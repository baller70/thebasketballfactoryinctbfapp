
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const credentials = [
  { name: 'NY DAILY NEW ALL CITY', image: '/new-york-daily-news-logo-alt.png' },
  { name: 'FIBA EUROPE CUP 1ST TEAM', image: '/fiba-international-basketball-logo.png' },
  { name: 'DENVER NUGGETS', image: '/denver-nuggets-nba-logo.png' },
  { name: 'MVP OF BELGIUM LEAGUE', image: '/belgium-basketball-league-logo.png' },
  { name: 'NABC 1ST TEAM', image: '/nabc-coaches-association-logo.png' },
];

export default function KevinHoustonCredentials() {
  return (
    <section className="py-20 md:py-32 bg-black text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            SERVING <span className="text-[#FFD700]">SUSSEX COUNTY</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Kevin Houston has more than 20 years of experience as a player, coach, and highly sought-after 
            trainer, making him extremely valuable to any team or individual striving to reach their full potential.
          </p>
        </motion.div>

        {/* Credentials Carousel */}
        <div className="relative overflow-hidden py-12">
          <motion.div
            className="flex gap-16"
            animate={{
              x: [0, -1920],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 20,
                ease: 'linear',
              },
            }}
          >
            {[...credentials, ...credentials, ...credentials].map((cred, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-4 min-w-[250px]"
              >
                <div className="relative w-32 h-32 grayscale hover:grayscale-0 transition-all duration-300">
                  <Image
                    src={cred.image}
                    alt={cred.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-[#FFD700] font-bold text-sm text-center uppercase tracking-wider">
                  {cred.name}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Trainer Photo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="relative inline-block">
            <div className="relative w-64 h-80 md:w-80 md:h-96 mx-auto rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/basketball-factory-footer-image.png"
                alt="Kevin Houston - Elite Basketball Trainer in Sparta NJ"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative Border */}
            <div className="absolute -inset-4 border-4 border-[#FFD700] rounded-2xl -z-10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
