
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Calendar } from 'lucide-react';

const seasons = [
  {
    name: 'FALL PROGRAMS',
    description: 'Skills development and tryout preparation.',
    image: '/fall-basketball-programs-sparta-nj.png',
    href: '/fall-programs',
    color: 'from-orange-600/20 to-orange-900/20'
  },
  {
    name: 'WINTER PROGRAMS',
    description: 'Focused training during competitive season.',
    image: '/winter-basketball-programs-sparta-nj.png',
    href: '/winter-programs',
    color: 'from-blue-600/20 to-blue-900/20'
  },
  {
    name: 'SUMMER PROGRAMS',
    description: 'Comprehensive camps and clinics.',
    image: '/summer-basketball-programs-sparta-nj.png',
    href: '/summer-programs',
    color: 'from-yellow-600/20 to-yellow-900/20'
  },
  {
    name: 'SPRING PROGRAMS',
    description: 'AAU and showcase preparation.',
    image: '/spring-basketball-programs-sparta-nj.png',
    href: '/spring-programs',
    color: 'from-green-600/20 to-green-900/20'
  }
];

export default function SeasonalProgramsGrid() {
  return (
    <section className="py-24 bg-black relative">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#FFD700 1px, transparent 1px), linear-gradient(90deg, #FFD700 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-tbf-gold/10 border border-tbf-gold/20 rounded-full">
                <Calendar className="w-4 h-4 text-tbf-gold" />
                <span className="text-tbf-gold font-semibold text-sm uppercase tracking-wider">4 SEASONS OF EXCELLENCE</span>
              </div>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-audiowide uppercase">
              CHOOSE YOUR <span className="text-tbf-gold">SEASON</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Year-round training programs designed to fit your schedule and elevate your game
            </p>
          </motion.div>
        </div>

        {/* Long Vertical Seasonal Cards - 2 Cards per Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {seasons.map((season, index) => (
            <motion.div
              key={season.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="h-full"
            >
              <Link href={season.href} className="block group h-full">
                <div className="relative bg-gradient-to-b from-gray-900 to-black border-2 border-gray-800 rounded-xl overflow-hidden hover:border-tbf-gold transition-all duration-500 shadow-2xl hover:shadow-tbf-gold/30 h-full flex flex-col">
                  {/* LONG VERTICAL Image Section - FULL IMAGE */}
                  <div className="relative h-[700px] w-full overflow-hidden">
                    <Image
                      src={season.image}
                      alt={season.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${season.color} to-transparent opacity-50`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    
                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="px-3 py-1.5 bg-black/80 backdrop-blur-sm border border-tbf-gold/40 rounded-full">
                        <span className="text-tbf-gold font-bold text-xs uppercase tracking-wide">REGISTER</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Compact Content Section */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2 font-audiowide uppercase group-hover:text-tbf-gold transition-colors duration-300 leading-tight">
                      {season.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 leading-snug flex-1">
                      {season.description}
                    </p>
                    
                    {/* CTA with Arrow */}
                    <div className="flex items-center gap-1.5 text-tbf-gold font-bold text-xs group-hover:gap-2.5 transition-all duration-300">
                      <span className="uppercase tracking-wider">VIEW PROGRAMS</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Bottom Border Accent */}
                  <div className="h-1 w-full bg-gradient-to-r from-transparent via-tbf-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
