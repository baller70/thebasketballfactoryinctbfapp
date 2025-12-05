
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Game {
  id: string
  location: string
  teamName: string
  date: string
}

interface FeaturedGamesProps {
  games?: Game[]
}

const FeaturedGames = ({ games = [] }: FeaturedGamesProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Default games matching the original website
  const defaultGames = [
    {
      id: '1',
      location: '@ NYC',
      teamName: 'TEAM NIKE',
      date: 'SUN, OCT 13TH'
    },
    {
      id: '2',
      location: '@ RAMAPO COLLEGE',
      teamName: 'REBELS',
      date: 'SUN, OCT 5TH'
    },
    {
      id: '3',
      location: '@ NEWARK ACADEMY',
      teamName: 'MORRIS MAGIC',
      date: 'SUN, SEPT 28TH'
    },
    {
      id: '4',
      location: '@ GSB',
      teamName: 'NJ LIBERTY',
      date: 'SUN, SEPT 21ST'
    },
  ]

  const displayGames = games.length > 0 ? games : defaultGames

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320 // Width of one card + gap
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount)
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  if (!displayGames || displayGames.length === 0) {
    return null
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Scroll Left Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-none w-12 h-12"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-8 px-16">
              {displayGames.map((game) => (
                <div
                  key={game.id}
                  className="flex-shrink-0 flex items-center gap-4"
                >
                  {/* Shield Logo - Much Bigger */}
                  <div className="w-[120px] h-[120px] relative flex-shrink-0">
                    <Image
                      src="/basketball-factory-shield-logo.png"
                      alt="RA1 Shield Logo"
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Text Content - Smaller and Compact */}
                  <div className="flex flex-col items-start text-left space-y-0.5">
                    {/* Location */}
                    <span className="text-white/70 text-[11px] tracking-wider font-saira uppercase">
                      {game.location}
                    </span>

                    {/* Team Name */}
                    <h3 className="text-tbf-gold text-sm font-audiowide tracking-wide leading-tight uppercase">
                      {game.teamName}
                    </h3>

                    {/* Date */}
                    <p className="text-white/70 text-[11px] font-saira tracking-wide">
                      {game.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Right Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-none w-12 h-12"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedGames
