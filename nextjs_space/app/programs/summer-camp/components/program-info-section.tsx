'use client';

import { useState } from 'react';
import { ChevronDown, Star, Trophy, Shirt, Users, Gamepad2, Medal, MapPin, Shield, Clock, Car, Utensils } from 'lucide-react';

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
  'Lake Mohawk', 'Byram', 'Stanhope', 'Andover', 'Hamburg', 'Vernon',
  'West Milford', 'Butler', 'Kinnelon', 'Boonton', 'Parsippany',
  'Lafayette', 'Montague', 'Wantage', 'Franklin', 'Ogdensburg',
];

const faqs = [
  { q: 'What ages/grades is the camp for?', a: 'Boys and girls in grades 3rd through 8th, all skill levels welcome. Our coaches work with every child at their level.' },
  { q: 'What does a typical camp day look like?', a: 'Starts with trivia and Q&A, then basketball skill stations across 16 baskets. Kids compete in team games, 3-on-3, 2-on-2, and 1-on-1 brackets. We also play dodgeball, kickball, human tic-tac-toe, and other fun games. Every day has a theme!' },
  { q: 'What is NBA All-Star Friday?', a: 'The highlight of every camp week! Dunk contest, 3-point shootout, skills challenge, hot shot challenge, and free throw contest. The team with the most points wins the TBF Championship Belt.' },
  { q: 'Is lunch provided?', a: 'Lunch available for purchase (pizza & subs) or bring your own. Gatorade & water for sale. Bring a reusable water bottle.' },
  { q: 'Does my child need to be good at basketball?', a: 'Not at all! This camp is about fun, friends, and basketball. We welcome all skill levels and adapt activities so every child has a great time.' },
  { q: 'How many baskets does the facility have?', a: '16 baskets — every kid gets maximum reps and playing time. No standing around waiting.' },
  { q: 'Who are the coaches and staff?', a: 'Led by Kevin Houston and experienced coaches, plus local high school players as counselors. The younger kids love having older players to look up to.' },
  { q: 'Can I sign up for multiple weeks?', a: 'Yes! Many families sign up for more than one week. Each week has fresh theme days and competitions.' },
  { q: 'Where is the camp? How far from Rockaway/Dover?', a: '38 Station Rd, Sparta, NJ 07871. Rockaway ~25 min, Dover ~30 min, Jefferson is right next door.' },
  { q: 'What should my child bring?', a: 'Athletic clothes, basketball shoes (indoor, non-marking soles), water bottle, great attitude! We provide all basketballs and equipment.' },
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
              Most gyms have 2-4 baskets. We have 16. Every kid is playing, competing, and having fun at the same time &mdash; not sitting on the sideline.
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
            <Accordion title="What does a typical camp day look like?" defaultOpen>
              <div className="space-y-3">
                {[
                  { time: 'Morning', desc: 'Q&A trivia to kick things off, then basketball skill stations across all 16 baskets.' },
                  { time: 'Midday', desc: 'Team competitions — 3-on-3 tournaments, 2-on-2 battles, March Madness 1-on-1, and full-court games.' },
                  { time: 'Lunch', desc: 'Pizza & subs available for purchase, or bring your own. Gatorade & water for sale.' },
                  { time: 'Afternoon', desc: 'Fun games — dodgeball, kickball, human tic-tac-toe, relay races — then back to team competition for points.' },
                ].map((slot) => (
                  <div key={slot.time} className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                    <span className="text-tbf-gold font-bold text-sm w-20 flex-shrink-0">{slot.time}</span>
                    <span className="text-gray-700 text-sm">{slot.desc}</span>
                  </div>
                ))}
              </div>
            </Accordion>

            <Accordion title="NBA All-Star Friday">
              <div className="bg-black rounded-xl p-6 text-center">
                <p className="text-tbf-gold font-bold text-lg font-audiowide mb-3">THE HIGHLIGHT OF EVERY WEEK</p>
                <p className="text-gray-300 text-sm mb-4 max-w-xl mx-auto">
                  Every Friday is All-Star Day. Kids compete in individual and team challenges for the ultimate prize: the TBF Championship Belt.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-3">
                  {['Dunk Contest', '3-Point Shootout', 'Skills Challenge', 'Hot Shot', 'Free Throw Contest'].map((event) => (
                    <span key={event} className="bg-tbf-gold/10 border border-tbf-gold/30 rounded-lg px-3 py-1.5 text-tbf-gold font-bold text-xs">{event}</span>
                  ))}
                </div>
                <p className="text-tbf-gold font-bold text-sm">The winning team takes home the Championship Belt!</p>
              </div>
            </Accordion>

            <Accordion title="What makes this camp different?">
              <div className="grid gap-2">
                {[
                  { icon: Shirt, text: 'Theme days every day — Jersey Day, Blackout Day, Hat Day, Color Wars & more' },
                  { icon: Users, text: '4 teams with real NBA/WNBA names competing all week for the championship belt' },
                  { icon: Gamepad2, text: 'Not just basketball — dodgeball, kickball, human tic-tac-toe, relay races' },
                  { icon: Medal, text: 'Points system all week — earn points for wins, trivia, sportsmanship & effort' },
                  { icon: Star, text: 'High school players help coach — kids look up to them and it creates great energy' },
                  { icon: Utensils, text: 'Lunch available daily (pizza & subs) or bring your own' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                    <item.icon className="w-4 h-4 text-tbf-gold flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </Accordion>

            <Accordion title="Schedule & Details">
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-black text-sm">Monday through Friday &bull; Full Day</p>
                    <p className="text-gray-600 text-sm">Multiple weeks available throughout the summer. Sign up for one week or come back every week!</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                  <Users className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-black text-sm">Grades 3rd - 8th &bull; All Skill Levels</p>
                    <p className="text-gray-600 text-sm">Just starting out or years of experience — our coaches meet every kid where they are. Focus is on fun, friendship, and basketball.</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-black text-sm">What to Bring</p>
                    <p className="text-gray-600 text-sm">Athletic clothes, basketball shoes (indoor, non-marking soles), water bottle. Pizza & subs available for purchase daily, or bring your own lunch.</p>
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
                    16 baskets under one roof. Climate-controlled and purpose-built for basketball. Led by Kevin Houston and experienced coaches, plus high school player counselors. Your child is in safe, professional hands.
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
              Our summer basketball camp draws kids from across Sussex County, Morris County, and beyond. Centrally located in Sparta, NJ.
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
