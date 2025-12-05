
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Check, Calendar, Clock, MapPin, Users } from 'lucide-react'

export default function FreeYouthDetails() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const included = [
    'Professional coaching from experienced youth basketball trainers',
    'Age-appropriate basketball fundamentals (dribbling, shooting, passing)',
    'Fun, engaging drills designed specifically for 7-10 year olds',
    'Positive reinforcement and confidence-building techniques',
    'Safe, supervised environment with small group sizes',
    'Introduction to teamwork and sportsmanship',
    'All equipment provided – just bring your child and a water bottle!',
    'No strings attached – truly 100% FREE for Sparta families'
  ]

  const sessionDates = [
    { date: 'December 28, 2025', time: '10:00 AM - 11:00 AM', spots: 'Available' },
    { date: 'January 12, 2026', time: '10:00 AM - 11:00 AM', spots: 'Available' }
  ]

  return (
    <section ref={ref} className="relative py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* What's Included & Session Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {/* Program Highlights */}
            <div className="mb-8 p-6 bg-gradient-to-br from-[#C8B273]/20 to-yellow-600/10 border border-[#C8B273]/30 rounded-xl">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 uppercase">
                <Clock className="w-6 h-6 text-[#C8B273]" />
                Program Highlights
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-black/40 rounded-lg">
                  <p className="text-3xl font-bold text-[#C8B273]">FREE</p>
                  <p className="text-sm text-gray-300">No Cost</p>
                </div>
                <div className="text-center p-4 bg-black/40 rounded-lg">
                  <p className="text-3xl font-bold text-[#C8B273]">1 Hour</p>
                  <p className="text-sm text-gray-300">Perfect Length</p>
                </div>
                <div className="text-center p-4 bg-black/40 rounded-lg">
                  <p className="text-3xl font-bold text-[#C8B273]">7-10</p>
                  <p className="text-sm text-gray-300">Years Old</p>
                </div>
                <div className="text-center p-4 bg-black/40 rounded-lg">
                  <p className="text-3xl font-bold text-[#C8B273]">Sparta</p>
                  <p className="text-sm text-gray-300">Local to You</p>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-2 uppercase">
              <Check className="w-8 h-8 text-[#C8B273]" />
              What Your Child Gets
            </h3>
            <div className="space-y-3">
              {included.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="flex items-start gap-3 p-3 bg-white/5 backdrop-blur-sm border border-[#C8B273]/20 rounded-lg hover:border-[#C8B273]/50 transition-colors"
                >
                  <Check className="w-5 h-5 text-[#C8B273] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Available Sessions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-2 uppercase">
              <Calendar className="w-8 h-8 text-[#C8B273]" />
              Available Sessions
            </h3>
            <p className="text-gray-300 mb-6 text-lg">
              Choose the Saturday morning session that works best for your family. Each session is 1 hour long 
              and limited to ensure personalized attention for every child.
            </p>

            <div className="space-y-4">
              {sessionDates.map((session, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="p-5 bg-white/5 backdrop-blur-sm border border-[#C8B273]/20 rounded-xl hover:border-[#C8B273] transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-[#C8B273]" />
                        <p className="text-lg font-bold text-white">{session.date}</p>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <p className="text-gray-300">{session.time}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <p className="text-gray-300">The Basketball Factory, Sparta NJ</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                        session.spots === 'Available' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {session.spots}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Location Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 p-6 bg-gradient-to-br from-[#C8B273]/10 to-yellow-600/5 border border-[#C8B273]/30 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-[#C8B273] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-white mb-2 uppercase">Convenient Sparta Location</h4>
                  <p className="text-gray-300">
                    All sessions take place right here in Sparta, NJ at The Basketball Factory. 
                    Easy parking, safe facility, and close to home for busy families!
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
