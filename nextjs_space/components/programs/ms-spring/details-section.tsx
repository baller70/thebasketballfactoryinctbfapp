
'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Clock, Users, MapPin, DollarSign, Calendar } from 'lucide-react'

const includedFeatures = [
  'Professional skill development',
  'Shooting form & technique',
  'Ball handling drills',
  'Defensive positioning',
  'Game situation training',
  'Basketball IQ development',
  'Progress tracking',
  'Professional equipment access'
]

const trainingDates = [
  { month: 'APR', date: '1', day: 'TUE' },
  { month: 'APR', date: '8', day: 'TUE' },
  { month: 'APR', date: '15', day: 'TUE' },
  { month: 'APR', date: '22', day: 'TUE' },
  { month: 'APR', date: '29', day: 'TUE' },
  { month: 'MAY', date: '6', day: 'TUE' },
  { month: 'MAY', date: '13', day: 'TUE' },
  { month: 'MAY', date: '20', day: 'TUE' },
]

export default function MSSpringDetails() {
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
              Everything you need to know about the Middle School Spring Circuit program
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
              <div className="text-white font-bold text-sm">Grades 2nd - 6th</div><div className="text-white font-bold text-sm">Grades 7th - 8th</div>
            </div>
            <div className="text-center">
              <Clock className="w-6 h-6 text-tbf-gold mx-auto mb-2" />
              <div className="text-white/60 text-xs uppercase mb-1">Duration</div>
              <div className="text-white font-bold text-lg">90 Minutes</div>
            </div>
            <div className="text-center">
              <Calendar className="w-6 h-6 text-tbf-gold mx-auto mb-2" />
              <div className="text-white/60 text-xs uppercase mb-1">Schedule</div>
              <div className="text-white font-bold text-lg">Tuesdays</div>
            </div>
            <div className="text-center">
              <MapPin className="w-6 h-6 text-tbf-gold mx-auto mb-2" />
              <div className="text-white/60 text-xs uppercase mb-1">Location</div>
              <div className="text-white font-bold text-lg">Sparta, NJ</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Training Dates - Compact Calendar */}
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
                <h3 className="text-xl font-bold text-white font-audiowide">Spring 2025 Training Dates</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {trainingDates.map((date, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-black/40 border border-tbf-gold/40 rounded-lg p-3 text-center hover:border-tbf-gold transition-colors"
                  >
                    <div className="text-tbf-gold/70 text-xs font-bold mb-1">{date.month}</div>
                    <div className="text-white text-2xl font-bold font-audiowide">{date.date}</div>
                    <div className="text-white/50 text-xs mt-1">{date.day}</div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-tbf-gold/10 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-tbf-gold text-xs font-bold uppercase mb-1">Session Times (Tuesdays)</div>
                    <div className="text-white font-bold text-sm">Grades 2nd - 6th: 5:00 - 6:30 PM</div><div className="text-white font-bold text-sm">Grades 7th - 8th: 6:30 - 8:00 PM</div>
                  </div>
                  <Clock className="w-8 h-8 text-tbf-gold/40" />
                </div>
              </div>

              
              <div className="bg-black/30 border border-white/10 rounded-lg p-4 mb-4">
                <p className="text-white font-bold text-sm mb-3">All Tuesday Sessions:</p>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-black/40 rounded p-2 border border-tbf-gold/20">
                    <p className="text-tbf-gold font-bold">Grades 2nd - 6th</p>
                    <p className="text-white/70">5:00 - 6:30 PM</p>
                    <p className="text-white/50" style={{fontSize: '10px'}}>Boys &amp; Girls</p>
                  </div>
                  <div className="bg-black/40 rounded p-2 border border-tbf-gold/20">
                    <p className="text-tbf-gold font-bold">Grades 7th - 8th</p>
                    <p className="text-white/70">6:30 - 8:00 PM</p>
                    <p className="text-white/50" style={{fontSize: '10px'}}>Boys &amp; Girls</p>
                  </div>
                  <div className="bg-black/40 rounded p-2 border border-tbf-gold/20">
                    <p className="text-tbf-gold font-bold">Grades 9th - 12th</p>
                    <p className="text-white/70">8:00 - 9:30 PM</p>
                    <p className="text-white/50" style={{fontSize: '10px'}}>Boys &amp; Girls</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-white/70">
                  <span className="text-tbf-gold mt-0.5">•</span>
                  <span>Arrive 10 minutes early for check-in</span>
                </div>
                <div className="flex items-start gap-2 text-white/70">
                  <span className="text-tbf-gold mt-0.5">•</span>
                  <span>No make-up sessions for missed dates</span>
                </div>
                <div className="flex items-start gap-2 text-white/70">
                  <span className="text-tbf-gold mt-0.5">•</span>
                  <span>Limited spots - register early!</span>
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
                      Positive attitude
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
                  <h3 className="text-lg font-bold text-white font-audiowide">Pricing</h3>
                  <p className="text-tbf-gold text-sm font-semibold">Flexible Options</p>
                </div>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                Choose <strong className="text-white">Pay in Full</strong> or <strong className="text-white">Pay As You Go</strong>. Payment details available during registration.
              </p>
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
                <h3 className="text-xl font-bold text-white font-audiowide mb-1">Training Location</h3>
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
