
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

// GET - List all page configurations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !(session.user as any)?.role || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pages = await prisma.sEOPageConfig.findMany({
      include: {
        targetKeywords: true,
        contentVersions: {
          where: { isPublished: true },
          orderBy: { versionNumber: 'desc' },
          take: 1
        },
        _count: {
          select: {
            contentVersions: true
          }
        }
      },
      orderBy: { pagePath: 'asc' }
    })

    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

// POST - Create new page configuration
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !(session.user as any)?.role || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      pagePath, 
      pageTitle,
      metaDescription,
      keywordIds,
      autoUpdate,
      updateFrequency
    } = body

    // Check if page already exists
    const existing = await prisma.sEOPageConfig.findUnique({
      where: { pagePath }
    })

    if (existing) {
      return NextResponse.json({ error: 'Page already exists' }, { status: 400 })
    }

    // Create new page config
    const pageConfig = await prisma.sEOPageConfig.create({
      data: {
        pagePath,
        pageName: pageTitle,
        pageTitle,
        metaDescription,
        updateFrequency: updateFrequency || 'weekly',
        autoUpdateEnabled: autoUpdate !== false,
        status: 'active',
        targetKeywords: keywordIds && keywordIds.length > 0 ? {
          connect: keywordIds.map((id: string) => ({ id }))
        } : undefined
      },
      include: {
        targetKeywords: true
      }
    })

    await prisma.sEOAuditLog.create({
      data: {
        action: 'page_config_created',
        entityType: 'page',
        entityId: pageConfig.id,
        pagePath: pageConfig.pagePath,
        changes: JSON.stringify(body),
        performedBy: session.user?.email || 'unknown',
        success: true
      }
    })

    return NextResponse.json(pageConfig)
  } catch (error) {
    console.error('Error creating page config:', error)
    return NextResponse.json({ error: 'Failed to create page configuration' }, { status: 500 })
  }
}

// PUT - Update existing page configuration
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !(session.user as any)?.role || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      id,
      pagePath, 
      pageTitle,
      metaDescription,
      keywordIds,
      autoUpdate,
      updateFrequency,
      isActive
    } = body

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }

    // Build update data
    const updateData: any = {}
    
    if (pageTitle !== undefined) updateData.pageTitle = pageTitle
    if (pageTitle !== undefined) updateData.pageName = pageTitle
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription
    if (autoUpdate !== undefined) updateData.autoUpdateEnabled = autoUpdate
    if (updateFrequency !== undefined) updateData.updateFrequency = updateFrequency
    if (isActive !== undefined) updateData.status = isActive ? 'active' : 'inactive'
    
    if (keywordIds !== undefined && Array.isArray(keywordIds)) {
      updateData.targetKeywords = {
        set: keywordIds.map((kid: string) => ({ id: kid }))
      }
    }

    // Update page config
    const pageConfig = await prisma.sEOPageConfig.update({
      where: { id },
      data: updateData,
      include: {
        targetKeywords: true
      }
    })

    await prisma.sEOAuditLog.create({
      data: {
        action: 'page_config_updated',
        entityType: 'page',
        entityId: pageConfig.id,
        pagePath: pageConfig.pagePath,
        changes: JSON.stringify(body),
        performedBy: session.user?.email || 'unknown',
        success: true
      }
    })

    return NextResponse.json(pageConfig)
  } catch (error) {
    console.error('Error updating page config:', error)
    return NextResponse.json({ error: 'Failed to update page configuration' }, { status: 500 })
  }
}

// DELETE - Remove page configuration
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !(session.user as any)?.role || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }

    // Get page info before deleting
    const page = await prisma.sEOPageConfig.findUnique({
      where: { id }
    })

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    // Delete the page config
    await prisma.sEOPageConfig.delete({
      where: { id }
    })

    await prisma.sEOAuditLog.create({
      data: {
        action: 'page_config_deleted',
        entityType: 'page',
        entityId: id,
        pagePath: page.pagePath,
        changes: JSON.stringify({ deleted: true }),
        performedBy: session.user?.email || 'unknown',
        success: true
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting page config:', error)
    return NextResponse.json({ error: 'Failed to delete page configuration' }, { status: 500 })
  }
}
