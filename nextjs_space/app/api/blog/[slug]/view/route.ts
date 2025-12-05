
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/blog/[slug]/view - Increment view count
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await prisma.blogPost.update({
      where: {
        slug: params.slug
      },
      data: {
        views: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error incrementing view count:', error)
    return NextResponse.json(
      { error: 'Failed to increment view count' },
      { status: 500 }
    )
  }
}
