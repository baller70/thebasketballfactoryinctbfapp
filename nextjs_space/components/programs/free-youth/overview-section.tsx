
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Heart, Users, Trophy, Target, Clock, MapPin } from 'lucide-react'

export default function FreeYouthOverview() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const benefits = [
    {
      icon: Heart,
      title: 'Build Confidence',
      description: 'Watch your child develop self-esteem and a love for the game in a supportive environment.'
    },
    {
      icon: Users,
      title: 'Make New Friends',
      description: 'Your child will meet other Sparta kids their age who share the same interest in basketball.'
    },
    {
      icon: Trophy,
      title: 'Learn Fundamentals',
      description: 'Expert coaching focused on age-appropriate skills: dribbling, shooting, passing, and defense.'
    },
    {
      icon: Target,
      title: 'Expert Coaching',
      description: 'Led by Kevin Houston and experienced coaches who specialize in youth development.'
    },
    {
      icon: Clock,
      title: 'Perfect 1-Hour Session',
      description: 'Just the right length to keep kids engaged without overwhelming them – perfect for their age.'
    },
    {
      icon: MapPin,
      title: 'Local to Sparta',
      description: 'Convenient location right here in Sparta, NJ. No long drives for busy parents!'
    }
  ]

  return (
    <section id="overview" ref={ref} className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 uppercase">
            <span className="text-white">Why This Program Is Free: </span>
            <span className="bg-gradient-to-r from-[#C8B273] to-yellow-600 bg-clip-text text-transparent">
              The Takeover
            </span>
          </h2>
        </motion.div>

        {/* The Takeover Message - Main Content Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="p-8 md:p-12 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-2 border-[#C8B273]/30 rounded-2xl">
            <div className="space-y-6 text-gray-200 leading-relaxed text-lg">
              <p className="text-xl font-semibold text-white">
                This movement is rooted in reclaiming basketball's roots—where skill development, patience, and care mattered.
              </p>
              
              <p>
                I grew up in an era where trainers and coaches developed players who weren't elite from the start but thrived through genuine mentorship. We believed in the process. We believed in every player's potential.
              </p>
              
              <p>
                Today, the narrative has shifted towards only focusing on the elite, neglecting those who need time and proper guidance. Young players who aren't immediately polished are often overlooked, left behind, or pushed aside.
              </p>
              
              <p className="text-white font-semibold">
                I am committed to changing that.
              </p>
              
              <p>
                This free program isn't charity—it's a statement. It's about accessibility, mentorship, and proving that every young player deserves a chance to develop their skills with the same care and dedication that was given to generations before them.
              </p>
              
              <div className="pt-6 mt-6 border-t border-[#C8B273]/30">
                <p className="text-2xl font-bold text-center">
                  <span className="text-white">Let the </span>
                  <span className="bg-gradient-to-r from-[#C8B273] to-yellow-600 bg-clip-text text-transparent">
                    TAKEOVER
                  </span>
                  <span className="text-white"> begin—</span>
                </p>
                <p className="text-center text-white text-lg mt-2">
                  because I am relentless in reshaping the future of the game.
                </p>
              </div>
            </div>
          </div>

          {/* Gold accent corners */}
          <div className="absolute -top-3 -left-3 w-24 h-24 border-t-4 border-l-4 border-[#C8B273] rounded-tl-2xl" />
          <div className="absolute -bottom-3 -right-3 w-24 h-24 border-b-4 border-r-4 border-[#C8B273] rounded-br-2xl" />
        </motion.div>

        {/* Benefits Grid - Simplified */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {benefits.slice(0, 3).map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="text-center p-6 bg-white/5 backdrop-blur-sm border border-[#C8B273]/20 rounded-xl"
              >
                <div className="mb-3 inline-flex p-3 bg-gradient-to-br from-[#C8B273] to-yellow-600 rounded-lg">
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 uppercase">{benefit.title}</h3>
                <p className="text-gray-300 text-sm">{benefit.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
