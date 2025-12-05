
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Award, Trophy, ChevronDown, ChevronUp } from 'lucide-react'

export default function ResumeSection() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className="relative py-24 bg-gradient-to-b from-gray-900 via-black to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-tbf-gold text-sm font-bold tracking-wider uppercase mb-4 block">
            Elite Credentials
          </span>
          <h2 className="text-4xl sm:text-6xl font-bold text-white mb-6 font-audiowide uppercase">
            MEET <span className="text-tbf-gold">MR. BASIC</span>
          </h2>
          <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
            Two decades of professional excellence—from international championships to Hall of Fame honors.
          </p>
        </div>

        {/* Kevin Houston Card */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-0">
            {/* Image Section */}
            <div className="md:col-span-2 relative h-96 md:h-auto">
              <Image
                src="/kevin-houston-head-basketball-trainer.jpg"
                alt="Kevin Houston - Professional Basketball Trainer"
                fill
                className="object-cover object-top"
              />
              {/* Gold Accent Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-tbf-gold"></div>
            </div>

            {/* Content Section */}
            <div className="md:col-span-3 p-8 md:p-12 bg-gradient-to-br from-white to-gray-50">
              {/* Name and Title */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-3xl md:text-5xl font-audiowide mb-2 text-black uppercase">
                    KEVIN HOUSTON
                  </h3>
                  <p className="text-tbf-gold font-bold text-xl md:text-2xl uppercase tracking-wide mb-4">
                    Director & Elite Skills Trainer
                  </p>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Trophy className="w-5 h-5 text-tbf-gold" />
                    <span className="font-semibold">20+ Years Professional Experience</span>
                  </div>
                </div>
                
                {/* Certification Badge */}
                <div className="flex-shrink-0 ml-4 hidden md:block">
                  <Image
                    src="/basketball-trainer-certifications-sparta-nj.png"
                    alt="Certified Basketball Trainer"
                    width={180}
                    height={180}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Featured Quote */}
              <div className="bg-gradient-to-r from-tbf-gold to-yellow-600 p-6 rounded-lg mb-6 shadow-lg">
                <p className="text-white text-lg md:text-xl font-bold italic leading-relaxed">
                  "Hard work, discipline, and proper training build champions on and off the court."
                </p>
              </div>

              {/* Career Summary Paragraph */}
              <div className="mb-6 space-y-4">
                <p className="text-gray-800 leading-relaxed text-base md:text-lg">
                  Kevin Houston brings over <strong>20 years of elite basketball experience</strong> spanning professional leagues across Europe, collegiate excellence, and NBA development camps. As a <strong>Hall of Fame inductee</strong> and former international player, Kevin competed at the highest levels in Belgium, Austria, and Slovakia—earning MVP honors, league championships, and setting records that still stand today.
                </p>
                <p className="text-gray-800 leading-relaxed text-base md:text-lg">
                  His decorated career includes <strong>Atlantic 10 Conference honors</strong>, <strong>NJCAA All-American recognition</strong>, participation in the <strong>Denver Nuggets NBA Camp</strong>, and multiple <strong>EuroBasket.com All-Star selections</strong>. Kevin scored <strong>19.5 PPG at the Division I level</strong>, ranking 36th in the nation, and earned the prestigious title of <strong>Belgian League MVP</strong> while leading his team to championships.
                </p>
                <div className="bg-black/5 border-l-4 border-tbf-gold p-4 rounded">
                  <p className="text-gray-800 leading-relaxed italic">
                    <strong>What sets Kevin apart:</strong> He doesn't just teach basketball—he brings proven European training methodology combined with championship-level experience. When you train with Kevin, you're learning from someone who has competed against the world's best and understands what it truly takes to excel at every level of the game.
                  </p>
                </div>
              </div>

              {/* Expand/Collapse Button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full bg-tbf-gold text-white px-8 py-4 font-bold text-lg hover:bg-yellow-600 transition-all duration-300 rounded shadow-lg flex items-center justify-center gap-3 group"
              >
                {isExpanded ? (
                  <>
                    <span>HIDE FULL RESUME</span>
                    <ChevronUp className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
                  </>
                ) : (
                  <>
                    <span>VIEW KEVIN'S COMPLETE PROFESSIONAL RESUME</span>
                    <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Expandable Full Resume Section */}
          {isExpanded && (
            <div className="bg-gradient-to-b from-black to-gray-900 p-8 md:p-12 border-t-4 border-tbf-gold animate-fadeIn">
              <div className="max-w-6xl mx-auto">
                <h4 className="text-3xl md:text-4xl font-audiowide mb-8 text-white text-center">
                  COMPLETE PROFESSIONAL <span className="text-tbf-gold">ACHIEVEMENTS</span>
                </h4>
                
                {/* Main Achievements Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column - Professional Career */}
                  <div className="space-y-6">
                    <div className="bg-black/40 border-l-4 border-tbf-gold p-6 rounded-lg">
                      <div className="flex items-center gap-4 mb-6">
                        <Trophy className="w-8 h-8 text-tbf-gold" />
                        <h5 className="text-2xl font-audiowide text-white uppercase">Professional Honors</h5>
                      </div>
                      
                      {/* International Excellence */}
                      <div className="mb-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="relative w-12 h-12 flex-shrink-0 grayscale opacity-60">
                            <Image 
                              src="/fiba-international-basketball-logo.png" 
                              alt="FIBA" 
                              fill 
                              className="object-contain" 
                            />
                          </div>
                          <h6 className="text-lg font-bold text-tbf-gold uppercase">European Excellence</h6>
                        </div>
                        <ul className="space-y-2 pl-4">
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span><strong>Austrian Bundesliga Player of the Year</strong> — 2010</span>
                          </li>
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span><strong>Belgian League MVP</strong> — 2005</span>
                          </li>
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span><strong>Leading Scorer, Austrian League</strong> — 2010</span>
                          </li>
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span><strong>Leading Scorer, Belgian League</strong> — 2005</span>
                          </li>
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span><strong>Set Slovakian Playoff Record: 55 points</strong> — 2009</span>
                          </li>
                        </ul>
                      </div>

                      {/* Championships */}
                      <div className="mb-6 pt-6 border-t border-tbf-gold/20">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="relative w-12 h-12 flex-shrink-0 grayscale opacity-60">
                            <Image 
                              src="/belgium-basketball-league-logo.png" 
                              alt="Championships" 
                              fill 
                              className="object-contain" 
                            />
                          </div>
                          <h6 className="text-lg font-bold text-tbf-gold uppercase">Championships</h6>
                        </div>
                        <ul className="space-y-2 pl-4">
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span><strong>Belgian Cup Winner</strong> — 2005, 2006</span>
                          </li>
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span><strong>Belgian League Finalist</strong> — 2006</span>
                          </li>
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span><strong>Slovakian League Champion</strong> — 2009</span>
                          </li>
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span><strong>NJCAA National Tournament Champion</strong> — 1998</span>
                          </li>
                        </ul>
                      </div>

                      {/* All-Star Teams */}
                      <div className="pt-6 border-t border-tbf-gold/20">
                        <h6 className="text-lg font-bold text-tbf-gold mb-3 uppercase">All-Star Selections</h6>
                        <ul className="space-y-2 pl-4">
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span>EuroBasket.com All-Austrian Bundesliga 1st Team — 2010, 2011</span>
                          </li>
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span>EuroBasket.com Belgian League All-Imports — 2005, 2007</span>
                          </li>
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span>FIBA EuroCup Quarterfinals — 2006</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Collegiate & Other Honors */}
                  <div className="space-y-6">
                    {/* Collegiate Achievements */}
                    <div className="bg-black/40 border-l-4 border-tbf-gold p-6 rounded-lg">
                      <div className="flex items-center gap-4 mb-6">
                        <Award className="w-8 h-8 text-tbf-gold" />
                        <h5 className="text-2xl font-audiowide text-white uppercase">Collegiate Excellence</h5>
                      </div>
                      
                      {/* Division I */}
                      <div className="mb-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="relative w-12 h-12 flex-shrink-0 grayscale opacity-60">
                            <Image 
                              src="/atlantic-10-conference-logo-bw.png" 
                              alt="Atlantic 10" 
                              fill 
                              className="object-contain" 
                            />
                          </div>
                          <h6 className="text-lg font-bold text-tbf-gold uppercase">Division I</h6>
                        </div>
                        <ul className="space-y-2 pl-4">
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span><strong>Atlantic 10 Conference Second Team</strong> — 2001</span>
                          </li>
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span><strong>NABC District II Second Team</strong> — 2001</span>
                          </li>
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span><strong>19.5 PPG, 36th in Nation</strong></span>
                          </li>
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span>All-NCAA All-Star Touring Team Italy — 2000</span>
                          </li>
                        </ul>
                      </div>

                      {/* Junior College */}
                      <div className="mb-6 pt-6 border-t border-tbf-gold/20">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="relative w-12 h-12 flex-shrink-0 grayscale opacity-60">
                            <Image 
                              src="/njcaa-junior-college-basketball-logo.png" 
                              alt="NJCAA" 
                              fill 
                              className="object-contain" 
                            />
                          </div>
                          <h6 className="text-lg font-bold text-tbf-gold uppercase">Junior College</h6>
                        </div>
                        <ul className="space-y-2 pl-4">
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span><strong>NJCAA First Team All-American</strong> — 1998</span>
                          </li>
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span><strong>Jayhawk West Conference MVP</strong> — 1998</span>
                          </li>
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span><strong>Region VI Most Valuable Player</strong> — 1998</span>
                          </li>
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span>Jayhawk West Freshman of the Year — 1997</span>
                          </li>
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span>NJCAA All-Region VI Team — 1996, 1997</span>
                          </li>
                        </ul>
                      </div>

                      {/* Hall of Fame & Special Honors */}
                      <div className="pt-6 border-t border-tbf-gold/20">
                        <h6 className="text-lg font-bold text-tbf-gold mb-3 uppercase">Hall of Fame & Special Honors</h6>
                        <ul className="space-y-2 pl-4">
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span><strong>Hall of Fame Inductee</strong>, Seward County CC — 2016</span>
                          </li>
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span><strong>Second All-Time Leading Scorer</strong>, Seward County CC</span>
                          </li>
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span><strong>Denver Nuggets NBA Camp</strong> — 2001</span>
                          </li>
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span>Nike Battleground Finalist (One-On-One), NYC — 2002</span>
                          </li>
                          <li className="text-white/90 text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-tbf-gold mt-1">•</span>
                            <span>NY Daily News 2nd Team All-City — 1996</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 text-center bg-tbf-gold/10 border border-tbf-gold/30 rounded-lg p-8">
                  <p className="text-white text-xl md:text-2xl font-audiowide mb-4 uppercase">
                    Learn from a <span className="text-tbf-gold">Proven Champion</span>
                  </p>
                  <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
                    When you train with Kevin Houston, you're not just learning basketball—you're learning from someone who has competed and excelled at every level of the game. His championship experience and professional methodology will elevate your game to new heights.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
