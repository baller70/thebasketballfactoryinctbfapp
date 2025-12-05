
'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function PrivateLessonsHero() {
  const scrollToBooking = () => {
    document.getElementById('booking-wizard')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-[240px] md:pt-[260px] pb-16">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src="/private-lessons-header-vintage.jpg"
            alt="Private Basketball Training Session in Sparta NJ"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="inline-block mb-4">
              <span className="bg-tbf-gold/20 text-tbf-gold px-4 py-2 rounded-full text-sm font-bold tracking-wider">
                ELITE ONE-ON-ONE TRAINING
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold !text-white bg-transparent mb-6 leading-tight font-audiowide">
              PRIVATE BASKETBALL LESSONS IN{' '}
              <span className="text-tbf-gold">SPARTA, NJ</span>
            </h1>
            <p className="text-xl !text-white bg-transparent/90 mb-8 leading-relaxed">
              Expert one-on-one training with Kevin Houston, "Mr. Basic" - helping young athletes ages 7-18 in Sussex County build confidence, master fundamentals, and elevate their basketball IQ through personalized instruction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={scrollToBooking}
                size="lg"
                className="bg-tbf-gold hover:bg-tbf-gold/90 text-black font-bold text-lg px-8 py-6 rounded-none"
              >
                BOOK YOUR SESSION <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                size="lg"
                variant="outline"
                className="border-2 border-black bg-white text-black hover:bg-black hover:!text-white bg-transparent font-bold text-lg px-8 py-6 rounded-none"
              >
                VIEW PRICING
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 !text-white bg-transparent/80">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-tbf-gold rounded-full" />
                <span className="text-sm">Flexible Scheduling</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-tbf-gold rounded-full" />
                <span className="text-sm">All Skill Levels</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-tbf-gold rounded-full" />
                <span className="text-sm">Proven Results</span>
              </div>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm border border-tbf-gold/30 p-6 rounded-lg">
              <div className="text-tbf-gold text-3xl font-bold mb-2">200+</div>
              <div className="!text-white bg-transparent text-sm">Athletes Trained</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-tbf-gold/30 p-6 rounded-lg">
              <div className="text-tbf-gold text-3xl font-bold mb-2">15+</div>
              <div className="!text-white bg-transparent text-sm">Years Experience</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-tbf-gold/30 p-6 rounded-lg">
              <div className="text-tbf-gold text-3xl font-bold mb-2">100%</div>
              <div className="!text-white bg-transparent text-sm">Skill Improvement</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-tbf-gold/30 p-6 rounded-lg">
              <div className="text-tbf-gold text-3xl font-bold mb-2">1:1</div>
              <div className="!text-white bg-transparent text-sm">Personalized Focus</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
