'use client';

import { useState } from 'react';
import { ChevronDown, Crosshair, Hand, Users, Footprints, Trophy, Calendar, MapPin, Shield, Car } from 'lucide-react';

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
  { q: 'What days and times does the program run?', a: 'Monday, Tuesday, and Wednesday mornings from 10:00 AM to 11:30 AM. The program runs all summer \u2014 starting the Monday after the 4th of July through the last week of August.' },
  { q: 'Does my child need to be experienced to join?', a: 'Not at all. This program is for all skill levels \u2014 from kids picking up a basketball for the first time to players sharpening their fundamentals before school season. Our coaches work with every child at their level.' },
  { q: 'Is it all drills or do they play games too?', a: "It\u2019s a great mix of both. Each session starts with focused skill work, then kids put what they\u2019ve learned into live games \u2014 1-on-1, 2-on-2, 3-on-3, and 5-on-5. Learn a skill, then immediately apply it." },
  { q: 'Do I have to sign up for the whole summer?', a: 'No \u2014 you can drop in for individual sessions or come as often as you like. Many families come all summer, but there\u2019s no commitment required.' },
  { q: 'How many baskets does the facility have?', a: "We have 16 baskets. Every kid gets plenty of reps \u2014 no standing in line waiting for a turn. It\u2019s one of the biggest advantages of training at The Basketball Factory." },
  { q: 'Where is the facility located?', a: "38 Station Rd, Sparta, NJ 07871. Easy drive from Rockaway (~25 min), Dover (~30 min), Jefferson (right next door), and Newton (~15 min)." },
  { q: 'What should my child bring?', a: 'Athletic clothing, basketball shoes (indoor, non-marking soles), and a water bottle. We provide all basketballs and training equipment.' },
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
              Most gyms have 2-4 baskets. We have 16. Every kid is shooting, dribbling, and working at the same time &mdash; not standing in line. More reps means faster improvement.
            </p>
          </div>
        </div>
      </section>

      {/* Everything You Need to Know — Accordions */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 font-russo-one text-center">
            Everything You Need to <span className="text-tbf-gold">Know</span>
          </h2>

          <div className="space-y-3">
            <Accordion title="What does a typical session look like?" defaultOpen>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="bg-tbf-gold text-black font-bold text-xs w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <div>
                    <p className="font-bold text-black text-sm">Warm-Up &amp; Skill Focus</p>
                    <p className="text-gray-600 text-sm">Each session starts with a focused skill topic &mdash; shooting form, ball handling, passing, or footwork drills.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-tbf-gold text-black font-bold text-xs w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <div>
                    <p className="font-bold text-black text-sm">Drill Stations &amp; Reps</p>
                    <p className="text-gray-600 text-sm">With 16 baskets, every kid gets maximum reps. No standing around &mdash; everyone is working at the same time.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-tbf-gold text-black font-bold text-xs w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <div>
                    <p className="font-bold text-black text-sm">Live Games &amp; Competition</p>
                    <p className="text-gray-600 text-sm">Put skills to the test in 1-on-1, 2-on-2, 3-on-3, and full 5-on-5 games. This is where learning becomes playing.</p>
                  </div>
                </div>
                <div className="bg-tbf-gold/10 rounded-lg p-3 text-center mt-2">
                  <p className="text-black font-bold text-sm">Half skill development, half live games &mdash; learn it, then apply it in real competition.</p>
                </div>
              </div>
            </Accordion>

            <Accordion title="What skills will my child learn?">
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: Crosshair, title: 'Shooting', desc: 'Proper form, release point, follow-through, range development' },
                  { icon: Hand, title: 'Ball Handling', desc: 'Both hands, crossovers, between the legs, ball control under pressure' },
                  { icon: Users, title: 'Passing', desc: 'Chest pass, bounce pass, outlet pass, reading the floor' },
                  { icon: Footprints, title: 'Footwork', desc: 'Pivoting, jab steps, triple threat, defensive slides' },
                  { icon: Trophy, title: 'Finishing', desc: 'Layups with both hands, floaters, reverse finishes, contact finishing' },
                ].map((skill) => (
                  <div key={skill.title} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                    <div className="bg-tbf-gold/10 p-2 rounded-lg flex-shrink-0">
                      <skill.icon className="w-4 h-4 text-tbf-gold" />
                    </div>
                    <div>
                      <p className="font-bold text-black text-sm">{skill.title}</p>
                      <p className="text-gray-600 text-xs">{skill.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Accordion>

            <Accordion title="Schedule & Details">
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-black text-sm">Monday, Tuesday, Wednesday &bull; 10:00 - 11:30 AM</p>
                    <p className="text-gray-600 text-sm">Runs the entire summer &mdash; Monday after 4th of July through last week of August. Drop in any session or come all summer.</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                  <Users className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-black text-sm">Boys &amp; Girls &bull; All Skill Levels</p>
                    <p className="text-gray-600 text-sm">Whether your child is just learning the basics or sharpening their game before school season. Coaches meet every kid where they are.</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-black text-sm">What to Bring</p>
                    <p className="text-gray-600 text-sm">Athletic clothes, basketball shoes (indoor, non-marking soles), water bottle. We provide all basketballs and equipment.</p>
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
                    16 baskets under one roof. Climate-controlled and purpose-built for basketball training. Every kid gets maximum reps &mdash; no waiting in line. Easy drive from towns across Sussex and Morris County.
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

          {/* Towns SEO Block — always visible */}
          <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Car className="w-5 h-5 text-tbf-gold" />
              <h3 className="text-lg font-bold text-black font-audiowide">Families Come From All Over Northern NJ</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Our youth basketball skills training draws kids from across Sussex County, Morris County, and beyond. An easy morning drive from anywhere in northern New Jersey.
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
