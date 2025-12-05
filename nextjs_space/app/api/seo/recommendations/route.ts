
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import {
  analyzeKeywordStrategy,
  generatePageRecommendations,
  detectKeywordCannibalization,
  suggestContentUpdates,
  SEOPageStrategy,
  SEORecommendation
} from '@/lib/seo-best-practices'

export const dynamic = 'force-dynamic';

// Get SEO recommendations based on current data
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !(session.user as any)?.role || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allRecommendations: SEORecommendation[] = []

    // Get all pages with their keywords
    const pages = await prisma.sEOPageConfig.findMany({
      include: {
        targetKeywords: true
      }
    })

    // Build page strategies
    const pageStrategies: SEOPageStrategy[] = []
    
    for (const page of pages) {
      if (page.targetKeywords.length === 0) continue

      const primaryKeyword = page.targetKeywords[0]
      
      // Get recent performance for primary keyword
      const recentPerformance = await prisma.sEOPerformance.findMany({
        where: { keywordId: primaryKeyword.id },
        orderBy: { date: 'desc' },
        take: 30
      })
        
      const avgPosition = recentPerformance.length > 0
        ? recentPerformance.reduce((sum: number, p: any) => sum + (p.position || 0), 0) / recentPerformance.length
        : null
      
      const totalClicks = recentPerformance.reduce((sum: number, p: any) => sum + p.clicks, 0)
      const totalImpressions = recentPerformance.reduce((sum: number, p: any) => sum + p.impressions, 0)
      const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0

      pageStrategies.push({
        pagePath: page.pagePath,
        pageName: page.pageName,
        primaryKeyword: primaryKeyword.keyword,
        secondaryKeywords: page.targetKeywords.slice(1).map((k: any) => k.keyword),
        intent: (page.contentStrategy as any)?.intent || 'informational',
        contentStrategy: {
          titleTag: page.pageTitle || '',
          metaDescription: page.metaDescription || '',
          h1: page.pageName,
          contentFocus: primaryKeyword.keyword,
          updateFrequency: (page.updateFrequency as 'daily' | 'weekly' | 'biweekly' | 'monthly') || 'weekly'
        },
        performance: {
          currentPosition: avgPosition,
          targetPosition: 5, // Default target: top 5
          clicks: totalClicks,
          impressions: totalImpressions,
          ctr
        }
      })
    }

    // Analyze keyword strategies
    const keywords = await prisma.sEOKeyword.findMany()

    for (const keyword of keywords) {
      // Get recent performance for this keyword
      const recentPerf = await prisma.sEOPerformance.findMany({
        where: { keywordId: keyword.id },
        orderBy: { date: 'desc' },
        take: 30
      })
      
      const avgPosition = recentPerf.length > 0
        ? recentPerf.reduce((sum: number, p: any) => sum + (p.position || 0), 0) / recentPerf.length
        : null

      const keywordRecs = analyzeKeywordStrategy(
        keyword.keyword,
        keyword.searchVolume || 0,
        keyword.difficulty || 50,
        avgPosition
      )
      allRecommendations.push(...keywordRecs)
    }

    // Generate page-specific recommendations
    for (const pageStrategy of pageStrategies) {
      const pageRecs = generatePageRecommendations(pageStrategy)
      allRecommendations.push(...pageRecs)
    }

    // Detect keyword cannibalization
    const cannibalizationRecs = detectKeywordCannibalization(pageStrategies)
    allRecommendations.push(...cannibalizationRecs)

    // Suggest content updates
    const lastUpdatedMap = new Map<string, Date>()
    pages.forEach(page => {
      lastUpdatedMap.set(page.pagePath, page.lastGenerated || page.updatedAt)
    })
    const contentUpdateRecs = suggestContentUpdates(pageStrategies, lastUpdatedMap)
    allRecommendations.push(...contentUpdateRecs)

    // Sort by impact and type
    const sortedRecommendations = allRecommendations.sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 }
      const typeOrder = { critical: 3, important: 2, opportunity: 1 }
      
      if (impactOrder[a.impact] !== impactOrder[b.impact]) {
        return impactOrder[b.impact] - impactOrder[a.impact]
      }
      return typeOrder[b.type] - typeOrder[a.type]
    })

    return NextResponse.json({
      recommendations: sortedRecommendations.slice(0, 50), // Top 50
      summary: {
        total: sortedRecommendations.length,
        critical: sortedRecommendations.filter(r => r.type === 'critical').length,
        important: sortedRecommendations.filter(r => r.type === 'important').length,
        opportunities: sortedRecommendations.filter(r => r.type === 'opportunity').length
      }
    })

  } catch (error) {
    console.error('Error generating recommendations:', error)
    return NextResponse.json({ 
      error: 'Failed to generate recommendations',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

