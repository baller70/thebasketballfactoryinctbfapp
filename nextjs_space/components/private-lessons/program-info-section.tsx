'use client';

import { useState } from 'react';
import { ChevronDown, MapPin, Shield, Clock, Users, Car, Star, Trophy, GraduationCap, TrendingUp, Award } from 'lucide-react';
import Image from 'next/image';

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-tbf-gold transition-colors">
      <button
        className="w-full px-6 py-5 flex items-center justify-between text-left bg-white cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span className="text-lg font-bold text-black font-audiowide pr-4">{title}</span>
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

const faqs = [
  { q: 'What age groups do you train?', a: 'We work with young athletes ages 7-18, from beginners to advanced players.' },
  { q: 'How long are sessions?', a: 'All private lessons are 1 hour long, focused entirely on your child\'s development.' },
  { q: 'Do you offer payment plans?', a: 'Yes! We offer flexible payment options for our multi-session packages.' },
  { q: 'What should my child bring?', a: 'Basketball shoes, water bottle, and a willingness to learn and work hard!' },
  { q: 'Can parents watch sessions?', a: 'Absolutely! Parents are welcome to observe their child\'s training sessions.' },
  { q: 'How do I reschedule?', a: 'Contact us at least 24 hours in advance to reschedule at no charge.' },
];

const towns = [
  'Sparta', 'Jefferson', 'Newton', 'Rockaway', 'Dover', 'Hopatcong',
  'Vernon', 'Byram', 'Stanhope', 'Lafayette', 'West Milford', 'Kinnelon',
  'Butler', 'Boonton', 'Parsippany', 'Andover', 'Hamburg', 'Franklin',
];

export default function ProgramInfoSection() {
  return (
    <>
      {/* Standalone Callout — 1:1 Personalized Training */}
      <section className="py-8 bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 font-russo-one">
              <span className="text-tbf-gold">1-ON-1</span> = YOUR CHILD&apos;S FULL POTENTIAL
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Group training is great. Private lessons are transformative. One hour of undivided attention from an elite coach who has competed and trained at every level of the game.
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
            <Accordion title='Why parents choose "Mr. Basic"' defaultOpen>
              <div className="space-y-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  Kevin Houston, known as &ldquo;Mr. Basic,&rdquo; believes in mastering fundamentals first. His proven method has helped hundreds of young athletes in Sparta and Sussex County transform their game through dedicated skill development and mental preparation.
                </p>
                <div className="bg-tbf-gold/10 border-l-4 border-tbf-gold p-4 rounded-r-lg">
                  <p className="text-gray-800 text-sm leading-relaxed italic">
                    &ldquo;I believe every young athlete can excel when they master the basics. Through my private lessons, I focus on ball handling, shooting mechanics, footwork, and game awareness. This isn&apos;t just about basketball &mdash; it&apos;s about building confidence, discipline, and a winning mindset.&rdquo;
                  </p>
                  <p className="text-tbf-gold font-semibold text-sm mt-2">&mdash; Kevin Houston, Head Trainer</p>
                </div>
              </div>
            </Accordion>

            <Accordion title="Meet Kevin Houston — Elite Credentials">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-tbf-gold flex-shrink-0">
                    <Image src="/kevin-houston-head-basketball-trainer.jpg" alt="Kevin Houston" fill className="object-cover object-top" />
                  </div>
                  <div>
                    <p className="font-bold text-black text-lg font-audiowide">KEVIN HOUSTON</p>
                    <p className="text-tbf-gold font-bold text-sm">Director & Elite Skills Trainer &bull; 20+ Years Experience</p>
                    <p className="text-gray-600 text-sm mt-1">Professional career across Belgium, Austria, and Slovakia. Hall of Fame inductee. Belgian League MVP. 19.5 PPG at Division I level.</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    'Austrian Bundesliga Player of the Year',
                    'Belgian League MVP',
                    'NJCAA First Team All-American',
                    'Atlantic 10 Conference Honors',
                    'Denver Nuggets NBA Camp',
                    'Hall of Fame Inductee, Seward County CC',
                    'Set Slovakian Playoff Record: 55 points',
                    'All-NCAA All-Star Touring Team Italy',
                  ].map((achievement) => (
                    <div key={achievement} className="flex items-start gap-2 bg-gray-50 p-2 rounded-lg">
                      <Trophy className="w-3 h-3 text-tbf-gold flex-shrink-0 mt-1" />
                      <span className="text-gray-700 text-xs">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Accordion>

            <Accordion title="Success Stories — Real Results">
              <div className="space-y-4">
                <div className="grid sm:grid-cols-4 gap-3 mb-4">
                  {[
                    { num: '200+', label: 'Athletes Trained' },
                    { num: '25+', label: 'College Scholarships' },
                    { num: '100+', label: 'Varsity Players' },
                    { num: '85%', label: 'Improvement in 3mo' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-tbf-gold font-bold text-xl">{stat.num}</p>
                      <p className="text-gray-600 text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>
                {[
                  { name: 'Jason Heter', role: 'Division 2 College Basketball', quote: 'Kevin\'s talent for identifying and enhancing my skills significantly distinguished him. His individualized drills and feedback have elevated my basketball IQ and confidence.' },
                  { name: 'Madison Miller', role: 'Starting Center — South Carolina Upstate (D1)', quote: 'I started private lessons in 8th grade and it completely changed my basketball career. Kevin didn\'t just make me a better player — he taught me how to be a leader on the court.' },
                  { name: 'Samba Diallo', role: 'UMass Minutemen (D1)', quote: 'Training with Kevin was instrumental in my development. The work ethic and basketball IQ I developed prepared me for the demands of Division 1 basketball.' },
                ].map((story) => (
                  <div key={story.name} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-bold text-black text-sm">{story.name} <span className="text-tbf-gold font-normal">&mdash; {story.role}</span></p>
                    <p className="text-gray-600 text-sm italic mt-1">&ldquo;{story.quote}&rdquo;</p>
                  </div>
                ))}
              </div>
            </Accordion>

            <Accordion title="What Parents Are Saying">
              <div className="space-y-3">
                {[
                  { name: 'Jennifer Walsh', town: 'Sparta', quote: 'My son went from being afraid to shoot in games to becoming one of his team\'s top scorers. Kevin\'s patient teaching style and focus on fundamentals really built his confidence.' },
                  { name: 'Michael Torres', town: 'Newton', quote: 'My daughter made varsity as a freshman! Kevin doesn\'t just teach basketball skills — he teaches discipline, focus, and mental toughness.' },
                  { name: 'Robert Jenkins', town: 'Hopatcong', quote: 'He fixed my son\'s shooting form in just three sessions, and now he\'s shooting 45% from three. Kevin\'s ability to explain complex concepts in ways young athletes understand is outstanding.' },
                  { name: 'Lisa Martinez', town: 'Andover', quote: 'My twin boys have been doing private lessons for over a year. He tailors each session to their individual needs. They actually look forward to training!' },
                ].map((testimonial) => (
                  <div key={testimonial.name} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-tbf-gold fill-tbf-gold" />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm italic">&ldquo;{testimonial.quote}&rdquo;</p>
                    <p className="text-black font-semibold text-xs mt-2">{testimonial.name} &mdash; {testimonial.town}, NJ</p>
                  </div>
                ))}
                <div className="text-center mt-2">
                  <a href="https://www.google.com/search?q=the+basketball+factory+sparta+nj" target="_blank" rel="noopener noreferrer" className="text-tbf-gold hover:underline font-semibold text-sm">
                    Read More Reviews on Google &rarr;
                  </a>
                </div>
              </div>
            </Accordion>

            <Accordion title="Session Details & Scheduling">
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-black text-sm">1-Hour Sessions &bull; Flexible Scheduling</p>
                    <p className="text-gray-600 text-sm">Book sessions that fit your family&apos;s schedule. Single sessions and multi-session packages available.</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                  <Users className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-black text-sm">Ages 7 - 18 &bull; All Skill Levels</p>
                    <p className="text-gray-600 text-sm">From first-time players to varsity athletes preparing for college. Kevin meets every athlete where they are.</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-black text-sm">What to Bring</p>
                    <p className="text-gray-600 text-sm">Basketball shoes, water bottle, and a willingness to work hard. We provide all basketballs and equipment.</p>
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
                    16 baskets under one roof. Climate-controlled and purpose-built for basketball. Private lessons take place in a professional training environment — not a school gym.
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
              Families drive from across Sussex County and Morris County for Kevin Houston&apos;s private basketball training.
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
