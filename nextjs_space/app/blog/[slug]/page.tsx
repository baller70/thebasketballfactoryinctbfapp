
import { notFound } from 'next/navigation'
import Header from '@/components/header'
import BlogPostDetail from '@/components/blog/blog-post-detail'
import { Metadata } from 'next'

interface PageProps {
  params: {
    slug: string
  }
}

async function getPost(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/blog/${slug}`, {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      return null
    }
    
    return await res.json()
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found | The Basketball Factory'
    }
  }

  return {
    title: post.metaTitle || `${post.title} | The Basketball Factory Blog`,
    description: post.metaDescription || post.excerpt,
    keywords: post.tags.join(', ')
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black">
      <Header alwaysDark />
      <BlogPostDetail post={post} />
    </div>
  )
}
