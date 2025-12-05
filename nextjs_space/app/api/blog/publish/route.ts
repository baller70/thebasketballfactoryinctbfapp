
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface BlogSection {
  title: string
  content: string
  mediaUrl?: string
  mediaType?: 'image' | 'video'
  order: number
}

interface PublishBlogRequest {
  title: string
  content: string
  excerpt: string
  slug: string
  publishedAt: string
  sections?: BlogSection[]
  coverImage?: string
  author: string
  companyId?: string
  category?: string
  tags?: string[]
  metaTitle?: string
  metaDescription?: string
}

// Helper function to convert markdown to HTML (basic conversion)
function markdownToHtml(markdown: string): string {
  let html = markdown
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  
  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>')
  html = `<p>${html}</p>`
  
  return html
}

// Helper function to process sections into HTML
function processSections(sections: BlogSection[]): string {
  const sortedSections = [...sections].sort((a, b) => a.order - b.order)
  
  return sortedSections.map(section => {
    let sectionHtml = `<section class="blog-section">`
    
    if (section.title) {
      sectionHtml += `<h2>${section.title}</h2>`
    }
    
    if (section.content) {
      sectionHtml += markdownToHtml(section.content)
    }
    
    if (section.mediaUrl) {
      if (section.mediaType === 'video') {
        sectionHtml += `<video controls src="${section.mediaUrl}" class="blog-media"></video>`
      } else {
        sectionHtml += `<img src="${section.mediaUrl}" alt="${section.title || 'Blog image'}" class="blog-media" />`
      }
    }
    
    sectionHtml += `</section>`
    return sectionHtml
  }).join('\n')
}

export async function POST(request: NextRequest) {
  try {
    // 1. Validate API Key
    const authHeader = request.headers.get('authorization')
    const apiKey = process.env.BLOG_PUBLISH_API_KEY
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing or invalid Authorization header. Use: Bearer YOUR_API_KEY' 
        },
        { status: 401 }
      )
    }
    
    const providedKey = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    if (providedKey !== apiKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid API key' 
        },
        { status: 401 }
      )
    }
    
    // 2. Parse and validate request body
    const data: PublishBlogRequest = await request.json()
    
    if (!data.title || !data.content || !data.slug || !data.author) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: title, content, slug, and author are required' 
        },
        { status: 400 }
      )
    }
    
    // 3. Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: data.slug }
    })
    
    if (existingPost) {
      return NextResponse.json(
        { 
          success: false, 
          error: `A post with slug '${data.slug}' already exists` 
        },
        { status: 409 }
      )
    }
    
    // 4. Process content
    let htmlContent = markdownToHtml(data.content)
    
    // If sections are provided, append them to content
    if (data.sections && data.sections.length > 0) {
      const sectionsHtml = processSections(data.sections)
      htmlContent += '\n' + sectionsHtml
    }
    
    // 5. Prepare blog post data
    const blogPostData = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || data.content.substring(0, 200) + '...',
      content: htmlContent,
      featuredImage: data.coverImage || null,
      category: data.category || 'basketball-training',
      tags: data.tags || [],
      author: data.author,
      authorImage: null, // Can be extended if needed
      metaTitle: data.metaTitle || data.title,
      metaDescription: data.metaDescription || data.excerpt || data.content.substring(0, 160),
      isPublished: true,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
      views: 0
    }
    
    // 6. Create blog post in database
    const newPost = await prisma.blogPost.create({
      data: blogPostData
    })
    
    // 7. Construct URL for the post
    const baseUrl = process.env.NEXTAUTH_URL || 'https://thebasketballfactoryinc.com'
    const postUrl = `${baseUrl}/blog/${newPost.slug}`
    
    // 8. Return success response
    return NextResponse.json(
      {
        success: true,
        postId: newPost.id,
        url: postUrl,
        message: 'Blog post published successfully'
      },
      { status: 201 }
    )
    
  } catch (error: any) {
    console.error('Error publishing blog post:', error)
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'A post with this slug already exists' 
        },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to publish blog post',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { 
      error: 'Method not allowed. Use POST to publish blog posts.' 
    },
    { status: 405 }
  )
}
