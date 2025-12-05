
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/email'
import { createCustomerConfirmationEmail, createAdminNotificationEmail } from '@/lib/email-templates'

// Read Stripe API key from secrets file
function getStripeSecrets() {
  try {
    const secretsPath = path.join(process.env.HOME || '/home/ubuntu', '.config', 'abacusai_auth_secrets.json')
    const secretsData = fs.readFileSync(secretsPath, 'utf8')
    const secrets = JSON.parse(secretsData)
    
    return {
      secretKey: secrets.stripe?.secrets?.secret_key?.value || process.env.STRIPE_SECRET_KEY,
      publishableKey: secrets.stripe?.secrets?.publishable_key?.value || process.env.STRIPE_PUBLISHABLE_KEY
    }
  } catch (error) {
    console.error('Error reading Stripe secrets:', error)
    return {
      secretKey: process.env.STRIPE_SECRET_KEY,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    }
  }
}

export async function POST(request: Request) {
  try {
    const { amount, bookingId, email, customerName } = await request.json()

    const stripeSecrets = getStripeSecrets()

    if (!stripeSecrets.secretKey) {
      console.error('Stripe secret key not configured')
      return NextResponse.json(
        { success: false, error: 'Payment processing not configured' },
        { status: 500 }
      )
    }

    // Import Stripe dynamically to avoid build-time issues
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeSecrets.secretKey, {
      apiVersion: '2024-12-18.acacia' as any
    })

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      description: `Basketball Training - Booking ${bookingId}`,
      receipt_email: email,
      metadata: {
        bookingId,
        customerName
      }
    })

    console.log('Payment intent created:', {
      paymentIntentId: paymentIntent.id,
      amount: amount,
      bookingId
    })

    // Update booking in database with payment info
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: 'paid',
        paymentIntentId: paymentIntent.id,
        amountPaid: amount,
        paidAt: new Date()
      }
    })

    // Prepare email data
    const emailData = {
      bookingId: booking.id,
      lessonType: booking.lessonType,
      athleteName: booking.athleteName,
      athleteAge: booking.athleteAge,
      skillLevel: booking.skillLevel,
      parentName: booking.parentName,
      email: booking.email,
      phone: booking.phone,
      selectedDates: booking.selectedDates as string[],
      selectedTimes: booking.selectedTimes as string[],
      pricingInfo: booking.pricingInfo as any,
      isElite: booking.lessonType === 'elite'
    }

    // Send confirmation email to customer
    try {
      const customerEmailHtml = createCustomerConfirmationEmail(emailData)
      const customerEmailResult = await sendEmail({
        to: booking.email,
        subject: `🏀 Booking Confirmed - The Basketball Factory`,
        html: customerEmailHtml,
        from: 'The Basketball Factory <khouston@thebasketballfactorynj.com>'
      })

      if (customerEmailResult.success) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            confirmationEmailSent: true,
            confirmationEmailSentAt: new Date()
          }
        })
        console.log('Customer confirmation email sent successfully to:', booking.email)
      } else {
        console.error('Failed to send customer confirmation email:', customerEmailResult.error)
      }
    } catch (emailError) {
      console.error('Error sending customer confirmation email:', emailError)
    }

    // Send notification email to admin
    try {
      const adminEmailHtml = createAdminNotificationEmail(emailData)
      console.log('🚨 SENDING ADMIN NOTIFICATION EMAIL TO: khouston@thebasketballfactorynj.com')
      console.log('📧 Admin Email Details:', {
        to: 'khouston@thebasketballfactorynj.com',
        subject: `🎯 New Booking Received - ${booking.athleteName} (${booking.lessonType})`,
        bookingId: booking.id
      })
      
      const adminEmailResult = await sendEmail({
        to: 'khouston@thebasketballfactorynj.com',
        subject: `🎯 New Booking Received - ${booking.athleteName} (${booking.lessonType})`,
        html: adminEmailHtml,
        from: 'The Basketball Factory <khouston@thebasketballfactorynj.com>'
      })

      if (adminEmailResult.success) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            adminNotificationSent: true
          }
        })
        console.log('✅ Admin notification email sent successfully to khouston@thebasketballfactorynj.com')
        console.log('📬 Admin email result:', JSON.stringify(adminEmailResult.data, null, 2))
      } else {
        console.error('❌ Failed to send admin notification email:', adminEmailResult.error)
        console.error('❌ Full error details:', JSON.stringify(adminEmailResult, null, 2))
      }
    } catch (emailError) {
      console.error('💥 Error sending admin notification email:', emailError)
      console.error('💥 Stack trace:', emailError instanceof Error ? emailError.stack : 'No stack trace')
    }

    return NextResponse.json({ 
      success: true,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret
    })
  } catch (error: any) {
    console.error('Error processing payment:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Payment processing failed' },
      { status: 500 }
    )
  }
}
