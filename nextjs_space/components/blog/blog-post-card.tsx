
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Eye, Clock, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'

interface BlogPostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string
    featuredImage: string | null
    category: string
    tags: string[]
    author: string
    authorImage: string | null
    publishedAt: string
    views: number
  }
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const categoryLabels: Record<string, string> = {
    'basketball-training': 'Training Tips',
    'player-development': 'Player Development',
    'success-stories': 'Success Stories',
    'program-updates': 'Program Updates',
    'college-recruiting': 'College Recruiting'
  }

  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="group relative bg-gradient-to-br from-gray-900 to-black border-2 border-white/10 rounded-lg overflow-hidden hover:border-tbf-gold transition-all duration-300 h-full flex flex-col">
        {/* Featured Image */}
        <div className="relative h-64 bg-gray-800 overflow-hidden">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-tbf-gold/20 to-gray-900">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-tbf-gold/10 border border-tbf-gold/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🏀</span>
                </div>
                <p className="text-white/50 font-audiowide uppercase text-sm">The Basketball Factory</p>
              </div>
            </div>
          )}
          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 bg-tbf-gold text-black text-xs font-bold uppercase tracking-wider rounded-full">
              {categoryLabels[post.category] || post.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 font-audiowide uppercase group-hover:text-tbf-gold transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-white/70 mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-white/50 text-sm mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(post.publishedAt), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{post.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>5 min read</span>
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-700">
                {post.authorImage ? (
                  <Image
                    src={post.authorImage}
                    alt={post.author}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-tbf-gold/20">
                    <span className="text-tbf-gold font-bold text-sm">
                      {post.author.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{post.author}</p>
                <p className="text-white/50 text-xs">Head Trainer</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-tbf-gold group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}
