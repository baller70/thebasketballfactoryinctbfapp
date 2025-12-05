
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CareerPortfolioCarousel from './career-portfolio-carousel'

export default function DirectorContent() {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const testimonials = [
    {
      name: 'IAN HANAVAN',
      title: 'PLAYER',
      org: 'PHOENIX BRUSSELS',
      image: '/ian-basketball-reference-photo.png',
      quote: 'I\'ve been through many workouts with a lot of different trainers in the USA and Europe, none compared to Kevin and his staff. The workout was only for an hour and focused on every aspect of basketball.'
    },
    {
      name: 'JIM BARON',
      title: 'HEAD TRAINER',
      org: 'K-10 HALL OF FAME TRAINER',
      image: '/jim-baron-basketball-reference-photo.png',
      quote: 'There is no better person to teach the youth the game of basketball. His passion to make every player better is the same as when I trainered him at St Bonaventure. He is a leader and shows others by example.'
    },
    {
      name: 'NORM ROBERTS',
      title: 'ASSISTANT TRAINER',
      org: 'KANSAS JAYHAWKS',
      image: '/norm-basketball-reference-photo.png',
      quote: 'I recruited Kevin when I was at the University of Tulsa and two things that have never changed his work ethic and dedication.'
    },
    {
      name: 'MARLON SEARS',
      title: 'ASSISTANT TRAINER',
      org: 'COLUMBIA LIONS',
      image: '/marlon-basketball-reference-photo.png',
      quote: 'I worked out with Kevin for two years and he always went into the gym with a purpose. He was well organized and knew what specific drills he wanted to work on to get us better. It was that attention to detail is the reason why we won a championship our second year.'
    },
    {
      name: 'LEONARDO HAMILTON',
      title: 'HEAD TRAINER',
      org: 'FLORIDA ST SEMINOLES',
      image: '/leonard-hamilton-basketball-reference-photo.png',
      quote: 'Kevin has the ability to inspire players in this generation it\'s important because they want to achieve the same things Kevin has accomplished and that is to be successful.'
    },
    {
      name: 'MICHAEL HUGER',
      title: 'ASSISTANT TRAINER',
      org: 'TEMPLE OWLS',
      image: '/huger-basketball-reference-photo.png',
      quote: 'If I was a parent deciding who would my son/daughter learn basketball, I would choose Kevin simply because to find someone with his basketball experience is rare.'
    },
    {
      name: 'SCOTT HOWARD',
      title: 'HEAD SCOUT',
      org: 'CHARLOTTE BOBCATS',
      image: '/scott-basketball-reference-photo.png',
      quote: 'The hard work Kevin put in as a player is the same work that he brings in developing and improving players.'
    },
    {
      name: 'ANDREA MAGELLI',
      title: 'HEAD TRAINER',
      org: 'VIENNA CLUB',
      image: '/andrea-basketball-reference-photo.png',
      quote: 'Kevin was one of the best players I ever trainered not because of his physical gifts or talent. His work ethic was second to none. He would spend hours upon hours after practice working on how to get better and that was at the age of 34. Kevin not only helped our team finish at the top of our league. He helped a lot of our young players develop by teaching them how to be a professional.'
    }
  ]

  return (
    <div className="min-h-screen bg-white relative">
      {/* Featured Article Section */}
      <div className="bg-gray-100 py-12 mt-[100px]">
        <div className="container mx-auto px-4">
          <a 
            href="https://www.njherald.com/story/sports/high-school/basketball/2019/02/08/houston-s-hoopsters-former-basketball/4156386007/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block max-w-4xl mx-auto bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative aspect-video md:aspect-auto bg-gray-200">
                <Image
                  src="/houstons-hoopsters-youth-basketball-team-sparta-nj.jpg"
                  alt="Kevin Houston with Houston's Hoopsters youth basketball team"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder-image.jpg'
                  }}
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <p className="text-tbf-gold text-xs font-bold uppercase tracking-wider mb-2">NJ.COM ARTICLE - SPARTA, NEW JERSEY</p>
                <h3 className="text-2xl md:text-3xl font-audiowide mb-4 text-black">
                  HOUSTON'S HOOPSTERS: FORMER BASKETBALL PRO HELPING AREA'S YOUNG PLAYERS
                </h3>
                <p className="text-gray-600 mb-4">
                  Featured in The New Jersey Herald for bringing elite basketball training to Sussex County and transforming young athletes into skilled players.
                </p>
                <span className="text-tbf-gold font-bold">READ THE FULL ARTICLE →</span>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Serving Sussex County Section */}
      <div className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-audiowide text-center mb-8 text-white">
              SERVING <span className="text-tbf-gold">SUSSEX COUNTY</span>
            </h2>
            <p className="text-center text-gray-300 mb-12 max-w-4xl mx-auto">
              A Decade of Greatness" reflects the remarkable journey of Kevin Houston in the sport of basketball, marked by individual achievements, team championships, and a strong work ethic. Now, Kevin is channeling that same passion into developing young talent from Northern New Jersey, helping them become better players through his dedicated development system.
            </p>

            {/* Scrollable Logos Carousel - Homepage Style */}
            <div className="relative">
              {/* Scroll Left Button */}
              <button
                onClick={() => {
                  const container = scrollContainerRef.current
                  if (container) {
                    container.scrollBy({ left: -300, behavior: 'smooth' })
                  }
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white w-12 h-12 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>

              {/* Scrollable Container */}
              <div 
                ref={scrollContainerRef}
                className="overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex items-center gap-8 md:gap-12 px-16">
                  <div className="relative w-24 h-24 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300">
                    <Image src="/atlantic-10-conference-logo-bw.png" alt="Atlantic 10 Conference" fill className="object-contain" onError={(e) => { const target = e.target as HTMLImageElement; target.style.display = 'none' }} />
                  </div>
                  <div className="relative w-24 h-24 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300">
                    <Image src="/new-york-daily-news-logo.png" alt="New York Daily News" fill className="object-contain" onError={(e) => { const target = e.target as HTMLImageElement; target.style.display = 'none' }} />
                  </div>
                  <div className="relative w-24 h-24 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300">
                    <Image src="/fiba-international-basketball-logo.png" alt="FIBA" fill className="object-contain" onError={(e) => { const target = e.target as HTMLImageElement; target.style.display = 'none' }} />
                  </div>
                  <div className="relative w-24 h-24 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300">
                    <Image src="/belgium-basketball-league-logo.png" alt="Belgium Basketball League" fill className="object-contain" onError={(e) => { const target = e.target as HTMLImageElement; target.style.display = 'none' }} />
                  </div>
                  <div className="relative w-24 h-24 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300">
                    <Image src="/denver-nuggets-nba-logo.png" alt="Denver Nuggets" fill className="object-contain" onError={(e) => { const target = e.target as HTMLImageElement; target.style.display = 'none' }} />
                  </div>
                  <div className="relative w-24 h-24 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300">
                    <Image src="/nabc-coaches-association-logo.png" alt="NABC" fill className="object-contain" onError={(e) => { const target = e.target as HTMLImageElement; target.style.display = 'none' }} />
                  </div>
                  <div className="relative w-24 h-24 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300">
                    <Image src="/belgian-basketball-league-logo.png" alt="Basketball Super League" fill className="object-contain" onError={(e) => { const target = e.target as HTMLImageElement; target.style.display = 'none' }} />
                  </div>
                  <div className="relative w-24 h-24 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300">
                    <Image src="/njcaa-junior-college-basketball-logo.png" alt="NJCAA" fill className="object-contain" onError={(e) => { const target = e.target as HTMLImageElement; target.style.display = 'none' }} />
                  </div>
                </div>
              </div>

              {/* Scroll Right Button */}
              <button
                onClick={() => {
                  const container = scrollContainerRef.current
                  if (container) {
                    container.scrollBy({ left: 300, behavior: 'smooth' })
                  }
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white w-12 h-12 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <p className="text-tbf-gold text-sm font-bold uppercase tracking-wider mb-3">THE BASKETBALL FACTORY</p>
              <h2 className="text-4xl md:text-6xl font-audiowide mb-6 text-black leading-tight">
                KEVIN HOUSTON'S <span className="text-tbf-gold">REPUTATION</span><br />
                <span className="text-tbf-gold">IN BASKETBALL</span>
              </h2>
              <div className="w-24 h-1 bg-tbf-gold mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                HERE'S WHAT TRAINERS, PLAYERS, AND HIGH-LEVEL EXECUTIVES HAVE TO SAY ABOUT HIM
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="group bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-center text-center border border-gray-100 hover:border-tbf-gold hover:-translate-y-2"
                >
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <svg className="w-8 h-8 text-tbf-gold/20 group-hover:text-tbf-gold/40 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  {/* Profile Image */}
                  <div className="relative w-28 h-28 mb-4">
                    <div className="absolute inset-0 bg-tbf-gold rounded-full opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-gray-100 group-hover:border-tbf-gold transition-colors bg-gray-200">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder-avatar.jpg'
                        }}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mb-4">
                    <h3 className="text-base font-audiowide mb-1 text-black group-hover:text-tbf-gold transition-colors">{testimonial.name}</h3>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{testimonial.title}</p>
                    <p className="text-xs uppercase text-tbf-gold font-semibold">{testimonial.org}</p>
                  </div>

                  {/* Divider */}
                  <div className="w-12 h-0.5 bg-gray-200 group-hover:bg-tbf-gold transition-colors mb-4"></div>

                  {/* Quote */}
                  <p className="text-sm text-gray-700 leading-relaxed flex-grow">
                    "{testimonial.quote}"
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 text-center">
              <p className="text-gray-600 mb-6 text-lg">
                Ready to train with one of basketball's most respected professionals?
              </p>
              <Link href="/#boys-spring">
                <button className="bg-tbf-gold text-white px-10 py-4 font-bold text-lg hover:bg-tbf-gold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  JOIN THE BASKETBALL FACTORY TODAY
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* College Placement Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Boxed Container */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Header Bar */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 py-6 px-8">
                <p className="text-white text-xs font-bold mb-2 uppercase tracking-wider">ELITE DEVELOPMENT PROGRAM</p>
                <h2 className="text-3xl md:text-4xl font-audiowide text-white">
                  COLLEGE PLACEMENT
                </h2>
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg bg-gray-200">
                    <Image
                      src="/kevin-houston-college-placement-success.png"
                      alt="Kevin Houston college placement success"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder-image.jpg'
                      }}
                    />
                  </div>

                  <div>
                    <p className="text-gray-700 text-base leading-relaxed mb-8">
                      Kevin Houston is the founder of The Basketball Factory, where he has successfully placed over 100 players into college programs. With a successful European academy-inspired training system and years of professional training experience, Kevin has helped top middle school and high school players earn college scholarships.
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-5 rounded-lg bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-tbf-gold shadow-md">
                        <div className="text-3xl font-audiowide text-tbf-gold">100+</div>
                        <div className="text-sm text-gray-800 font-semibold">Players Placed in College Programs from Sparta, NJ Area</div>
                      </div>
                      <div className="flex items-center gap-4 p-5 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-black shadow-md">
                        <div className="text-3xl font-audiowide text-black">15+</div>
                        <div className="text-sm text-gray-800 font-semibold">Years Elite Training Experience - College & Pro Level</div>
                      </div>
                      <div className="flex items-center gap-4 p-5 rounded-lg bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-tbf-gold shadow-md">
                        <div className="text-3xl font-audiowide text-tbf-gold">#1</div>
                        <div className="text-sm text-gray-800 font-semibold">Sussex County AAU Program for College Placement</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Elite Skill Trainer Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Boxed Container */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Header Bar */}
              <div className="bg-gradient-to-r from-black to-gray-900 py-6 px-8">
                <p className="text-tbf-gold text-xs font-bold mb-2 uppercase tracking-wider">AKA MR. BANS</p>
                <h2 className="text-3xl md:text-4xl font-audiowide text-white">
                  ELITE SKILL TRAINER
                </h2>
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <p className="text-gray-700 text-base leading-relaxed mb-8">
                      Kevin Houston aka Mr. Bans is recognized as an elite skill trainer, known for his ability to bring out the best in aspiring basketball players. With a keen eye for detail and a deep understanding of the game, he tailors training to the unique needs of each athlete, ensuring they master the fundamentals while developing advanced techniques. His professional experience across Europe's top leagues gives him unique insights into what it takes to compete at the highest levels, and he brings that championship mindset to every training session in Sparta, New Jersey. Whether working with beginners or advanced players, Kevin's personalized approach ensures every athlete reaches their full potential.
                    </p>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-5 bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg border-2 border-red-200 hover:scale-105 transition-transform">
                        <div className="text-2xl font-audiowide text-tbf-gold mb-1">10+</div>
                        <div className="text-xs text-gray-700 uppercase font-semibold">Years Pro Experience</div>
                      </div>
                      <div className="text-center p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg border-2 border-gray-200 hover:scale-105 transition-transform">
                        <div className="text-2xl font-audiowide text-black mb-1">PRO</div>
                        <div className="text-xs text-gray-700 uppercase font-semibold">Level Training</div>
                      </div>
                      <div className="text-center p-5 bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg border-2 border-red-200 hover:scale-105 transition-transform">
                        <div className="text-2xl font-audiowide text-tbf-gold mb-1">1-ON-1</div>
                        <div className="text-xs text-gray-700 uppercase font-semibold">Personalized Focus</div>
                      </div>
                    </div>
                  </div>

                  <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg bg-gray-200">
                    <Image
                      src="/kevin-houston-elite-basketball-trainer-sparta-nj.jpg"
                      alt="Kevin Houston - Elite Basketball Skill Trainer in Sparta NJ"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder-image.jpg'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorated Player Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Boxed Container */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Header Bar */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 py-6 px-8">
                <p className="text-white text-xs font-bold mb-2 uppercase tracking-wider">PROFESSIONAL CAREER</p>
                <h2 className="text-3xl md:text-4xl font-audiowide text-white">
                  DECORATED PLAYER
                </h2>
              </div>

              {/* Content */}
              <div className="p-5 lg:p-8">
                <div className="grid lg:grid-cols-2 gap-6 items-start">
                  <div className="relative h-[350px] rounded-xl overflow-hidden shadow-lg bg-gray-200">
                    <Image
                      src="/kevin-houston-decorated-professional-player.jpg"
                      alt="Kevin Houston - Decorated Professional Basketball Player"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder-image.jpg'
                      }}
                    />
                  </div>

                  <div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      Kevin Houston isn't just another trainer in Sparta, New Jersey—he's a highly accomplished former professional player whose international basketball career spanning Europe gives him real-world expertise that 99% of youth basketball trainers in Sussex County simply don't possess. Learning from someone who has actually succeeded at the highest levels of basketball gives children an irreplaceable competitive advantage.
                    </p>

                    <div className="space-y-2.5">
                      <div className="bg-gradient-to-r from-red-50 to-white p-3 rounded-lg border-l-4 border-tbf-gold shadow-md hover:shadow-lg transition-shadow">
                        <h3 className="font-audiowide text-sm text-black mb-1">10+ YEARS PROFESSIONAL CAREER</h3>
                        <p className="text-gray-700 text-xs">Played across Europe's top leagues - bringing world-class basketball IQ and professional training methods to Sussex County youth</p>
                      </div>

                      <div className="bg-gradient-to-r from-gray-50 to-white p-3 rounded-lg border-l-4 border-black shadow-md hover:shadow-lg transition-shadow">
                        <h3 className="font-audiowide text-sm text-black mb-1">DIVISION I COLLEGIATE EXCELLENCE</h3>
                        <p className="text-gray-700 text-xs">Top 50 scorer nationally - your child learns from proven elite-level competition experience</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Coverage Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Boxed Container */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Header Bar */}
              <div className="bg-gradient-to-r from-black to-gray-900 py-5 px-8">
                <p className="text-tbf-gold text-xs font-bold mb-2 uppercase tracking-wider">NATIONALLY RECOGNIZED</p>
                <h2 className="text-3xl md:text-4xl font-audiowide text-white">
                  MEDIA COVERAGE
                </h2>
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="relative h-[350px] rounded-xl overflow-hidden shadow-lg bg-gray-200">
                    <Image
                      src="/kevin-houston-media-coverage-nj-herald.jpg"
                      alt="Kevin Houston Media Coverage - NJ Herald Feature"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder-image.jpg'
                      }}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-red-50 to-white border-2 border-red-200 p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-1 bg-tbf-gold"></div>
                        <h3 className="text-lg font-audiowide text-black">SPORTS ILLUSTRATED FEATURE</h3>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">Kevin Houston made the front page of Sports Illustrated's college basketball section during the NCAA tournament game when University of Miami played Purdue. This national recognition validated his elite skills on basketball's biggest stage, proving he competed at the highest levels of college basketball.</p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-300 p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-1 bg-black"></div>
                        <h3 className="text-lg font-audiowide text-black">NJ HERALD COVER STORY</h3>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">The New Jersey Herald featured Kevin Houston's impact on youth basketball throughout Sussex County. The article highlighted how a former professional player returned to Northern New Jersey to build the region's premier AAU program, bringing elite-level training to local communities.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Collegiate Player Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Boxed Container */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Header Bar */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 py-5 px-8">
                <p className="text-white text-xs font-bold mb-2 uppercase tracking-wider">COLLEGIATE EXCELLENCE</p>
                <h2 className="text-3xl md:text-4xl font-audiowide text-white">
                  TOP COLLEGIATE PLAYER
                </h2>
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="relative h-[350px] rounded-xl overflow-hidden shadow-lg bg-gray-200">
                    <Image
                      src="/kevin-houston-top-college-basketball-player.jpg"
                      alt="Kevin Houston - Top Collegiate Basketball Player"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder-image.jpg'
                      }}
                    />
                  </div>

                  <div>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-gradient-to-br from-red-600 to-red-700 p-4 text-center rounded-xl shadow-lg hover:scale-105 transition-transform">
                        <div className="text-2xl font-audiowide text-white mb-1">TOP 10</div>
                        <div className="text-xs text-white uppercase font-semibold">Atlantic 10 Rankings</div>
                      </div>
                      <div className="bg-gradient-to-br from-black to-gray-900 p-4 text-center rounded-xl shadow-lg hover:scale-105 transition-transform">
                        <div className="text-2xl font-audiowide text-tbf-gold mb-1">#46</div>
                        <div className="text-xs text-white uppercase font-semibold">Division I Scorer</div>
                      </div>
                      <div className="bg-gradient-to-br from-black to-gray-900 p-4 text-center rounded-xl shadow-lg hover:scale-105 transition-transform">
                        <div className="text-2xl font-audiowide text-tbf-gold mb-1">TOP 50</div>
                        <div className="text-xs text-white uppercase font-semibold">Seniors Nationally</div>
                      </div>
                      <div className="bg-gradient-to-br from-red-600 to-red-700 p-4 text-center rounded-xl shadow-lg hover:scale-105 transition-transform">
                        <div className="text-2xl font-audiowide text-white mb-1">NBA</div>
                        <div className="text-xs text-white uppercase font-semibold">Pre-Draft Camp</div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-gray-50 to-white border-l-4 border-tbf-gold pl-5 py-4 rounded-xl shadow-md">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Kevin Houston ranked TOP 10 in the Atlantic 10 Conference for points, rebounds, steals, 3-pointers made, and field goal percentage. He earned Big East Player of the Week honors at Miami University and was invited to NBA Pre-Draft Camp. Your child learns from a trainer who competed at basketball's highest levels.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Championship Trainer Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Boxed Container */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Header Bar */}
              <div className="bg-gradient-to-r from-black to-gray-900 py-6 px-8">
                <p className="text-tbf-gold text-xs font-bold mb-2 uppercase tracking-wider">PROVEN WINNER</p>
                <h2 className="text-3xl md:text-4xl font-audiowide text-white">
                  CHAMPIONSHIP TRAINER
                </h2>
                <p className="text-white/90 text-sm mt-2">
                  Leading The Basketball Factory to prestigious championships at the highest levels of youth basketball competition
                </p>
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-10">
                  <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg bg-gray-200">
                    <Image
                      src="/CHAMPIONSHIP TRAINER.jpg"
                      alt="Kevin Houston - Championship Basketball Trainer"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder-image.jpg'
                      }}
                    />
                  </div>

                  <div className="space-y-5">
                    <div className="bg-gradient-to-r from-red-50 to-white border-l-4 border-tbf-gold pl-6 py-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                      <h3 className="font-audiowide text-base text-black mb-2">NIKE TOURNAMENT OF CHAMPIONS</h3>
                      <p className="text-gray-700 text-sm">Elite national competition showcasing top AAU talent</p>
                    </div>

                    <div className="bg-gradient-to-r from-gray-50 to-white border-l-4 border-black pl-6 py-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                      <h3 className="font-audiowide text-base text-black mb-2">NIKE NATIONAL CHAMPIONSHIP</h3>
                      <p className="text-gray-700 text-sm">Competed against EYBL, Under Armour, and Adidas teams</p>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-white border-l-4 border-tbf-gold pl-6 py-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                      <h3 className="font-audiowide text-base text-black mb-2">NJ AAU STATE CHAMPIONSHIP</h3>
                      <p className="text-gray-700 text-sm">Dominating New Jersey's premier AAU competition</p>
                    </div>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-300 p-8 rounded-xl shadow-lg">
                  <p className="text-gray-700 text-sm leading-relaxed text-center">
                    Here's what separates The Basketball Factory from every other youth basketball program in Sparta, New Jersey and Sussex County: CHAMPIONSHIP RESULTS at the highest national levels. While other local AAU teams in Northern New Jersey struggle to compete beyond regional tournaments, Kevin Houston has led The Basketball Factory to victories in the Nike Tournament of Champions, Nike National Championship, and New Jersey AAU State Championship—defeating elite teams from EYBL, Under Armour, and Adidas circuits. When you're investing in your child's basketball future, you need proven winners, not hopeful participants. Parents throughout Sparta, Hopatcong, Newton, Andover, and the surrounding areas trust The Basketball Factory because Kevin doesn't just talk about excellence—his teams consistently PROVE it on the court against the nation's best competition, giving your child exposure and development that simply doesn't exist at ordinary local programs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Record Breaking Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Boxed Container */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Header Bar */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 py-5 px-8">
                <p className="text-white text-xs font-bold mb-2 uppercase tracking-wider">PRO A FRENCH LEAGUE</p>
                <h2 className="text-3xl md:text-4xl font-audiowide text-white">
                  RECORD BREAKING
                </h2>
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="relative h-[350px] rounded-xl overflow-hidden shadow-lg bg-gray-200">
                    <Image
                      src="/kevin-houston-record-breaking-basketball-performance.png"
                      alt="Kevin Houston - Record Breaking Basketball Performance"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder-image.jpg'
                      }}
                    />
                  </div>

                  <div>
                    <div className="mb-4">
                      <div className="inline-block bg-red-50 px-3 py-1.5 rounded-full mb-3">
                        <span className="text-tbf-gold font-bold text-xs uppercase tracking-wide">
                          🏀 Historic Elite Performance
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      Kevin Houston made history in France's Pro A League by drilling <span className="font-bold text-tbf-gold">8 out of 10 three-pointers</span> in a single game, setting a Pro A French League record with a 42 evaluation rating that still stands today. He set professional records competing against Europe's best players, bringing championship-level expertise to youth training.
                    </p>

                    {/* Stats Highlight Box */}
                    <div className="bg-gradient-to-br from-red-50 to-gray-50 rounded-xl p-5 border-l-4 border-tbf-gold">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-tbf-gold">8/10</div>
                          <div className="text-xs text-gray-600 uppercase tracking-wide">Historic 3-Point Performance</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-tbf-gold">42</div>
                          <div className="text-xs text-gray-600 uppercase tracking-wide">Pro A French League Record</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Career Portfolio Section */}
      <div className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-audiowide text-center mb-4 text-white">
              <span className="text-tbf-gold">CAREER</span> PORTFOLIO
            </h2>
            <p className="text-center text-gray-300 mb-12 max-w-3xl mx-auto text-sm md:text-base">
              A visual journey through Kevin Houston's outstanding basketball career, capturing moments of triumph, skillful play, and significant milestones from collegiate excellence to professional achievements.
            </p>

            <CareerPortfolioCarousel />
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-audiowide mb-6 text-white">
            TRAIN WITH A <span className="text-black">PROVEN CHAMPION</span>
          </h2>
          <p className="text-white text-lg mb-8 max-w-3xl mx-auto">
            Join The Basketball Factory in Sparta, NJ and learn from Kevin Houston's decades of elite playing and training experience. Transform your game with training methods developed from college and professional basketball success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#boys-spring">
              <button className="bg-white text-tbf-gold px-10 py-4 text-lg font-bold hover:bg-gray-100 transition-colors shadow-xl">
                FREE APPS
              </button>
            </Link>
            <Link href="/#girls-spring">
              <button className="bg-black text-white px-10 py-4 text-lg font-bold hover:bg-gray-900 transition-colors shadow-xl">
                GIRLS SPRING AAU
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-tbf-gold text-white p-4 rounded-full shadow-2xl hover:bg-tbf-gold transition-all duration-300 z-50"
          aria-label="Back to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  )
}
