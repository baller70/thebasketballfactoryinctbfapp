
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default function FreeYouthFAQ() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const faqs = [
    {
      question: 'Is this really FREE? What\'s the catch?',
      answer: 'Yes, it\'s 100% FREE – no hidden fees, no commitment, no catch! We want to introduce Sparta families to quality basketball training and give kids ages 7-10 a fun, positive first experience with the sport. This is our way of giving back to the local community.'
    },
    {
      question: 'My child has never played basketball. Is this program suitable for beginners?',
      answer: 'Absolutely! This program is perfect for beginners. We teach fundamental skills from the ground up in a fun, non-intimidating environment. Many kids in our sessions have never touched a basketball before, and they all have a great time learning together.'
    },
    {
      question: 'What should my child bring to the session?',
      answer: 'Just bring your child in comfortable athletic clothes and sneakers, plus a water bottle. We provide all basketballs and training equipment. No special gear needed!'
    },
    {
      question: 'How many kids will be in each session?',
      answer: 'We keep groups small – typically 12-15 kids per session. This ensures each child gets individual attention from our coaches and plenty of practice time. It\'s the perfect size for learning and making new friends!'
    },
    {
      question: 'Who will be coaching my child?',
      answer: 'Sessions are led by Kevin Houston and our experienced youth basketball coaches who specialize in working with elementary-aged children. Our coaches are patient, encouraging, and focused on making basketball fun while teaching proper fundamentals.'
    },
    {
      question: 'Can I stay and watch my child during the session?',
      answer: 'Yes! Parents are welcome to stay and watch from our viewing area. You\'ll see your child learning new skills, building confidence, and having fun. Many parents enjoy seeing their kids try something new!'
    },
    {
      question: 'What if my child is 6 or 11 years old?',
      answer: 'This specific free session is designed for ages 7-10 to ensure age-appropriate instruction. However, we have other programs for different age groups. Contact us and we\'ll help you find the perfect fit for your child!'
    },
    {
      question: 'Is there any obligation to sign up for paid programs after the free session?',
      answer: 'None whatsoever! This is a no-strings-attached FREE session. If your child loves it and wants to continue, we\'ll share information about our other programs, but there\'s absolutely no pressure or obligation.'
    },
    {
      question: 'How do I reserve a spot for my child?',
      answer: 'Simply complete the quick sign-up form above. Choose your preferred date, provide your contact information and a few details about your child, and you\'re all set! We\'ll send you a confirmation email with all the details.'
    },
    {
      question: 'What if I need to cancel or change my session date?',
      answer: 'No problem at all! Just email us or call, and we\'ll help you switch to a different date. Since it\'s free, there are no cancellation fees – we just ask that you let us know so we can offer the spot to another family.'
    }
  ]

  return (
    <section ref={ref} className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 uppercase">
            <span className="text-white">Questions </span>
            <span className="bg-gradient-to-r from-[#C8B273] to-yellow-600 bg-clip-text text-transparent">
              From Parents
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            We understand you want the best for your child. Here are answers to common questions from Sparta parents.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white/5 backdrop-blur-sm border border-[#C8B273]/20 rounded-xl px-6 hover:border-[#C8B273] transition-colors"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-white hover:text-[#C8B273] transition-colors py-6 font-russo-one">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-6 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center p-8 bg-gradient-to-br from-[#C8B273]/20 to-yellow-600/10 border border-[#C8B273]/30 rounded-xl"
        >
          <h3 className="text-2xl font-bold text-white mb-3 uppercase">Still Have Questions?</h3>
          <p className="text-gray-300 mb-4">
            We're here to help! Reach out and we'll get back to you quickly.
          </p>
          <a
            href="mailto:khouston@thebasketballfactorynj.com"
            className="inline-block px-8 py-3 bg-gradient-to-r from-[#C8B273] to-yellow-600 hover:from-[#B89F5F] hover:to-yellow-500 text-black font-bold rounded-full transition-all duration-300"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </section>
  )
}
