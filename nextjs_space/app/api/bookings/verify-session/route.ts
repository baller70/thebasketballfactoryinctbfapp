import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Session ID required' }, { status: 400 })
    }

    // Retrieve the Stripe checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const bookingId = session.metadata?.bookingId

    if (!bookingId) {
      return NextResponse.json({ success: false, error: 'No booking found for this session' }, { status: 404 })
    }

    // Get booking details from database
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        lessonType: booking.lessonType,
        athleteName: booking.athleteName,
        athleteAge: booking.athleteAge,
        skillLevel: booking.skillLevel,
        parentName: booking.parentName,
        email: booking.email,
        phone: booking.phone,
        selectedDates: booking.selectedDates,
        selectedTimes: booking.selectedTimes,
        pricingInfo: booking.pricingInfo,
        paymentStatus: booking.paymentStatus,
        bookingStatus: booking.bookingStatus,
      },
      paymentStatus: session.payment_status,
    })
  } catch (error: any) {
    console.error('Error verifying session:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to verify session' },
      { status: 500 }
    )
  }
}
