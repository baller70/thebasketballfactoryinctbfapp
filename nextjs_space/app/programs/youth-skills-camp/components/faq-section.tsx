'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What days and times does the program run?',
      answer: 'Monday, Tuesday, and Wednesday mornings from 10:00 AM to 11:30 AM. The program runs all summer — starting the Monday after the 4th of July through the last week of August.',
    },
    {
      question: 'Does my child need to be experienced to join?',
      answer: 'Not at all. This program is for all skill levels — from kids who are just picking up a basketball for the first time to players who want to sharpen their fundamentals before the school season. Our coaches work with every child at their level.',
    },
    {
      question: 'What skills will my child learn?',
      answer: 'We cover all the core basketball fundamentals: proper shooting form and technique, ball handling and dribbling with both hands, passing (chest pass, bounce pass, outlet pass), footwork (pivoting, jab steps, triple threat), and finishing at the rim with both hands. Kids learn the right way to do things from day one.',
    },
    {
      question: 'Is it all drills or do they play games too?',
      answer: 'It\'s a great mix of both. Each session starts with focused skill work and drills, then kids put what they\'ve learned into live games — 1-on-1, 2-on-2, 3-on-3, 4-on-4, and 5-on-5. The idea is to learn a skill and immediately apply it in a real game setting.',
    },
    {
      question: 'How many baskets does the facility have?',
      answer: 'We have 16 baskets in our facility. That means every kid gets plenty of reps and practice time — no standing in line waiting for a turn. It\'s one of the biggest advantages of training at The Basketball Factory.',
    },
    {
      question: 'Do I have to sign up for the whole summer?',
      answer: 'No — you can drop in for individual sessions or come as often as you like. Many families come all summer, but there\'s no commitment required. Pay as you go.',
    },
    {
      question: 'Where is the facility located?',
      answer: 'We\'re at 38 Station Rd, Sparta, NJ 07871. We\'re an easy drive from towns across Sussex and Morris County — Rockaway is about 25 minutes, Dover is about 30 minutes, Jefferson is right next door, and Newton is about 15 minutes.',
    },
    {
      question: 'What should my child bring?',
      answer: 'Athletic clothing, basketball shoes (indoor, non-marking soles), and a water bottle. We provide all basketballs and training equipment.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 font-russo-one">
            Parent <span className="text-tbf-gold">FAQs</span>
          </h2>
          <p className="text-xl text-gray-600">
            Common questions about our youth basketball skills training program.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-tbf-gold transition-colors"
            >
              <button
                className="w-full px-8 py-6 flex items-center justify-between text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-bold text-black font-audiowide pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-tbf-gold flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-8 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
