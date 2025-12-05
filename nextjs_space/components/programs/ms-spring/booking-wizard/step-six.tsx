
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FileText, CreditCard, Shield, AlertCircle } from 'lucide-react'
import { ProgramBookingData } from './program-booking-wizard'

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

  const handlePayment = async () => {
    if (!agreementChecked || !liabilityChecked || !photoChecked) {
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
          lessonType: bookingData.sessionOption === 'full-program' ? 'Full Program (8 Weeks)' : 'Single Session Drop-In'
        })
      })

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json()
        throw new Error(errorData.error || 'Failed to create booking')
      }

      const bookingResult = await bookingResponse.json()
      const bookingId = bookingResult.bookingId

      // Step 2: Process payment
      const paymentResponse = await fetch('/api/bookings/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: bookingData.pricingInfo.price,
          bookingId: bookingId,
          customerEmail: bookingData.parentEmail,
          customerName: bookingData.parentName
        })
      })

      if (!paymentResponse.ok) {
        throw new Error('Payment processing failed')
      }

      const paymentResult = await paymentResponse.json()
      
      updateBookingData({ 
        agreementSigned: true,
        paymentIntentId: paymentResult.paymentIntentId,
        bookingId: bookingId
      })
      
      setIsProcessing(false)
      nextStep()
    } catch (error) {
      console.error('Payment error:', error)
      alert(error instanceof Error ? error.message : 'Payment processing failed. Please try again.')
      setIsProcessing(false)
    }
  }

  const allChecked = agreementChecked && liabilityChecked && photoChecked

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold !text-white bg-transparent mb-4 font-audiowide">
          AGREEMENT & <span className="text-[#C8B273]">PAYMENT</span>
        </h3>
        <p className="!text-white bg-transparent/80 max-w-2xl mx-auto">
          Please review and agree to the program terms, then complete your payment to secure your registration.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Registration Summary */}
        <div className="bg-gradient-to-br from-black via-gray-900 to-black border-2 border-[#C8B273] rounded-lg p-6">
          <h4 className="!text-white bg-transparent font-bold text-xl font-audiowide mb-4">REGISTRATION SUMMARY</h4>
          <div className="space-y-3 !text-white bg-transparent/80">
            <div className="flex justify-between">
              <span>Program:</span>
              <span className="font-semibold !text-white bg-transparent">
                {bookingData.sessionOption === 'full-program' ? 'Full Program (8 Weeks)' : 'Single Session Drop-In'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Player:</span>
              <span className="font-semibold !text-white bg-transparent">{bookingData.playerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Parent/Guardian:</span>
              <span className="font-semibold !text-white bg-transparent">{bookingData.parentName}</span>
            </div>
            <div className="border-t border-[#C8B273]/30 pt-3 mt-3 space-y-2">
              {/* Price Breakdown */}
              {bookingData.pricingInfo.programFee && (
                <>
                  <div className="flex justify-between">
                    <span>Program Fee:</span>
                    <span className="!text-white bg-transparent">${bookingData.pricingInfo.programFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Credit Card Processing Fee:</span>
                    <span className="!text-white bg-transparent">${bookingData.pricingInfo.processingFee?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="border-t border-[#C8B273]/20 pt-2"></div>
                </>
              )}
              <div className="flex justify-between text-lg">
                <span className="font-bold !text-white bg-transparent">Total Amount:</span>
                <span className="font-bold text-[#C8B273]">${bookingData.pricingInfo.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Agreements */}
        <div className="bg-black/50 border border-white/20 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-[#C8B273]" />
            <h5 className="!text-white bg-transparent font-bold font-audiowide">TERMS & CONDITIONS</h5>
          </div>

          <div className="space-y-4">
            {/* Program Agreement */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="agreement"
                checked={agreementChecked}
                onCheckedChange={(checked) => {
                  setAgreementChecked(checked as boolean)
                  updateBookingData({ agreementSigned: checked as boolean })
                }}
                className="mt-1 border-white/30 data-[state=checked]:bg-[#C8B273] data-[state=checked]:border-[#C8B273]"
              />
              <label htmlFor="agreement" className="!text-white bg-transparent/80 text-sm cursor-pointer">
                I agree to the program terms and conditions including the 24-hour cancellation policy. 
                I understand that {bookingData.sessionOption === 'full-program' ? 'the full program fee is non-refundable but transferable' : 'single session fees are non-refundable'}.
              </label>
            </div>

            {/* Liability Waiver */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="liability"
                checked={liabilityChecked}
                onCheckedChange={(checked) => setLiabilityChecked(checked as boolean)}
                className="mt-1 border-white/30 data-[state=checked]:bg-[#C8B273] data-[state=checked]:border-[#C8B273]"
              />
              <label htmlFor="liability" className="!text-white bg-transparent/80 text-sm cursor-pointer">
                I hereby waive and release The Basketball Factory, Kevin Houston, and all staff from any liability 
                for injuries or accidents that may occur during training sessions. I confirm that my child is physically 
                fit to participate in basketball activities.
              </label>
            </div>

            {/* Photo Release */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="photo"
                checked={photoChecked}
                onCheckedChange={(checked) => setPhotoChecked(checked as boolean)}
                className="mt-1 border-white/30 data-[state=checked]:bg-[#C8B273] data-[state=checked]:border-[#C8B273]"
              />
              <label htmlFor="photo" className="!text-white bg-transparent/80 text-sm cursor-pointer">
                I grant permission for The Basketball Factory to use photos and videos of my child taken during 
                training sessions for promotional purposes on social media and marketing materials.
              </label>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-gradient-to-br from-black via-gray-900 to-black border-2 border-[#C8B273]/30 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-[#C8B273]" />
            <h5 className="!text-white bg-transparent font-bold font-audiowide">SECURE PAYMENT</h5>
          </div>

          <div className="bg-[#C8B273]/10 border border-[#C8B273]/30 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#C8B273] flex-shrink-0 mt-0.5" />
              <div>
                <p className="!text-white bg-transparent font-semibold mb-1">Secure Payment Processing</p>
                <p className="!text-white bg-transparent/70 text-sm">
                  Your payment is processed securely through Stripe. We never store your credit card information.
                </p>
              </div>
            </div>
          </div>

          {!allChecked && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-500 text-sm">
                  Please review and agree to all terms and conditions above before proceeding with payment.
                </p>
              </div>
            </div>
          )}

          <Button
            onClick={handlePayment}
            disabled={!allChecked || isProcessing}
            className="w-full bg-[#C8B273] hover:bg-[#B8A263] text-black font-bold py-6 text-lg rounded-none disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                Processing Payment...
              </span>
            ) : (
              `Pay $${bookingData.pricingInfo.price.toFixed(2)} & Complete Registration`
            )}
          </Button>

          <p className="!text-white bg-transparent/60 text-center text-xs mt-3">
            By clicking the button above, you agree to charge the amount shown to your payment method
          </p>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <Button
          onClick={prevStep}
          disabled={isProcessing}
          variant="outline"
          className="border-[#C8B273]/50 !text-white bg-transparent hover:bg-[#C8B273]/10 px-8 py-6 text-lg rounded-none"
        >
          Back
        </Button>
      </div>
    </div>
  )
}
