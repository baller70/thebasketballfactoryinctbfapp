

'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Clock, Users, MapPin, DollarSign, Calendar } from 'lucide-react'

const includedFeatures = [
  'Professional supervision',
  'Full court access',
  'Basketball equipment provided',
  'Skill practice time',
  'Pickup game opportunities',
  'Safe training environment',
  'Flexible drop-in schedule',
  'Ages 7-18 welcome'
]

export default function YouthFallOpenGymDetails() {
  return (
    <section className="relative py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-tbf-gold text-sm font-bold tracking-wider uppercase mb-3 block">
              Program Information
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-audiowide">
              PROGRAM <span className="text-tbf-gold">DETAILS</span>
            </h2>
            <p className="text-white/60 text-sm max-w-2xl mx-auto">
              Everything you need to know about the Youth Fall Open Gym program
            </p>
          </motion.div>
        </div>

        {/* Quick Info Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-tbf-gold/20 via-tbf-gold/10 to-tbf-gold/20 border-2 border-tbf-gold rounded-lg p-6 mb-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Users className="w-6 h-6 text-tbf-gold mx-auto mb-2" />
              <div className="text-white/60 text-xs uppercase mb-1">Age Group</div>
              <div className="text-white font-bold text-lg">Ages 7-18</div>
            </div>
            <div className="text-center">
              <Clock className="w-6 h-6 text-tbf-gold mx-auto mb-2" />
              <div className="text-white/60 text-xs uppercase mb-1">Duration</div>
              <div className="text-white font-bold text-lg">4 Hours</div>
            </div>
            <div className="text-center">
              <Calendar className="w-6 h-6 text-tbf-gold mx-auto mb-2" />
              <div className="text-white/60 text-xs uppercase mb-1">Schedule</div>
              <div className="text-white font-bold text-lg">Every Monday</div>
            </div>
            <div className="text-center">
              <MapPin className="w-6 h-6 text-tbf-gold mx-auto mb-2" />
              <div className="text-white/60 text-xs uppercase mb-1">Location</div>
              <div className="text-white font-bold text-lg">Sparta, NJ</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Schedule Information */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900 to-black border-2 border-tbf-gold/30 rounded-lg p-6 h-full"
            >
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-tbf-gold" />
                <h3 className="text-xl font-bold text-white font-audiowide">FALL 2025 SCHEDULE</h3>
              </div>

              <div className="bg-tbf-gold/10 rounded-lg p-6 mb-6">
                <div className="mb-4">
                  <div className="text-tbf-gold text-xs font-bold uppercase mb-1">Remaining Sessions</div>
                  <div className="text-white font-bold text-lg">Monday, November 17, 2025</div>
                  <div className="text-white font-bold text-lg">Monday, November 24, 2025</div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-tbf-gold/20">
                  <div>
                    <div className="text-tbf-gold text-xs font-bold uppercase mb-1">Session Time</div>
                    <div className="text-white font-bold text-lg">4:30 PM - 8:30 PM</div>
                  </div>
                  <Clock className="w-8 h-8 text-tbf-gold/40" />
                </div>
              </div>

              <div className="bg-black/40 border border-tbf-gold/20 rounded-lg p-4 mb-4">
                <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wide">Remaining Fall Sessions</h4>
                <p className="text-white/70 text-sm leading-relaxed">
                  Join us for the last two Monday sessions of the fall season! Register for the full program or drop in for a single session. Book your spot now to secure your place.
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-white/70">
                  <span className="text-tbf-gold mt-0.5">•</span>
                  <span>Ages 7-18 welcome - all skill levels</span>
                </div>
                <div className="flex items-start gap-2 text-white/70">
                  <span className="text-tbf-gold mt-0.5">•</span>
                  <span>Professional supervision throughout session</span>
                </div>
                <div className="flex items-start gap-2 text-white/70">
                  <span className="text-tbf-gold mt-0.5">•</span>
                  <span>Full court access with premium equipment</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* What's Included & Pricing */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900 to-black border-2 border-tbf-gold rounded-lg p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 font-audiowide flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-tbf-gold" />
                WHAT'S INCLUDED
              </h3>
              
              <div className="space-y-2.5">
                {includedFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 text-white/80 text-sm"
                  >
                    <div className="w-1.5 h-1.5 bg-tbf-gold rounded-full flex-shrink-0"></div>
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-tbf-gold/20">
                <div className="bg-tbf-gold/10 rounded-lg p-4">
                  <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wide">What to Bring</h4>
                  <ul className="text-white/70 space-y-2 text-xs">
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-tbf-gold rounded-full"></span>
                      Basketball shoes (indoor)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-tbf-gold rounded-full"></span>
                      Athletic wear & water
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-tbf-gold rounded-full"></span>
                      Ready to play attitude
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-tbf-gold/20 to-tbf-gold/10 border-2 border-tbf-gold rounded-lg p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-tbf-gold/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-tbf-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-audiowide">PRICING</h3>
                  <p className="text-tbf-gold text-sm font-semibold">FLEXIBLE OPTIONS</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-white/70 text-xs mb-1">Full Program (2 Sessions)</div>
                  <div className="text-white font-bold text-2xl">$120</div>
                  <div className="text-tbf-gold text-xs mt-1">Save $10 - Best Value!</div>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-white/70 text-xs mb-1">Single Session Drop-In</div>
                  <div className="text-white font-bold text-2xl">$15</div>
                  <div className="text-white/60 text-xs mt-1">per session</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Location Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-900 to-black border-2 border-tbf-gold/30 rounded-lg p-6 mt-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-tbf-gold/10 rounded-lg">
                <MapPin className="w-7 h-7 text-tbf-gold" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-audiowide mb-1">TRAINING LOCATION</h3>
                <p className="text-white/70 text-sm">38 Station Rd, Sparta, NJ 07871</p>
              </div>
            </div>
            <div className="text-white/80 text-sm leading-relaxed md:text-right max-w-md">
              State-of-the-art facility with professional courts and equipment for optimal player development
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

