'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CreditCard, Lock, Loader2, Shield, ExternalLink } from 'lucide-react'
import { BookingData } from '../booking-wizard'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

interface StepSixProps {
  bookingData: BookingData
  updateBookingData: (data: Partial<BookingData>) => void
  nextStep: () => void
  prevStep: () => void
}

export default function StepSix({ bookingData, updateBookingData, nextStep, prevStep }: StepSixProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const isElite = bookingData.lessonType === 'elite'

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      const bookingResponse = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonType: bookingData.lessonType,
          selectedDates: bookingData.selectedDates,
          selectedTimes: bookingData.selectedTimes,
          parentName: bookingData.parentName,
          email: bookingData.email,
          phone: bookingData.phone,
          athleteName: bookingData.athleteName,
          athleteAge: bookingData.athleteAge,
          skillLevel: bookingData.skillLevel,
          notes: bookingData.notes,
          agreementSigned: bookingData.agreementSigned,
        }),
      })

      if (!bookingResponse.ok) {
        const err = await bookingResponse.json()
        throw new Error(err.error || 'Failed to create booking')
      }

      const { bookingId, needsPayment } = await bookingResponse.json()

      if (isElite || !needsPayment) {
        toast.success('Booking request submitted!')
        nextStep()
        return
      }

      const checkoutResponse = await fetch('/api/bookings/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      })

      if (!checkoutResponse.ok) {
        const err = await checkoutResponse.json()
        throw new Error(err.error || 'Failed to create checkout session')
      }

      const { checkoutUrl } = await checkoutResponse.json()

      toast.success('Redirecting to secure payment...')
      window.location.href = checkoutUrl
    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error(error.message || 'Something went wrong. Please try again or contact us at (973) 240-8759')
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4 font-audiowide uppercase">
          {isElite ? 'CONFIRM' : 'SECURE'} <span className="text-tbf-gold">{isElite ? 'BOOKING' : 'PAYMENT'}</span>
        </h3>
        <p className="text-white/80 max-w-2xl mx-auto">
          {isElite
            ? 'Review your details below and confirm your consultation request. No payment required at this time.'
            : 'Review your order below, then click to complete your payment securely through Stripe.'}
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Order Summary */}
        <div className="bg-gradient-to-br from-black via-gray-900 to-black border-2 border-tbf-gold rounded-lg p-6 mb-6">
          <h4 className="text-white font-bold text-lg mb-4 font-audiowide uppercase">ORDER SUMMARY</h4>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-white/80">
              <span>Package:</span>
              <span className="font-semibold text-white">
                {bookingData.lessonType === 'individual' && 'Individual Session'}
                {bookingData.lessonType === '10-pack' && '10-Pack Lessons'}
                {bookingData.lessonType === '20-pack' && '20-Pack Lessons'}
                {bookingData.lessonType === 'elite' && 'All-Inclusive Elite'}
              </span>
            </div>

            <div className="flex justify-between text-white/80">
              <span>Athlete:</span>
              <span className="font-semibold text-white">{bookingData.athleteName}, Age {bookingData.athleteAge}</span>
            </div>

            <div className="flex justify-between text-white/80">
              <span>Parent/Guardian:</span>
              <span className="font-semibold text-white">{bookingData.parentName}</span>
            </div>

            <div className="flex justify-between text-white/80">
              <span>Contact:</span>
              <span className="font-semibold text-white">{bookingData.email}</span>
            </div>

            {!isElite && (
              <>
                <div className="border-t border-tbf-gold/30 pt-3 mt-3">
                  <p className="text-white/70 text-xs mb-2">Scheduled Sessions:</p>
                  {bookingData.selectedDates.map((date, index) => (
                    <div key={index} className="flex justify-between text-white/80 text-xs mb-1">
                      <span>Session {index + 1}:</span>
                      <span className="font-semibold text-white">
                        {format(date, 'MMM d, yyyy')} at {bookingData.selectedTimes[index]}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-tbf-gold/30 pt-3 mt-3 space-y-2">
                  <div className="flex justify-between text-white/80">
                    <span>Subtotal:</span>
                    <span className="font-semibold">${bookingData.pricingInfo.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/60 text-xs">
                    <span>Processing Fee:</span>
                    <span className="font-semibold">${bookingData.pricingInfo.processingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white text-lg font-bold pt-2 border-t border-tbf-gold/30">
                    <span>Total:</span>
                    <span className="text-tbf-gold">${bookingData.pricingInfo.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payment Section */}
        {isElite ? (
          <div className="bg-tbf-gold/10 border border-tbf-gold/30 rounded-lg p-8 text-center">
            <CreditCard className="w-16 h-16 text-tbf-gold mx-auto mb-4" />
            <h4 className="text-white font-bold text-xl mb-3 font-audiowide uppercase">NO PAYMENT REQUIRED</h4>
            <p className="text-white/80 mb-4">
              The All-Inclusive Elite package is fully customized. After you click &quot;Confirm Booking&quot; below,
              we&apos;ll contact you within 24 hours to schedule a consultation call where we&apos;ll discuss your
              athlete&apos;s specific needs and create a custom training plan with pricing.
            </p>
            <p className="text-tbf-gold font-semibold text-sm">
              You&apos;re just one click away from getting started!
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-b from-gray-900 to-black border-2 border-tbf-gold/30 rounded-lg p-8">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-tbf-gold" />
              <h4 className="text-white font-bold text-lg font-audiowide uppercase">SECURE CHECKOUT</h4>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-black/50 border border-white/20 rounded-lg p-6">
                <Lock className="w-10 h-10 text-tbf-gold mx-auto mb-3" />
                <p className="text-white/90 text-sm mb-2">
                  You&apos;ll be redirected to <strong className="text-tbf-gold">Stripe&apos;s secure payment page</strong> to complete your purchase.
                </p>
                <p className="text-white/60 text-xs">
                  Your card details are entered directly on Stripe&apos;s PCI-compliant platform.
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
                <div className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-tbf-gold" />
                  <span>Powered by Stripe</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 pt-6">
        <Button
          onClick={prevStep}
          variant="outline"
          disabled={isProcessing}
          className="border-tbf-gold/50 text-white hover:bg-tbf-gold/10 px-8 py-6 text-lg rounded-none"
        >
          Back
        </Button>
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="bg-tbf-gold-bright hover:bg-tbf-gold-bright/90 text-black font-bold px-12 py-6 text-lg rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : isElite ? (
            'Confirm Booking'
          ) : (
            <>
              Pay ${bookingData.pricingInfo.totalPrice.toFixed(2)} with Stripe
              <ExternalLink className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
