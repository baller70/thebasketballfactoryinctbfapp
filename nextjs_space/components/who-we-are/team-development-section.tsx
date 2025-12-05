
'use client'

import Image from 'next/image'
import { Trophy, Users, Target, TrendingUp } from 'lucide-react'
import ImageModal from './image-modal'
import SectionDivider from './section-divider'

const teamImages = [
  {
    src: 'https://cdn.abacus.ai/images/8d8f2ffb-62ed-482f-aadf-d4b9334867cc.png',
    alt: 'The Basketball Factory Team Bonding - Youth Basketball Sussex County',
    title: 'Team Bonding',
    description: 'Building lifelong friendships through youth basketball in Sussex County'
  },
  {
    src: 'https://cdn.abacus.ai/images/40010ef1-3825-4213-85f8-dfb4968dd2ce.png',
    alt: 'Championship Team Celebration - AAU Basketball New Jersey',
    title: 'Championship Celebration',
    description: 'Celebrating victories together as a The Basketball Factory family'
  },
  {
    src: 'https://cdn.abacus.ai/images/2662900e-ba0b-4ff8-ace9-22009b644f6c.png',
    alt: 'DC Championship Winners - Elite Basketball Training',
    title: 'DC Champions',
    description: 'Tournament winners showcasing elite basketball training results'
  },
  {
    src: 'https://cdn.abacus.ai/images/8f3167eb-9522-4628-ac21-3ed08044c078.png',
    alt: 'Hershey Tournament Champions - AAU Tryouts Sparta NJ',
    title: 'Hershey Champions',
    description: 'Elite AAU team from Sparta NJ bringing home the trophy'
  },
]

const developmentSteps = [
  {
    icon: 'https://cdn.abacus.ai/images/523f494c-b715-41eb-8b43-322e7a35893c.png',
    title: 'TRYOUTS & EVALUATION',
    description: 'Comprehensive skill assessment focused on potential, work ethic, and team spirit for youth basketball in Sussex County'
  },
  {
    icon: 'https://cdn.abacus.ai/images/9b8f70ef-a02c-452f-923d-8af2d4494f14.png',
    title: 'SKILL DEVELOPMENT',
    description: 'Elite basketball training programs that emphasize fundamentals, game IQ, and maximum effort'
  },
  {
    icon: 'https://cdn.abacus.ai/images/b6681a85-bc33-414a-a1fb-6bb4f2d9007e.png',
    title: 'TEAM BUILDING',
    description: 'Creating championship culture through teamwork, leadership, and community in Sparta, NJ'
  },
  {
    icon: 'https://cdn.abacus.ai/images/7ffaa4ef-2ce0-4af5-a75e-ae153ed4a2c1.png',
    title: 'CHAMPIONSHIP SUCCESS',
    description: 'Proven track record of tournament wins, college scholarships, and lifelong friendships'
  },
]

export default function TeamDevelopmentSection() {
  return (
    <section className="relative py-20 bg-gray-50">
      {/* Attractive Section Divider */}
      <SectionDivider variant="top" style="diagonal" className="mb-8" />
      
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6" style={{ fontFamily: 'Audiowide, sans-serif' }}>
            BUILDING CHAMPIONS TOGETHER
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            Our Commitment to <span className="text-tbf-gold font-semibold">Team Growth</span>, <span className="text-tbf-gold font-semibold">Longevity</span>, 
            and <span className="text-tbf-gold font-semibold">Youth Basketball Excellence</span> in Sussex County
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto">
          <div className="bg-tbf-gold p-8 rounded-lg text-center shadow-lg">
            <Trophy className="w-14 h-14 text-white mx-auto mb-3" />
            <div className="text-5xl font-bold text-white mb-2">12+</div>
            <div className="text-base text-white font-semibold">Championships</div>
          </div>
          <div className="bg-white p-8 rounded-lg text-center shadow-lg border-2 border-gray-200">
            <Users className="w-14 h-14 text-tbf-gold mx-auto mb-3" />
            <div className="text-5xl font-bold text-black mb-2">95%</div>
            <div className="text-base text-gray-700 font-semibold">Player Retention</div>
          </div>
          <div className="bg-white p-8 rounded-lg text-center shadow-lg border-2 border-gray-200">
            <Target className="w-14 h-14 text-tbf-gold mx-auto mb-3" />
            <div className="text-5xl font-bold text-black mb-2">8</div>
            <div className="text-base text-gray-700 font-semibold">Years Average</div>
          </div>
          <div className="bg-white p-8 rounded-lg text-center shadow-lg border-2 border-gray-200">
            <TrendingUp className="w-14 h-14 text-tbf-gold mx-auto mb-3" />
            <div className="text-5xl font-bold text-black mb-2">100%</div>
            <div className="text-base text-gray-700 font-semibold">Skill Growth</div>
          </div>
        </div>

        {/* Why Longevity Matters */}
        <div className="bg-white border-2 border-tbf-gold rounded-xl p-10 mb-16 shadow-lg max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-black mb-10 text-center" style={{ fontFamily: 'Audiowide, sans-serif' }}>
            WHY TEAM LONGEVITY LEADS TO BETTER RESULTS
          </h3>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-tbf-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-white">1</span>
              </div>
              <h4 className="text-xl font-bold text-black mb-3">CHEMISTRY BUILDS WINS</h4>
              <p className="text-gray-700 text-base leading-relaxed">
                Players who grow together develop unspoken communication and trust, leading to championship performances
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-tbf-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-white">2</span>
              </div>
              <h4 className="text-xl font-bold text-black mb-3">SKILL MASTERY TAKES TIME</h4>
              <p className="text-gray-700 text-base leading-relaxed">
                Multi-year development allows for advanced skill progression and elite basketball training results
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-tbf-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-white">3</span>
              </div>
              <h4 className="text-xl font-bold text-black mb-3">FAMILY CULTURE</h4>
              <p className="text-gray-700 text-base leading-relaxed">
                Long-term teams create lifelong friendships and a supportive community for youth in Sparta, NJ
              </p>
            </div>
          </div>
        </div>

        {/* Development Journey */}
        <div className="mb-16 max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-black mb-10 text-center" style={{ fontFamily: 'Audiowide, sans-serif' }}>
            YOUR CHILD&apos;S DEVELOPMENT JOURNEY
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            {developmentSteps.map((step, index) => (
              <ImageModal
                key={index}
                src={step.icon}
                alt={step.title}
                title={step.title}
                description={step.description}
              >
                <div className="group cursor-pointer">
                  <div className="relative aspect-square mb-4 rounded-lg overflow-hidden shadow-lg border-2 border-gray-200 group-hover:border-tbf-gold transition-all duration-300">
                    <Image
                      src={step.icon}
                      alt={step.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="text-tbf-gold text-5xl font-bold mb-1">{index + 1}</div>
                      <p className="text-xs opacity-90">Click to view larger</p>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-black mb-2" style={{ fontFamily: 'Audiowide, sans-serif' }}>
                    {step.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </ImageModal>
            ))}
          </div>
        </div>

        {/* Team Success Images */}
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-black mb-10 text-center" style={{ fontFamily: 'Audiowide, sans-serif' }}>
            OUR CHAMPIONSHIP MOMENTS
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {teamImages.map((image, index) => (
              <ImageModal
                key={index}
                src={image.src}
                alt={image.alt}
                title={image.title}
                description={image.description}
              >
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden shadow-lg border-2 border-gray-200 hover:border-tbf-gold transition-all duration-300 group cursor-pointer">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h4 className="text-xl font-bold mb-1" style={{ fontFamily: 'Audiowide, sans-serif' }}>{image.title}</h4>
                    <p className="text-sm opacity-90">Click to view larger</p>
                  </div>
                </div>
              </ImageModal>
            ))}
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-gray-700 text-lg leading-relaxed">
            At The Basketball Factory, we don&apos;t just build teams—we build <span className="text-tbf-gold font-semibold">families</span>. 
            Our players stay with us for years because they experience <span className="text-tbf-gold font-semibold">real growth</span>, 
            genuine <span className="text-tbf-gold font-semibold">team culture</span>, and the best <span className="text-tbf-gold font-semibold">youth basketball training in New Jersey</span>.
          </p>
        </div>
      </div>
    </section>
  )
}
