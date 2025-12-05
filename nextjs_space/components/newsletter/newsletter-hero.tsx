
'use client';

import { motion } from 'framer-motion';

export default function NewsletterHero() {
  return (
    <section className="relative min-h-[65vh] bg-black text-white pt-[320px] pb-24 overflow-hidden flex items-center">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #C8B273 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Gold Paper Plane Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <svg
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C8B273"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-15"
        >
          <path d="M22 2L11 13" />
          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
        </svg>
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-none font-audiowide uppercase"
          >
            THE BASKETBALL FACTORY
            <br />
            <span className="text-[#C8B273]">NEWSLETTER</span>
          </motion.h1>
          
          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Stay connected with exclusive updates, player spotlights, training insights, and insider news from The Basketball Factory, Inc.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
