
'use client';

import { motion } from 'framer-motion';
import { Calendar, Trophy, Users, Target } from 'lucide-react';

export default function ProgramsHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='https://static.vecteezy.com/system/resources/thumbnails/014/724/816/small_2x/abstract-black-triangular-background-with-gold-lines-free-vector.jpg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFD700' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center" style={{ paddingTop: '300px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-audiowide uppercase">
            YEAR-ROUND
            <span className="block text-tbf-gold mt-2">BASKETBALL PROGRAMS</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Elite training programs designed for every season. From skill development to competitive preparation,
            we have the perfect program for your athlete's journey.
          </p>

          {/* Feature Icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-tbf-gold/10 rounded-full flex items-center justify-center mb-4 border border-tbf-gold/20">
                <Calendar className="w-8 h-8 text-tbf-gold" />
              </div>
              <h3 className="text-white font-semibold font-audiowide uppercase">YEAR-ROUND</h3>
              <p className="text-gray-400 text-sm mt-1">Continuous Training</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-tbf-gold/10 rounded-full flex items-center justify-center mb-4 border border-tbf-gold/20">
                <Trophy className="w-8 h-8 text-tbf-gold" />
              </div>
              <h3 className="text-white font-semibold font-audiowide uppercase">ELITE COACHING</h3>
              <p className="text-gray-400 text-sm mt-1">Expert Trainers</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-tbf-gold/10 rounded-full flex items-center justify-center mb-4 border border-tbf-gold/20">
                <Users className="w-8 h-8 text-tbf-gold" />
              </div>
              <h3 className="text-white font-semibold font-audiowide uppercase">ALL AGES</h3>
              <p className="text-gray-400 text-sm mt-1">Ages 7-18</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-tbf-gold/10 rounded-full flex items-center justify-center mb-4 border border-tbf-gold/20">
                <Target className="w-8 h-8 text-tbf-gold" />
              </div>
              <h3 className="text-white font-semibold font-audiowide uppercase">SKILL FOCUSED</h3>
              <p className="text-gray-400 text-sm mt-1">Proven Results</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
}
