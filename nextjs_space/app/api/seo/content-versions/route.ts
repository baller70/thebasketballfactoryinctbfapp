
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic';

// GET - Get content versions for a page
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !(session.user as any)?.role || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const pageConfigId = searchParams.get('pageConfigId')
    const versionId = searchParams.get('versionId')

    if (versionId) {
      // Get specific version
      const version = await prisma.sEOContentVersion.findUnique({
        where: { id: versionId },
        include: {
          pageConfig: {
            include: {
              targetKeywords: true
            }
          }
        }
      })
      return NextResponse.json(version)
    }

    if (pageConfigId) {
      // Get all versions for a page
      const versions = await prisma.sEOContentVersion.findMany({
        where: { pageConfigId },
        orderBy: { versionNumber: 'desc' },
        include: {
          pageConfig: {
            select: {
              pagePath: true,
              pageName: true
            }
          }
        }
      })
      return NextResponse.json(versions)
    }

    // Get all pending versions
    const versions = await prisma.sEOContentVersion.findMany({
      where: {
        status: 'pending_review'
      },
      include: {
        pageConfig: {
          select: {
            pagePath: true,
            pageName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(versions)
  } catch (error) {
    console.error('Error fetching content versions:', error)
    return NextResponse.json({ error: 'Failed to fetch content versions' }, { status: 500 })
  }
}

// PUT - Approve/reject/publish content version
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !(session.user as any)?.role || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { versionId, action, reviewNotes, rejectionReason } = body

    const version = await prisma.sEOContentVersion.findUnique({
      where: { id: versionId },
      include: { pageConfig: true }
    })

    if (!version) {
      return NextResponse.json({ error: 'Content version not found' }, { status: 404 })
    }

    let updateData: any = {
      reviewedBy: session.user?.email,
      reviewNotes
    }

    switch (action) {
      case 'approve':
        updateData.status = 'approved'
        break
      case 'reject':
        updateData.status = 'rejected'
        updateData.rejectionReason = rejectionReason
        break
      case 'publish':
        // Unpublish all other versions for this page
        await prisma.sEOContentVersion.updateMany({
          where: {
            pageConfigId: version.pageConfigId,
            isPublished: true
          },
          data: { isPublished: false }
        })

        updateData.status = 'published'
        updateData.isPublished = true
        updateData.publishedAt = new Date()

        // Update page config with published content
        await prisma.sEOPageConfig.update({
          where: { id: version.pageConfigId },
          data: {
            pageTitle: version.title,
            metaDescription: version.metaDescription,
            metaKeywords: version.metaKeywords,
            h1Heading: version.h1Heading,
            lastPublished: new Date()
          }
        })
        break
      case 'unpublish':
        updateData.isPublished = false
        updateData.status = 'approved'
        break
    }

    const updatedVersion = await prisma.sEOContentVersion.update({
      where: { id: versionId },
      data: updateData
    })

    await prisma.sEOAuditLog.create({
      data: {
        action: `content_${action}`,
        entityType: 'page',
        entityId: version.pageConfigId,
        pagePath: version.pageConfig.pagePath,
        changes: { versionId, action, versionNumber: version.versionNumber },
        performedBy: session.user?.email || 'unknown',
        success: true
      }
    })

    return NextResponse.json(updatedVersion)
  } catch (error) {
    console.error('Error updating content version:', error)
    return NextResponse.json({ error: 'Failed to update content version' }, { status: 500 })
  }
}
