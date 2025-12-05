
'use client';

import { motion } from 'framer-motion';
import { Users, Award, Target, Building } from 'lucide-react';

const stats = [
  {
    icon: Users,
    number: '24+',
    label: 'ENROLLMENT',
    description: 'Every year, over 150 local players join our program, benefiting from expert coaching and world-class training facilities.',
  },
  {
    icon: Award,
    number: '10',
    label: 'PARENTS',
    description: 'We take pride in our positive testimonials from parents who have seen their children make incredible progress.',
  },
  {
    icon: Target,
    number: '30',
    label: 'SKILL SESSION',
    description: 'Each year, we conduct over 300 skills development sessions, ensuring consistent growth and improvement for every athlete.',
  },
  {
    icon: Building,
    number: '10',
    label: 'Training Center',
    description: 'Our facility boasts a professional-grade basketball court outfitted with the latest cutting-edge tools to maximize their skill development and performance.',
  },
];

export default function FallStatsSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/fall-basketball-statistics-background.png)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/85" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm md:text-base text-gray-400 uppercase tracking-widest mb-4">
            FUNDAMENTAL SKILL DEVELOPMENT
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            TBF INC <span className="text-[#C8B273]">IN NUMBERS</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            The Basketball Factory Inc. has been a cornerstone of basketball excellence in Sussex County, NJ 
            for 13 years. Our European-inspired training methods, led by a former professional player, 
            have shaped some of the region's top talent.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                {/* Icon and Number */}
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="text-white/80">
                    <Icon className="w-12 h-12 md:w-16 md:h-16" strokeWidth={1.5} />
                  </div>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    className="text-6xl md:text-7xl lg:text-8xl font-bold text-white"
                  >
                    {stat.number}
                  </motion.div>
                </div>

                {/* Label */}
                <h3 className="text-white font-bold text-lg md:text-xl uppercase tracking-wider mb-4">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-white/80 text-sm md:text-base leading-relaxed">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
