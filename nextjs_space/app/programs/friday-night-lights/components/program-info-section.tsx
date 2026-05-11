'use client';

import { useState } from 'react';
import { ChevronDown, MapPin, Shield, Clock, Users, Car, Zap, Trophy } from 'lucide-react';

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-tbf-gold transition-colors">
      <button
        className="w-full px-6 py-5 flex items-center justify-between text-left bg-white cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span className="text-lg font-bold text-black font-russo-one pr-4">{title}</span>
        <ChevronDown className={`w-5 h-5 text-tbf-gold flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-6 pb-6 bg-white">{children}</div>}
    </div>
  );
}

function SubAccordion({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-semibold text-black pr-4">{question}</span>
        <ChevronDown className={`w-4 h-4 text-tbf-gold flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-4 pb-3"><p className="text-sm text-gray-600 leading-relaxed">{answer}</p></div>}
    </div>
  );
}

const towns = [
  'Sparta', 'Jefferson', 'Newton', 'Rockaway', 'Dover', 'Hopatcong',
  'Vernon', 'Byram', 'Stanhope', 'Lafayette', 'West Milford', 'Kinnelon',
  'Butler', 'Boonton', 'Parsippany', 'Andover', 'Hamburg', 'Franklin',
];

const faqs = [
  { q: 'Do I need to register in advance?', a: 'You can register online or just show up! We recommend registering ahead to guarantee your spot, especially on busy nights.' },
  { q: 'What ages can participate?', a: 'Friday Night Lights is open to players ages 7-18. We group games by age and skill level so everyone gets competitive, fair matchups.' },
  { q: 'Is it just pickup games?', a: 'Mostly pickup and open runs, but we organize competitive games so kids get quality playing time. Coaches are on hand to keep things fun and safe.' },
  { q: 'What should my child bring?', a: 'Basketball shoes (indoor, non-marking soles), water bottle, and athletic clothes. We provide all basketballs.' },
  { q: 'How much does it cost?', a: 'Check the registration section above for current pricing. Drop-in and multi-session options available.' },
  { q: 'Where is the facility?', a: '38 Station Rd, Sparta, NJ 07871. Easy drive from towns across Sussex and Morris County.' },
];

export default function ProgramInfoSection() {
  return (
    <>
      {/* 16 Baskets Standalone Callout */}
      <section className="py-8 bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 font-russo-one">
              <span className="text-tbf-gold">16 BASKETS</span> = MAXIMUM REPS
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
              More courts. More games. More action. 16 baskets means everyone is playing at the same time &mdash; no sitting on the sideline waiting for next.
            </p>
          </div>
        </div>
      </section>

      {/* Everything You Need to Know */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 font-russo-one text-center">
            Everything You Need to <span className="text-tbf-gold">Know</span>
          </h2>

          <div className="space-y-3">
            <Accordion title="What is Friday Night Lights?" defaultOpen>
              <div className="space-y-3">
                <p className="text-gray-700 text-sm leading-relaxed">
                  Friday Night Lights is our weekly open gym night where kids come to play competitive pickup basketball in a professional facility. It&apos;s the perfect way to end the week &mdash; high energy, great competition, and a ton of fun.
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <Zap className="w-5 h-5 text-tbf-gold mx-auto mb-1" />
                    <p className="font-bold text-black text-sm">Competitive Runs</p>
                    <p className="text-gray-600 text-xs">Organized games by age group</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <Trophy className="w-5 h-5 text-tbf-gold mx-auto mb-1" />
                    <p className="font-bold text-black text-sm">No Commitment</p>
                    <p className="text-gray-600 text-xs">Drop in any Friday night</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <Users className="w-5 h-5 text-tbf-gold mx-auto mb-1" />
                    <p className="font-bold text-black text-sm">Coaches Present</p>
                    <p className="text-gray-600 text-xs">Safe, supervised environment</p>
                  </div>
                </div>
              </div>
            </Accordion>

            <Accordion title="Schedule & Details">
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-black text-sm">Every Friday &bull; 7:00 - 9:00 PM</p>
                    <p className="text-gray-600 text-sm">Runs throughout the summer. No signup for the full season needed &mdash; come to as many Fridays as you want.</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                  <Users className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-black text-sm">Ages 7 - 18 &bull; All Skill Levels</p>
                    <p className="text-gray-600 text-sm">Games grouped by age and ability. Beginners and experienced players both welcome.</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-black text-sm">What to Bring</p>
                    <p className="text-gray-600 text-sm">Basketball shoes (indoor, non-marking soles) and a water bottle. We provide all basketballs.</p>
                  </div>
                </div>
              </div>
            </Accordion>

            <Accordion title="About Our Facility">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-black text-sm">38 Station Rd, Sparta, NJ 07871</p>
                  <p className="text-gray-600 text-sm mt-1">
                    16 baskets under one roof. Climate-controlled and purpose-built for basketball. Coaches on hand to supervise and organize competitive games. Safe, professional environment.
                  </p>
                </div>
              </div>
            </Accordion>

            <Accordion title="Parent FAQs">
              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <SubAccordion key={i} question={faq.q} answer={faq.a} />
                ))}
              </div>
            </Accordion>
          </div>

          {/* Towns SEO Block */}
          <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Car className="w-5 h-5 text-tbf-gold" />
              <h3 className="text-lg font-bold text-black font-audiowide">Families Come From All Over Northern NJ</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Our Friday Night Lights draws players from across Sussex County, Morris County, and beyond.
            </p>
            <div className="flex flex-wrap gap-2">
              {towns.map((town) => (
                <span key={town} className="bg-white text-gray-700 px-3 py-1 rounded-full text-xs border border-gray-200">
                  {town}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
