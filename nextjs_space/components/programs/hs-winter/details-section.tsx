'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Clock, Users, MapPin, Calendar } from 'lucide-react'

const includedFeatures = [
  'Advanced skill development',
  'Shooting mechanics',
  'Ball handling drills',
  'Defensive techniques',
  'Game situation training',
  'Strength & conditioning',
  'Progress tracking',
  'Professional facility access'
]

const trainingDates = [
  { month: 'DEC', year: '2024', dates: ['2', '4', '9', '11', '16', '18'] },
  { month: 'JAN', year: '2025', dates: ['6', '8', '13', '15', '20', '22', '27', '29'] },
  { month: 'FEB', year: '2025', dates: ['3', '5', '10', '12'] },
]

export default function HSWinterDetails() {
  return (
    <section className="relative py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Everything you need to know about the High School Winter Workouts program
            </p>
          </motion.div>
        </div>

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
              <div className="text-white font-bold text-lg">Grades 9-12</div>
            </div>
            <div className="text-center">
              <Clock className="w-6 h-6 text-tbf-gold mx-auto mb-2" />
              <div className="text-white/60 text-xs uppercase mb-1">Duration</div>
              <div className="text-white font-bold text-lg">90 Minutes</div>
            </div>
            <div className="text-center">
              <Calendar className="w-6 h-6 text-tbf-gold mx-auto mb-2" />
              <div className="text-white/60 text-xs uppercase mb-1">Schedule</div>
              <div className="text-white font-bold text-lg">Mon & Wed</div>
            </div>
            <div className="text-center">
              <MapPin className="w-6 h-6 text-tbf-gold mx-auto mb-2" />
              <div className="text-white/60 text-xs uppercase mb-1">Location</div>
              <div className="text-white font-bold text-lg">Sparta, NJ</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                <h3 className="text-xl font-bold text-white font-audiowide">Winter 2025 Training Dates</h3>
              </div>

              <div className="space-y-4">
                {trainingDates.map((month, index) => (
                  <motion.div
                    key={month.month}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-black/40 border border-tbf-gold/40 rounded-lg p-4"
                  >
                    <div className="text-tbf-gold font-bold mb-2">{month.month} {month.year}</div>
                    <div className="flex flex-wrap gap-2">
                      {month.dates.map((date) => (
                        <div key={date} className="bg-tbf-gold/10 border border-tbf-gold/30 rounded px-3 py-1 text-white font-bold">
                          {date}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-tbf-gold/10 rounded-lg p-4 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-tbf-gold text-xs font-bold uppercase mb-1">Session Time</div>
                    <div className="text-white font-bold text-lg">6:00 PM - 7:30 PM</div>
                  </div>
                  <Clock className="w-8 h-8 text-tbf-gold/40" />
                </div>
              </div>
            </motion.div>
          </div>

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
                What's Included
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
            </motion.div>
          </div>
        </div>

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
                <h3 className="text-xl font-bold text-white font-audiowide mb-1">Training Location</h3>
                <p className="text-white/70 text-sm">38 Station Rd, Sparta, NJ 07871</p>
              </div>
            </div>
            <div className="text-white/80 text-sm leading-relaxed md:text-right max-w-md">
              State-of-the-art facility with professional courts and equipment
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
