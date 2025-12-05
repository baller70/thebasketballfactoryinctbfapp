
'use client'

import { Button } from '@/components/ui/button'
import { Check, Info } from 'lucide-react'
import { ProgramBookingData, SessionOption } from './program-booking-wizard'
import { calculateStripeTotal } from '@/lib/stripe-fees'

const packages = [
  {
    id: 'full-program' as SessionOption,
    name: 'Full Program (2 Sessions)',
    price: 120,
    sessionCount: 2,
    pricePerSession: 60,
    features: [
      '2 remaining Monday sessions',
      'Nov 17 & Nov 24, 2025',
      '4 hours per session',
      'Supervised open gym',
      'Flexible practice time',
      'Professional coaching',
      'All equipment provided',
      'Ages 7-18 welcome'
    ],
    popular: true,
    savings: 10
  },
  {
    id: 'single-session' as SessionOption,
    name: 'Single Session Drop-In',
    price: 15,
    sessionCount: 1,
    pricePerSession: 15,
    features: [
      '1 training session',
      'Join any scheduled workout',
      '4 hours of open gym',
      'Professional coaching',
      'All equipment provided',
      'Great for trying us out'
    ],
    popular: false
  }
]

interface StepOneProps {
  bookingData: ProgramBookingData
  updateBookingData: (data: Partial<ProgramBookingData>) => void
  nextStep: () => void
}

export default function StepOne({ bookingData, updateBookingData, nextStep }: StepOneProps) {
  const handleSelectPackage = (pkg: typeof packages[0]) => {
    const priceBreakdown = calculateStripeTotal(pkg.price)
    
    updateBookingData({
      sessionOption: pkg.id,
      pricingInfo: {
        price: priceBreakdown.totalAmount, // Total amount including processing fee
        programFee: pkg.price, // Original program fee
        processingFee: priceBreakdown.processingFee, // Processing fee
        sessionCount: pkg.sessionCount,
        pricePerSession: pkg.pricePerSession
      }
    })
  }

  const handleContinue = () => {
    if (bookingData.sessionOption) {
      nextStep()
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4 font-audiowide">
          CHOOSE YOUR <span className="text-[#C8B273]">PROGRAM OPTION</span>
        </h3>
        <p className="text-white/80 max-w-2xl mx-auto">
          Select the option that best fits your athlete's schedule and commitment level. All sessions include expert coaching with Kevin Houston at our Sparta, NJ facility.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {packages.map((pkg) => {
          const priceBreakdown = calculateStripeTotal(pkg.price)
          
          return (
            <div
              key={pkg.id}
              onClick={() => handleSelectPackage(pkg)}
              className={`
                relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-300
                ${bookingData.sessionOption === pkg.id 
                  ? 'bg-[#C8B273]/10 border-[#C8B273] shadow-lg shadow-[#C8B273]/20' 
                  : 'bg-black/50 border-white/20 hover:border-[#C8B273]/50'}
              `}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#C8B273] text-black text-xs font-bold px-4 py-1 rounded-full">
                    BEST VALUE
                  </span>
                </div>
              )}

              {bookingData.sessionOption === pkg.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-[#C8B273] rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-black" />
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-xl font-bold text-white font-audiowide mb-2">
                  {pkg.name}
                </h4>
                <div>
                  <div className="mb-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-[#C8B273]">
                        ${priceBreakdown.totalAmount.toFixed(2)}
                      </span>
                      {pkg.sessionCount > 1 && (
                        <span className="text-white/60 text-sm">
                          (${pkg.pricePerSession}/session)
                        </span>
                      )}
                    </div>
                    
                    {/* Price Breakdown */}
                    <div className="mt-2 bg-black/30 border border-[#C8B273]/20 rounded p-2">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-[#C8B273] flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-white/70 space-y-1">
                          <div className="flex justify-between">
                            <span>Program Fee:</span>
                            <span className="text-white">${pkg.price.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Processing Fee:</span>
                            <span className="text-white">${priceBreakdown.processingFee.toFixed(2)}</span>
                          </div>
                          <div className="border-t border-[#C8B273]/20 pt-1 mt-1 flex justify-between font-semibold">
                            <span>Total:</span>
                            <span className="text-[#C8B273]">${priceBreakdown.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {pkg.savings && pkg.savings > 0 && (
                    <p className="text-green-400 text-sm font-semibold mt-1">
                      Save ${pkg.savings} vs. drop-in pricing
                    </p>
                  )}
                  {pkg.sessionCount > 1 && (
                    <p className="text-white/60 text-sm mt-1">
                      {pkg.sessionCount} sessions included
                    </p>
                  )}
                </div>
              </div>

              <ul className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-white/80">
                    <Check className="w-4 h-4 text-[#C8B273] flex-shrink-0 mt-0.5" />
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
          disabled={!bookingData.sessionOption}
          className="bg-[#C8B273] hover:bg-[#B8A263] text-black font-bold px-12 py-6 text-lg rounded-none"
        >
          Continue to Pricing Details
        </Button>
      </div>
    </div>
  )
}
