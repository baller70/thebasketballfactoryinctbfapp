
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic';

// GET - Get SEO settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !(session.user as any)?.role || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let settings = await prisma.sEOSettings.findFirst()

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.sEOSettings.create({
        data: {}
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// PUT - Update SEO settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !(session.user as any)?.role || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    // Get current settings
    let settings = await prisma.sEOSettings.findFirst()

    if (!settings) {
      // Create new settings
      settings = await prisma.sEOSettings.create({
        data: {
          ...updateData,
          lastModifiedBy: session.user?.email
        }
      })
    } else {
      // Update existing settings
      settings = await prisma.sEOSettings.update({
        where: { id: settings.id },
        data: {
          ...updateData,
          lastModifiedBy: session.user?.email
        }
      })
    }

    await prisma.sEOAuditLog.create({
      data: {
        action: 'settings_updated',
        entityType: 'settings',
        entityId: settings.id,
        changes: updateData,
        performedBy: session.user?.email || 'unknown',
        success: true
      }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
