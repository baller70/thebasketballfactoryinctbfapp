
'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle, Calendar, Mail, Phone, MapPin, Download, Share2 } from 'lucide-react'
import { ProgramBookingData } from './program-booking-wizard'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'

interface StepSevenProps {
  bookingData: ProgramBookingData
}

export default function StepSeven({ bookingData }: StepSevenProps) {
  useEffect(() => {
    // Trigger confetti animation on mount
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#C8B273', '#FFD700', '#FFFFFF']
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#C8B273', '#FFD700', '#FFFFFF']
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  const handleDownloadReceipt = () => {
    if (bookingData.bookingId) {
      // Open receipt in new window for printing/saving as PDF
      const receiptUrl = `/api/bookings/receipt?bookingId=${bookingData.bookingId}`
      window.open(receiptUrl, '_blank')
    } else {
      alert('Receipt information not available. Please contact us at (973) 240-8759')
    }
  }

  const handleShareProgram = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Youth Skills Youth Skills Camp Development Training Camp - The Basketball Factory',
        text: 'I just registered for The Basketball Factory\'s Youth Skills Youth Skills Camp Development Training Camp program!',
        url: window.location.href
      })
    } else {
      alert('Share functionality would be implemented here')
    }
  }

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-[#C8B273] rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="w-12 h-12 text-black" />
          </div>
        </div>
        <h3 className="text-4xl font-bold text-white mb-4 font-audiowide">
          REGISTRATION <span className="text-[#C8B273]">CONFIRMED!</span>
        </h3>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Congratulations! {bookingData.playerName} is officially registered for the Youth Skills Youth Skills Camp Development Training Camp program. 
          We're excited to help them take their game to the next level!
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Confirmation Details */}
        <div className="bg-gradient-to-br from-black via-gray-900 to-black border-2 border-[#C8B273] rounded-lg p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-white font-bold font-audiowide mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#C8B273]" />
                PROGRAM DETAILS
              </h5>
              <div className="space-y-2 text-white/80 text-sm">
                <p><span className="text-white font-semibold">Program:</span> {bookingData.sessionOption === 'full-program' ? 'Full Program (8 Weeks)' : 'Single Session Drop-In'}</p>
                <p><span className="text-white font-semibold">Sessions:</span> {bookingData.pricingInfo.sessionCount} sessions</p>
                <p><span className="text-white font-semibold">Amount Paid:</span> <span className="text-[#C8B273] font-bold">${bookingData.pricingInfo.price}</span></p>
                <p><span className="text-white font-semibold">Confirmation #:</span> {bookingData.paymentIntentId?.toUpperCase()}</p>
              </div>
            </div>

            <div>
              <h5 className="text-white font-bold font-audiowide mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#C8B273]" />
                CONTACT INFO
              </h5>
              <div className="space-y-2 text-white/80 text-sm">
                <p><span className="text-white font-semibold">Player:</span> {bookingData.playerName}</p>
                <p><span className="text-white font-semibold">Parent:</span> {bookingData.parentName}</p>
                <p><span className="text-white font-semibold">Email:</span> {bookingData.parentEmail}</p>
                <p><span className="text-white font-semibold">Phone:</span> {bookingData.parentPhone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-[#C8B273]/10 border border-[#C8B273]/30 rounded-lg p-6">
          <h5 className="text-white font-bold text-lg font-audiowide mb-4">WHAT HAPPENS NEXT?</h5>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#C8B273] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-black font-bold text-xs">1</span>
              </div>
              <div>
                <p className="text-white font-semibold">Confirmation Email</p>
                <p className="text-white/70 text-sm">You'll receive a detailed confirmation email within the next few minutes at {bookingData.parentEmail}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#C8B273] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-black font-bold text-xs">2</span>
              </div>
              <div>
                <p className="text-white font-semibold">Program Welcome Packet</p>
                <p className="text-white/70 text-sm">A welcome packet with program details, what to bring, and facility information will be sent 48 hours before the first session</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#C8B273] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-black font-bold text-xs">3</span>
              </div>
              <div>
                <p className="text-white font-semibold">First Day</p>
                <p className="text-white/70 text-sm">Arrive 15 minutes early on the first day for check-in and to meet Coach Kevin Houston</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Reminders */}
        <div className="bg-black/50 border border-white/20 rounded-lg p-6">
          <h5 className="text-white font-bold text-lg font-audiowide mb-4">IMPORTANT REMINDERS</h5>
          <ul className="space-y-2 text-white/70 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[#C8B273] font-bold">•</span>
              <span>Session times vary by program - check your confirmation email for details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C8B273] font-bold">•</span>
              <span>Players should wear athletic attire and bring a water bottle</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C8B273] font-bold">•</span>
              <span>All equipment and basketballs are provided</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C8B273] font-bold">•</span>
              <span>Parent/guardian viewing area is available</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C8B273] font-bold">•</span>
              <span>24-hour notice required for cancellations or rescheduling</span>
            </li>
          </ul>
        </div>

        {/* Location Info */}
        <div className="bg-gradient-to-br from-black via-gray-900 to-black border-2 border-[#C8B273]/30 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-[#C8B273]" />
            <h5 className="text-white font-bold text-lg font-audiowide">FACILITY LOCATION</h5>
          </div>
          <p className="text-white/80 mb-2">The Basketball Factory</p>
          <p className="text-white/80 mb-4">38 Station Rd, Sparta, NJ 07871</p>
          <Button
            onClick={() => window.open('https://maps.google.com/?q=38+Station+Rd+Sparta+NJ+07871', '_blank')}
            variant="outline"
            className="border-[#C8B273] text-[#C8B273] hover:bg-[#C8B273] hover:text-black rounded-none"
          >
            Get Directions
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleDownloadReceipt}
            variant="outline"
            className="flex-1 border-[#C8B273] text-[#C8B273] hover:bg-[#C8B273] hover:text-black rounded-none py-6"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Receipt
          </Button>
          <Button
            onClick={handleShareProgram}
            variant="outline"
            className="flex-1 border-[#C8B273] text-[#C8B273] hover:bg-[#C8B273] hover:text-black rounded-none py-6"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share with Friends
          </Button>
        </div>

        {/* Contact Support */}
        <div className="text-center">
          <p className="text-white/60 text-sm mb-3">
            Questions about your registration? Need to make changes?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white/80 text-sm">
            <a href="mailto:khouston@thebasketballfactorynj.com" className="flex items-center gap-2 hover:text-[#C8B273] transition-colors">
              <Mail className="w-4 h-4" />
              khouston@thebasketballfactorynj.com
            </a>
            <a href="tel:+19732408759" className="flex items-center gap-2 hover:text-[#C8B273] transition-colors">
              <Phone className="w-4 h-4" />
              (973) 240-8759
            </a>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center pt-6">
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-[#C8B273] hover:bg-[#B8A263] text-black font-bold px-12 py-6 text-lg rounded-none"
          >
            Return to Homepage
          </Button>
        </div>
      </div>
    </div>
  )
}
