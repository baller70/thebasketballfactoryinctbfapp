
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What age groups can attend this camp?',
      answer: 'Our TBF Weekly Summer Basketball Camp is designed for athletes ages 7-15, with age-appropriate programming and grouping.',
    },
    {
      question: 'What time does camp run each day?',
      answer: 'Camp runs Monday through Friday from 9:00 AM to 3:00 PM. Please arrive 10-15 minutes early for check-in.',
    },
    {
      question: 'What should my child bring to camp?',
      answer: 'Athletes should bring a water bottle, lunch/snacks, basketball shoes, athletic clothing, and a positive attitude. We provide all basketball equipment.',
    },
    {
      question: 'Is the camp available for multiple weeks?',
      answer: 'Yes! We offer 8 different weeks throughout the summer. You can register for one week or multiple weeks based on your schedule.',
    },
    {
      question: 'What skill level is required?',
      answer: 'All skill levels are welcome! Our coaches work with each athlete at their individual level to help them improve and succeed.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 font-russo-one">
            Frequently Asked <span className="text-tbf-gold">Questions</span>
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about our summer basketball camp.
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
