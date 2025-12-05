
'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface CTAStat {
  value: string
  title: string
  description: string
}

interface SharedCTAProps {
  title: string
  subtitle: string
  stats?: CTAStat[]
  backgroundImage?: string
}

export default function SharedCTA({ 
  title, 
  subtitle, 
  stats = [],
  backgroundImage = "/high-school-basketball-training-sparta-nj.jpg"
}: SharedCTAProps) {
  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking-section')
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative py-16 bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Basketball Training"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-tbf-gold/20 border border-tbf-gold rounded-full mb-4">
              <Trophy className="w-4 h-4 text-tbf-gold" />
              <span className="text-tbf-gold font-bold text-xs tracking-wider uppercase">
                Limited Spots Available
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-audiowide leading-tight">
              {title}
            </h2>

            <p className="text-white/70 text-base max-w-3xl mx-auto leading-relaxed mb-8">
              {subtitle}
            </p>

            <Button
              onClick={scrollToBooking}
              className="bg-tbf-gold hover:bg-tbf-gold/90 text-black font-bold text-base px-8 py-6 rounded-none group"
            >
              Register Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>

        {stats && stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(stats.length, 4)} gap-6 mb-12`}
          >
            {stats.map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-900 to-black border-2 border-tbf-gold rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-tbf-gold mb-2 font-audiowide">{stat.value}</div>
                <h3 className="text-base font-bold text-white mb-1">{stat.title}</h3>
                <p className="text-white/60 text-sm">
                  {stat.description}
                </p>
              </div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-tbf-gold/20 via-tbf-gold/10 to-tbf-gold/20 border-2 border-tbf-gold/50 rounded-lg p-6"
        >
          <p className="text-white text-base font-bold">
            🏀 Parents Trust The Basketball Factory for Results - Join the community of families in Sparta who choose excellence
          </p>
        </motion.div>
      </div>
    </section>
  )
}
