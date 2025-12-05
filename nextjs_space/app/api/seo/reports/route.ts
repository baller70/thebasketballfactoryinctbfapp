
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateAnalyticsReport } from '@/lib/seo-service'

const prisma = new PrismaClient()

// GET - List reports
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !(session.user as any)?.role || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get('type')
    const reportId = searchParams.get('id')

    if (reportId) {
      const report = await prisma.sEOAnalyticsReport.findUnique({
        where: { id: reportId }
      })
      return NextResponse.json(report)
    }

    const reports = await prisma.sEOAnalyticsReport.findMany({
      where: reportType ? { reportType } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}

// POST - Generate new report
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !(session.user as any)?.role || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { reportType, startDate, endDate } = body

    if (!reportType || !startDate || !endDate) {
      return NextResponse.json({ 
        error: 'Report type, start date, and end date are required' 
      }, { status: 400 })
    }

    const report = await generateAnalyticsReport({
      reportType,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    })

    await prisma.sEOAuditLog.create({
      data: {
        action: 'report_generated',
        entityType: 'report',
        entityId: report.id,
        changes: { reportType, startDate, endDate },
        performedBy: session.user?.email || 'unknown',
        success: true
      }
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json({ 
      error: 'Failed to generate report',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
