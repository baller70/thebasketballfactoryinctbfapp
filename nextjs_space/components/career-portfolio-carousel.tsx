
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function CareerPortfolioCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Portfolio items from Kevin Houston's basketball career with titles and descriptions
  const portfolioItems = [
    {
      src: '/kevin-houston-college-basketball-action-photo.jpg',
      title: 'Professional Career - Belgium',
      description: 'Playing at the highest level in European basketball leagues'
    },
    {
      src: '/kevin-houston-basketball-achievement-photo-1.jpg',
      title: 'Game Day Performance',
      description: 'Showcasing skills and leadership on the court'
    },
    {
      src: '/kevin-houston-basketball-achievement-photo-2.jpg',
      title: 'Competitive Excellence',
      description: 'Years of experience in professional basketball'
    },
    {
      src: '/kevin-houston-professional-basketball-career-photo-1.jpg',
      title: 'International Experience',
      description: 'Competing across multiple countries and leagues'
    },
    {
      src: '/kevin-houston-professional-basketball-career-photo-2.jpg',
      title: 'Team Leadership',
      description: 'Building chemistry and guiding teammates to success'
    },
    {
      src: '/kevin-houston-professional-basketball-game-photo-1.jpg',
      title: 'College Basketball',
      description: 'Foundation of skills developed at collegiate level'
    },
    {
      src: '/kevin-houston-professional-basketball-game-photo-2.jpg',
      title: 'Championship Moments',
      description: 'Celebrating victories and team achievements'
    },
    {
      src: '/kevin-houston-professional-basketball-action-photo-1.jpg',
      title: 'Training Development',
      description: 'Transitioning knowledge from player to trainer'
    },
    {
      src: '/kevin-houston-professional-basketball-action-photo-2.jpg',
      title: 'Team Building',
      description: 'Working with athletes to reach their potential'
    },
    {
      src: '/kevin-houston-professional-basketball-team-photo.jpg',
      title: 'Basketball Excellence',
      description: 'Dedication to the sport and continuous improvement'
    },
    {
      src: '/kevin-houston-basketball-professional-portrait.jpg',
      title: 'Professional Athlete',
      description: 'Portrait of commitment and athletic achievement'
    },
    {
      src: '/kevin-houston-belgium-basketball-league-photo.jpg',
      title: 'European Competition',
      description: 'Competing in top-tier international basketball'
    },
    {
      src: '/kevin-houston-belgium-basketball-championship.jpg',
      title: 'Professional Play',
      description: 'Displaying technical skills and basketball IQ'
    },
    {
      src: '/kevin-houston-basketball-basketball-training-action-shot-sparta-nj.jpg',
      title: 'Training & Development',
      description: 'Continuous work ethic and skill refinement'
    },
    {
      src: '/kevin-houston-basketball-career-highlight-1.jpg',
      title: 'Basketball Journey',
      description: 'A career built on passion and dedication'
    },
    {
      src: '/kevin-houston-basketball-career-highlight-2.jpg',
      title: 'Career Milestone',
      description: 'Memorable moments from a distinguished career'
    },
  ]

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="relative max-w-7xl mx-auto">
      {/* Navigation Buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-xl -ml-6"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-xl -mr-6"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Scrollable Grid */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {portfolioItems.map((item, index) => (
          <div
            key={index}
            className="relative flex-none w-[calc(33.333%-1rem)] min-w-[320px] aspect-[4/3] rounded-2xl overflow-hidden shadow-xl snap-start group"
          >
            {/* Image */}
            <div className="relative w-full h-full bg-gray-900">
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/placeholder-portfolio.jpg'
                }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </div>

            {/* Text Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-bold mb-2 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-200 line-clamp-2">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
