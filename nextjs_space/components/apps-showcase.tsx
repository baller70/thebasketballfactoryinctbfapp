
'use client';

import { motion } from 'framer-motion';
import { Target, Timer, TrendingUp, Brain, Calendar, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const apps = [
  {
    id: 1,
    name: 'Shot Tracker Pro',
    icon: Target,
    description: 'Track your shooting percentages from different spots on the court. Analyze your form with video breakdown, log workouts, and see your improvement over time with detailed analytics.',
    features: [
      'Spot-specific shooting stats',
      'Video form analysis',
      'Workout history tracking',
      'Progress charts & analytics',
      'Custom shooting drills'
    ]
  },
  {
    id: 2,
    name: 'Dribbling Drill Master',
    icon: Timer,
    description: 'Guided dribbling workouts with timers, progressions, and skill level tracking. From beginner ball handling to advanced combo moves, develop elite handles at your own pace.',
    features: [
      'Skill-level progression system',
      'Timed drill sequences',
      'Form tips & demonstrations',
      'Daily workout reminders',
      'Achievement milestones'
    ]
  },
  {
    id: 3,
    name: 'Vertical & Speed Lab',
    icon: TrendingUp,
    description: 'Science-backed training programs designed to increase your vertical jump, first-step quickness, and overall explosiveness. Track your athletic development with measurable results.',
    features: [
      'Personalized jump programs',
      'Speed & agility drills',
      'Strength training routines',
      'Performance testing',
      'Recovery protocols'
    ]
  },
  {
    id: 4,
    name: 'Basketball IQ Simulator',
    icon: Brain,
    description: 'Improve your basketball decision-making with game scenario simulations. Learn to read defenses, make the right pass, and develop court vision through interactive training.',
    features: [
      'Game situation scenarios',
      'Decision-making quizzes',
      'Play recognition training',
      'Court vision exercises',
      'Strategy breakdowns'
    ]
  },
  {
    id: 5,
    name: 'Personal Training Planner',
    icon: Calendar,
    description: 'AI-powered custom workout plans based on your skill level, goals, and schedule. Get a personalized training roadmap that adapts as you improve, keeping you on track to reach your potential.',
    features: [
      'AI-generated workout plans',
      'Goal-based programming',
      'Adaptive difficulty scaling',
      'Schedule integration',
      'Progress tracking dashboard'
    ]
  }
];

export default function AppsShowcase() {
  return (
    <section className="py-20 md:py-32 bg-black">
      <div className="container mx-auto px-4">
        {/* Join the Takeover CTA - MOVED TO TOP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto mb-20"
        >
          <div className="relative bg-gradient-to-br from-[#FFD700] via-[#FFD700] to-[#FFC700] rounded-3xl p-12 md:p-16 shadow-2xl overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
                All I Ask in Return?
                <span className="block">Subscribe & Join the Takeover</span>
              </h3>
              
              <p className="text-lg md:text-xl text-gray-900 mb-8 leading-relaxed max-w-3xl">
                I'm building these apps for <span className="font-bold">FREE</span> because I believe every player deserves access to 
                quality training tools without breaking the bank. All I ask for my hard work is simple: 
                <span className="font-bold"> follow us on social media and join the Takeover movement</span>. 
                We're tired of expensive software holding players back, and together, we can change the game.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start mb-8">
                <Button
                  asChild
                  size="lg"
                  className="bg-black hover:bg-gray-900 text-white font-bold px-10 py-7 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <a 
                    href="https://www.instagram.com/thebasketballfactoryinc/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Follow on Instagram
                  </a>
                </Button>
                
                <Button
                  asChild
                  size="lg"
                  className="bg-white hover:bg-gray-100 text-black border-4 border-black font-bold px-10 py-7 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <a 
                    href="https://www.youtube.com/@thebasketballfactoryinc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    Subscribe on YouTube
                  </a>
                </Button>
              </div>
              
              <p className="text-base md:text-lg text-black font-bold">
                That's it. No payment. No subscription. Just your support as we revolutionize 
                basketball training together. 🏀
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section header */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Five Powerful Apps,{' '}
              <span className="bg-gradient-to-r from-[#FFD700] via-[#FFD700] to-[#FFC700] bg-clip-text text-transparent">
                Zero Cost
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
              Each app is expertly designed to target specific aspects of basketball development. 
              All launching soon—follow us above to be notified when they're ready.
            </p>
          </motion.div>
        </div>

        {/* Apps list */}
        <div className="space-y-8 max-w-6xl mx-auto mb-20">
          {apps.map((app, index) => {
            const Icon = app.icon;
            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white/5 backdrop-blur-sm border border-[#FFD700]/20 rounded-2xl p-8 md:p-10 hover:bg-white/10 hover:border-[#FFD700]/40 transition-all duration-300 group">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#FFD700] to-[#FFC700] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-[#FFD700]/50 transition-all duration-300">
                        <Icon className="w-10 h-10 text-black" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                        <h3 className="text-2xl md:text-3xl font-bold text-white">
                          {app.name}
                        </h3>
                        <div className="inline-flex items-center gap-2 bg-[#FFD700] text-black px-4 py-2 rounded-full text-sm font-bold">
                          <Lock className="w-4 h-4" />
                          <span>COMING SOON</span>
                        </div>
                      </div>

                      <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                        {app.description}
                      </p>

                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="text-sm font-bold text-[#FFD700] uppercase tracking-wider mb-4">
                          Key Features:
                        </h4>
                        <ul className="grid md:grid-cols-2 gap-3">
                          {app.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-gray-300">
                              <span className="w-2 h-2 bg-[#FFD700] rounded-full mt-2 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Disabled button */}
                      <Button
                        disabled
                        className="bg-[#FFD700] hover:bg-[#FFC700] text-black font-bold px-8 py-6 text-base disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Notify Me When Available
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>


        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-[#FFD700]/30 rounded-2xl p-10 md:p-12">
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Be the First to Know
            </h3>
            <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed">
              All five apps are in development and launching soon. Follow us to get notified 
              the moment they're ready to download.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
              <span className="flex items-center gap-2 text-[#FFD700] font-semibold">
                <span className="w-2 h-2 bg-[#FFD700] rounded-full" />
                100% Free
              </span>
              <span className="flex items-center gap-2 text-[#FFD700] font-semibold">
                <span className="w-2 h-2 bg-[#FFD700] rounded-full" />
                No Credit Card
              </span>
              <span className="flex items-center gap-2 text-[#FFD700] font-semibold">
                <span className="w-2 h-2 bg-[#FFD700] rounded-full" />
                iOS & Android
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
