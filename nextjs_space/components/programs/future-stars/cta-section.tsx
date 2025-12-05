
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { ArrowUp, Gift, Heart } from 'lucide-react'

export default function FreeYouthCTA() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const scrollToBooking = () => {
    document.getElementById('booking-wizard')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section ref={ref} className="relative py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative p-12 bg-gradient-to-br from-[#C8B273]/20 to-yellow-600/10 border-2 border-[#C8B273]/50 rounded-3xl overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #C8B273 1px, transparent 0)`,
              backgroundSize: '30px 30px'
            }} />
          </div>

          <div className="relative z-10 text-center">
            {/* FREE Badge */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 mb-6 bg-gradient-to-r from-[#C8B273] to-yellow-600 rounded-full"
            >
              <Gift className="w-5 h-5 text-black" />
              <span className="text-black font-bold text-lg">Limited Spots Available!</span>
            </motion.div>

            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 uppercase">
              Give Your Child the Gift of Basketball
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Sparta parents, don't miss this chance! Sign up your 7-10 year old for a FREE 1-hour basketball 
              session. No cost, no commitment – just fun, learning, and confidence-building.
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {[
                { icon: Gift, text: '100% Free' },
                { icon: Heart, text: 'Build Confidence' },
                { icon: ArrowUp, text: 'Expert Coaching' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-2 px-5 py-3 bg-black/40 backdrop-blur-sm border border-[#C8B273]/30 rounded-full"
                >
                  <item.icon className="w-5 h-5 text-[#C8B273]" />
                  <span className="text-white font-semibold">{item.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                onClick={scrollToBooking}
                size="lg"
                className="bg-gradient-to-r from-[#C8B273] to-yellow-600 hover:from-[#B89F5F] hover:to-yellow-500 text-black font-bold px-16 py-7 text-xl rounded-full shadow-2xl shadow-[#C8B273]/50 transition-all duration-300 hover:scale-105"
              >
                Claim Your FREE Spot Now
              </Button>
              <p className="mt-4 text-sm text-gray-400">
                Takes less than 2 minutes • Spots filling up fast!
              </p>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#C8B273]/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-yellow-600/20 to-transparent rounded-full blur-3xl" />
        </motion.div>

        {/* Trust Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400 text-lg">
            Trusted by Sparta families • Professional coaching • Safe environment • 100% FREE
          </p>
        </motion.div>
      </div>
    </section>
  )
}
