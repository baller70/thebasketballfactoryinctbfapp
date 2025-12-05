
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/email'
import { createCustomerConfirmationEmail, createAdminNotificationEmail } from '@/lib/email-templates'

export async function POST(request: Request) {
  try {
    const bookingData = await request.json()

    // Detect if this is a program booking or private lesson booking
    const isProgram = bookingData.sessionOption !== undefined && !bookingData.lessonType
    
    console.log('🔍 Booking type detection:', { 
      isProgram, 
      hasSessionOption: !!bookingData.sessionOption,
      hasLessonType: !!bookingData.lessonType 
    })

    // Map program booking fields to database fields
    const lessonType = isProgram ? bookingData.sessionOption : bookingData.lessonType
    const athleteName = bookingData.athleteName || bookingData.playerName
    const athleteAgeRaw = bookingData.athleteAge || bookingData.playerAge
    const athleteAge = parseInt(athleteAgeRaw) || 0  // Convert to number, default to 0 if invalid
    const email = bookingData.email || bookingData.parentEmail
    const phone = bookingData.phone || bookingData.parentPhone
    const skillLevel = bookingData.skillLevel || 'intermediate'
    const parentName = bookingData.parentName
    const selectedDates = bookingData.selectedDates || []
    const selectedTimes = bookingData.selectedTimes || []
    const pricingInfo = bookingData.pricingInfo
    const cardLast4 = bookingData.cardLast4 || null
    
    // Validate athleteAge
    if (!athleteAge || isNaN(athleteAge)) {
      console.error('Invalid athleteAge:', { athleteAgeRaw, athleteAge })
      return NextResponse.json(
        { success: false, error: 'Invalid athlete age. Please provide a valid age.' },
        { status: 400 }
      )
    }
    
    // For programs, combine additional details into goals/notes
    let primaryFocus = bookingData.primaryFocus || null
    let goals = bookingData.goals || null
    let notes = null
    
    if (isProgram) {
      const programDetails = []
      if (bookingData.playerGrade) programDetails.push(`Grade: ${bookingData.playerGrade}`)
      if (bookingData.schoolName) programDetails.push(`School: ${bookingData.schoolName}`)
      if (bookingData.trainingGoals) programDetails.push(`Training Goals: ${bookingData.trainingGoals}`)
      if (bookingData.medicalInfo) programDetails.push(`Medical Info: ${bookingData.medicalInfo}`)
      if (bookingData.emergencyContact && bookingData.emergencyPhone) {
        programDetails.push(`Emergency Contact: ${bookingData.emergencyContact} (${bookingData.emergencyPhone})`)
      }
      
      if (programDetails.length > 0) {
        notes = programDetails.join('\n')
      }
      
      // Set training goals as primaryFocus for programs
      if (bookingData.trainingGoals) {
        primaryFocus = bookingData.trainingGoals
      }
    }

    console.log('📋 Mapped booking data:', {
      lessonType,
      athleteName,
      email,
      phone,
      isProgram
    })

    // Determine session details
    let sessionsBooked = 1
    let sessionDuration = 60 // default 60 minutes

    if (isProgram) {
      // Program bookings
      if (lessonType === 'full-program') {
        sessionsBooked = Array.isArray(selectedDates) ? selectedDates.length : 7
        sessionDuration = 90 // 1.5 hours for programs
      } else {
        sessionsBooked = 1
        sessionDuration = 90
      }
    } else {
      // Private lesson bookings
      switch (lessonType) {
        case 'individual':
          sessionsBooked = 1
          sessionDuration = 60
          break
        case '10-pack':
          sessionsBooked = 10
          sessionDuration = 60
          break
        case '20-pack':
          sessionsBooked = 20
          sessionDuration = 60
          break
        case 'elite':
          sessionsBooked = 0 // TBD during consultation
          sessionDuration = 0
          break
      }
    }

    const isElite = lessonType === 'elite'
    const isFreeProgram = bookingData.isFreeProgram || 
                          (pricingInfo && pricingInfo.totalPrice === 0) ||
                          lessonType === 'free-youth-program'

    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        lessonType,
        sessionsBooked,
        sessionDuration,
        athleteName,
        athleteAge, // Already parsed as integer above
        skillLevel,
        primaryFocus: primaryFocus || null,
        goals: goals || null,
        parentName,
        email,
        phone,
        selectedDates: selectedDates || [],
        selectedTimes: selectedTimes || [],
        pricingInfo,
        paymentStatus: isFreeProgram ? 'completed' : (isElite ? 'pending' : 'pending'),
        cardLast4: cardLast4 || null,
        bookingStatus: 'confirmed',
        notes: notes || null
      }
    })

    console.log('Booking created successfully:', {
      bookingId: booking.id,
      athleteName: booking.athleteName,
      email: booking.email,
      lessonType: booking.lessonType
    })

    // For Elite packages and FREE programs, send emails immediately (no payment required)
    if (isElite || isFreeProgram) {
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
        isElite: true
      }

      // Send confirmation email to customer
      try {
        const customerEmailHtml = createCustomerConfirmationEmail(emailData)
        const emailSubject = isFreeProgram 
          ? `🏀 FREE Youth Basketball Program - Registration Confirmed!`
          : `🏀 Elite Package Consultation Request Received - The Basketball Factory`
        const customerEmailResult = await sendEmail({
          to: booking.email,
          subject: emailSubject,
          html: customerEmailHtml,
          from: 'The Basketball Factory <khouston@thebasketballfactorynj.com>'
        })

        if (customerEmailResult.success) {
          await prisma.booking.update({
            where: { id: booking.id },
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
        const adminSubject = isFreeProgram
          ? `🆓 FREE Program Registration - ${booking.athleteName}`
          : `🌟 Elite Package Consultation Request - ${booking.athleteName}`
        console.log('🚨 SENDING ADMIN NOTIFICATION EMAIL TO: khouston@thebasketballfactorynj.com')
        console.log('📧 Admin Email Details:', {
          to: 'khouston@thebasketballfactorynj.com',
          subject: adminSubject,
          bookingId: booking.id
        })
        
        const adminEmailResult = await sendEmail({
          to: 'khouston@thebasketballfactorynj.com',
          subject: adminSubject,
          html: adminEmailHtml,
          from: 'The Basketball Factory <khouston@thebasketballfactorynj.com>'
        })

        if (adminEmailResult.success) {
          await prisma.booking.update({
            where: { id: booking.id },
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
    }

    return NextResponse.json({ 
      success: true,
      bookingId: booking.id
    })
  } catch (error: any) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create booking' },
      { status: 500 }
    )
  }
}
