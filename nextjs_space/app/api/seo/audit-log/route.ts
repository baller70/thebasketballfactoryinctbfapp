
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic';

// GET - Fetch audit logs
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !(session.user as any)?.role || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const entityType = searchParams.get('entityType')
    const pagePath = searchParams.get('pagePath')
    const limit = parseInt(searchParams.get('limit') || '100')

    const where: any = {}
    if (action) where.action = action
    if (entityType) where.entityType = entityType
    if (pagePath) where.pagePath = pagePath

    const logs = await prisma.sEOAuditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 })
  }
}
