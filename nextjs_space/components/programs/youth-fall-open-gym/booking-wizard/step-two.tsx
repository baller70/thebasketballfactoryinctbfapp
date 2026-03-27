
'use client'

import { Button } from '@/components/ui/button'
import { Check, Info, Calendar, Clock, MapPin } from 'lucide-react'
import { ProgramBookingData } from './program-booking-wizard'

interface StepTwoProps {
  bookingData: ProgramBookingData
  nextStep: () => void
  prevStep: () => void
}

const packageNames = {
  'full-program': 'Full Program (2 Sessions)',
  'single-session': 'Single Session Drop-In'
}

export default function StepTwo({ bookingData, nextStep, prevStep }: StepTwoProps) {
  const { pricingInfo, sessionOption } = bookingData
  const isFullProgram = sessionOption === 'full-program'

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4 font-audiowide">
          REVIEW YOUR <span className="text-[#C8B273]">PROGRAM DETAILS</span>
        </h3>
        <p className="text-white/80 max-w-2xl mx-auto">
          Here's a detailed breakdown of your selected program. All prices include facility access, equipment, and expert instruction from Coach Kevin Houston.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Selected Package Card */}
        <div className="bg-gradient-to-br from-black via-gray-900 to-black border-2 border-[#C8B273] rounded-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-2xl font-bold text-white font-audiowide mb-2">
                {packageNames[sessionOption]}
              </h4>
              <p className="text-white/60">
                {pricingInfo.sessionCount} {pricingInfo.sessionCount === 1 ? 'session' : 'sessions'} included
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-[#C8B273]">${pricingInfo.price}</p>
              {pricingInfo.sessionCount > 1 && (
                <p className="text-white/60 text-sm mt-1">
                  ${pricingInfo.pricePerSession} per session
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-[#C8B273]/30 pt-6">
            <div className="space-y-3">
              <div className="flex justify-between text-white/80">
                <span>Price per Session:</span>
                <span className="font-semibold">${pricingInfo.pricePerSession}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Number of Sessions:</span>
                <span className="font-semibold">{pricingInfo.sessionCount}</span>
              </div>
              {isFullProgram && (
                <div className="flex justify-between text-green-400 font-semibold">
                  <span>Your Savings:</span>
                  <span>$10</span>
                </div>
              )}
              <div className="border-t border-[#C8B273]/30 pt-3 mt-3">
                <div className="flex justify-between text-white text-lg font-bold">
                  <span>Total Investment:</span>
                  <span className="text-[#C8B273]">${pricingInfo.price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Program Schedule */}
        <div className="bg-[#C8B273]/10 border border-[#C8B273]/30 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#C8B273]" />
            <h5 className="text-white font-bold text-lg font-audiowide">PROGRAM SCHEDULE</h5>
          </div>
          <div className="space-y-3 text-white/80 text-sm">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-[#C8B273] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Remaining Sessions:</p>
                <p>November 17 & 24, 2025 (Mondays)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#C8B273] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Training Times:</p>
                <p>Every Monday, 4:30 PM - 8:30 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#C8B273] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Location:</p>
                <p>The Basketball Factory, 38 Station Rd, Sparta, NJ 07871</p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-black/50 border border-white/20 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Check className="w-5 h-5 text-[#C8B273]" />
            <h5 className="text-white font-bold text-lg font-audiowide">WHAT'S INCLUDED</h5>
          </div>
          <ul className="space-y-2 text-white/80 text-sm">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#C8B273] flex-shrink-0 mt-0.5" />
              <span>Supervised open gym by professional staff</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#C8B273] flex-shrink-0 mt-0.5" />
              <span>4 hours of flexible practice time per session</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#C8B273] flex-shrink-0 mt-0.5" />
              <span>Access to full court and all facilities</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#C8B273] flex-shrink-0 mt-0.5" />
              <span>Work on individual skills at your own pace</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#C8B273] flex-shrink-0 mt-0.5" />
              <span>Play pickup games with other athletes</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#C8B273] flex-shrink-0 mt-0.5" />
              <span>All training equipment & basketballs provided</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#C8B273] flex-shrink-0 mt-0.5" />
              <span>Ages 7-18 welcome</span>
            </li>
          </ul>
        </div>

        {/* Important Info */}
        <div className="bg-black/50 border border-white/20 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-[#C8B273]" />
            <h5 className="text-white font-bold font-audiowide">IMPORTANT INFORMATION</h5>
          </div>
          <ul className="space-y-2 text-white/70 text-sm">
            <li>• Each session is 4 hours of supervised open gym (4:30 PM - 8:30 PM)</li>
            <li>• {isFullProgram ? 'Full program includes both remaining Monday sessions (Nov 17 & 24)' : 'Drop-in available for any scheduled session date'}</li>
            <li>• 24-hour notice required for cancellations or rescheduling</li>
            <li>• {isFullProgram ? 'All sales are final, but spots can be transferred' : 'Single session fee is non-refundable'}</li>
            <li>• Parent/guardian may observe from designated viewing area</li>
            <li>• Players should bring water bottle and wear appropriate athletic attire</li>
            <li>• Ages 7-18 welcome to participate</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-6">
        <Button
          onClick={prevStep}
          variant="outline"
          className="border-[#C8B273]/50 !text-white !bg-transparent hover:bg-[#C8B273]/10 px-8 py-6 text-lg rounded-none"
        >
          Back
        </Button>
        <Button
          onClick={nextStep}
          className="bg-[#C8B273] hover:bg-[#B8A263] text-black font-bold px-12 py-6 text-lg rounded-none"
        >
          Continue to Date Selection
        </Button>
      </div>
    </div>
  )
}
