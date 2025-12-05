

'use client'

import { motion } from 'framer-motion'
import { Target, TrendingUp, Users, Award } from 'lucide-react'

const features = [
  {
    icon: Target,
    title: 'SUPERVISED PLAY',
    description: 'Safe, structured environment with professional supervision ensuring all athletes can practice and play with confidence.'
  },
  {
    icon: TrendingUp,
    title: 'SKILL PRACTICE TIME',
    description: 'Dedicated time and space to work on your individual skills, from shooting and dribbling to defensive techniques.'
  },
  {
    icon: Users,
    title: 'PICKUP GAMES',
    description: 'Play competitive pickup games with other local athletes, improve your game IQ, and develop teamwork skills.'
  },
  {
    icon: Award,
    title: 'DROP-IN FLEXIBILITY',
    description: 'No long-term commitment required. Drop in when it fits your schedule and pay only for the sessions you attend.'
  }
]

export default function YouthFallOpenGymOverview() {
  return (
    <section id="overview-section" className="relative py-16 bg-gradient-to-b from-black via-gray-900 to-black">
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
              Program Overview
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-audiowide">
              WHY CHOOSE OUR <span className="text-tbf-gold">OPEN GYM?</span>
            </h2>
            <p className="text-white/70 text-base max-w-3xl mx-auto leading-relaxed">
              Flexible basketball training for youth athletes ages 7-18. Perfect for skill development, pickup games, and staying active throughout the fall season.
            </p>
          </motion.div>
        </div>

        {/* Compact Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900 to-black border-2 border-tbf-gold/30 rounded-lg p-6 hover:border-tbf-gold transition-all duration-300 group text-center"
            >
              <div className="inline-flex p-3 bg-tbf-gold/10 rounded-lg mb-4 group-hover:bg-tbf-gold/20 transition-colors">
                <feature.icon className="w-6 h-6 text-tbf-gold" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-audiowide">
                {feature.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Compact Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-tbf-gold/10 border-l-4 border-tbf-gold rounded-lg p-6 max-w-5xl mx-auto"
        >
          <p className="text-white text-base italic leading-relaxed mb-3">
            "Our Open Gym sessions provide the perfect environment for young athletes to develop their skills, make new friends, and stay active. With professional supervision and flexible drop-in scheduling, it's the ideal way to keep your game sharp throughout the fall season."
          </p>
          <p className="text-tbf-gold font-bold text-sm">- The Basketball Factory Coaching Staff</p>
        </motion.div>
      </div>
    </section>
  )
}

