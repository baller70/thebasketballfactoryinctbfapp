
'use client'

import { motion } from 'framer-motion'
import { BookOpen, TrendingUp, Award } from 'lucide-react'

export default function BlogHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black pt-[320px] pb-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #C8B273 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-tbf-gold/10 border-2 border-tbf-gold rounded-full text-tbf-gold font-bold tracking-wider uppercase text-sm">
            <BookOpen className="w-5 h-5" />
            BASKETBALL TRAINING INSIGHTS
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 font-audiowide uppercase"
        >
          THE TBF <span className="text-tbf-gold">BLOG</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-12"
        >
          Expert training tips, player development strategies, and success stories from professional trainer Kevin Houston and The Basketball Factory team.
        </motion.p>

        {/* Feature Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-tbf-gold/10 border border-tbf-gold/20 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-tbf-gold" />
            </div>
            <h3 className="text-white font-semibold font-audiowide uppercase">TRAINING TIPS</h3>
            <p className="text-white/70 text-sm">Expert techniques and drills</p>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-tbf-gold/10 border border-tbf-gold/20 flex items-center justify-center">
              <Award className="w-8 h-8 text-tbf-gold" />
            </div>
            <h3 className="text-white font-semibold font-audiowide uppercase">SUCCESS STORIES</h3>
            <p className="text-white/70 text-sm">Player achievements and wins</p>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-tbf-gold/10 border border-tbf-gold/20 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-tbf-gold" />
            </div>
            <h3 className="text-white font-semibold font-audiowide uppercase">BASKETBALL WISDOM</h3>
            <p className="text-white/70 text-sm">Insights from the pros</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
