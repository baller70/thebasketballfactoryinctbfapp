
'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock } from 'lucide-react'

const trainingDays = [
  { month: 'October', date: '5th' },
  { month: 'October', date: '12th' },
  { month: 'October', date: '19th' },
  { month: 'October', date: '26th' },
  { month: 'November', date: '2nd' },
  { month: 'November', date: '9th' },
  { month: 'November', date: '16th' },
]

export default function HSFallSchedule() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-tbf-gold text-sm font-bold tracking-wider uppercase mb-4 block">
              Training Schedule
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-audiowide">
              FALL 2025 <span className="text-tbf-gold">TRAINING DATES</span>
            </h2>
            <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
              Mark your calendars! All sessions are held on Sundays from 11:30 AM to 1:00 PM at our Sparta, NJ facility.
            </p>
          </motion.div>
        </div>

        {/* Schedule Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Training Days Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {trainingDays.map((day, index) => (
                <motion.div
                  key={`${day.month}-${day.date}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900 to-black border-2 border-tbf-gold/30 rounded-lg p-6 hover:border-tbf-gold transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-tbf-gold group-hover:scale-110 transition-transform" />
                    <span className="text-white/70 text-sm font-semibold uppercase">{day.month}</span>
                  </div>
                  <div className="text-4xl font-bold text-tbf-gold font-audiowide">
                    {day.date}
                  </div>
                  <div className="mt-3 pt-3 border-t border-tbf-gold/20">
                    <div className="flex items-center gap-2 text-white/60 text-xs">
                      <Clock className="w-4 h-4" />
                      <span>11:30 AM - 1:00 PM</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Time and Age Info Card */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-tbf-gold/20 to-tbf-gold/10 border-2 border-tbf-gold rounded-lg p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-8 h-8 text-tbf-gold" />
                <h3 className="text-2xl font-bold text-white font-audiowide">Session Times</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-tbf-gold text-sm font-bold uppercase mb-2">Age Group</div>
                  <div className="text-white text-xl font-bold">Grades 9th-12th</div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-tbf-gold text-sm font-bold uppercase mb-2">Start Time</div>
                  <div className="text-white text-xl font-bold">11:30 AM</div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-tbf-gold text-sm font-bold uppercase mb-2">End Time</div>
                  <div className="text-white text-xl font-bold">1:00 PM</div>
                </div>

                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-tbf-gold text-sm font-bold uppercase mb-2">Day</div>
                  <div className="text-white text-xl font-bold">Sundays Only</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900 to-black border-2 border-tbf-gold/30 rounded-lg p-6"
            >
              <h4 className="text-white font-bold text-lg mb-4 font-audiowide">Important Notes</h4>
              <ul className="space-y-3 text-white/80 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-tbf-gold mt-1">•</span>
                  <span>Sessions run for 90 minutes each Sunday</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-tbf-gold mt-1">•</span>
                  <span>Please arrive 10 minutes early for check-in</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-tbf-gold mt-1">•</span>
                  <span>No make-up sessions for missed dates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-tbf-gold mt-1">•</span>
                  <span>Limited spots available - book early!</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
