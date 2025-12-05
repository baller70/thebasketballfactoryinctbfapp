
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

// GET - List all competitors
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !(session.user as any)?.role || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const competitors = await prisma.sEOCompetitor.findMany({
      orderBy: { organicKeywords: 'desc' }
    })

    return NextResponse.json(competitors)
  } catch (error) {
    console.error('Error fetching competitors:', error)
    return NextResponse.json({ error: 'Failed to fetch competitors' }, { status: 500 })
  }
}

// POST - Add new competitor
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !(session.user as any)?.role || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, domain, domainRating, organicKeywords, organicTraffic, backlinks, strengths, weaknesses, topKeywords, contentGaps } = body

    const competitor = await prisma.sEOCompetitor.create({
      data: {
        name,
        domain,
        domainRating: domainRating || 0,
        organicKeywords: organicKeywords || 0,
        organicTraffic: organicTraffic || 0,
        backlinks: backlinks || 0,
        strengths: strengths || [],
        weaknesses: weaknesses || [],
        topKeywords: topKeywords || [],
        contentGaps: contentGaps || []
      }
    })

    await prisma.sEOAuditLog.create({
      data: {
        action: 'competitor_added',
        entityType: 'competitor',
        entityId: competitor.id,
        changes: { name, domain },
        performedBy: session.user?.email || 'unknown',
        success: true
      }
    })

    return NextResponse.json(competitor)
  } catch (error) {
    console.error('Error creating competitor:', error)
    return NextResponse.json({ error: 'Failed to create competitor' }, { status: 500 })
  }
}

// DELETE - Remove competitor
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !(session.user as any)?.role || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Competitor ID required' }, { status: 400 })
    }

    await prisma.sEOCompetitor.delete({
      where: { id }
    })

    await prisma.sEOAuditLog.create({
      data: {
        action: 'competitor_deleted',
        entityType: 'competitor',
        entityId: id,
        performedBy: session.user?.email || 'unknown',
        success: true
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting competitor:', error)
    return NextResponse.json({ error: 'Failed to delete competitor' }, { status: 500 })
  }
}
