
'use client'

import Image from 'next/image'
import { Star, Quote } from 'lucide-react'
import ImageModal from './image-modal'
import SectionDivider from './section-divider'

const reviews = [
  {
    image: 'https://cdn.abacus.ai/images/66c14d04-1fb2-44e5-81a0-a91ac3d8e8df.png',
    reviewer: 'Rebecca Thompson',
    rating: 5,
    title: 'My Daughter Actually Looks Forward to Practice!',
    text: 'I can\'t say enough good things about The Basketball Factory. My 11-year-old daughter has been going for 8 months now and the change is incredible. She used to get nervous during games, but now she\'s confident and making plays I never thought possible. The trainers really get to know each kid and push them in the best way. We live in Sparta and this is hands down the best basketball training program around.',
    date: '2024',
    location: 'Sparta, NJ'
  },
  {
    image: 'https://cdn.abacus.ai/images/09720506-d2e2-4933-a25c-c07d4a6786a2.png',
    reviewer: 'David Chen',
    rating: 5,
    title: 'Finally Found the Right Place for My Son',
    text: 'We tried three different basketball programs before finding The Basketball Factory, and I wish we had started here first. My 13-year-old son struggled with his shooting mechanics and was getting frustrated. The trainers here took the time to break it down, and within 2 months his form completely changed. But what really impressed me is how they focus on character too - teamwork, effort, respect. That matters just as much to me as a parent. If you\'re in Sussex County looking for real skill development, this is it.',
    date: '2024',
    location: 'Sussex County, NJ'
  }
]

export default function GoogleReviewsSection() {
  return (
    <section className="relative py-20 bg-gray-50">
      {/* Attractive Section Divider */}
      <SectionDivider variant="top" style="geometric" className="mb-8" />
      
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-4">
            <Image
              src="/cropped-PRPdnDfJ_400x400.jpg"
              alt="Google Reviews"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-7 h-7 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-black font-bold text-lg">5.0 Rating</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6" style={{ fontFamily: 'Audiowide, sans-serif' }}>
            WHAT OUR COMMUNITY SAYS
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            Real feedback from <span className="text-tbf-gold font-semibold">Sussex County families</span> about our <span className="text-tbf-gold font-semibold">youth basketball program</span>
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {reviews.map((review, index) => (
            <ImageModal
              key={index}
              src={review.image}
              alt={`Google Review - ${review.title}`}
              title={review.title}
              description={`"${review.text}" - ${review.reviewer}, ${review.location}`}
            >
              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-tbf-gold transition-all duration-300 group cursor-pointer shadow-lg">
                {/* Review Image */}
                <div className="relative aspect-video bg-gray-100">
                  <Image
                    src={review.image}
                    alt={`Google Review - ${review.title}`}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all flex items-center justify-center">
                    <p className="text-black text-sm opacity-0 group-hover:opacity-100 transition-opacity font-semibold bg-white px-4 py-2 rounded">Click to enlarge</p>
                  </div>
                </div>
                
                {/* Review Content */}
                <div className="p-8">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-gray-600 text-base">• {review.date}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Audiowide, sans-serif' }}>
                    {review.title}
                  </h3>

                  {/* Quote Icon */}
                  <Quote className="w-12 h-12 text-tbf-gold/30 mb-3" />

                  {/* Review Text */}
                  <p className="text-gray-700 text-base leading-relaxed mb-6 italic">
                    &quot;{review.text}&quot;
                  </p>

                  {/* Reviewer Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <div className="text-black font-semibold text-base">{review.reviewer}</div>
                      <div className="text-gray-600 text-sm">{review.location}</div>
                    </div>
                    <div className="text-tbf-gold font-bold text-sm">VERIFIED REVIEW</div>
                  </div>
                </div>
              </div>
            </ImageModal>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white border-2 border-tbf-gold rounded-xl p-10 shadow-lg">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold text-black mb-2">4.9/5.0</div>
                <div className="text-gray-700 text-base font-semibold">Google Rating</div>
                <div className="flex justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-5xl font-bold text-black mb-2">150+</div>
                <div className="text-gray-700 text-base font-semibold">5-Star Reviews</div>
                <div className="text-tbf-gold text-sm mt-2 font-semibold">Sussex County Families</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-black mb-2">100%</div>
                <div className="text-gray-700 text-base font-semibold">Recommend to Friends</div>
                <div className="text-tbf-gold text-sm mt-2 font-semibold">Parent Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Keywords Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm max-w-4xl mx-auto">
            Parents love our focus on <span className="text-gray-600 font-semibold">skill development</span>, <span className="text-gray-600 font-semibold">character building</span>, 
            and <span className="text-gray-600 font-semibold">maximum effort</span> | Top-rated <span className="text-gray-600 font-semibold">AAU basketball program</span> in 
            <span className="text-gray-600 font-semibold"> Sparta, NJ 07871</span> and <span className="text-gray-600 font-semibold">Sussex County</span>
          </p>
        </div>
      </div>
    </section>
  )
}
