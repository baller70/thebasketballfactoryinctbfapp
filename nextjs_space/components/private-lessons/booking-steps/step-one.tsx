
'use client'

import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { BookingData, LessonType } from '../booking-wizard'
import { calculateStripeFee, calculateTotalWithFee } from '@/lib/pricing'

const packages = [
  {
    id: 'individual' as LessonType,
    name: 'Individual Session',
    price: 85,
    sessionCount: 1,
    pricePerSession: 85,
    features: [
      'One-on-one training with Kevin Houston',
      '1 hour focused skill development',
      'Personalized training plan',
      'Progress assessment',
      'Flexible scheduling'
    ],
    popular: false
  },
  {
    id: '10-pack' as LessonType,
    name: '10-Pack Lessons',
    price: 750,
    sessionCount: 10,
    pricePerSession: 75,
    features: [
      'Save $100 vs individual sessions',
      '10 one-hour training sessions',
      'Comprehensive skill development',
      'Detailed progress tracking',
      'Priority scheduling',
      'Valid for 6 months'
    ],
    popular: true
  },
  {
    id: '20-pack' as LessonType,
    name: '20-Pack Lessons',
    price: 1300,
    sessionCount: 20,
    pricePerSession: 65,
    features: [
      'Save $400 vs individual sessions',
      '20 one-hour training sessions',
      'Complete skill transformation',
      'Advanced progress analytics',
      'VIP scheduling priority',
      'Valid for 1 year',
      'Quarterly parent meetings'
    ],
    popular: false
  },
  {
    id: 'elite' as LessonType,
    name: 'All-Inclusive Elite',
    price: 0,
    sessionCount: 0,
    pricePerSession: 0,
    features: [
      'Unlimited training sessions',
      'Customized elite athlete program',
      'Video analysis & breakdown',
      'Nutrition guidance',
      'Tournament preparation',
      'College recruiting support',
      'Year-round development plan'
    ],
    popular: false,
    custom: true
  }
]

interface StepOneProps {
  bookingData: BookingData
  updateBookingData: (data: Partial<BookingData>) => void
  nextStep: () => void
}

export default function StepOne({ bookingData, updateBookingData, nextStep }: StepOneProps) {
  const handleSelectPackage = (pkg: typeof packages[0]) => {
    const fee = calculateStripeFee(pkg.price)
    const total = calculateTotalWithFee(pkg.price)
    updateBookingData({
      lessonType: pkg.id,
      pricingInfo: {
        price: pkg.price,
        sessionCount: pkg.sessionCount,
        pricePerSession: pkg.pricePerSession,
        processingFee: fee,
        totalPrice: total,
      }
    })
    setTimeout(() => nextStep(), 400)
  }

  const handleContinue = () => {
    if (bookingData.lessonType) {
      nextStep()
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4 font-audiowide uppercase">
          CHOOSE YOUR <span className="text-tbf-gold">LESSON PACKAGE</span>
        </h3>
        <p className="text-white/80 max-w-2xl mx-auto">
          Select the package that best fits your athlete&apos;s development goals. All packages include training with expert trainer Kevin Houston at our Sparta, NJ facility.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages.map((pkg) => {
          const fee = calculateStripeFee(pkg.price)
          const total = calculateTotalWithFee(pkg.price)
          return (
            <div
              key={pkg.id}
              onClick={() => handleSelectPackage(pkg)}
              className={`
                relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-300
                ${bookingData.lessonType === pkg.id 
                  ? 'bg-tbf-gold/10 border-tbf-gold shadow-lg shadow-tbf-gold/20' 
                  : 'bg-black/50 border-white/20 hover:border-tbf-gold/50'}
              `}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-tbf-gold text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {bookingData.lessonType === pkg.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-tbf-gold rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-black" />
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-xl font-bold text-white font-audiowide mb-2 uppercase">
                  {pkg.name}
                </h4>
                {pkg.custom ? (
                  <div>
                    <p className="text-2xl font-bold text-tbf-gold">Custom Pricing</p>
                    <p className="text-white/60 text-sm">Contact us for details</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-tbf-gold">${total.toFixed(2)}</span>
                      {pkg.sessionCount > 1 && (
                        <span className="text-white/60 text-sm">
                          (${pkg.pricePerSession}/session)
                        </span>
                      )}
                    </div>
                    <p className="text-white/50 text-xs mt-1">
                      ${pkg.price} + ${fee.toFixed(2)} processing fee
                    </p>
                    {pkg.sessionCount > 1 && (
                      <p className="text-white/60 text-sm mt-1">
                        {pkg.sessionCount} sessions included
                      </p>
                    )}
                  </div>
                )}
              </div>

              <ul className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-white/80">
                    <Check className="w-4 h-4 text-tbf-gold flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="flex justify-center pt-6">
        <Button
          onClick={handleContinue}
          disabled={!bookingData.lessonType}
          className="bg-tbf-gold-bright hover:bg-tbf-gold-bright/90 text-white font-bold px-12 py-6 text-lg rounded-none"
        >
          Continue to Pricing Details
        </Button>
      </div>
    </div>
  )
}
