import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { sendBookingConfirmationEmails } from '@/lib/booking-emails'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  let event

  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
    }

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        const bookingId = session.metadata?.bookingId

        if (!bookingId) {
          console.error('No bookingId in checkout session metadata')
          break
        }

        console.log('Payment completed for booking:', bookingId)

        // Update booking to paid/confirmed
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            paymentStatus: 'paid',
            bookingStatus: 'confirmed',
            paymentIntentId: session.payment_intent as string,
            amountPaid: (session.amount_total || 0) / 100,
            paidAt: new Date(),
          },
        })

        // Send confirmation emails
        await sendBookingConfirmationEmails(bookingId)

        console.log('Booking confirmed and emails sent for:', bookingId)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as any
        const bookingId = session.metadata?.bookingId

        if (bookingId) {
          await prisma.booking.update({
            where: { id: bookingId },
            data: {
              paymentStatus: 'expired',
              bookingStatus: 'cancelled',
            },
          })
          console.log('Booking cancelled (checkout expired):', bookingId)
        }
        break
      }

      default:
        console.log('Unhandled webhook event type:', event.type)
    }
  } catch (error) {
    console.error('Error processing webhook event:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
