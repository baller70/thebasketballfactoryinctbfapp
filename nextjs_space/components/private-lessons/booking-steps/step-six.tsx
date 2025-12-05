
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreditCard, Lock, Loader2 } from 'lucide-react'
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
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [nameOnCard, setNameOnCard] = useState('')

  const isElite = bookingData.lessonType === 'elite'

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
    if (!cardNumber || !expiryDate || !cvv || !nameOnCard) {
      toast.error('Please fill in all payment details')
      return
    }

    setIsProcessing(true)

    try {
      // Create booking in database
      const bookingResponse = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingData,
          cardLast4: cardNumber.slice(-4)
        })
      })

      if (!bookingResponse.ok) {
        throw new Error('Failed to create booking')
      }

      const { bookingId } = await bookingResponse.json()

      // Process payment if not elite package
      if (!isElite) {
        const paymentResponse = await fetch('/api/bookings/process-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: bookingData.pricingInfo.price,
            bookingId,
            email: bookingData.email,
            customerName: bookingData.parentName
          })
        })

        if (!paymentResponse.ok) {
          throw new Error('Payment processing failed')
        }

        const { paymentIntentId } = await paymentResponse.json()
        updateBookingData({ paymentIntentId })
      }

      // Success!
      toast.success('Payment processed successfully!')
      nextStep()
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment failed. Please try again or contact us at (973) 240-8759')
    } finally {
      setIsProcessing(false)
    }
  }

  const isFormValid = cardNumber.replace(/\s/g, '').length === 16 &&
    expiryDate.length === 5 &&
    cvv.length >= 3 &&
    nameOnCard.length > 0

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold !text-white bg-transparent mb-4 font-audiowide uppercase">
          SECURE <span className="text-tbf-gold">PAYMENT</span>
        </h3>
        <p className="!text-white bg-transparent/80 max-w-2xl mx-auto">
          {isElite 
            ? 'Complete your contact information to schedule a consultation call. No payment required at this time.'
            : 'Complete your booking with a secure payment. Your information is encrypted and protected.'
          }
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Order Summary */}
        <div className="bg-gradient-to-br from-black via-gray-900 to-black border-2 border-tbf-gold rounded-lg p-6 mb-6">
          <h4 className="!text-white bg-transparent font-bold text-lg mb-4 font-audiowide uppercase">ORDER SUMMARY</h4>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between !text-white bg-transparent/80">
              <span>Package:</span>
              <span className="font-semibold !text-white bg-transparent">
                {bookingData.lessonType === 'individual' && 'Individual Session'}
                {bookingData.lessonType === '10-pack' && '10-Pack Lessons'}
                {bookingData.lessonType === '20-pack' && '20-Pack Lessons'}
                {bookingData.lessonType === 'elite' && 'All-Inclusive Elite'}
              </span>
            </div>

            <div className="flex justify-between !text-white bg-transparent/80">
              <span>Athlete:</span>
              <span className="font-semibold !text-white bg-transparent">{bookingData.athleteName}, Age {bookingData.athleteAge}</span>
            </div>

            <div className="flex justify-between !text-white bg-transparent/80">
              <span>Parent/Guardian:</span>
              <span className="font-semibold !text-white bg-transparent">{bookingData.parentName}</span>
            </div>

            <div className="flex justify-between !text-white bg-transparent/80">
              <span>Contact:</span>
              <span className="font-semibold !text-white bg-transparent">{bookingData.email}</span>
            </div>

            {!isElite && (
              <>
                <div className="border-t border-tbf-gold/30 pt-3 mt-3">
                  <p className="!text-white bg-transparent/70 text-xs mb-2">Scheduled Sessions:</p>
                  {bookingData.selectedDates.map((date, index) => (
                    <div key={index} className="flex justify-between !text-white bg-transparent/80 text-xs mb-1">
                      <span>Session {index + 1}:</span>
                      <span className="font-semibold !text-white bg-transparent">
                        {format(date, 'MMM d, yyyy')} at {bookingData.selectedTimes[index]}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-tbf-gold/30 pt-3 mt-3">
                  <div className="flex justify-between !text-white bg-transparent text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-tbf-gold">${bookingData.pricingInfo.price}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payment Form */}
        {isElite ? (
          <div className="bg-tbf-gold/10 border border-tbf-gold/30 rounded-lg p-8 text-center">
            <CreditCard className="w-16 h-16 text-tbf-gold mx-auto mb-4" />
            <h4 className="!text-white bg-transparent font-bold text-xl mb-3 font-audiowide uppercase">NO PAYMENT REQUIRED</h4>
            <p className="!text-white bg-transparent/80 mb-4">
              The All-Inclusive Elite package is fully customized. After you click "Confirm Booking" below, 
              we'll contact you within 24 hours to schedule a consultation call where we'll discuss your 
              athlete's specific needs and create a custom training plan with pricing.
            </p>
            <p className="text-tbf-gold font-semibold text-sm">
              You're just one click away from getting started!
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-b from-gray-900 to-black border-2 border-tbf-gold/30 rounded-lg p-8">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-tbf-gold" />
              <h4 className="!text-white bg-transparent font-bold text-lg font-audiowide uppercase">PAYMENT DETAILS</h4>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="nameOnCard" className="!text-white bg-transparent/90 mb-2 block">
                  Name on Card <span className="text-tbf-gold">*</span>
                </Label>
                <Input
                  id="nameOnCard"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                  placeholder="John Smith"
                  className="bg-black/50 border-tbf-gold/30 !text-white bg-transparent focus:border-tbf-gold h-12"
                />
              </div>

              <div>
                <Label htmlFor="cardNumber" className="!text-white bg-transparent/90 mb-2 block">
                  Card Number <span className="text-tbf-gold">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    className="bg-black/50 border-tbf-gold/30 !text-white bg-transparent focus:border-tbf-gold h-12 pr-12"
                  />
                  <CreditCard className="w-5 h-5 text-tbf-gold/50 absolute right-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate" className="!text-white bg-transparent/90 mb-2 block">
                    Expiry Date <span className="text-tbf-gold">*</span>
                  </Label>
                  <Input
                    id="expiryDate"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    className="bg-black/50 border-tbf-gold/30 !text-white bg-transparent focus:border-tbf-gold h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="cvv" className="!text-white bg-transparent/90 mb-2 block">
                    CVV <span className="text-tbf-gold">*</span>
                  </Label>
                  <Input
                    id="cvv"
                    type="password"
                    value={cvv}
                    onChange={handleCvvChange}
                    placeholder="123"
                    className="bg-black/50 border-tbf-gold/30 !text-white bg-transparent focus:border-tbf-gold h-12"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 bg-black/50 border border-white/20 rounded p-4">
              <div className="flex items-start gap-2 text-xs !text-white bg-transparent/60">
                <Lock className="w-4 h-4 text-tbf-gold flex-shrink-0 mt-0.5" />
                <p>
                  Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data. 
                  Your card will be charged ${bookingData.pricingInfo.price} today.
                </p>
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
          className="border-tbf-gold/50 !text-white bg-transparent hover:bg-tbf-gold/10 px-8 py-6 text-lg rounded-none"
        >
          Back
        </Button>
        <Button
          onClick={handlePayment}
          disabled={!isElite && (!isFormValid || isProcessing)}
          className="bg-tbf-gold-bright hover:bg-tbf-gold-bright/90 text-black font-bold px-12 py-6 text-lg rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            isElite ? 'Confirm Booking' : `Pay $${bookingData.pricingInfo.price}`
          )}
        </Button>
      </div>
    </div>
  )
}
