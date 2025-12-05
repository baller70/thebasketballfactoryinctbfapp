
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get all analytics events
    const events = await prisma.analyticsEvent.findMany({
      orderBy: { timestamp: 'desc' },
      take: 1000
    })

    // Calculate statistics
    const pageViews = events.filter(e => e.eventType === 'page_view').length
    const uniqueSessions = new Set(events.map(e => e.sessionId)).size
    const totalEvents = events.length

    // Get user journeys for more detailed metrics
    const journeys = await prisma.websiteJourney.findMany({
      select: {
        sessionId: true,
        duration: true,
        converted: true,
        deviceType: true,
        pages: true
      }
    })

    const avgSessionDuration = journeys.reduce((sum: number, j: any) => sum + (j.duration || 0), 0) / journeys.length || 0
    const conversions = journeys.filter((j: any) => j.converted).length
    const conversionRate = journeys.length > 0 ? Math.round((conversions / journeys.length) * 100) : 0
    
    // Calculate bounce rate (sessions with only 1 page view)
    const singlePageSessions = journeys.filter((j: any) => 
      Array.isArray(j.pages) && j.pages.length === 1
    ).length
    const bounceRate = journeys.length > 0 ? Math.round((singlePageSessions / journeys.length) * 100) : 0

    // Get top pages
    const pageCounts: Record<string, number> = {}
    events.filter(e => e.eventType === 'page_view').forEach(e => {
      pageCounts[e.page] = (pageCounts[e.page] || 0) + 1
    })
    const topPages = Object.entries(pageCounts)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)

    // Get top events
    const eventCounts: Record<string, number> = {}
    events.forEach(e => {
      eventCounts[e.eventName] = (eventCounts[e.eventName] || 0) + 1
    })
    const topEvents = Object.entries(eventCounts)
      .map(([event, count]) => ({ event, count }))
      .sort((a, b) => b.count - a.count)

    // Device breakdown
    const deviceCounts: Record<string, number> = {}
    journeys.forEach((j: any) => {
      const device = j.deviceType || 'Unknown'
      deviceCounts[device] = (deviceCounts[device] || 0) + 1
    })
    const deviceBreakdown = Object.entries(deviceCounts)
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({
      pageViews,
      uniqueVisitors: uniqueSessions,
      totalEvents,
      conversionRate,
      avgSessionDuration,
      bounceRate,
      topPages,
      topEvents,
      deviceBreakdown
    })
  } catch (error) {
    console.error('Fetch analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const event = await prisma.analyticsEvent.create({
      data: {
        eventType: data.eventType,
        eventName: data.eventName,
        page: data.page,
        userId: data.userId,
        sessionId: data.sessionId,
        properties: data.properties || {}
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Create analytics event error:', error)
    return NextResponse.json(
      { error: 'Failed to create analytics event' },
      { status: 500 }
    )
  }
}
