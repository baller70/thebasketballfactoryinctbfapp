
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What age is this camp designed for?',
      answer: 'The Youth Skills & Development Training Camp is specifically designed for athletes ages 7-12 who want to develop their fundamental basketball skills.',
    },
    {
      question: 'What days and times does the camp meet?',
      answer: 'Camp meets twice per week on Tuesdays and Thursdays throughout July. Check the training dates section for specific dates.',
    },
    {
      question: 'Does my child need previous basketball experience?',
      answer: 'No previous experience is required! This camp is perfect for beginners and players looking to strengthen their fundamentals.',
    },
    {
      question: 'What should my child bring?',
      answer: 'Athletes should bring basketball shoes, athletic clothing, and a water bottle. We provide all basketball equipment.',
    },
    {
      question: 'How many athletes are in each group?',
      answer: 'We maintain small group sizes to ensure each athlete receives personalized coaching and attention to develop their skills effectively.',
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
            Everything you need to know about our youth skills camp.
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
