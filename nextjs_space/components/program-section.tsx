
'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function ProgramSection() {
  return (
    <section className="w-full bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <p className="text-sm tracking-widest text-gray-600 mb-2" style={{ fontFamily: 'var(--font-saira)' }}>
            THE BASKETBALL FACTORY
          </p>
          <h2 className="text-5xl font-bold text-black" style={{ fontFamily: 'var(--font-audiowide)' }}>
            TBF <span className="text-tbf-gold">SEASONAL PROGRAMS</span>
          </h2>
        </div>

        {/* Four Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Spring Program */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-square relative overflow-hidden rounded-lg">
              <Image
                src="/spring-basketball-programs-sparta-nj.png"
                alt="Spring Program"
                fill
                className="object-cover"
              />
            </div>
            <Link href="/spring-programs">
              <button 
                className="mt-6 px-8 py-3 border-2 border-black text-black font-semibold tracking-wider hover:bg-black hover:text-white transition-colors"
                style={{ fontFamily: 'var(--font-audiowide)' }}
              >
                LEARN MORE
              </button>
            </Link>
          </div>

          {/* Summer Program */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-square relative overflow-hidden rounded-lg">
              <Image
                src="/summer-basketball-programs-sparta-nj.png"
                alt="Summer Program"
                fill
                className="object-cover"
              />
            </div>
            <Link href="/summer-programs">
              <button 
                className="mt-6 px-8 py-3 border-2 border-black text-black font-semibold tracking-wider hover:bg-black hover:text-white transition-colors"
                style={{ fontFamily: 'var(--font-audiowide)' }}
              >
                LEARN MORE
              </button>
            </Link>
          </div>

          {/* Fall Program */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-square relative overflow-hidden rounded-lg">
              <Image
                src="/fall-basketball-programs-sparta-nj.png"
                alt="Fall Program"
                fill
                className="object-cover"
              />
            </div>
            <Link href="/fall-programs">
              <button 
                className="mt-6 px-8 py-3 border-2 border-black text-black font-semibold tracking-wider hover:bg-black hover:text-white transition-colors"
                style={{ fontFamily: 'var(--font-audiowide)' }}
              >
                LEARN MORE
              </button>
            </Link>
          </div>

          {/* Winter Program */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-square relative overflow-hidden rounded-lg">
              <Image
                src="/winter-basketball-programs-sparta-nj.png"
                alt="Winter Program"
                fill
                className="object-cover"
              />
            </div>
            <Link href="/winter-programs">
              <button 
                className="mt-6 px-8 py-3 border-2 border-black text-black font-semibold tracking-wider hover:bg-black hover:text-white transition-colors"
                style={{ fontFamily: 'var(--font-audiowide)' }}
              >
                LEARN MORE
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
