import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ success: false, error: 'Missing authorization header' }, { status: 401 })
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader
    const validApiKey = process.env.NEWSLETTER_PUBLISH_API_KEY
    if (!validApiKey || token !== validApiKey) {
      return NextResponse.json({ success: false, error: 'Invalid API key' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.title || !body.slug) {
      return NextResponse.json({ success: false, error: 'title and slug are required' }, { status: 400 })
    }

    const actualContent = body.htmlContent || body.content || ''
    if (!actualContent) {
      return NextResponse.json({ success: false, error: 'content or htmlContent is required' }, { status: 400 })
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!slugRegex.test(body.slug)) {
      return NextResponse.json({ success: false, error: 'Invalid slug format' }, { status: 400 })
    }

    const existing = await prisma.newsletter.findUnique({ where: { slug: body.slug } })
    if (existing) {
      return NextResponse.json({ success: false, error: 'Newsletter with this slug already exists' }, { status: 409 })
    }

    let publishedAt: Date | undefined
    if (body.publishedAt) {
      publishedAt = new Date(body.publishedAt)
      if (isNaN(publishedAt.getTime())) {
        return NextResponse.json({ success: false, error: 'Invalid publishedAt date format' }, { status: 400 })
      }
    }

    const newsletter = await prisma.newsletter.create({
      data: {
        title: body.title,
        slug: body.slug,
        volume: body.volume,
        content: actualContent,
        htmlContent: body.htmlContent,
        excerpt: body.excerpt,
        coverImage: body.coverImage,
        status: publishedAt ? 'published' : 'draft',
        publishedAt,
        author: body.author,
        companyId: body.companyId,
        companyName: body.companyName,
        sections: body.sections || undefined,
        metadata: body.metadata || undefined,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Newsletter published successfully',
      postId: newsletter.id,
      publishedAt: newsletter.publishedAt,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Newsletter publish error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/newsletter/publish',
    method: 'POST',
    auth: 'Bearer token in Authorization header',
    body: {
      title: 'string (required)',
      slug: 'string (required)',
      content: 'string (HTML content)',
      htmlContent: 'string (alternative HTML field)',
      excerpt: 'string',
      coverImage: 'string (URL)',
      publishedAt: 'ISO 8601 date string',
      author: 'string',
    },
  })
}
