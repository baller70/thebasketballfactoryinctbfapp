
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

interface FAQ {
  question: string
  answer: string
}

interface SharedFAQProps {
  faqs: FAQ[]
  title?: string
  subtitle?: string
}

export default function SharedFAQ({ faqs, title = "FREQUENTLY ASKED QUESTIONS", subtitle = "Got questions? We've got answers." }: SharedFAQProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <section id="faq-section" className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-tbf-gold text-sm font-bold tracking-wider uppercase mb-4 block">
              Program FAQ
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-audiowide">
              {title.split(' ').map((word, i) => 
                word === 'QUESTIONS' ? <span key={i} className="text-tbf-gold">{word}</span> : <span key={i}>{word} </span>
              )}
            </h2>
            <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </motion.div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className={`
                bg-gradient-to-br from-gray-900 to-black border-2 rounded-lg overflow-hidden transition-all duration-300
                ${expandedIndex === index ? 'border-tbf-gold' : 'border-tbf-gold/30'}
              `}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 flex items-center justify-between gap-4 text-left hover:bg-white/5 transition-colors"
              >
                <h3 className="text-lg font-bold text-white pr-4 font-russo-one">
                  {faq.question}
                </h3>
                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-full bg-tbf-gold/20 flex items-center justify-center transition-transform
                  ${expandedIndex === index ? 'rotate-180' : ''}
                `}>
                  {expandedIndex === index ? (
                    <Minus className="w-5 h-5 text-tbf-gold" />
                  ) : (
                    <Plus className="w-5 h-5 text-tbf-gold" />
                  )}
                </div>
              </button>

              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-tbf-gold/30"
                >
                  <div className="p-6 pt-4">
                    <p className="text-white/80 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center bg-tbf-gold/10 border border-tbf-gold/30 rounded-lg p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-4 font-audiowide">
            STILL HAVE QUESTIONS?
          </h3>
          <p className="text-white/80 mb-6">
            We're here to help! Contact us directly and we'll be happy to answer any questions about our program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:+19732408759"
              className="text-tbf-gold hover:text-tbf-gold/80 font-bold text-lg"
            >
              📞 (973) 240-8759
            </a>
            <span className="hidden sm:block text-white/30">|</span>
            <a
              href="mailto:khouston@thebasketballfactorynj.com"
              className="text-tbf-gold hover:text-tbf-gold/80 font-bold text-lg"
            >
              ✉️ khouston@thebasketballfactorynj.com
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
