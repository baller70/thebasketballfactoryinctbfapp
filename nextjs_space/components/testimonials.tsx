
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  imageUrl?: string
  type: 'player' | 'professional'
}

interface TestimonialsProps {
  testimonials?: Testimonial[]
}

const Testimonials = ({ testimonials = [] }: TestimonialsProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Default testimonials if none provided
  const defaultTestimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Mitchell',
      role: 'Parent - Sparta, NJ',
      content: 'Honestly, I can\'t believe the difference in my son\'s game after just three months at The Basketball Factory. He went from barely dribbling with his left hand to confidently driving to the basket in games. The trainers here really take the time with each kid - they\'re not just going through the motions. My son actually asks if he can go to practice early!',
      type: 'player'
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      role: 'Parent - Sussex County',
      content: 'My daughter was so shy when she started at The Basketball Factory last year. Now she\'s one of the team leaders! It\'s not just about basketball skills - though those have improved tremendously - it\'s watching her confidence grow on and off the court. The trainers focus on fundamentals but keep it fun. Worth every penny for any parent in Sussex County looking for quality basketball training.',
      type: 'player'
    },
    {
      id: '3',
      name: 'Jennifer Walsh',
      role: 'Parent - Newton, NJ',
      content: 'We drive 20 minutes from Newton and it\'s absolutely worth it. My 12-year-old has learned more in six months here than in two years at other programs. The trainers break everything down so kids really understand the "why" behind each skill. My son\'s trainer even texts me updates after sessions - you don\'t get that kind of personal attention everywhere.',
      type: 'player'
    },
    {
      id: '4',
      name: 'Tom Anderson',
      role: 'Parent - Sparta, NJ',
      content: 'Best decision we made for our twin boys! They\'re 9 and were getting frustrated with basketball before starting at The Basketball Factory. Now they can\'t stop talking about what they learned at practice. The improvement in their shooting form alone is remarkable. If you\'re a parent in Sparta looking for real skill development, this is the place.',
      type: 'player'
    }
  ]

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials

  useEffect(() => {
    if (displayTestimonials.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % displayTestimonials.length)
      }, 6000) // Auto-advance every 6 seconds

      return () => clearInterval(timer)
    }
  }, [displayTestimonials.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % displayTestimonials.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (!displayTestimonials || displayTestimonials.length === 0) {
    return null
  }

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/summer-basketball-camp-banner-sparta-nj.jpeg"
          alt="Game Summer Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Audiowide, sans-serif' }}>
            PARENT <span className="text-tbf-gold">TESTIMONIALS</span>
          </h2>
          <p className="text-white/80 text-lg max-w-3xl mx-auto">
            Real stories from Sparta, NJ and Sussex County parents about how The Basketball Factory's youth basketball skill training has transformed their kids' game, confidence, and love for basketball.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonials Carousel */}
          <div className="overflow-hidden">
            <motion.div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {displayTestimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-gray-900/80 border-tbf-gold/30 backdrop-blur-sm">
                      <CardContent className="p-8 lg:p-12">
                        <div className="text-center">
                          {/* Quote Icon */}
                          <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-tbf-gold/20 rounded-full mb-6"
                          >
                            <Quote className="h-8 w-8 text-tbf-gold" />
                          </motion.div>

                          {/* Rating Stars */}
                          <div className="flex justify-center space-x-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-5 w-5 text-yellow-400 fill-current"
                              />
                            ))}
                          </div>

                          {/* Content */}
                          <blockquote className="text-white text-lg lg:text-xl leading-relaxed mb-8 italic">
                            "{testimonial.content}"
                          </blockquote>

                          {/* Author Info */}
                          <div className="flex items-center justify-center space-x-4">
                            <Avatar className="h-16 w-16 border-2 border-tbf-gold">
                              <AvatarImage src="/basketball-factory-sparta-nj-logo.png" alt={testimonial.name} />
                              <AvatarFallback className="bg-tbf-gold text-white font-bold">
                                {getInitials(testimonial.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                              <h4 className="text-white font-semibold text-lg">
                                {testimonial.name}
                              </h4>
                              <p className="text-white/70 text-sm">
                                {testimonial.role}
                              </p>
                              <div className="flex items-center mt-1">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  testimonial.type === 'player'
                                    ? 'bg-tbf-gold/20 text-tbf-gold'
                                    : 'bg-gray-600/50 text-gray-300'
                                }`}>
                                  {testimonial.type === 'player' ? 'Parent' : 'Trainer'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          {displayTestimonials.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-black/50 border-white/30 text-white hover:bg-tbf-gold hover:border-tbf-gold"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-black/50 border-white/30 text-white hover:bg-tbf-gold hover:border-tbf-gold"
                onClick={nextSlide}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Slide Indicators */}
          {displayTestimonials.length > 1 && (
            <div className="flex justify-center space-x-3 mt-8">
              {displayTestimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentSlide ? 'bg-tbf-gold' : 'bg-white/30 hover:bg-white/50'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
