
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function WhoWeTrainedHero() {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Hall of Fame Banner Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/HALL-OF-FAME-BANNER.png"
          alt="Hall of Fame - Elite Players Trained at The Basketball Factory"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Overlaid Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 font-audiowide uppercase"
        >
          WHO WE <span className="text-tbf-gold">TRAINED</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl md:text-4xl font-bold text-white mb-6 uppercase"
        >
          SPARTA TRAINING. <span className="text-tbf-gold">COLLEGE SUCCESS</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed"
        >
          From our training facility in Sparta, NJ, we've developed over 30 college athletes. 
          These players represent years of dedication, hard work, and our proven commitment 
          to excellence in basketball training.
        </motion.p>
      </div>
    </section>
  )
}
