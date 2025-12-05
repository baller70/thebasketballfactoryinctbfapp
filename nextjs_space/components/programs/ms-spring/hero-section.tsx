

'use client'

import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function MSSpringHero() {
  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking-wizard')
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToDetails = () => {
    const detailsSection = document.getElementById('overview-section')
    if (detailsSection) {
      detailsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-[320px] pb-32">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/middle-school-basketball-training-sparta-nj.jpg"
          alt="Middle School Basketball Training"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
      </div>

      {/* Animated Basketball Pattern */}
      <div className="absolute inset-0 z-[1] opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-tbf-gold rounded-full animate-pulse" />
        <div className="absolute bottom-40 right-20 w-24 h-24 border-2 border-tbf-gold rounded-full animate-pulse delay-75" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-tbf-gold rounded-full animate-pulse delay-150" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-tbf-gold/20 border border-tbf-gold rounded-full mb-8">
            <span className="w-2 h-2 bg-tbf-gold rounded-full animate-pulse" />
            <span className="text-tbf-gold font-bold text-sm tracking-wider uppercase">
              Spring 2025 Program
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold !text-white bg-transparent mb-6 leading-tight font-russo-one">
            MIDDLE SCHOOL<br />
            <span className="text-tbf-gold">SPRING CIRCUIT</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl !text-white bg-transparent/90 mb-4 max-w-3xl mx-auto font-medium">
            Spring Season Development Training
          </p>
          
          <p className="text-lg !text-white bg-transparent/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            Build fundamental skills and game awareness during the spring season. Perfect for middle school athletes looking to improve.
          </p>

          {/* Key Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            <div className="bg-black/50 backdrop-blur-sm border border-tbf-gold/30 rounded-lg p-6">
              <div className="text-3xl font-bold text-tbf-gold mb-2 font-russo-one">16</div>
              <div className="!text-white bg-transparent/80 text-sm">Training Sessions</div>
            </div>
            <div className="bg-black/50 backdrop-blur-sm border border-tbf-gold/30 rounded-lg p-6">
              <div className="text-3xl font-bold text-tbf-gold mb-2 font-russo-one">90</div>
              <div className="!text-white bg-transparent/80 text-sm">Minutes Per Session</div>
            </div>
            <div className="bg-black/50 backdrop-blur-sm border border-tbf-gold/30 rounded-lg p-6">
              <div className="text-3xl font-bold text-tbf-gold mb-2 font-russo-one">6-8</div>
              <div className="!text-white bg-transparent/80 text-sm">Grades</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={scrollToBooking}
              className="bg-tbf-gold hover:bg-tbf-gold/90 text-black font-bold text-lg px-8 py-6 rounded-none w-full sm:w-auto"
            >
              Book Your Spot Now
            </Button>
            <Button
              onClick={scrollToDetails}
              variant="outline"
              className="border-2 border-tbf-gold text-tbf-gold hover:bg-tbf-gold hover:text-black font-bold text-lg px-8 py-6 rounded-none w-full sm:w-auto"
            >
              Learn More
            </Button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <button
            onClick={scrollToDetails}
            className="!text-white bg-transparent/60 hover:text-tbf-gold transition-colors"
            aria-label="Scroll down"
          >
            <ArrowDown className="w-8 h-8 animate-bounce" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
