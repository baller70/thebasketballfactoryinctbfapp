import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/email'
import { createCustomerConfirmationEmail, createAdminNotificationEmail } from '@/lib/email-templates'

export async function sendBookingConfirmationEmails(bookingId: string) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
  if (!booking) {
    console.error('Booking not found for email:', bookingId)
    return
  }

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
    isElite: booking.lessonType === 'elite',
  }

  // Send confirmation email to customer
  try {
    const customerEmailHtml = createCustomerConfirmationEmail(emailData)
    const customerEmailResult = await sendEmail({
      to: booking.email,
      subject: '🏀 Booking Confirmed - The Basketball Factory',
      html: customerEmailHtml,
      from: 'The Basketball Factory <khouston@thebasketballfactorynj.com>',
    })

    if (customerEmailResult.success) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          confirmationEmailSent: true,
          confirmationEmailSentAt: new Date(),
        },
      })
      console.log('Customer confirmation email sent to:', booking.email)
    } else {
      console.error('Failed to send customer email:', customerEmailResult.error)
    }
  } catch (error) {
    console.error('Error sending customer email:', error)
  }

  // Send notification email to admin
  try {
    const adminEmailHtml = createAdminNotificationEmail(emailData)
    const adminEmailResult = await sendEmail({
      to: 'khouston@thebasketballfactorynj.com',
      subject: '🎯 New Booking Received - ' + booking.athleteName + ' (' + booking.lessonType + ')',
      html: adminEmailHtml,
      from: 'The Basketball Factory <khouston@thebasketballfactorynj.com>',
    })

    if (adminEmailResult.success) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { adminNotificationSent: true },
      })
      console.log('Admin notification email sent')
    } else {
      console.error('Failed to send admin email:', adminEmailResult.error)
    }
  } catch (error) {
    console.error('Error sending admin email:', error)
  }
}
