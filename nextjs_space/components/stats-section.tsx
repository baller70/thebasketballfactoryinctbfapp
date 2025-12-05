
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'
import { Trophy, Users, GraduationCap, Target } from 'lucide-react'
import Image from 'next/image'

interface Statistic {
  id: string
  label: string
  value: string
  description?: string
  order: number
}

interface StatsSectionProps {
  statistics?: Statistic[]
}

interface StatItemProps {
  icon: React.ReactNode
  value: string
  label: string
  description?: string
  delay?: number
  shouldAnimate: boolean
}

const StatItem = ({ icon, value, label, description, delay = 0, shouldAnimate }: StatItemProps) => {
  const [currentValue, setCurrentValue] = useState(0)
  const targetValue = parseInt(value.replace(/\D/g, '')) || 0
  const hasPlus = value.includes('+')

  useEffect(() => {
    if (shouldAnimate && targetValue > 0) {
      const duration = 2000
      const steps = 60
      const increment = targetValue / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= targetValue) {
          setCurrentValue(targetValue)
          clearInterval(timer)
        } else {
          setCurrentValue(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [shouldAnimate, targetValue])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="flex flex-col items-center text-center px-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="text-white/90">
          {icon}
        </div>
        <motion.div
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-white"
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
        >
          {shouldAnimate && targetValue > 0 ? (
            <>
              {currentValue}
              {hasPlus && currentValue === targetValue ? '+' : ''}
            </>
          ) : (
            value
          )}
        </motion.div>
      </div>
      <div className="text-white font-bold text-sm md:text-base uppercase tracking-wider mb-3" style={{ fontFamily: 'Audiowide, sans-serif' }}>
        {label}
      </div>
      {description && (
        <p className="text-white/80 text-xs md:text-sm leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  )
}

const StatsSection = ({ statistics = [] }: StatsSectionProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  })

  const defaultStats = [
    {
      id: '1',
      label: 'YOUTH ATHLETES',
      value: '200+',
      description: 'The Basketball Factory serves over 200 young athletes ages 7-18 annually in Sparta, NJ and Sussex County, providing elite basketball skill training and player development.',
      order: 1
    },
    {
      id: '2',
      label: 'TRAINING SESSIONS',
      value: '400+',
      description: 'Each year, we conduct over 400 basketball skill training sessions in Sparta, New Jersey, focusing on shooting, ball handling, defense, and game IQ for youth players.',
      order: 2
    },
    {
      id: '3',
      label: 'YEARS EXPERIENCE',
      value: '15+',
      description: 'Our expert training staff has over 15 years of combined experience in youth basketball skill development, with certifications in player development and training.',
      order: 3
    },
    {
      id: '4',
      label: 'SKILL IMPROVEMENT',
      value: '95%',
      description: '95% of parents report significant basketball skill improvement in their children within the first 3 months of training at our Sparta, NJ facility.',
      order: 4
    }
  ]

  const displayStats = statistics.length > 0 ? statistics.sort((a, b) => a.order - b.order) : defaultStats

  const getIcon = (index: number) => {
    const icons = [
      <Users className="h-8 w-8 md:h-10 md:w-10" />,
      <Target className="h-8 w-8 md:h-10 md:w-10" />,
      <GraduationCap className="h-8 w-8 md:h-10 md:w-10" />,
      <Trophy className="h-8 w-8 md:h-10 md:w-10" />
    ]
    return icons[index % icons.length]
  }

  return (
    <section className="relative py-16 md:py-20 overflow-hidden" ref={ref}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/basketball-training-gold-court-optimized.jpeg"
          alt="Basketball Training Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8 md:mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'Audiowide, sans-serif' }}>
            <span className="text-white">TBF</span> <span className="text-tbf-gold">BY THE NUMBERS</span>
          </h2>
          <p className="text-white/90 text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
            Our impressive statistics highlight The Basketball Factory's impact on youth basketball skill development in Sparta, NJ and Sussex County. These numbers reflect our commitment to excellence in training young athletes ages 7-18.
          </p>
        </motion.div>

        {/* Stats Grid - Single Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-8">
          {displayStats.map((stat, index) => (
            <StatItem
              key={stat.id}
              icon={getIcon(index)}
              value={stat.value}
              label={stat.label}
              description={stat.description}
              delay={index * 0.1}
              shouldAnimate={inView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
