
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const journeys = await prisma.websiteJourney.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    // Calculate statistics
    const totalSessions = journeys.length
    const avgDuration = journeys.reduce((sum: number, j) => sum + (j.duration || 0), 0) / totalSessions || 0
    const conversions = journeys.filter((j) => j.converted).length
    const conversionRate = totalSessions > 0 ? Math.round((conversions / totalSessions) * 100) : 0

    // Get top landing pages
    const landingPageCounts: Record<string, number> = {}
    journeys.forEach((j) => {
      landingPageCounts[j.landingPage] = (landingPageCounts[j.landingPage] || 0) + 1
    })
    const topLandingPages = Object.entries(landingPageCounts)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({
      journeys,
      stats: {
        totalSessions,
        avgDuration,
        conversionRate,
        topLandingPages
      }
    })
  } catch (error) {
    console.error('Fetch user journeys error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user journeys' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const journey = await prisma.websiteJourney.create({
      data: {
        sessionId: data.sessionId,
        userId: data.userId,
        landingPage: data.landingPage,
        referrer: data.referrer,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        deviceType: data.deviceType,
        browser: data.browser,
        country: data.country,
        pages: data.pages || [],
        interactions: data.interactions || [],
        duration: data.duration,
        converted: data.converted || false,
        conversionType: data.conversionType,
        exitPage: data.exitPage
      }
    })

    return NextResponse.json(journey, { status: 201 })
  } catch (error) {
    console.error('Create user journey error:', error)
    return NextResponse.json(
      { error: 'Failed to create user journey' },
      { status: 500 }
    )
  }
}
