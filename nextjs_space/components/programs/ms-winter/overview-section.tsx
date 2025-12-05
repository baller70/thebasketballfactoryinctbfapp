'use client'
import { motion } from 'framer-motion'
import { Target, TrendingUp, Users, Award } from 'lucide-react'

const features = [
  { icon: Target, title: 'Skill Development', description: 'Focus on fundamental basketball skills and proper technique.' },
  { icon: TrendingUp, title: 'Age-Appropriate', description: 'Training designed specifically for middle school athletes\' development.' },
  { icon: Users, title: 'Game Application', description: 'Learn how to apply skills in real game situations.' },
  { icon: Award, title: 'Confidence Building', description: 'Build self-assurance through progressive skill mastery.' }
]

export default function MSWinterOverview() {
  return (
    <section id="overview-section" className="relative py-16 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <span className="text-tbf-gold text-sm font-bold tracking-wider uppercase mb-3 block">Program Overview</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-audiowide">
              WHY WINTER <span className="text-tbf-gold">WORKOUTS?</span>
            </h2>
            <p className="text-white/70 text-base max-w-3xl mx-auto leading-relaxed">
              Keep your skills sharp and continue developing throughout the winter basketball season.
            </p>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900 to-black border-2 border-tbf-gold/30 rounded-lg p-6 hover:border-tbf-gold transition-all duration-300 group text-center">
              <div className="inline-flex p-3 bg-tbf-gold/10 rounded-lg mb-4 group-hover:bg-tbf-gold/20 transition-colors">
                <feature.icon className="w-6 h-6 text-tbf-gold" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-audiowide">{feature.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
          className="bg-tbf-gold/10 border-l-4 border-tbf-gold rounded-lg p-6 max-w-5xl mx-auto">
          <p className="text-white text-base italic leading-relaxed mb-3">
            "Middle school winter workouts help young athletes maintain and develop their skills during the competitive season. Our program focuses on building a strong foundation while keeping training age-appropriate and fun."
          </p>
          <p className="text-tbf-gold font-bold text-sm">- The Basketball Factory Coaching Staff</p>
        </motion.div>
      </div>
    </section>
  )
}
