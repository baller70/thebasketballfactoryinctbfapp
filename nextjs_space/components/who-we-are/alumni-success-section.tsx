
'use client'

import Image from 'next/image'
import { GraduationCap, Award, Star } from 'lucide-react'
import ImageModal from './image-modal'
import SectionDivider from './section-divider'

const featuredAlumni = [
  {
    name: 'Madison Miller',
    image: 'https://cdn.abacus.ai/images/b08f46d7-a9cf-4d33-b4f8-acdabe9d27d3.png',
    college: 'Division I Commitment',
    achievement: 'Full Athletic Scholarship',
    location: 'Sussex County, NJ',
    description: 'Started with RA1 at age 11, developed into elite player through our skill development program'
  },
  {
    name: 'Kennedy Brown',
    image: 'https://cdn.abacus.ai/images/d8c80573-4ba7-4560-8f77-20a068452660.png',
    college: 'College Commitment',
    achievement: 'Academic & Athletic Excellence',
    location: 'Sparta, NJ',
    description: 'Team captain for 4 years, exemplifies our culture of maximum effort and leadership'
  },
  {
    name: 'Addy',
    image: 'https://cdn.abacus.ai/images/c779ed15-7723-4ff9-9c0e-10812cedae52.png',
    college: 'Championship MVP',
    achievement: 'Multiple Tournament Wins',
    location: 'New Jersey',
    description: 'Tournament All-Star, known for clutch performances and team-first mentality'
  },
]

const alumniGallery = [
  'https://cdn.abacus.ai/images/f6e279b9-aa16-43f1-b457-4b41888bb3fd.png',
  'https://cdn.abacus.ai/images/281fb20c-aa19-4150-864b-d1c79d7790c1.png',
  'https://cdn.abacus.ai/images/5ca5a701-6040-4f3e-9b29-9f664a6e5b31.png',
  'https://cdn.abacus.ai/images/f172c8d0-fc36-4ce9-b85a-0c1e161b3281.png',
  'https://cdn.abacus.ai/images/edce301b-7fa8-4354-be7d-4a9cda337b9c.png',
  'https://cdn.abacus.ai/images/93ae9e96-c5e7-4f0e-84c8-48a79d0fafb7.png',
  'https://cdn.abacus.ai/images/d3c8bbbc-30d6-4d11-ac99-401bdf103f9d.png',
  'https://cdn.abacus.ai/images/b0569164-a497-4251-bdd6-0abea43f3bd6.png',
]

export default function AlumniSuccessSection() {
  return (
    <section className="relative py-20 bg-white">
      {/* Attractive Section Divider */}
      <SectionDivider variant="top" style="wave" className="mb-8" />
      
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 text-tbf-gold">
              <GraduationCap className="w-10 h-10" />
              <span className="text-base font-bold tracking-wider">LEGACY OF EXCELLENCE</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6" style={{ fontFamily: 'Audiowide, sans-serif' }}>
            A LEGACY OF EXCELLENCE
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            Our <span className="text-tbf-gold font-semibold">alumni</span> represent the best of <span className="text-tbf-gold font-semibold">Sussex County</span>, 
            earning scholarships and making their mark across <span className="text-tbf-gold font-semibold">New York, New Jersey, and Pennsylvania</span>
          </p>
        </div>

        {/* Stats Banner */}
        <div className="bg-tbf-gold p-10 rounded-xl mb-16 shadow-lg max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-6xl font-bold text-white mb-2">40+</div>
              <div className="text-white font-semibold text-lg">College Scholarships</div>
              <div className="text-white/80 text-base mt-1">D1, D2, D3 Commitments</div>
            </div>
            <div>
              <div className="text-6xl font-bold text-white mb-2">85%</div>
              <div className="text-white font-semibold text-lg">Continue Basketball</div>
              <div className="text-white/80 text-base mt-1">At College Level</div>
            </div>
            <div>
              <div className="text-6xl font-bold text-white mb-2">100%</div>
              <div className="text-white font-semibold text-lg">College Acceptance</div>
              <div className="text-white/80 text-base mt-1">Academic Excellence</div>
            </div>
          </div>
        </div>

        {/* Featured Alumni */}
        <div className="mb-16 max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-black mb-10 text-center" style={{ fontFamily: 'Audiowide, sans-serif' }}>
            FEATURED SUCCESS STORIES
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredAlumni.map((alumnus, index) => (
              <ImageModal
                key={index}
                src={alumnus.image}
                alt={`${alumnus.name} - ${alumnus.achievement} - The Basketball Factory Alumni`}
                title={alumnus.name}
                description={`${alumnus.achievement} - ${alumnus.description}`}
              >
                <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-tbf-gold transition-all duration-300 group cursor-pointer shadow-lg">
                  <div className="relative aspect-square">
                    <Image
                      src={alumnus.image}
                      alt={`${alumnus.name} - ${alumnus.achievement} - The Basketball Factory Alumni`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2 text-tbf-gold mb-2">
                        <Award className="w-5 h-5" />
                        <span className="text-sm font-bold">{alumnus.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-2xl font-bold text-black mb-2" style={{ fontFamily: 'Audiowide, sans-serif' }}>
                      {alumnus.name}
                    </h4>
                    <div className="flex items-center gap-2 text-tbf-gold mb-3">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="font-semibold text-base">{alumnus.college}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 font-semibold">{alumnus.achievement}</p>
                    <p className="text-gray-700 text-base leading-relaxed">{alumnus.description}</p>
                    <p className="text-sm text-gray-500 mt-3 italic">Click image to view larger</p>
                  </div>
                </div>
              </ImageModal>
            ))}
          </div>
        </div>

        {/* Alumni Gallery */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-black mb-10 text-center" style={{ fontFamily: 'Audiowide, sans-serif' }}>
            MORE SUCCESS STORIES FROM ACROSS THE TRI-STATE
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {alumniGallery.map((image, index) => (
              <ImageModal
                key={index}
                src={image}
                alt={`The Basketball Factory Alumni Success Story ${index + 1}`}
                title={`Success Story ${index + 1}`}
                description="The Basketball Factory Alumni - Youth Basketball Excellence"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg border-2 border-gray-200 hover:border-tbf-gold transition-all duration-300 group cursor-pointer">
                  <Image
                    src={image}
                    alt={`The Basketball Factory Alumni Success Story`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity font-semibold">Click to view</p>
                  </div>
                </div>
              </ImageModal>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 bg-gray-50 border-2 border-tbf-gold rounded-xl p-10 text-center max-w-5xl mx-auto shadow-lg">
          <h4 className="text-3xl font-bold text-black mb-4" style={{ fontFamily: 'Audiowide, sans-serif' }}>
            YOUR CHILD COULD BE NEXT
          </h4>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Join the ranks of our successful alumni who started their journey with <span className="text-tbf-gold font-semibold">AAU tryouts in Sparta, NJ</span>. 
            Our proven track record of <span className="text-tbf-gold font-semibold">college scholarships</span>, <span className="text-tbf-gold font-semibold">championship wins</span>, 
            and <span className="text-tbf-gold font-semibold">lifelong friendships</span> speaks for itself.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-base text-gray-600">
            <span className="flex items-center gap-2">
              <Award className="w-5 h-5 text-tbf-gold" />
              Sussex County Champions
            </span>
            <span className="flex items-center gap-2">
              <Star className="w-5 h-5 text-tbf-gold" />
              New York • New Jersey • Pennsylvania
            </span>
            <span className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-tbf-gold" />
              Elite Basketball Training
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
