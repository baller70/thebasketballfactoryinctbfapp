'use client'

import { Button } from '@/components/ui/button'
import { Check, Info, XCircle } from 'lucide-react'
import { ProgramBookingData, SessionOption } from './program-booking-wizard'
import { calculateStripeTotal } from '@/lib/stripe-fees'

interface StepOneProps {
  bookingData: ProgramBookingData
  updateBookingData: (data: Partial<ProgramBookingData>) => void
  nextStep: () => void
}

export default function StepOne({ bookingData, updateBookingData, nextStep }: StepOneProps) {
  const handleSelectDropIn = () => {
    const priceBreakdown = calculateStripeTotal(15)
    updateBookingData({
      sessionOption: 'single-session',
      pricingInfo: {
        price: priceBreakdown.totalAmount,
        programFee: 15,
        processingFee: priceBreakdown.processingFee,
        sessionCount: 1,
        pricePerSession: 15,
      },
    })
  }

  const handleContinue = () => {
    if (bookingData.sessionOption === 'single-session') {
      nextStep()
    }
  }

  const dropInPrice = calculateStripeTotal(15)

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4 font-audiowide">
          CHOOSE YOUR <span className="text-[#C8B273]">PROGRAM OPTION</span>
        </h3>
        <p className="text-white/80 max-w-2xl mx-auto">
          Sign up for a single session drop-in. Sessions are held on <strong className="text-[#C8B273]">Wednesdays</strong> at our Sparta, NJ facility. Boys &amp; girls welcome.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Full Program - REGISTRATION CLOSED */}
        <div className="relative p-6 rounded-lg border-2 border-white/10 bg-black/30 opacity-60 cursor-not-allowed">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-red-600 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              REGISTRATION CLOSED
            </span>
          </div>

          <div className="mb-4">
            <h4 className="text-xl font-bold text-white/50 font-audiowide mb-2 line-through">
              Full Program (8 Weeks)
            </h4>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white/30 line-through">$288.44</span>
            </div>
            <p className="text-white/40 text-sm mt-2">Full program registration has ended.</p>
          </div>

          <ul className="space-y-2">
            {['8 weekly training sessions', 'Complete skill development curriculum', 'Progress tracking & assessments', 'Certificate of completion'].map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/30 line-through">
                <Check className="w-4 h-4 text-white/20 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Single Session Drop-In - ACTIVE */}
        <div
          onClick={handleSelectDropIn}
          className={`
            relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-300
            ${bookingData.sessionOption === 'single-session'
              ? 'bg-[#C8B273]/10 border-[#C8B273] shadow-lg shadow-[#C8B273]/20'
              : 'bg-black/50 border-white/20 hover:border-[#C8B273]/50'}
          `}
        >
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-green-600 text-white text-xs font-bold px-4 py-1 rounded-full">
              AVAILABLE NOW
            </span>
          </div>

          {bookingData.sessionOption === 'single-session' && (
            <div className="absolute top-4 right-4">
              <div className="w-8 h-8 bg-[#C8B273] rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-black" />
              </div>
            </div>
          )}

          <div className="mb-4">
            <h4 className="text-xl font-bold text-white font-audiowide mb-2">
              Single Session Drop-In
            </h4>
            <div className="mb-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#C8B273]">
                  ${dropInPrice.totalAmount.toFixed(2)}
                </span>
                <span className="text-white/60 text-sm">per session</span>
              </div>

              <div className="mt-2 bg-black/30 border border-[#C8B273]/20 rounded p-2">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#C8B273] flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-white/70 space-y-1">
                    <div className="flex justify-between">
                      <span>Session Fee:</span>
                      <span className="text-white">$15.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Fee:</span>
                      <span className="text-white">${dropInPrice.processingFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-[#C8B273]/20 pt-1 mt-1 flex justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-[#C8B273]">${dropInPrice.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ul className="space-y-2">
            {[
              '1 open gym session — pay as you go',
              'Wednesdays: 4:00 PM - 7:00 PM',
              'All ages welcome — boys & girls',
              'Professional coaching staff',
              'All equipment provided',
              'Perfect for young players building fundamentals',
            ].map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-white/80">
                <Check className="w-4 h-4 text-[#C8B273] flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <Button
          onClick={handleContinue}
          disabled={bookingData.sessionOption !== 'single-session'}
          className="bg-[#C8B273] hover:bg-[#B8A263] text-black font-bold px-12 py-6 text-lg rounded-none disabled:opacity-50"
        >
          Continue to Pricing Details
        </Button>
      </div>
    </div>
  )
}
