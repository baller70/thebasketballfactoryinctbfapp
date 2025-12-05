
'use client';

import { motion } from 'framer-motion';
import { Smartphone, Zap, Target, Award } from 'lucide-react';

export default function FreeAppsHero() {
  return (
    <section className="relative min-h-screen bg-black text-white pt-[320px] pb-32 overflow-hidden border-b border-[#FFD700]/20">
      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-50" />
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #FFD700 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#FFD700] text-black rounded-full px-6 py-3 mb-8 font-bold"
          >
            <Zap className="w-5 h-5" />
            <span>100% FREE FOREVER</span>
          </motion.div>
          
          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
          >
            Free Basketball
            <span className="block bg-gradient-to-r from-[#FFD700] via-[#FFD700] to-[#FFC700] bg-clip-text text-transparent">
              Training Apps
            </span>
          </motion.h1>
          
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <p className="text-xl md:text-2xl text-gray-300 mb-6 leading-relaxed max-w-4xl mx-auto">
              I'm tired of software being so expensive. Monthly subscriptions that cost $10, $20, even $50+ 
              just to track your workouts or get a training plan.
            </p>
            <p className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto">
              If you're tired of it too,{' '}
              <span className="text-[#FFD700] font-bold">join the Takeover</span>.{' '}
              I want players to get better, and I know having adequate apps will help organize 
              the skill training process—that's why these will{' '}
              <span className="text-[#FFD700] font-bold">always be free</span>.
            </p>
          </motion.div>

          {/* Features grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {[
              { icon: Smartphone, label: 'iOS & Android' },
              { icon: Target, label: 'Skill Focused' },
              { icon: Zap, label: 'Track Progress' },
              { icon: Award, label: 'Expert Designed' }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-[#FFD700]/20 hover:border-[#FFD700]/50 transition-all duration-300"
              >
                <feature.icon className="w-10 h-10 text-[#FFD700] mx-auto mb-3" />
                <p className="text-sm md:text-base font-semibold">{feature.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent" />
    </section>
  );
}
