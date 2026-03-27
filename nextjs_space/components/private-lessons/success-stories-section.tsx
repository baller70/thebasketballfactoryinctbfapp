
'use client'

import { GraduationCap, Trophy, TrendingUp, Award } from 'lucide-react'
import Image from 'next/image'

const successStories = [
  {
    name: 'Jason Heter',
    role: 'High School Player',
    achievement: 'Division 2 College Basketball',
    image: '/jason-heter-testimonial.webp',
    story: "Training with Kevin was truly transformative for me. Having played at the Division 2 level, I've encountered many trainers, but Kevin's talent for identifying and enhancing my skills significantly distinguished him. His individualized drills and feedback, based on his professional experience, have not only elevated my basketball IQ but also boosted my confidence on the court. Each session with Kevin made me more ready to tackle the challenges ahead. He's more than just a basketball trainer; he's a mentor who genuinely invests in your development."
  },
  {
    name: 'Madison Miller',
    role: 'Division 1 Basketball Player',
    achievement: 'Starting Center - South Carolina Upstate',
    image: '/madison-miller-testimonial.webp',
    story: "I started private lessons with Kevin in 8th grade, and it completely changed my basketball career. He helped me develop the post moves and defensive presence I needed to become a dominant center. By sophomore year, I was starting on varsity, and now I'm playing Division 1 basketball as the starting center at South Carolina Upstate. Kevin didn't just make me a better player - he taught me how to be a leader on the court and stay mentally tough during pressure situations."
  },
  {
    name: 'Samba Diallo',
    role: 'Division 1 Basketball Player',
    achievement: 'UMass Minutemen',
    image: '/samba-diallo-testimonial.webp',
    story: "Training with Kevin Houston was instrumental in my development as a player. His expertise and dedication helped me refine my skills to compete at the highest level. The work ethic and basketball IQ I developed through training with Kevin prepared me for the demands of Division 1 basketball. He pushed me to maximize my potential and believed in my abilities even when others didn't. Now playing at UMass, I carry the lessons Kevin taught me every single day on the court."
  }
]

const achievements = [
  {
    icon: GraduationCap,
    number: '25+',
    label: 'College Scholarships Earned',
    description: 'Athletes trained by Kevin Houston have earned basketball scholarships'
  },
  {
    icon: Trophy,
    number: '100+',
    label: 'Varsity Team Players',
    description: 'Young athletes who made their high school varsity teams'
  },
  {
    icon: TrendingUp,
    number: '85%',
    label: 'Skill Improvement Rate',
    description: 'Athletes show measurable improvement within 3 months'
  },
  {
    icon: Award,
    number: '50+',
    label: 'Tournament Championships',
    description: 'Teams and individuals trained by Kevin winning tournaments'
  }
]

export default function SuccessStoriesSection() {
  return (
    <section className="relative py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-tbf-gold text-sm font-bold tracking-wider uppercase mb-4 block">
            Real Results from Real Athletes
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-audiowide uppercase">
            SUCCESS <span className="text-tbf-gold">STORIES</span>
          </h2>
          <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
            Young athletes from Sparta and Sussex County who transformed their game through dedicated private training with Kevin Houston at The Basketball Factory.
          </p>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon
            return (
              <div
                key={index}
                className="bg-gradient-to-b from-tbf-gold/10 to-transparent border border-tbf-gold/30 rounded-lg p-6 text-center hover:border-tbf-gold transition-all duration-300"
              >
                <Icon className="w-12 h-12 text-tbf-gold mx-auto mb-4" />
                <div className="text-4xl font-bold text-white mb-2">{achievement.number}</div>
                <div className="text-tbf-gold font-semibold mb-2 text-sm uppercase tracking-wide">
                  {achievement.label}
                </div>
                <div className="text-white/70 text-xs leading-relaxed">
                  {achievement.description}
                </div>
              </div>
            )
          })}
        </div>

        {/* Success Stories */}
        <div className="space-y-8">
          {successStories.map((story, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${
                index % 2 === 0 ? 'from-gray-900 to-black' : 'from-black to-gray-900'
              } border border-tbf-gold/20 rounded-lg p-8 hover:border-tbf-gold/60 transition-all duration-300`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-tbf-gold mb-4">
                    <Image
                      src={story.image}
                      alt={story.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 font-audiowide uppercase">{story.name}</h3>
                  <p className="text-tbf-gold font-semibold mb-1">{story.role}</p>
                  <div className="bg-tbf-gold/20 px-4 py-2 rounded-full">
                    <p className="text-white text-sm font-semibold">{story.achievement}</p>
                  </div>
                </div>

                <div className="md:col-span-2 flex items-center">
                  <div>
                    <div className="flex items-start gap-3 mb-4">
                      <Trophy className="w-6 h-6 text-tbf-gold flex-shrink-0 mt-1" />
                      <p className="text-white/90 text-lg leading-relaxed italic">
                        "{story.story}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-tbf-gold/10 via-tbf-gold/5 to-tbf-gold/10 border border-tbf-gold/30 rounded-lg p-12">
          <h3 className="text-3xl font-bold text-white mb-4 font-audiowide uppercase">
            YOUR CHILD COULD BE OUR NEXT <span className="text-tbf-gold">SUCCESS STORY</span>
          </h3>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join the hundreds of young athletes in Sparta and Sussex County who have transformed their game with private lessons at The Basketball Factory. Let Kevin Houston help your child reach their full potential.
          </p>
          <button
            onClick={() => document.getElementById('booking-wizard')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-tbf-gold hover:bg-tbf-gold/90 text-black font-bold text-lg px-12 py-4 rounded-none transition-all"
          >
            START YOUR JOURNEY TODAY
          </button>
        </div>
      </div>
    </section>
  )
}
