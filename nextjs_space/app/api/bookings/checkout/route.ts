import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { getPrice, isValidLessonType, calculateTotalWithFee } from '@/lib/pricing'
import { checkRateLimit } from '@/lib/booking-rate-limit'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const rateCheck = checkRateLimit(ip)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      )
    }

    const { bookingId } = await request.json()

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID required' },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.paymentStatus === 'paid') {
      return NextResponse.json(
        { success: false, error: 'This booking has already been paid' },
        { status: 400 }
      )
    }

    let priceInDollars: number
    let productName: string
    let productDescription: string

    const pricingInfo = booking.pricingInfo as any

    if (isValidLessonType(booking.lessonType)) {
      const pricing = getPrice(booking.lessonType)
      if (pricing.price === 0) {
        return NextResponse.json(
          { success: false, error: 'Elite packages do not require online payment' },
          { status: 400 }
        )
      }
      priceInDollars = calculateTotalWithFee(pricing.price)
      productName = pricing.name + ' - Private Basketball Training'
      productDescription = 'The Basketball Factory - Training with Kevin Houston (includes processing fee)'
    } else {
      priceInDollars = pricingInfo?.totalPrice || pricingInfo?.price || pricingInfo?.totalPrice || 0
      if (priceInDollars <= 0) {
        return NextResponse.json(
          { success: false, error: 'This program does not require payment' },
          { status: 400 }
        )
      }
      const sessionType = booking.lessonType === 'full-program' || booking.lessonType === 'Full Program (8 Weeks)'
        ? 'Full Program' : 'Single Session'
      productName = sessionType + ' - Basketball Training Program'
      productDescription = 'The Basketball Factory - ' + (booking.athleteName || 'Player Registration')
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://thebasketballfactoryinc.com'

    const amountInCents = Math.round(priceInDollars * 100)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: booking.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: productDescription,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
      },
      payment_intent_data: {
        metadata: {
          bookingId: booking.id,
        },
      },
      success_url: baseUrl + '/private-lessons/booking-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: baseUrl + '/programs?canceled=true',
    })

    console.log('Stripe Checkout Session created:', {
      sessionId: session.id,
      bookingId: booking.id,
      amount: priceInDollars,
      type: isValidLessonType(booking.lessonType) ? 'private-lesson' : 'program',
    })

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
    })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
