
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Calendar, Users, Trophy } from 'lucide-react';

export default function FallProgramsHero() {
  return (
    <section className="relative bg-black pt-64 pb-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-block bg-tbf-gold/10 border border-tbf-gold px-4 py-2 rounded-full mb-6">
              <span className="text-tbf-gold font-bold text-sm uppercase tracking-wider">
                Fall 2025 Registration Open
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight font-russo-one">
              Fall Basketball<br />
              <span className="text-tbf-gold">Programs 2025</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Expert-led training programs designed to prepare youth athletes for school and travel basketball tryouts. Choose the program that fits your child's age and goals.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <Calendar className="w-8 h-8 text-tbf-gold mx-auto mb-2" />
                <div className="text-white font-bold text-lg">8-12 Weeks</div>
                <div className="text-gray-400 text-sm">Duration</div>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-tbf-gold mx-auto mb-2" />
                <div className="text-white font-bold text-lg">Ages 7-18</div>
                <div className="text-gray-400 text-sm">All Levels</div>
              </div>
              <div className="text-center">
                <Trophy className="w-8 h-8 text-tbf-gold mx-auto mb-2" />
                <div className="text-white font-bold text-lg">Expert</div>
                <div className="text-gray-400 text-sm">Coaching</div>
              </div>
            </div>

            <div className="flex gap-4">
              <a
                href="#programs"
                className="bg-tbf-gold hover:bg-tbf-gold-bright text-black font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300"
              >
                Browse Programs
              </a>
              <a
                href="#comparison"
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300"
              >
                Compare Options
              </a>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/group-basketball-workout-training-sparta-nj.png"
                alt="Fall Basketball Training in Sparta NJ"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-2xl max-w-xs">
              <div className="flex items-center gap-4">
                <div className="bg-tbf-gold/20 p-3 rounded-lg">
                  <Trophy className="w-8 h-8 text-tbf-gold" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-black">500+</div>
                  <div className="text-gray-600 text-sm">Athletes Trained</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
