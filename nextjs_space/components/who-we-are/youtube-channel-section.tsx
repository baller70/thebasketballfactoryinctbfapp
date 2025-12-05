
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Youtube } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ImageModal from './image-modal'
import SectionDivider from './section-divider'

const videos = [
  {
    thumbnail: 'https://cdn.abacus.ai/images/e641c7e2-e69f-4abf-99d8-f726c8b30920.png',
    title: 'Tournament of Champions Highlights',
    description: 'Watch our elite youth basketball team compete at the highest level',
    views: '12K views'
  },
  {
    thumbnail: 'https://cdn.abacus.ai/images/d8133cd0-549c-4ef1-90a4-d629c50e0b99.png',
    title: 'Hershey Championship 2021',
    description: 'Championship game highlights and celebration',
    views: '18K views'
  },
  {
    thumbnail: 'https://cdn.abacus.ai/images/1294f370-c830-44bb-b1b6-b21d03a9dc55.png',
    title: 'Player Spotlight: Tournament MVP',
    description: 'See the dedication and skill development in action',
    views: '9K views'
  },
  {
    thumbnail: 'https://cdn.abacus.ai/images/30d8ec31-4544-4130-aab5-d30ee9198060.png',
    title: 'Middle School Championship',
    description: 'Young athletes showcasing teamwork and maximum effort',
    views: '15K views'
  },
  {
    thumbnail: 'https://cdn.abacus.ai/images/d76f62f1-e6ff-4784-a6bc-a846aec90e03.png',
    title: 'High School Championship Win',
    description: 'Elite basketball training paying off at the highest level',
    views: '22K views'
  },
  {
    thumbnail: 'https://cdn.abacus.ai/images/16fc22f3-d5be-4232-9d18-4afacb5c54fb.png',
    title: 'NYC Tournament Victory',
    description: 'Sussex County team dominates in NYC competition',
    views: '11K views'
  },
]

export default function YouTubeChannelSection() {
  return (
    <section className="relative py-20 bg-white">
      {/* Attractive Section Divider */}
      <SectionDivider variant="top" style="basketball" className="mb-8" />
      
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-tbf-gold rounded-full flex items-center justify-center">
              <Youtube className="w-9 h-9 text-white" />
            </div>
            <span className="text-black text-2xl font-bold">The Basketball Factory</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6" style={{ fontFamily: 'Audiowide, sans-serif' }}>
            SEE US IN ACTION
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            Watch <span className="text-tbf-gold font-semibold">game highlights</span>, <span className="text-tbf-gold font-semibold">skill development drills</span>, 
            and <span className="text-tbf-gold font-semibold">championship moments</span> from Sussex County&apos;s premier youth basketball program
          </p>
          <Link href="https://www.youtube.com/@riseasoneaaubasketball1027" target="_blank" rel="noopener noreferrer">
            <Button className="bg-tbf-gold hover:bg-tbf-gold text-white px-10 py-7 text-xl font-bold shadow-xl">
              <Youtube className="w-7 h-7 mr-2" />
              SUBSCRIBE TO OUR CHANNEL
            </Button>
          </Link>
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto">
          {videos.map((video, index) => (
            <div key={index}>
              <ImageModal
                src={video.thumbnail}
                alt={`${video.title} - The Basketball Factory Youth Basketball`}
                title={video.title}
                description={video.description}
              >
                <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-tbf-gold transition-all duration-300 group cursor-pointer shadow-lg">
                  {/* Thumbnail - No Overlay Play Button */}
                  <div className="relative aspect-video">
                    <Image
                      src={video.thumbnail}
                      alt={`${video.title} - The Basketball Factory Youth Basketball`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {/* Subtle hover effect only */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                    {/* "Click to enlarge" text on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-white text-black px-4 py-2 rounded text-sm font-semibold shadow-lg">Click to view larger</span>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-black mb-2 group-hover:text-tbf-gold transition-colors" style={{ fontFamily: 'Audiowide, sans-serif' }}>
                      {video.title}
                    </h3>
                    <p className="text-gray-600 text-base mb-3 leading-relaxed">{video.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{video.views}</span>
                      <Link 
                        href="https://www.youtube.com/@riseasoneaaubasketball1027" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-tbf-gold hover:text-tbf-gold font-semibold"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Youtube className="w-4 h-4" />
                        Watch on YouTube
                      </Link>
                    </div>
                  </div>
                </div>
              </ImageModal>
            </div>
          ))}
        </div>

        {/* Channel Stats */}
        <div className="bg-gray-50 border-2 border-tbf-gold rounded-xl p-10 max-w-5xl mx-auto shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Youtube className="w-12 h-12 text-tbf-gold mx-auto mb-3" />
              <div className="text-5xl font-bold text-black mb-2">500+</div>
              <div className="text-gray-700 text-base font-semibold">Videos Published</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-black mb-2">250K+</div>
              <div className="text-gray-700 text-base font-semibold">Total Views</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-black mb-2">3K+</div>
              <div className="text-gray-700 text-base font-semibold">Subscribers</div>
              <div className="text-tbf-gold text-sm mt-2 font-semibold">Growing Daily</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center max-w-4xl mx-auto">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Experience the <span className="text-tbf-gold font-semibold">energy</span>, <span className="text-tbf-gold font-semibold">passion</span>, 
            and <span className="text-tbf-gold font-semibold">excellence</span> that defines The Basketball Factory. 
            Watch our players develop elite skills, celebrate championships, and create lifelong memories.
          </p>
          <Link href="https://www.youtube.com/@riseasoneaaubasketball1027" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border-2 border-tbf-gold text-tbf-gold hover:bg-tbf-gold hover:text-white px-8 py-6 text-lg font-bold">
              VISIT YOUTUBE CHANNEL →
            </Button>
          </Link>
        </div>

        {/* SEO Keywords */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm max-w-4xl mx-auto">
            Watch <span className="text-gray-600 font-semibold">AAU basketball highlights</span>, <span className="text-gray-600 font-semibold">youth basketball training videos</span>, 
            <span className="text-gray-600 font-semibold"> championship games</span>, and <span className="text-gray-600 font-semibold">skill development drills</span> from 
            <span className="text-gray-600 font-semibold"> Sparta, NJ</span> and <span className="text-gray-600 font-semibold">Sussex County&apos;s elite basketball program</span>
          </p>
        </div>
      </div>
    </section>
  )
}
