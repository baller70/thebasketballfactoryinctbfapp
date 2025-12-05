
'use client'

import { Star, Quote } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    name: 'Jennifer Walsh',
    role: 'Parent - Sparta, NJ',
    image: '/player-testimonial-1.jpg',
    rating: 5,
    text: "We tried a few basketball programs around Sussex County before finding Kevin Houston at The Basketball Factory. The difference was night and day. My son went from being afraid to shoot in games to becoming one of his team's top scorers. Kevin's patient teaching style and focus on fundamentals really built his confidence. As a parent in Sparta, I love how easy it is to schedule sessions and how Kevin keeps me updated on my son's progress. Worth every penny!"
  },
  {
    name: 'Michael Torres',
    role: 'Parent - Newton, NJ',
    image: '/player-testimonial-2.jpg',
    rating: 5,
    text: "My daughter has been training with Mr. Basic for six months now, and her improvement is incredible. She made varsity as a freshman! Kevin doesn't just teach basketball skills - he teaches life skills like discipline, focus, and mental toughness. The private lessons are personalized to exactly what she needs to work on. We drive from Newton to Sparta every week because the quality of training is unmatched. Highly recommend to any parent looking for real results!"
  },
  {
    name: 'Robert Jenkins',
    role: 'Parent - Hopatcong, NJ',
    image: '/player-testimonial-3.jpg',
    rating: 5,
    text: "As a dad who played college basketball, I'm pretty picky about trainers. Kevin Houston is the real deal. He fixed my son's shooting form in just three sessions, and now he's shooting 45% from three-point range! What impresses me most is Kevin's ability to explain complex basketball concepts in ways that young athletes can understand and apply. The Basketball Factory's facility in Sparta is top-notch, and Kevin's professionalism is outstanding. Best investment in my son's athletic development."
  },
  {
    name: 'Lisa Martinez',
    role: 'Parent - Andover, NJ',
    image: '/parent-testimonial-basketball-training-4.jpg',
    rating: 5,
    text: "My twin boys have been doing private lessons with Kevin for over a year. What I appreciate most is how he tailors each session to their individual needs - even though they're the same age, they have different strengths and weaknesses. Kevin recognizes this and works with each of them accordingly. They've both improved dramatically in ball handling and court awareness. The boys actually look forward to their training sessions, which speaks volumes about Kevin's teaching style!"
  }
]

export default function TestimonialsSection() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-tbf-gold text-sm font-bold tracking-wider uppercase mb-4 block">
            What Parents Are Saying
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-audiowide uppercase">
            PARENT <span className="text-tbf-gold">TESTIMONIALS</span>
          </h2>
          <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
            Hear from real parents in Sparta and Sussex County about their children's experiences with Kevin Houston's private basketball lessons at The Basketball Factory.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-black/40 border border-tbf-gold/20 rounded-lg p-8 hover:border-tbf-gold/60 transition-all duration-300 relative"
            >
              <Quote className="absolute top-4 right-4 w-12 h-12 text-tbf-gold/20" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-tbf-gold flex-shrink-0">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg uppercase">{testimonial.name}</h4>
                  <p className="text-tbf-gold text-sm">{testimonial.role}</p>
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-tbf-gold fill-tbf-gold" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-white/80 leading-relaxed italic">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>

        {/* Google Reviews CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white/5 border border-tbf-gold/30 rounded-lg p-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-6 h-6 text-tbf-gold fill-tbf-gold" />
              <Star className="w-6 h-6 text-tbf-gold fill-tbf-gold" />
              <Star className="w-6 h-6 text-tbf-gold fill-tbf-gold" />
              <Star className="w-6 h-6 text-tbf-gold fill-tbf-gold" />
              <Star className="w-6 h-6 text-tbf-gold fill-tbf-gold" />
            </div>
            <p className="text-white text-xl font-bold mb-2">Rated 5.0 Stars on Google</p>
            <p className="text-white/70 mb-4">Based on 50+ parent reviews from Sparta & Sussex County families</p>
            <a
              href="https://www.google.com/search?q=the+basketball+factory+sparta+nj"
              target="_blank"
              rel="noopener noreferrer"
              className="text-tbf-gold hover:underline font-semibold"
            >
              Read More Reviews on Google →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
