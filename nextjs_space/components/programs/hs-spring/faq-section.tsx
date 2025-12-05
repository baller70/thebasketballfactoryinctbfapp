
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: 'What are the age groups and skill levels accepted in your training program?',
    answer: 'This program is designed specifically for high school athletes in grades 9-12 (ages 14-18). We welcome players of all skill levels - whether you\'re just starting out, looking to improve your skills, or aiming to take your game to the next level. Our expert coaches adapt the training to meet each athlete where they are and push them to reach their full potential.'
  },
  {
    question: 'How does The Basketball Factory support players development beyond just basketball skills?',
    answer: 'We focus on holistic player development that goes beyond the court. Our program emphasizes building confidence, mental toughness, leadership skills, and basketball IQ. We teach athletes how to handle pressure, work as part of a team, and develop the discipline and work ethic that will serve them in basketball and in life. Parents appreciate that we\'re not just developing players - we\'re developing young leaders.'
  },
  {
    question: 'How do I register for your training program?',
    answer: 'Registration is simple through our online booking portal above. Choose your preferred payment option (Pay in Full or Pay As You Go), fill out the registration form with your athlete\'s information, and select your training dates. Once submitted, we\'ll contact you within 24 hours to confirm your booking and provide payment details. You can also call us directly at (973) 240-8759 if you have questions or prefer to register over the phone.'
  },
  {
    question: 'What is the cost of the training program and are there any discounts or payment plans available?',
    answer: 'We offer two flexible payment options: 1) Pay in Full - Pay for all sessions upfront for the best value and priority booking for future programs, or 2) Pay As You Go (P.A.Y.G) - Pay only for the sessions you attend with no long-term commitment. Specific pricing details will be provided during the booking process. We believe in making quality basketball training accessible to all families in the Sparta community.'
  },
  {
    question: 'Who are your trainers and what are their qualifications?',
    answer: 'Our program is led by Kevin Houston ("Mr. Basic") and his team of experienced basketball trainers. Kevin has over 15 years of experience training youth athletes and has helped over 200 athletes in Sussex County reach their basketball goals. Our coaching staff includes former college players and coaches who understand the demands of youth basketball and what it takes to succeed.'
  },
  {
    question: 'How are training sessions structured and what is the schedule?',
    answer: 'Each training session runs for 90 minutes at our Sparta facility (38 Station Rd). Sessions begin with a dynamic warm-up, followed by skill development drills focusing on shooting, ball handling, and defense. We then move into game-situation training where athletes apply what they\'ve learned in competitive scenarios. Each session ends with cool-down stretching. The program runs for 8 weeks during the spring season.'
  },
  {
    question: 'What if my athlete needs to miss a session?',
    answer: 'We understand that conflicts arise. If you\'ve chosen Pay in Full, your spot remains reserved but we do not offer make-up sessions for missed dates. If you\'ve chosen Pay As You Go, you simply don\'t pay for sessions you don\'t attend. We encourage consistent attendance for maximum skill development, but we understand the demands on today\'s student-athletes.'
  },
  {
    question: 'What should my athlete bring to training?',
    answer: 'Athletes should bring: indoor basketball shoes (required - no outdoor shoes on our courts), athletic wear (shorts and a t-shirt or basketball jersey), a water bottle to stay hydrated, and a positive attitude ready to learn and work hard. We provide all basketballs and training equipment.'
  }
]

export default function HSSpringFAQ() {
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
              Got questions? We've got answers. Here's everything parents need to know about our High School Spring Circuit program.
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
