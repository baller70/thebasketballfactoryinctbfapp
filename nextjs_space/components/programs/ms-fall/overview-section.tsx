

'use client'

import { motion } from 'framer-motion'
import { Target, TrendingUp, Users, Award } from 'lucide-react'

const features = [
  {
    icon: Target,
    title: 'FUNDAMENTAL SKILLS',
    description: 'Master the basics with focused training on dribbling, shooting form, footwork, and defensive fundamentals tailored for middle school athletes.'
  },
  {
    icon: TrendingUp,
    title: 'BUILD CONFIDENCE',
    description: 'Develop confidence through age-appropriate challenges and positive coaching that helps young athletes believe in their abilities.'
  },
  {
    icon: Users,
    title: 'EXPERT GUIDANCE',
    description: 'Learn from coaches experienced in working with middle school players, understanding the unique needs of athletes at this development stage.'
  },
  {
    icon: Award,
    title: 'TRAVEL TEAM PREP',
    description: 'Get ready for travel basketball with skills training, game situations, and the competitive mindset needed to excel at the next level.'
  }
]

export default function MSFallOverview() {
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
              WHY CHOOSE OUR <span className="text-tbf-gold">SKILLS ACADEMY?</span>
            </h2>
            <p className="text-white/70 text-base max-w-3xl mx-auto leading-relaxed">
              Designed specifically for middle school athletes building their basketball foundation. Perfect for players preparing for travel teams and middle school programs.
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
            "Our Middle School Skills Academy focuses on building a strong foundation in basketball fundamentals. From proper shooting technique to ball handling and defensive positioning, we create a supportive environment where young athletes can develop skills, confidence, and a love for the game. Perfect for families looking to give their middle schooler the best start in competitive basketball."
          </p>
          <p className="text-tbf-gold font-bold text-sm">- The Basketball Factory Coaching Staff</p>
        </motion.div>
      </div>
    </section>
  )
}
