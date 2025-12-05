
'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Star, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function YouthBasicsHero() {
  const scrollToBooking = () => {
    document.getElementById('booking-wizard')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-black pt-[320px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/youth-basketball-basics-workshop-hero-image.png"
          alt="Youth Basketball Basics Workshop"
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* FREE Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-6 py-3 mb-8 bg-gradient-to-r from-[#C8B273] to-yellow-600 rounded-full"
        >
          <Gift className="w-5 h-5 text-black" />
          <span className="text-black font-bold text-lg">100% FREE COMMUNITY PROGRAM!</span>
          <Gift className="w-5 h-5 text-black" />
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 uppercase"
        >
          <span className="!text-white bg-transparent block mb-2">Youth Basketball</span>
          <span className="bg-gradient-to-r from-[#C8B273] to-yellow-600 bg-clip-text text-transparent">
            Basics Workshop
          </span>
        </motion.h1>

        {/* Age Group Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center gap-2 px-6 py-2 mb-6 border-2 border-[#C8B273] rounded-full"
        >
          <Star className="w-5 h-5 text-[#C8B273]" />
          <span className="!text-white bg-transparent font-semibold">Ages 7-10 • 4 Weeks • Saturdays</span>
          <Star className="w-5 h-5 text-[#C8B273]" />
        </motion.div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
        >
          FREE community basketball workshop for Sussex County families! Watch your child thrive in our beginner basketball program designed for ages 7-10 in Sparta, NJ. 
          Professional coaches create a positive, pressure-free environment where kids learn fundamentals, develop coordination, and have fun. 
          <span className="text-[#C8B273] font-bold"> Perfect first step into youth sports!</span>
        </motion.p>

        {/* Key Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          {[
            '✓ 100% FREE',
            '✓ 4 Weeks',
            '✓ Saturdays 11 AM',
            '✓ Ages 7-10',
            '✓ Pro Coaching',
            '✓ Sparta, NJ'
          ].map((benefit, index) => (
            <div
              key={index}
              className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-[#C8B273]/30 rounded-lg"
            >
              <span className="!text-white bg-transparent font-medium">{benefit}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            onClick={scrollToBooking}
            size="lg"
            className="bg-gradient-to-r from-[#C8B273] to-yellow-600 hover:from-[#B89F5F] hover:to-yellow-500 text-black font-bold px-12 py-6 text-lg rounded-full shadow-2xl shadow-[#C8B273]/50 transition-all duration-300 hover:scale-105"
          >
            Claim Your FREE Spot Now
          </Button>
          <Button
            onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
            size="lg"
            variant="outline"
            className="border-2 border-[#C8B273] bg-black !text-white bg-transparent hover:bg-[#C8B273] hover:text-black font-semibold px-8 py-6 text-lg rounded-full transition-all duration-300"
          >
            Learn More
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <ArrowDown className="w-8 h-8 text-[#C8B273] mx-auto animate-bounce" />
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  )
}
