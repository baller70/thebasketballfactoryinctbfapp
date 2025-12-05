
'use client'

import { Check, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

const packages = [
  {
    name: 'Individual Session',
    subtitle: 'Fundamental Skill Review',
    price: '$85',
    description: 'Perfect for trying out private lessons or focusing on specific skills',
    features: [
      'Single 1-hour basketball lesson',
      'Personalized skill assessment',
      'Custom drill recommendations',
      'TBF Training T-Shirt included',
      'Progress report for parents',
      'Flexible scheduling'
    ],
    popular: false,
    cta: 'Book Single Session'
  },
  {
    name: '10-Pack Lessons',
    subtitle: 'Mr. Basic Skill Growth Program',
    price: '$750',
    pricePerSession: '$75/session',
    description: 'Most popular for serious skill development over 10-12 weeks',
    features: [
      '10 one-hour basketball lessons',
      'Comprehensive skill development plan',
      'Video analysis of shooting form',
      'TBF Training T-Shirt & gear',
      'Online training platform access',
      'Mid-program progress assessment',
      'Priority scheduling',
      'Parent progress updates'
    ],
    popular: true,
    cta: 'Start 10-Pack Program'
  },
  {
    name: '20-Pack Lessons',
    subtitle: 'Mr. Basic Next Level Program',
    price: '$1,300',
    pricePerSession: '$65/session',
    description: 'Elite program for athletes committed to transforming their game',
    features: [
      '20 one-hour basketball lessons',
      'Advanced skill mastery curriculum',
      'Weekly video analysis sessions',
      'TBF Training gear package',
      'Game film breakdown (3 games)',
      'Mental performance training',
      'Nutrition & fitness guidance',
      'Tournament preparation',
      'Priority scheduling',
      'Monthly parent meetings'
    ],
    popular: false,
    cta: 'Start 20-Pack Program'
  },
  {
    name: 'All-Inclusive Elite',
    subtitle: 'Serious Players Only',
    price: 'Custom',
    description: 'Complete development program for athletes aiming for college basketball',
    features: [
      'Unlimited training sessions',
      'Virtual coaching (Zoom/Google Meet)',
      'Ultimate player blueprint',
      'Complete game film breakdown',
      'College recruitment guidance',
      'Mental performance coaching',
      'Strength & conditioning plans',
      'Tournament & showcase prep',
      'Parent & player workshops',
      '24/7 coaching support'
    ],
    popular: false,
    cta: 'Inquire About Elite Program'
  }
]

export default function PricingGuide() {
  const scrollToBooking = () => {
    document.getElementById('booking-portal')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="pricing" className="relative py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-tbf-gold text-sm font-bold tracking-wider uppercase mb-4 block">
            Investment in Your Child's Future
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-audiowide uppercase">
            LESSON <span className="text-tbf-gold">PRICING GUIDE</span>
          </h2>
          <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
            Kevin Houston offers private basketball lesson packages tailored to your child's needs and budget. Whether you're a Sparta family looking for a single trial lesson or committed to a comprehensive training program, we have flexible options for every young athlete ages 7-18 in Sussex County.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative bg-gradient-to-b from-gray-900 to-black border-2 rounded-lg p-8 flex flex-col ${
                pkg.popular
                  ? 'border-tbf-gold shadow-2xl shadow-tbf-gold/20 scale-105'
                  : 'border-gray-800 hover:border-tbf-gold/50'
              } transition-all duration-300`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-tbf-gold text-black px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Star className="w-4 h-4" fill="currentColor" />
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2 font-audiowide uppercase">{pkg.name}</h3>
                <p className="text-tbf-gold text-sm font-semibold uppercase tracking-wide mb-4">{pkg.subtitle}</p>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-white">{pkg.price}</span>
                  {pkg.pricePerSession && (
                    <span className="text-tbf-gold text-sm ml-2">({pkg.pricePerSession})</span>
                  )}
                </div>
                <p className="text-white/70 text-sm">{pkg.description}</p>
              </div>

              <div className="flex-grow mb-6">
                <ul className="space-y-3">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-0.5" />
                      <span className="text-white/80 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={scrollToBooking}
                className={`w-full py-6 font-bold text-base rounded-none ${
                  pkg.popular
                    ? 'bg-tbf-gold hover:bg-tbf-gold/90 text-black'
                    : 'bg-white hover:bg-white/90 text-black'
                }`}
              >
                {pkg.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-tbf-gold/10 border border-tbf-gold/30 rounded-lg p-8 text-center">
          <p className="text-white/90 text-lg mb-4">
            <strong className="text-tbf-gold">Parents Love Our Flexible Payment Options:</strong> We offer payment plans for multi-session packages. All lessons take place at our Sparta, NJ facility (38 Station Rd) with convenient scheduling Monday-Thursday.
          </p>
          <p className="text-white/70">
            Questions about which package is right for your child? <a href="/contact-us" className="text-tbf-gold hover:underline font-semibold">Contact us for a free consultation</a> to discuss your goals.
          </p>
        </div>
      </div>
    </section>
  )
}
