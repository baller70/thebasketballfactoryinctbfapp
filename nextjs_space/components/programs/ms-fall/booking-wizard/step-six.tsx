
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { FileText, CreditCard, Shield, AlertCircle, Lock, Loader2 } from 'lucide-react'
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
  
  // Payment form state
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [nameOnCard, setNameOnCard] = useState('')

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted)
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    if (formatted.replace('/', '').length <= 4) {
      setExpiryDate(formatted)
    }
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/gi, '')
    if (value.length <= 4) {
      setCvv(value)
    }
  }

  const handlePayment = async () => {
    if (!agreementChecked || !liabilityChecked || !photoChecked) {
      toast.error('Please agree to all terms and conditions')
      return
    }

    if (!cardNumber || !expiryDate || !cvv || !nameOnCard) {
      toast.error('Please fill in all payment details')
      return
    }

    setIsProcessing(true)

    try {
      console.log('Creating booking with data:', bookingData)
      
      // Create booking in database
      const bookingResponse = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingData,
          cardLast4: cardNumber.slice(-4),
          agreementSigned: true
        })
      })

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json()
        throw new Error(errorData.error || 'Failed to create booking')
      }

      const { bookingId } = await bookingResponse.json()
      console.log('Booking created with ID:', bookingId)

      // Process payment
      const paymentResponse = await fetch('/api/bookings/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: bookingData.pricingInfo.price,
          bookingId,
          email: bookingData.parentEmail,
          customerName: bookingData.parentName
        })
      })

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json()
        throw new Error(errorData.error || 'Payment processing failed')
      }

      const { paymentIntentId } = await paymentResponse.json()
      console.log('Payment successful:', paymentIntentId)
      
      updateBookingData({ 
        agreementSigned: true,
        paymentIntentId,
        bookingId
      })

      // Success!
      toast.success('Payment processed successfully!')
      nextStep()
    } catch (error) {
      console.error('Payment error:', error)
      toast.error(error instanceof Error ? error.message : 'Payment failed. Please try again or contact us at (973) 240-8759')
    } finally {
      setIsProcessing(false)
    }
  }

  const allChecked = agreementChecked && liabilityChecked && photoChecked
  const isPaymentFormValid = cardNumber.replace(/\s/g, '').length === 16 &&
    expiryDate.length === 5 &&
    cvv.length >= 3 &&
    nameOnCard.length > 0

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
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-[#C8B273]" />
            <h5 className="!text-white bg-transparent font-bold font-audiowide">PAYMENT DETAILS</h5>
          </div>

          {!allChecked && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-500 text-sm">
                  Please review and agree to all terms and conditions above before proceeding with payment.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="nameOnCard" className="!text-white bg-transparent/90 mb-2 block">
                Name on Card <span className="text-[#C8B273]">*</span>
              </Label>
              <Input
                id="nameOnCard"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                placeholder="John Smith"
                disabled={!allChecked}
                className="bg-black/50 border-[#C8B273]/30 !text-white bg-transparent focus:border-[#C8B273] h-12 disabled:opacity-50"
              />
            </div>

            <div>
              <Label htmlFor="cardNumber" className="!text-white bg-transparent/90 mb-2 block">
                Card Number <span className="text-[#C8B273]">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  disabled={!allChecked}
                  className="bg-black/50 border-[#C8B273]/30 !text-white bg-transparent focus:border-[#C8B273] h-12 pr-12 disabled:opacity-50"
                />
                <CreditCard className="w-5 h-5 text-[#C8B273]/50 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate" className="!text-white bg-transparent/90 mb-2 block">
                  Expiry Date <span className="text-[#C8B273]">*</span>
                </Label>
                <Input
                  id="expiryDate"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  disabled={!allChecked}
                  className="bg-black/50 border-[#C8B273]/30 !text-white bg-transparent focus:border-[#C8B273] h-12 disabled:opacity-50"
                />
              </div>

              <div>
                <Label htmlFor="cvv" className="!text-white bg-transparent/90 mb-2 block">
                  CVV <span className="text-[#C8B273]">*</span>
                </Label>
                <Input
                  id="cvv"
                  type="password"
                  value={cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  disabled={!allChecked}
                  className="bg-black/50 border-[#C8B273]/30 !text-white bg-transparent focus:border-[#C8B273] h-12 disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#C8B273]/10 border border-[#C8B273]/30 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#C8B273] flex-shrink-0 mt-0.5" />
              <div>
                <p className="!text-white bg-transparent font-semibold mb-1">Secure Payment Processing</p>
                <p className="!text-white bg-transparent/70 text-sm">
                  Your payment is processed securely through Stripe. We never store your credit card information.
                  Your card will be charged ${bookingData.pricingInfo.price.toFixed(2)} today.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handlePayment}
            disabled={!allChecked || !isPaymentFormValid || isProcessing}
            className="w-full bg-[#C8B273] hover:bg-[#B8A263] text-black font-bold py-6 text-lg rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2 justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
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
