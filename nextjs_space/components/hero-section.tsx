
'use client'

import { motion } from 'framer-motion'

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden pt-[200px] md:pt-[200px]">
      {/* Background Image - Full coverage from top including header area */}
      <div 
        className="fixed top-0 left-0 right-0 bottom-0 -z-20"
        style={{
          backgroundImage: 'url("/basketball-training-gold-court-optimized.jpeg")',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Dark overlay for better text visibility */}
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 -z-10" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
        <div className="text-center">
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white text-sm md:text-base tracking-[0.3em] uppercase mb-8 font-light"
          >
            SERVING SPARTA, NJ AND SUSSEX COUNTY AREA
          </motion.p>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight"
          >
            <span className="text-white">ELITE YOUTH BASKETBALL</span>
            <br />
            <span className="text-tbf-gold">SKILL TRAINING IN SPARTA, NJ</span>
          </motion.h1>
          
          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white text-lg md:text-xl mt-6 max-w-3xl mx-auto font-light"
          >
            Expert basketball training for ages 7-18. Develop shooting, ball handling, defense & game IQ with certified trainers in Sussex County.
          </motion.p>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
