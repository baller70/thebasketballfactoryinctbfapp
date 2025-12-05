
'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Eye, Clock, ArrowLeft, Tag, Share2 } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'

interface BlogPostDetailProps {
  post: {
    id: string
    title: string
    slug: string
    content: string
    featuredImage: string | null
    category: string
    tags: string[]
    author: string
    authorImage: string | null
    publishedAt: string
    views: number
  }
}

export default function BlogPostDetail({ post }: BlogPostDetailProps) {
  useEffect(() => {
    // Increment view count
    fetch(`/api/blog/${post.slug}/view`, { method: 'POST' }).catch(console.error)
  }, [post.slug])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content.substring(0, 100) + '...',
          url: window.location.href
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    }
  }

  const categoryLabels: Record<string, string> = {
    'basketball-training': 'Training Tips',
    'player-development': 'Player Development',
    'success-stories': 'Success Stories',
    'program-updates': 'Program Updates',
    'college-recruiting': 'College Recruiting'
  }

  return (
    <article className="min-h-screen bg-black">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link href="/blog">
          <Button variant="outline" className="border-white/20 text-white hover:border-tbf-gold hover:text-tbf-gold">
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO BLOG
          </Button>
        </Link>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative h-[60vh] max-h-[600px] mt-8 mb-12"
        >
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </motion.div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Category Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <span className="px-4 py-2 bg-tbf-gold text-black text-sm font-bold uppercase tracking-wider rounded-full">
            {categoryLabels[post.category] || post.category}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl md:text-6xl font-bold text-white mb-8 font-audiowide uppercase"
        >
          {post.title}
        </motion.h1>

        {/* Meta Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center gap-6 text-white/70 mb-8 pb-8 border-b border-white/10"
        >
          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-700">
              {post.authorImage ? (
                <Image
                  src={post.authorImage}
                  alt={post.author}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-tbf-gold/20">
                  <span className="text-tbf-gold font-bold">
                    {post.author.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="text-white font-semibold">{post.author}</p>
              <p className="text-white/50 text-sm">Head Trainer</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(post.publishedAt), 'MMMM dd, yyyy')}</span>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{post.views} views</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>5 min read</span>
          </div>

          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="ml-auto border-white/20 text-white hover:border-tbf-gold hover:text-tbf-gold"
          >
            <Share2 className="w-4 h-4 mr-2" />
            SHARE
          </Button>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="prose prose-invert prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <Tag className="w-5 h-5 text-tbf-gold" />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white/70 hover:border-tbf-gold hover:text-tbf-gold transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 p-8 bg-gradient-to-br from-tbf-gold/10 to-transparent border-l-4 border-tbf-gold rounded-lg"
        >
          <h3 className="text-2xl font-bold text-white mb-4 font-audiowide uppercase">READY TO ELEVATE YOUR GAME?</h3>
          <p className="text-white/80 mb-6">
            Join The Basketball Factory's elite training programs and take your skills to the next level. Train with professional coach Kevin Houston in Sparta, NJ.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/private-lessons">
              <Button className="bg-tbf-gold text-black hover:bg-tbf-gold/90 font-audiowide uppercase">
                BOOK PRIVATE LESSONS
              </Button>
            </Link>
            <Link href="/programs">
              <Button variant="outline" className="border-2 border-white/20 text-white hover:border-tbf-gold hover:text-tbf-gold font-audiowide uppercase">
                VIEW PROGRAMS
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </article>
  )
}
