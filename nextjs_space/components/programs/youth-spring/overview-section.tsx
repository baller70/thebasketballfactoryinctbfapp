
'use client'

import { motion } from 'framer-motion'
import { Target, TrendingUp, Users, Award } from 'lucide-react'

const features = [
  {
    icon: Target,
    title: 'Skill Sharpening',
    description: 'Learn basketball basics including shooting, dribbling, and defense through fun drills and personalized attention.'
  },
  {
    icon: TrendingUp,
    title: 'Confidence Building',
    description: 'Build confidence and love for the game in a supportive environment designed for young learners.'
  },
  {
    icon: Users,
    title: 'Expert Coaching',
    description: 'Learn from experienced coaches who specialize in teaching young athletes the fundamentals of basketball.'
  },
  {
    icon: Award,
    title: 'Competitive Edge',
    description: 'Develop skills that will prepare young athletes for future basketball success through age-appropriate training.'
  }
]

export default function YouthSpringOverview() {
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
              WHY CHOOSE OUR <span className="text-tbf-gold">SPRING OPEN GYM?</span>
            </h2>
            <p className="text-white/70 text-base max-w-3xl mx-auto leading-relaxed">
              Fun spring basketball training. Designed specifically for young athletes learning the game in a supportive environment.
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
            "Whether it's refining your shooting, improving your dribbling, or enhancing your defensive game, our expert coaches will provide personalized training to elevate your performance. Perfect for both players and parents looking to invest in the competitive edge."
          </p>
          <p className="text-tbf-gold font-bold text-sm">- The Basketball Factory Coaching Staff</p>
        </motion.div>
      </div>
    </section>
  )
}
