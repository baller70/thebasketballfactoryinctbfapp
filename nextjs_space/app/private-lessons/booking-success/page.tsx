'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/header'
import { CheckCircle, Calendar, Mail, MapPin, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import confetti from 'canvas-confetti'

interface BookingDetails {
  id: string
  lessonType: string
  athleteName: string
  athleteAge: number
  skillLevel: string
  parentName: string
  email: string
  phone: string
  selectedDates: string[]
  selectedTimes: string[]
  pricingInfo: any
  paymentStatus: string
  bookingStatus: string
}

const packageNames: Record<string, string> = {
  individual: 'Individual Session',
  '10-pack': '10-Pack Lessons',
  '20-pack': '20-Pack Lessons',
  elite: 'All-Inclusive Elite',
}

function BookingSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found')
      setLoading(false)
      return
    }

    fetch(`/api/bookings/verify-session?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBooking(data.booking)
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFF', '#000'],
          })
        } else {
          setError(data.error || 'Failed to verify payment')
        }
      })
      .catch(() => setError('Failed to verify payment'))
      .finally(() => setLoading(false))
  }, [sessionId])

  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="w-12 h-12 text-tbf-gold animate-spin mx-auto mb-4" />
        <p className="text-white/80 text-lg">Verifying your payment...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 text-lg mb-4">{error}</p>
        <Button
          onClick={() => (window.location.href = '/private-lessons')}
          className="bg-tbf-gold hover:bg-tbf-gold/90 text-black font-bold px-8 py-4 rounded-none"
        >
          Return to Private Lessons
        </Button>
      </div>
    )
  }

  if (!booking) return null

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-tbf-gold rounded-full mb-6 animate-bounce">
          <CheckCircle className="w-12 h-12 text-black" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4 font-audiowide uppercase">
          BOOKING <span className="text-tbf-gold">CONFIRMED!</span>
        </h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Congratulations, {booking.parentName}! Your private training sessions are confirmed.{' '}
          {booking.athleteName} is on the path to basketball excellence!
        </p>
      </div>

      {/* Booking Details */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-black border-2 border-tbf-gold rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6 font-audiowide uppercase">BOOKING DETAILS</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/50 rounded p-4 border border-tbf-gold/30">
              <p className="text-white/60 text-sm mb-1">Package</p>
              <p className="text-white font-semibold">
                {packageNames[booking.lessonType] || booking.lessonType}
              </p>
            </div>
            <div className="bg-black/50 rounded p-4 border border-tbf-gold/30">
              <p className="text-white/60 text-sm mb-1">Athlete</p>
              <p className="text-white font-semibold">{booking.athleteName}</p>
              <p className="text-white/70 text-sm">Age {booking.athleteAge} &bull; {booking.skillLevel}</p>
            </div>
          </div>

          {booking.selectedDates && booking.selectedDates.length > 0 && (
            <div className="bg-black/50 rounded p-4 border border-tbf-gold/30">
              <p className="text-white/60 text-sm mb-3">Scheduled Sessions</p>
              <div className="space-y-2">
                {booking.selectedDates.map((date: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 text-white">
                    <Calendar className="w-4 h-4 text-tbf-gold" />
                    <span className="font-semibold">{date}</span>
                    <span className="text-tbf-gold">&bull;</span>
                    <span>{booking.selectedTimes?.[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {booking.pricingInfo?.price > 0 && (
            <div className="bg-tbf-gold/20 rounded p-4 border border-tbf-gold">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Total Paid</span>
                <span className="text-2xl font-bold text-tbf-gold">${booking.pricingInfo.price}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What's Next */}
      <div className="bg-black/50 border border-tbf-gold/30 rounded-lg p-6">
        <h3 className="text-white font-bold text-lg mb-4 font-audiowide uppercase">WHAT&apos;S NEXT?</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-1" />
            <div>
              <p className="text-white font-semibold mb-1">Confirmation Email</p>
              <p className="text-white/70 text-sm">
                We&apos;ve sent a confirmation email to <span className="text-tbf-gold">{booking.email}</span> with all your booking details.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-1" />
            <div>
              <p className="text-white font-semibold mb-1">Calendar Reminders</p>
              <p className="text-white/70 text-sm">You&apos;ll receive reminders before each session.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-1" />
            <div>
              <p className="text-white font-semibold mb-1">Facility Location</p>
              <p className="text-white/70 text-sm">The Basketball Factory &bull; 38 Station Rd, Sparta, NJ 07871</p>
              <p className="text-white/70 text-sm mt-1">Please arrive 5-10 minutes early to your first session.</p>
            </div>
          </div>
        </div>
      </div>

      {/* What to Bring */}
      <div className="bg-tbf-gold/10 border border-tbf-gold/30 rounded-lg p-6">
        <h3 className="text-white font-bold text-lg mb-4 font-audiowide uppercase">WHAT TO BRING</h3>
        <ul className="space-y-2 text-white/80 text-sm">
          <li className="flex items-start gap-2"><span className="text-tbf-gold">&#10003;</span><span>Athletic clothing and court shoes (non-marking soles)</span></li>
          <li className="flex items-start gap-2"><span className="text-tbf-gold">&#10003;</span><span>Water bottle (stay hydrated!)</span></li>
          <li className="flex items-start gap-2"><span className="text-tbf-gold">&#10003;</span><span>Towel for wiping down after intense drills</span></li>
          <li className="flex items-start gap-2"><span className="text-tbf-gold">&#10003;</span><span>Positive attitude and willingness to learn</span></li>
        </ul>
      </div>

      {/* Contact */}
      <div className="bg-black/30 border border-white/20 rounded-lg p-6 text-center">
        <p className="text-white/80 mb-3">Questions? Need to reschedule?</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="mailto:khouston@thebasketballfactorynj.com" className="text-tbf-gold hover:text-tbf-gold/80 font-semibold">
            khouston@thebasketballfactorynj.com
          </a>
          <span className="hidden sm:inline text-white/40">&bull;</span>
          <a href="tel:+19732408759" className="text-tbf-gold hover:text-tbf-gold/80 font-semibold">
            (973) 240-8759
          </a>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <Button
          onClick={() => (window.location.href = '/')}
          className="bg-tbf-gold-bright hover:bg-tbf-gold-bright/90 text-black font-bold px-12 py-6 text-lg rounded-none"
        >
          Return to Homepage
        </Button>
      </div>
    </div>
  )
}

export default function BookingSuccessPage() {
  return (
    <>
      <Header alwaysDark />
      <div className="min-h-screen bg-black pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense
            fallback={
              <div className="text-center py-20">
                <Loader2 className="w-12 h-12 text-tbf-gold animate-spin mx-auto mb-4" />
                <p className="text-white/80 text-lg">Loading...</p>
              </div>
            }
          >
            <BookingSuccessContent />
          </Suspense>
        </div>
      </div>
    </>
  )
}
