
import { Metadata } from 'next'
import Header from '@/components/header'
import BlogHero from '@/components/blog/blog-hero'
import BlogGrid from '@/components/blog/blog-grid'

export const metadata: Metadata = {
  title: 'Basketball Training Blog | The Basketball Factory NJ',
  description: 'Expert basketball training tips, player development strategies, and success stories from The Basketball Factory in Sparta, NJ. Learn from professional trainer Kevin Houston.',
  keywords: 'basketball training blog, basketball tips, player development, basketball drills, Kevin Houston, Sparta NJ'
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header alwaysDark />
      <BlogHero />
      <BlogGrid />
    </div>
  )
}
