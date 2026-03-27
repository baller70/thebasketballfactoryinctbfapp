'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FileText, Shield, AlertCircle, Lock, Loader2, ExternalLink } from 'lucide-react'
import { ProgramBookingData } from './program-booking-wizard'
import toast from 'react-hot-toast'

interface StepSixProps {
  bookingData: ProgramBookingData
  updateBookingData: (data: Partial<ProgramBookingData>) => void
  nextStep: () => void
  prevStep: () => void
}

export default function StepSix({ bookingData, updateBookingData, nextStep, prevStep }: StepSixProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [agreementChecked, setAgreementChecked] = useState(bookingData.agreementSigned)
  const [liabilityChecked, setLiabilityChecked] = useState(false)
  const [photoChecked, setPhotoChecked] = useState(false)

  const isFree = bookingData.pricingInfo.price === 0 || bookingData.pricingInfo.programFee === 0

  const handlePayment = async () => {
    if (!agreementChecked || !liabilityChecked || !photoChecked) {
      toast.error('Please agree to all terms and conditions')
      return
    }

    setIsProcessing(true)

    try {
      // Step 1: Create booking record
      const bookingResponse = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingData,
          isFreeProgram: isFree,
          agreementSigned: true,
        }),
      })

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json()
        throw new Error(errorData.error || 'Failed to create booking')
      }

      const bookingResult = await bookingResponse.json()
      const bookingId = bookingResult.bookingId

      // Free programs: skip payment, go to confirmation
      if (isFree || !bookingResult.needsPayment) {
        updateBookingData({ agreementSigned: true })
        toast.success('Registration confirmed!')
        nextStep()
        return
      }

      // Step 2: Create Stripe Checkout Session
      const checkoutResponse = await fetch('/api/bookings/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      })

      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const { checkoutUrl } = await checkoutResponse.json()

      // Step 3: Redirect to Stripe Checkout
      toast.success('Redirecting to secure payment...')
      window.location.href = checkoutUrl
    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error(error.message || 'Something went wrong. Please try again or contact us at (973) 240-8759')
      setIsProcessing(false)
    }
  }

  const allAgreed = agreementChecked && liabilityChecked && photoChecked

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4 font-audiowide uppercase">
          AGREEMENT & <span className="text-tbf-gold">{isFree ? 'REGISTRATION' : 'PAYMENT'}</span>
        </h3>
        <p className="text-white/80 max-w-2xl mx-auto">
          {isFree
            ? 'Please review and agree to our terms below to complete your free registration.'
            : 'Please review and agree to our terms, then complete your payment securely through Stripe.'}
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Terms and Conditions */}
        <div className="bg-black/50 border border-tbf-gold/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-tbf-gold" />
            <h4 className="text-white font-bold text-lg font-audiowide uppercase">PROGRAM TERMS & CANCELLATION POLICY</h4>
          </div>

          <div className="bg-black rounded border border-white/20 p-6 max-h-64 overflow-y-auto space-y-4 text-white/80 text-sm leading-relaxed">
            <div>
              <h5 className="font-bold text-white mb-2">1. Registration & Payment</h5>
              <p>Full payment is required at the time of registration. Spots are not guaranteed until payment is received. All fees are non-refundable unless the program is cancelled by The Basketball Factory.</p>
            </div>
            <div>
              <h5 className="font-bold text-white mb-2">2. Attendance & Punctuality</h5>
              <p>Players are expected to arrive 10 minutes before their scheduled session. Late arrivals may result in shortened session time. Consistent attendance is required for skill development.</p>
            </div>
            <div>
              <h5 className="font-bold text-white mb-2">3. Cancellation Policy</h5>
              <p>Cancellations made 7+ days before program start: full refund minus processing fees. Cancellations within 7 days: 50% refund. No refunds after program begins. Missed sessions cannot be made up or refunded.</p>
            </div>
            <div>
              <h5 className="font-bold text-white mb-2">4. Weather & Facility Closures</h5>
              <p>In the event of facility closure due to weather or emergency, affected sessions will be rescheduled at no additional cost.</p>
            </div>
            <div>
              <h5 className="font-bold text-white mb-2">5. Code of Conduct</h5>
              <p>All participants must demonstrate good sportsmanship and respect for coaches, staff, and fellow players. The Basketball Factory reserves the right to dismiss any participant whose behavior is disruptive, without refund.</p>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={agreementChecked}
              onCheckedChange={(checked) => setAgreementChecked(checked === true)}
              className="mt-1 border-tbf-gold data-[state=checked]:bg-tbf-gold data-[state=checked]:text-black"
            />
            <label htmlFor="terms" className="text-white/90 text-sm cursor-pointer">
              I have read and agree to the Program Terms and Cancellation Policy outlined above.
            </label>
          </div>
        </div>

        {/* Liability Waiver */}
        <div className="bg-black/50 border border-tbf-gold/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-tbf-gold" />
            <h4 className="text-white font-bold text-lg font-audiowide uppercase">LIABILITY WAIVER</h4>
          </div>

          <div className="bg-black rounded border border-white/20 p-6 max-h-48 overflow-y-auto space-y-3 text-white/80 text-sm leading-relaxed">
            <p>I, the undersigned parent/legal guardian, acknowledge that basketball training involves physical activity and carries inherent risks of injury. I agree to release, waive, and discharge The Basketball Factory, Kevin Houston, and all associated staff from any liability for injuries sustained during training sessions.</p>
            <p>I confirm that my child is physically capable of participating and I authorize staff to seek emergency medical treatment if I cannot be reached.</p>
          </div>

          <div className="mt-6 flex items-start gap-3">
            <Checkbox
              id="waiver"
              checked={liabilityChecked}
              onCheckedChange={(checked) => setLiabilityChecked(checked === true)}
              className="mt-1 border-tbf-gold data-[state=checked]:bg-tbf-gold data-[state=checked]:text-black"
            />
            <label htmlFor="waiver" className="text-white/90 text-sm cursor-pointer">
              I have read and agree to the Liability Waiver. I assume responsibility for any risks associated with my child&apos;s participation.
            </label>
          </div>
        </div>

        {/* Photo Release */}
        <div className="bg-tbf-gold/10 border border-tbf-gold/30 rounded-lg p-6">
          <h4 className="text-white font-bold mb-3 font-audiowide uppercase">PHOTO/VIDEO RELEASE</h4>
          <p className="text-white/80 text-sm mb-4">
            The Basketball Factory may capture photos and videos during sessions for promotional purposes on our website and social media.
          </p>
          <div className="flex items-start gap-3">
            <Checkbox
              id="photo"
              checked={photoChecked}
              onCheckedChange={(checked) => setPhotoChecked(checked === true)}
              className="mt-1 border-tbf-gold data-[state=checked]:bg-tbf-gold data-[state=checked]:text-black"
            />
            <label htmlFor="photo" className="text-white/90 text-sm cursor-pointer">
              I grant permission for The Basketball Factory to use photos and videos of my child for promotional purposes.
            </label>
          </div>
        </div>

        {/* Payment Section (only for paid programs) */}
        {!isFree && (
          <div className="bg-gradient-to-b from-gray-900 to-black border-2 border-tbf-gold/30 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-tbf-gold" />
              <h4 className="text-white font-bold text-lg font-audiowide uppercase">SECURE CHECKOUT</h4>
            </div>

            {/* Order Summary */}
            <div className="bg-black/50 border border-white/20 rounded-lg p-4 mb-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/80">
                  <span>Program Fee:</span>
                  <span className="font-semibold text-white">${bookingData.pricingInfo.programFee?.toFixed(2) || bookingData.pricingInfo.price.toFixed(2)}</span>
                </div>
                {bookingData.pricingInfo.processingFee ? (
                  <div className="flex justify-between text-white/80">
                    <span>Processing Fee:</span>
                    <span className="font-semibold text-white">${bookingData.pricingInfo.processingFee.toFixed(2)}</span>
                  </div>
                ) : null}
                <div className="border-t border-tbf-gold/30 pt-2 mt-2">
                  <div className="flex justify-between text-white text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-tbf-gold">${bookingData.pricingInfo.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-3">
              <div className="bg-black/50 border border-white/20 rounded-lg p-4">
                <Lock className="w-8 h-8 text-tbf-gold mx-auto mb-2" />
                <p className="text-white/90 text-sm mb-1">
                  You&apos;ll be redirected to <strong className="text-tbf-gold">Stripe&apos;s secure payment page</strong>.
                </p>
                <p className="text-white/60 text-xs">
                  We never see or store your card information.
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-white/50">
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-tbf-gold" />
                  <span>256-bit SSL</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-tbf-gold" />
                  <span>PCI Compliant</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Electronic Signature Notice */}
        <div className="bg-black/30 border border-white/20 rounded-lg p-4">
          <p className="text-white/70 text-xs text-center">
            By clicking the button below, you are providing your electronic signature and agreeing to all checked items above.
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-6">
        <Button
          onClick={prevStep}
          variant="outline"
          disabled={isProcessing}
          className="border-tbf-gold/50 !text-white !bg-transparent hover:bg-tbf-gold/10 px-8 py-6 text-lg rounded-none"
        >
          Back
        </Button>
        <Button
          onClick={handlePayment}
          disabled={!allAgreed || isProcessing}
          className="bg-tbf-gold-bright hover:bg-tbf-gold-bright/90 text-black font-bold px-12 py-6 text-lg rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : isFree ? (
            'Complete Registration'
          ) : (
            <>
              Pay ${bookingData.pricingInfo.price.toFixed(2)} with Stripe
              <ExternalLink className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
