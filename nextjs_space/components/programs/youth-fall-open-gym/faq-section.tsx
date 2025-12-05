

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: 'What are the age groups accepted in the Open Gym program?',
    answer: 'Our Youth Fall Open Gym welcomes all young athletes ages 7-18. We provide a safe, supervised environment where players of all skill levels can practice, play, and improve their game. Our coaches ensure age-appropriate supervision and can help facilitate games that match players by skill level when needed.'
  },
  {
    question: 'Do I need to register in advance or can I just drop in?',
    answer: 'Open Gym is designed for drop-in flexibility! No advance registration is required - simply show up during our scheduled Monday sessions (4:30 PM - 8:30 PM). Payment is collected at the door. However, if you plan to attend regularly, you can contact us to set up a more convenient payment arrangement.'
  },
  {
    question: 'What happens during Open Gym sessions?',
    answer: 'Open Gym provides flexible court time where athletes can work on individual skills, shoot around, or participate in pickup games with other players. Our professional staff supervises all activities to ensure safety and can provide coaching tips when needed. It\'s a great mix of structured skill work and competitive play, all in a friendly environment.'
  },
  {
    question: 'How much does it cost to attend Open Gym?',
    answer: 'We offer competitive drop-in rates that allow you to pay only for the sessions you attend. There\'s no long-term commitment or membership fee required. For current pricing and any available multi-session discounts, please contact us directly at (973) 240-8759 or email khouston@thebasketballfactorynj.com.'
  },
  {
    question: 'Is supervision provided during Open Gym?',
    answer: 'Yes! All Open Gym sessions are professionally supervised by our experienced coaching staff. Safety is our top priority, and we maintain appropriate supervision ratios to ensure all athletes can practice and play in a secure environment. Parents can drop off their athletes with confidence knowing they\'re in good hands.'
  },
  {
    question: 'What should my child bring to Open Gym?',
    answer: 'Athletes should bring: indoor basketball shoes (required - no outdoor shoes allowed on our courts), athletic wear (shorts and t-shirt or jersey), a water bottle to stay hydrated, and a positive attitude ready to play! We provide all basketballs and training equipment.'
  },
  {
    question: 'Can players of different skill levels attend the same session?',
    answer: 'Absolutely! Open Gym is designed to accommodate players of all skill levels from beginners to advanced. Our staff helps facilitate appropriate groupings for pickup games and can provide guidance to help players at any level improve. It\'s a great opportunity for newer players to learn from more experienced ones while everyone enjoys the game.'
  },
  {
    question: 'What if my child wants more structured training?',
    answer: 'Open Gym is perfect for flexible practice time, but we also offer more structured programs throughout the year including our Middle School and High School Skills Programs, Private Lessons, and seasonal training camps. Contact us to learn about our full range of training options that might be a better fit for athletes seeking intensive skill development.'
  }
]

export default function YouthFallOpenGymFAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <section id="faq-section" className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
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
              FREQUENTLY ASKED <span className="text-tbf-gold">QUESTIONS</span>
            </h2>
            <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
              Got questions? We've got answers. Here's everything parents need to know about our Youth Fall Open Gym program.
            </p>
          </motion.div>
        </div>

        {/* FAQ Items */}
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
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 flex items-center justify-between gap-4 text-left hover:bg-white/5 transition-colors"
              >
                <h3 className="text-lg font-bold text-white pr-4" style={{ fontFamily: 'Russo One, sans-serif' }}>
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

              {/* Answer */}
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

        {/* Contact Section */}
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

