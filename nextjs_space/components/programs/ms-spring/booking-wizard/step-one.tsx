'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Info, XCircle } from 'lucide-react'
import { ProgramBookingData, SessionOption } from './program-booking-wizard'
import { calculateStripeTotal } from '@/lib/stripe-fees'

type SessionChoice = '2nd-6th' | '7th-8th' | null

interface StepOneProps {
  bookingData: ProgramBookingData
  updateBookingData: (data: Partial<ProgramBookingData>) => void
  nextStep: () => void
}

export default function StepOne({ bookingData, updateBookingData, nextStep }: StepOneProps) {
  const [sessionChoice, setSessionChoice] = useState<SessionChoice>(null)

  const handleSelect = (choice: SessionChoice) => {
    setSessionChoice(choice)
    const priceBreakdown = calculateStripeTotal(35)
    const timeLabel = choice === '2nd-6th' ? 'Tuesdays 5:00 - 6:30 PM (Grades 2nd - 6th)' : 'Tuesdays 6:30 - 8:00 PM (Grades 7th - 8th)'
    updateBookingData({
      sessionOption: 'single-session',
      pricingInfo: {
        price: priceBreakdown.totalAmount,
        programFee: 35,
        processingFee: priceBreakdown.processingFee,
        sessionCount: 1,
        pricePerSession: 35,
      },
      trainingGoals: timeLabel,
    })
  }

  const handleContinue = () => {
    if (sessionChoice) {
      nextStep()
    }
  }

  const dropInPrice = calculateStripeTotal(35)

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4 font-audiowide">
          SELECT YOUR <span className="text-[#C8B273]">SESSION</span>
        </h3>
        <p className="text-white/80 max-w-2xl mx-auto">
          Choose the session for your athlete. We have two age groups on <strong className="text-[#C8B273]">Tuesdays</strong> at our Sparta, NJ facility. Boys &amp; girls welcome.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {/* Full Program - REGISTRATION CLOSED */}
        <div className="relative p-5 rounded-lg border-2 border-white/10 bg-black/30 opacity-50 cursor-not-allowed">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              CLOSED
            </span>
          </div>
          <h4 className="text-lg font-bold text-white/40 font-audiowide mb-2 line-through">
            Full Program
          </h4>
          <span className="text-2xl font-bold text-white/25 line-through">$288.44</span>
          <p className="text-white/30 text-xs mt-2">Registration has ended.</p>
        </div>

        {/* Grades 2nd - 6th Session */}
        <div
          onClick={() => handleSelect('2nd-6th')}
          className={`
            relative p-5 rounded-lg border-2 cursor-pointer transition-all duration-300
            ${sessionChoice === '2nd-6th'
              ? 'bg-[#C8B273]/10 border-[#C8B273] shadow-lg shadow-[#C8B273]/20'
              : 'bg-black/50 border-white/20 hover:border-[#C8B273]/50'}
          `}
        >
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              AVAILABLE
            </span>
          </div>

          {sessionChoice === '2nd-6th' && (
            <div className="absolute top-3 right-3">
              <div className="w-7 h-7 bg-[#C8B273] rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-black" />
              </div>
            </div>
          )}

          <h4 className="text-lg font-bold text-white font-audiowide mb-1">
            Grades 2nd - 6th
          </h4>
          <p className="text-[#C8B273] font-bold text-sm mb-3">Tuesdays, 5:00 - 6:30 PM</p>
          <p className="text-white/70 text-xs mb-3">Boys &amp; Girls</p>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-[#C8B273]">${dropInPrice.totalAmount.toFixed(2)}</span>
            <span className="text-white/50 text-xs">per session</span>
          </div>

          <div className="bg-black/30 border border-[#C8B273]/20 rounded p-2 mb-3">
            <div className="flex items-start gap-2">
              <Info className="w-3 h-3 text-[#C8B273] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-white/70 space-y-0.5">
                <div className="flex justify-between">
                  <span>Session Fee:</span>
                  <span className="text-white">$35.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span className="text-white">${dropInPrice.processingFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-[#C8B273]/20 pt-0.5 mt-0.5 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="text-[#C8B273]">${dropInPrice.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <ul className="space-y-1.5">
            {['Pay as you go — drop in any Tuesday', 'Professional coaching', 'All equipment provided'].map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-white/70">
                <Check className="w-3 h-3 text-[#C8B273] flex-shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Grades 7th - 8th Session */}
        <div
          onClick={() => handleSelect('7th-8th')}
          className={`
            relative p-5 rounded-lg border-2 cursor-pointer transition-all duration-300
            ${sessionChoice === '7th-8th'
              ? 'bg-[#C8B273]/10 border-[#C8B273] shadow-lg shadow-[#C8B273]/20'
              : 'bg-black/50 border-white/20 hover:border-[#C8B273]/50'}
          `}
        >
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              AVAILABLE
            </span>
          </div>

          {sessionChoice === '7th-8th' && (
            <div className="absolute top-3 right-3">
              <div className="w-7 h-7 bg-[#C8B273] rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-black" />
              </div>
            </div>
          )}

          <h4 className="text-lg font-bold text-white font-audiowide mb-1">
            Grades 7th - 8th
          </h4>
          <p className="text-[#C8B273] font-bold text-sm mb-3">Tuesdays, 6:30 - 8:00 PM</p>
          <p className="text-white/70 text-xs mb-3">Boys &amp; Girls</p>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-[#C8B273]">${dropInPrice.totalAmount.toFixed(2)}</span>
            <span className="text-white/50 text-xs">per session</span>
          </div>

          <div className="bg-black/30 border border-[#C8B273]/20 rounded p-2 mb-3">
            <div className="flex items-start gap-2">
              <Info className="w-3 h-3 text-[#C8B273] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-white/70 space-y-0.5">
                <div className="flex justify-between">
                  <span>Session Fee:</span>
                  <span className="text-white">$35.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span className="text-white">${dropInPrice.processingFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-[#C8B273]/20 pt-0.5 mt-0.5 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="text-[#C8B273]">${dropInPrice.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <ul className="space-y-1.5">
            {['Pay as you go — drop in any Tuesday', 'Professional coaching', 'All equipment provided'].map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-white/70">
                <Check className="w-3 h-3 text-[#C8B273] flex-shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <Button
          onClick={handleContinue}
          disabled={!sessionChoice}
          className="bg-[#C8B273] hover:bg-[#B8A263] text-black font-bold px-12 py-6 text-lg rounded-none disabled:opacity-50"
        >
          Continue to Pricing Details
        </Button>
      </div>
    </div>
  )
}
