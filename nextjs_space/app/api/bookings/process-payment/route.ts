import { NextResponse } from 'next/server'

// This route has been replaced by /api/bookings/checkout
// which uses Stripe Checkout Sessions for PCI-compliant payment processing.
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: 'This payment endpoint has been deprecated. Please use the updated booking flow.',
    },
    { status: 410 }
  )
}
