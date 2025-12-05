
'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle, Calendar, Mail, MapPin, Phone } from 'lucide-react'
import { BookingData } from '../booking-wizard'
import { format } from 'date-fns'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'

interface StepSevenProps {
  bookingData: BookingData
}

export default function StepSeven({ bookingData }: StepSevenProps) {
  const isElite = bookingData.lessonType === 'elite'

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFF', '#000']
    })
  }, [])

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-tbf-gold rounded-full mb-6 animate-bounce">
          <CheckCircle className="w-12 h-12 text-black" />
        </div>
        
        <h3 className="text-4xl font-bold text-white mb-4 font-audiowide uppercase">
          {isElite ? 'BOOKING REQUEST' : 'BOOKING'} <span className="text-tbf-gold">CONFIRMED!</span>
        </h3>
        
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          {isElite 
            ? `Thank you for your interest in our All-Inclusive Elite package, ${bookingData.parentName}! We'll contact you within 24 hours to schedule your consultation call.`
            : `Congratulations, ${bookingData.parentName}! Your private training sessions are confirmed. ${bookingData.athleteName} is on the path to basketball excellence!`
          }
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Booking Details */}
        <div className="bg-gradient-to-br from-black via-gray-900 to-black border-2 border-tbf-gold rounded-lg p-8">
          <h4 className="text-2xl font-bold text-white mb-6 font-audiowide uppercase">BOOKING DETAILS</h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/50 rounded p-4 border border-tbf-gold/30">
                <p className="text-white/60 text-sm mb-1">Package</p>
                <p className="text-white font-semibold">
                  {bookingData.lessonType === 'individual' && 'Individual Session'}
                  {bookingData.lessonType === '10-pack' && '10-Pack Lessons'}
                  {bookingData.lessonType === '20-pack' && '20-Pack Lessons'}
                  {bookingData.lessonType === 'elite' && 'All-Inclusive Elite'}
                </p>
              </div>

              <div className="bg-black/50 rounded p-4 border border-tbf-gold/30">
                <p className="text-white/60 text-sm mb-1">Athlete</p>
                <p className="text-white font-semibold">{bookingData.athleteName}</p>
                <p className="text-white/70 text-sm">Age {bookingData.athleteAge} • {bookingData.skillLevel}</p>
              </div>
            </div>

            {!isElite && (
              <div className="bg-black/50 rounded p-4 border border-tbf-gold/30">
                <p className="text-white/60 text-sm mb-3">Scheduled Sessions</p>
                <div className="space-y-2">
                  {bookingData.selectedDates.map((date, index) => (
                    <div key={index} className="flex items-center gap-3 text-white">
                      <Calendar className="w-4 h-4 text-tbf-gold" />
                      <span className="font-semibold">
                        {format(date, 'EEEE, MMMM d, yyyy')}
                      </span>
                      <span className="text-tbf-gold">•</span>
                      <span>{bookingData.selectedTimes[index]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isElite && (
              <div className="bg-tbf-gold/20 rounded p-4 border border-tbf-gold">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total Paid</span>
                  <span className="text-2xl font-bold text-tbf-gold">${bookingData.pricingInfo.price}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-black/50 border border-tbf-gold/30 rounded-lg p-6">
          <h4 className="text-white font-bold text-lg mb-4 font-audiowide uppercase">WHAT'S NEXT?</h4>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-1" />
              <div>
                <p className="text-white font-semibold mb-1">Confirmation Email</p>
                <p className="text-white/70 text-sm">
                  We've sent a detailed confirmation email to <span className="text-tbf-gold">{bookingData.email}</span> with all your booking information, facility details, and what to bring.
                </p>
              </div>
            </div>

            {isElite ? (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-1" />
                <div>
                  <p className="text-white font-semibold mb-1">Consultation Call</p>
                  <p className="text-white/70 text-sm">
                    Kevin Houston will contact you at <span className="text-tbf-gold">{bookingData.phone}</span> within 24 hours to schedule your consultation call and discuss your customized training plan.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-1" />
                <div>
                  <p className="text-white font-semibold mb-1">Calendar Reminders</p>
                  <p className="text-white/70 text-sm">
                    You'll receive reminder emails 48 hours and 24 hours before each scheduled session. Add these sessions to your calendar so you don't miss them!
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-1" />
              <div>
                <p className="text-white font-semibold mb-1">Facility Location</p>
                <p className="text-white/70 text-sm">
                  The Basketball Factory • 38 Station Rd, Sparta, NJ 07871
                </p>
                <p className="text-white/70 text-sm mt-1">
                  Please arrive 5-10 minutes early to your first session for a quick facility tour and paperwork completion.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What to Bring */}
        <div className="bg-tbf-gold/10 border border-tbf-gold/30 rounded-lg p-6">
          <h4 className="text-white font-bold text-lg mb-4 font-audiowide uppercase">WHAT TO BRING</h4>
          <ul className="space-y-2 text-white/80 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-tbf-gold">✓</span>
              <span>Athletic clothing and court shoes (non-marking soles)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-tbf-gold">✓</span>
              <span>Water bottle (stay hydrated!)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-tbf-gold">✓</span>
              <span>Towel for wiping down after intense drills</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-tbf-gold">✓</span>
              <span>Positive attitude and willingness to learn</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-tbf-gold">✓</span>
              <span>Notebook (optional) for taking notes on drills to practice at home</span>
            </li>
          </ul>
          <p className="text-white/70 text-xs mt-4">
            All basketballs and training equipment are provided by The Basketball Factory.
          </p>
        </div>

        {/* Contact Info */}
        <div className="bg-black/30 border border-white/20 rounded-lg p-6 text-center">
          <p className="text-white/80 mb-3">Questions? Need to reschedule?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="mailto:khouston@thebasketballfactorynj.com" className="text-tbf-gold hover:text-tbf-gold/80 font-semibold">
              khouston@thebasketballfactorynj.com
            </a>
            <span className="hidden sm:inline text-white/40">•</span>
            <a href="tel:+19732408759" className="text-tbf-gold hover:text-tbf-gold/80 font-semibold">
              (973) 240-8759
            </a>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-6">
        <Button
          onClick={() => window.location.href = '/'}
          className="bg-tbf-gold-bright hover:bg-tbf-gold-bright/90 text-black font-bold px-12 py-6 text-lg rounded-none"
        >
          Return to Homepage
        </Button>
      </div>
    </div>
  )
}
