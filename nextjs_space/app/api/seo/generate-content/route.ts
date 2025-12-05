
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateSEOContent, calculateSEOScore, calculateNextUpdate } from '@/lib/seo-service'

const prisma = new PrismaClient()

// POST - Generate SEO content for a page
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !(session.user as any)?.role || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { pageConfigId } = body

    // Get page configuration with keywords
    const pageConfig = await prisma.sEOPageConfig.findUnique({
      where: { id: pageConfigId },
      include: {
        targetKeywords: true,
        contentVersions: {
          where: { isPublished: true },
          orderBy: { versionNumber: 'desc' },
          take: 1
        }
      }
    })

    if (!pageConfig) {
      return NextResponse.json({ error: 'Page configuration not found' }, { status: 404 })
    }

    // Get current content if exists
    const currentContent = pageConfig.contentVersions[0]?.contentBlocks
      ? JSON.stringify(pageConfig.contentVersions[0].contentBlocks)
      : undefined

    // Generate content using AI
    const result = await generateSEOContent({
      pagePath: pageConfig.pagePath,
      pageName: pageConfig.pageName,
      targetKeywords: pageConfig.targetKeywords.map(k => k.keyword),
      localAreas: pageConfig.localAreaTargets,
      contentStrategy: pageConfig.contentStrategy || undefined,
      currentContent
    })

    if (!result.success) {
      await prisma.sEOAuditLog.create({
        data: {
          action: 'content_generation_failed',
          entityType: 'page',
          entityId: pageConfig.id,
          pagePath: pageConfig.pagePath,
          performedBy: session.user?.email || 'unknown',
          success: false,
          errorMessage: result.error
        }
      })

      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Calculate SEO score
    const seoScore = calculateSEOScore({
      title: result.content.title,
      metaDescription: result.content.metaDescription,
      h1Heading: result.content.h1Heading,
      contentBlocks: result.content.contentBlocks,
      targetKeywords: pageConfig.targetKeywords.map(k => k.keyword)
    })

    // Get next version number
    const maxVersion = await prisma.sEOContentVersion.findFirst({
      where: { pageConfigId },
      orderBy: { versionNumber: 'desc' },
      select: { versionNumber: true }
    })
    const nextVersion = (maxVersion?.versionNumber || 0) + 1

    // Get global settings
    const settings = await prisma.sEOSettings.findFirst()

    // Create new content version
    const contentVersion = await prisma.sEOContentVersion.create({
      data: {
        pageConfigId,
        versionNumber: nextVersion,
        title: result.content.title,
        metaDescription: result.content.metaDescription,
        metaKeywords: result.content.metaKeywords,
        h1Heading: result.content.h1Heading,
        h2Headings: result.content.h2Headings || [],
        contentBlocks: result.content.contentBlocks,
        generatedBy: 'ai',
        generationModel: result.model,
        promptUsed: result.prompt,
        keywordsDensity: result.content.keywordsDensity,
        seoScore,
        readabilityScore: result.content.readabilityScore,
        status: settings?.requireManualApproval ? 'pending_review' : 'approved',
        isPublished: false
      }
    })

    // Update page config
    await prisma.sEOPageConfig.update({
      where: { id: pageConfigId },
      data: {
        lastGenerated: new Date(),
        nextScheduledUpdate: calculateNextUpdate(pageConfig.updateFrequency)
      }
    })

    await prisma.sEOAuditLog.create({
      data: {
        action: 'content_generated',
        entityType: 'page',
        entityId: pageConfig.id,
        pagePath: pageConfig.pagePath,
        changes: {
          versionNumber: nextVersion,
          seoScore,
          model: result.model
        },
        performedBy: session.user?.email || 'unknown',
        success: true
      }
    })

    return NextResponse.json({
      success: true,
      contentVersion,
      seoScore,
      requiresApproval: settings?.requireManualApproval
    })
  } catch (error) {
    console.error('Error generating content:', error)
    return NextResponse.json({ 
      error: 'Failed to generate content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
