'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What ages/grades is the camp for?',
      answer: 'Our summer basketball camp is for boys and girls in grades 3rd through 8th. All skill levels are welcome — from beginners to experienced players. Our coaches work with every child at their level.',
    },
    {
      question: 'What does a typical camp day look like?',
      answer: 'Each day starts with fun trivia and Q&A, then moves into basketball skill stations across our 16 baskets. Kids are divided into 4 teams (named after NBA/WNBA teams) and compete throughout the day in basketball games, 3-on-3 tournaments, 2-on-2 battles, and 1-on-1 March Madness brackets. We also play dodgeball, kickball, human tic-tac-toe, and other fun games. Every day has a theme — Jersey Day, Blackout Day, Hat Day, and more!',
    },
    {
      question: 'What is NBA All-Star Friday?',
      answer: 'NBA All-Star Friday is the highlight of every camp week! On Fridays, we hold our All-Star competitions: a dunk contest, 3-point shootout, skills challenge, hot shot challenge, and free throw contest. The team with the most points from the entire week wins the TBF Championship Belt. It\'s the event every camper looks forward to!',
    },
    {
      question: 'Is lunch provided?',
      answer: 'Lunch is available for purchase each day — we typically serve pizza and subs. Your child can also bring their own lunch. We sell Gatorade and water, but we recommend bringing a reusable water bottle to stay hydrated throughout the day.',
    },
    {
      question: 'Does my child need to be good at basketball to attend?',
      answer: 'Absolutely not! This camp is about having fun, making friends, and enjoying basketball. We welcome kids of all skill levels. Our coaches adapt activities so every child has a great time and improves, regardless of experience.',
    },
    {
      question: 'How many baskets does the facility have?',
      answer: 'Our facility has 16 baskets — that means every kid gets maximum reps and playing time. No standing around waiting for a turn. It\'s one of the biggest advantages of our camp compared to programs that run in school gyms with just 2-4 baskets.',
    },
    {
      question: 'Who are the coaches and staff?',
      answer: 'Camp is led by Kevin Houston and a team of experienced coaches. We also bring in local high school basketball players as counselors — the younger kids love having older players to look up to, and it creates an amazing energy in the gym.',
    },
    {
      question: 'Can I sign up for multiple weeks?',
      answer: 'Yes! We offer multiple camp weeks throughout the summer. Many families sign up for more than one week because their kids love it so much. Each week has fresh theme days and competitions, so it never gets repetitive.',
    },
    {
      question: 'Where is the camp located? How far is it from Rockaway/Dover/Jefferson?',
      answer: 'We\'re located at 38 Station Rd, Sparta, NJ 07871. We\'re an easy drive from towns across Sussex and Morris County — Rockaway is about 25 minutes, Dover is about 30 minutes, and Jefferson is right next door. Families come from all over northern NJ including Newton, Hopatcong, Vernon, Byram, Stanhope, West Milford, Kinnelon, Butler, Boonton, and Parsippany.',
    },
    {
      question: 'What should my child bring?',
      answer: 'Athletic clothing, basketball shoes (indoor, non-marking soles), a water bottle, and a great attitude! We provide all basketballs and equipment. Lunch can be purchased at camp or brought from home.',
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
            Everything you need to know before signing up your child for camp.
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
