
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'
import { useState } from 'react'
import ImageModal from './image-modal'

export default function HeroFeatureSection() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  return (
    <section className="bg-white pt-[280px] pb-16">
      <div className="container mx-auto px-4">
        {/* Headline */}
        <div className="text-center mb-12 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-black" style={{ fontFamily: 'Audiowide, sans-serif' }}>
            <span className="text-black">SUSSEX COUNTY&apos;S</span>
            <br />
            <span className="text-tbf-gold">PREMIER AAU</span>
            <br />
            <span className="text-black">BASKETBALL PROGRAM</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
            Elite <span className="text-tbf-gold font-semibold">youth basketball training</span> in Sparta, NJ 07871. 
            Building champions through <span className="text-tbf-gold font-semibold">skill development</span>, teamwork, and maximum effort.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact-us">
              <Button className="bg-tbf-gold hover:bg-tbf-gold/90 text-white px-8 py-6 text-lg font-bold shadow-xl">
                CONTACT US
              </Button>
            </Link>
            <Link href="/contact-us">
              <Button className="bg-white border-2 border-black text-black hover:bg-black hover:text-white px-8 py-6 text-lg font-bold">
                GET STARTED
              </Button>
            </Link>
          </div>
        </div>

        {/* What Parents Are Saying - Featured Videos */}
        <div className="mb-20 bg-gray-50 py-12 -mx-4 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 text-black" style={{ fontFamily: 'Audiowide, sans-serif' }}>
              WHAT PARENTS ARE SAYING ABOUT <span className="text-tbf-gold">THE BASKETBALL FACTORY</span>
            </h2>
            <p className="text-center text-gray-600 mb-10 text-lg">
              Hear directly from our program director about our philosophy and impact on the community
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Video 1 - ANISA */}
              <div className="space-y-4 bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-black text-center" style={{ fontFamily: 'Audiowide, sans-serif' }}>
                  OUR PHILOSOPHY & APPROACH
                </h3>
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
                  {activeVideo !== 'anisa' ? (
                    <button
                      onClick={() => setActiveVideo('anisa')}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/30 transition-all group cursor-pointer z-10"
                    >
                      <div className="w-20 h-20 bg-tbf-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                        <Play className="w-10 h-10 text-white ml-1" fill="white" />
                      </div>
                    </button>
                  ) : (
                    <video
                      controls
                      autoPlay
                      className="w-full h-full"
                      src="/anisa-ra1-video.mp4"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {activeVideo !== 'anisa' && (
                    <Image
                      src="https://cdn.abacus.ai/images/fabb65b7-8289-41ab-b82c-0ed9486a9f01.png"
                      alt="Program Director discussing AAU basketball philosophy"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  )}
                </div>
                <p className="text-gray-600 text-center text-base leading-relaxed">
                  Program Director shares our commitment to <span className="text-tbf-gold font-semibold">skill development</span> and <span className="text-tbf-gold font-semibold">character building</span>
                </p>
              </div>

              {/* Video 2 - HARPER */}
              <div className="space-y-4 bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-black text-center" style={{ fontFamily: 'Audiowide, sans-serif' }}>
                  IMPACT ON PLAYERS & COMMUNITY
                </h3>
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
                  {activeVideo !== 'harper' ? (
                    <button
                      onClick={() => setActiveVideo('harper')}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/30 transition-all group cursor-pointer z-10"
                    >
                      <div className="w-20 h-20 bg-tbf-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                        <Play className="w-10 h-10 text-white ml-1" fill="white" />
                      </div>
                    </button>
                  ) : (
                    <video
                      controls
                      autoPlay
                      className="w-full h-full"
                      src="/harper-ra1-video.mp4"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {activeVideo !== 'harper' && (
                    <Image
                      src="https://cdn.abacus.ai/images/ecf37002-06d7-4986-b413-3ed06dfe3ee7.png"
                      alt="Program Director on community impact and player development"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  )}
                </div>
                <p className="text-gray-600 text-center text-base leading-relaxed">
                  How The Basketball Factory transforms lives in <span className="text-tbf-gold font-semibold">Sussex County</span> and beyond
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Images Grid */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-black" style={{ fontFamily: 'Audiowide, sans-serif' }}>
            OUR PROGRAM IN ACTION
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <ImageModal
              src="https://cdn.abacus.ai/images/fabb65b7-8289-41ab-b82c-0ed9486a9f01.png"
              alt="The Basketball Factory Elite Training Facility"
              title="Elite Training Facility"
              description="State-of-the-art facilities for youth basketball development in Sussex County"
            >
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-lg border-2 border-gray-200 hover:border-tbf-gold transition-all duration-300 group">
                <Image
                  src="https://cdn.abacus.ai/images/fabb65b7-8289-41ab-b82c-0ed9486a9f01.png"
                  alt="The Basketball Factory Elite Training Facility"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Audiowide, sans-serif' }}>Elite Training Facility</h3>
                  <p className="text-sm opacity-90">Click to view larger</p>
                </div>
              </div>
            </ImageModal>

            <ImageModal
              src="https://cdn.abacus.ai/images/5b3ad84a-84c6-4bfe-a5fb-e5c28603cd5b.png"
              alt="AAU Basketball Success Stories"
              title="Success Stories"
              description="Championship-winning teams from Sparta NJ youth sports program"
            >
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-lg border-2 border-gray-200 hover:border-tbf-gold transition-all duration-300 group">
                <Image
                  src="https://cdn.abacus.ai/images/5b3ad84a-84c6-4bfe-a5fb-e5c28603cd5b.png"
                  alt="AAU Basketball Success Stories"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Audiowide, sans-serif' }}>Success Stories</h3>
                  <p className="text-sm opacity-90">Click to view larger</p>
                </div>
              </div>
            </ImageModal>

            <ImageModal
              src="https://cdn.abacus.ai/images/ecf37002-06d7-4986-b413-3ed06dfe3ee7.png"
              alt="Elite Basketball Training New Jersey"
              title="Elite Training"
              description="Professional training and skill development for The Basketball Factory"
            >
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-lg border-2 border-gray-200 hover:border-tbf-gold transition-all duration-300 group">
                <Image
                  src="https://cdn.abacus.ai/images/ecf37002-06d7-4986-b413-3ed06dfe3ee7.png"
                  alt="Elite Basketball Training New Jersey"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Audiowide, sans-serif' }}>Elite Training</h3>
                  <p className="text-sm opacity-90">Click to view larger</p>
                </div>
              </div>
            </ImageModal>
          </div>
        </div>

        {/* SEO Keywords Section */}
        <div className="text-center">
          <p className="text-gray-500 text-sm max-w-4xl mx-auto">
            Serving <span className="text-gray-600 font-semibold">Sparta, Newton, Andover, Hopatcong, Franklin, Hamburg</span> and all of <span className="text-gray-600 font-semibold">Sussex County, NJ</span> | 
            Premier <span className="text-gray-600 font-semibold">AAU tryouts</span>, <span className="text-gray-600 font-semibold">youth basketball training</span>, and <span className="text-gray-600 font-semibold">elite basketball development</span> programs
          </p>
        </div>
      </div>
    </section>
  )
}
