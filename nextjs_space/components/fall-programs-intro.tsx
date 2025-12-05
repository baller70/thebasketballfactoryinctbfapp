
'use client';

import { motion } from 'framer-motion';
import { Target, Award, TrendingUp, Shield } from 'lucide-react';

const benefits = [
  {
    icon: Target,
    title: 'Skill Development',
    description: 'Master fundamental basketball skills with expert coaching',
  },
  {
    icon: Award,
    title: 'Tryout Ready',
    description: 'Prepare for school and travel basketball tryouts',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'See measurable improvements throughout the season',
  },
  {
    icon: Shield,
    title: '15+ Years Experience',
    description: 'Proven results and player development',
  },
];

export default function FallProgramsIntro() {
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
              Why Choose Our <span className="text-[#C8B273]">Fall Programs?</span>
            </h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              Expert-led training programs designed to prepare youth athletes for the upcoming basketball season with personalized attention and proven results.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:border-[#C8B273] hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-[#C8B273] w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-black mb-1.5">{benefit.title}</h3>
                    <p className="text-sm text-gray-600 leading-snug">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
