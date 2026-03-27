
'use client'

import { Button } from '@/components/ui/button'
import { Check, Info } from 'lucide-react'
import { BookingData } from '../booking-wizard'

interface StepTwoProps {
  bookingData: BookingData
  nextStep: () => void
  prevStep: () => void
}

const packageNames = {
  individual: 'Individual Session',
  '10-pack': '10-Pack Lessons',
  '20-pack': '20-Pack Lessons',
  elite: 'All-Inclusive Elite'
}

export default function StepTwo({ bookingData, nextStep, prevStep }: StepTwoProps) {
  const { pricingInfo, lessonType } = bookingData
  const isElite = lessonType === 'elite'

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4 font-audiowide uppercase">
          REVIEW YOUR <span className="text-tbf-gold">PRICING</span>
        </h3>
        <p className="text-white/80 max-w-2xl mx-auto">
          Here's a detailed breakdown of your selected package. All prices include facility access, equipment, and expert instruction.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Selected Package Card */}
        <div className="bg-gradient-to-br from-black via-gray-900 to-black border-2 border-tbf-gold rounded-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-2xl font-bold text-white font-audiowide mb-2 uppercase">
                {packageNames[lessonType]}
              </h4>
              {!isElite && (
                <p className="text-white/60">
                  {pricingInfo.sessionCount} {pricingInfo.sessionCount === 1 ? 'session' : 'sessions'} included
                </p>
              )}
            </div>
            <div className="text-right">
              {isElite ? (
                <p className="text-2xl font-bold text-tbf-gold">Custom</p>
              ) : (
                <>
                  <p className="text-4xl font-bold text-tbf-gold">${pricingInfo.price}</p>
                  {pricingInfo.sessionCount > 1 && (
                    <p className="text-white/60 text-sm mt-1">
                      ${pricingInfo.pricePerSession} per session
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {!isElite && (
            <div className="border-t border-tbf-gold/30 pt-6">
              <div className="space-y-3">
                <div className="flex justify-between text-white/80">
                  <span>Base Price per Session:</span>
                  <span className="font-semibold">${pricingInfo.pricePerSession}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Number of Sessions:</span>
                  <span className="font-semibold">{pricingInfo.sessionCount}</span>
                </div>
                {pricingInfo.sessionCount > 1 && (
                  <div className="flex justify-between text-tbf-gold font-semibold">
                    <span>Your Savings:</span>
                    <span>${(85 * pricingInfo.sessionCount) - pricingInfo.price}</span>
                  </div>
                )}
                <div className="border-t border-tbf-gold/30 pt-3 mt-3">
                  <div className="flex justify-between text-white text-lg font-bold">
                    <span>Total Investment:</span>
                    <span className="text-tbf-gold">${pricingInfo.price}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* What's Included */}
        <div className="bg-tbf-gold/10 border border-tbf-gold/30 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Check className="w-5 h-5 text-tbf-gold" />
            <h5 className="text-white font-bold text-lg font-audiowide uppercase">WHAT'S INCLUDED</h5>
          </div>
          <ul className="space-y-2 text-white/80 text-sm">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-tbf-gold flex-shrink-0 mt-0.5" />
              <span>One-on-one training with Kevin Houston, 15+ years experience</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-tbf-gold flex-shrink-0 mt-0.5" />
              <span>Full facility access at 38 Station Rd, Sparta, NJ</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-tbf-gold flex-shrink-0 mt-0.5" />
              <span>All training equipment and basketballs provided</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-tbf-gold flex-shrink-0 mt-0.5" />
              <span>Personalized skill development plan</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-tbf-gold flex-shrink-0 mt-0.5" />
              <span>Progress tracking and assessment after each session</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-tbf-gold flex-shrink-0 mt-0.5" />
              <span>Email support between sessions for training questions</span>
            </li>
          </ul>
        </div>

        {/* Important Info */}
        {!isElite && (
          <div className="bg-black/50 border border-white/20 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-tbf-gold" />
              <h5 className="text-white font-bold font-audiowide uppercase">IMPORTANT INFORMATION</h5>
            </div>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>• Sessions are 60 minutes each, scheduled at your convenience</li>
              <li>• {lessonType === 'individual' ? 'Session must be used within 3 months' : lessonType === '10-pack' ? 'Package valid for 6 months from purchase' : 'Package valid for 1 year from purchase'}</li>
              <li>• 24-hour cancellation notice required for rescheduling</li>
              <li>• All sales are final, but sessions can be transferred or gifted</li>
              <li>• Parent/guardian may observe sessions from designated area</li>
            </ul>
          </div>
        )}

        {isElite && (
          <div className="bg-black/50 border border-white/20 rounded-lg p-6 text-center">
            <Info className="w-12 h-12 text-tbf-gold mx-auto mb-4" />
            <p className="text-white/80 text-sm mb-4">
              The All-Inclusive Elite package is fully customized to your athlete's goals and needs. 
              After completing this booking process, we'll schedule a consultation call to discuss 
              your specific requirements and provide a custom pricing proposal.
            </p>
            <p className="text-tbf-gold text-sm font-semibold">
              No payment required at this step - we'll finalize pricing together
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 pt-6">
        <Button
          onClick={prevStep}
          variant="outline"
          className="border-tbf-gold/50 text-white hover:bg-tbf-gold/10 px-8 py-6 text-lg rounded-none"
        >
          Back
        </Button>
        <Button
          onClick={nextStep}
          className="bg-tbf-gold-bright hover:bg-tbf-gold-bright/90 text-black font-bold px-12 py-6 text-lg rounded-none"
        >
          Continue to Date Selection
        </Button>
      </div>
    </div>
  )
}
