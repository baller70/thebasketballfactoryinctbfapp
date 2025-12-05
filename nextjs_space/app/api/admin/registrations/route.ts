
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Fetch from ProgramRegistration table
    const programRegistrations = await prisma.programRegistration.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customerJourneys: {
          include: {
            template: {
              include: {
                steps: {
                  orderBy: { stepNumber: 'asc' }
                }
              }
            },
            progress: {
              orderBy: { stepNumber: 'asc' }
            }
          }
        }
      }
    })

    // Fetch from Booking table (includes private lessons and free programs)
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' }
    })

    // Transform bookings to match the registration format
    const transformedBookings = bookings.map((booking) => {
      const pricingInfo = booking.pricingInfo as any
      const programName = pricingInfo?.programName || booking.lessonType || 'Unknown Program'
      
      return {
        id: booking.id,
        programType: booking.lessonType,
        programName: programName,
        firstName: booking.athleteName.split(' ')[0] || booking.athleteName,
        lastName: booking.athleteName.split(' ').slice(1).join(' ') || '',
        email: booking.email,
        phone: booking.phone,
        age: booking.athleteAge,
        status: booking.bookingStatus,
        paymentStatus: booking.paymentStatus,
        createdAt: booking.createdAt.toISOString(),
        customerJourneys: [],
        // Additional booking-specific fields
        sessionDuration: booking.sessionDuration,
        sessionsBooked: booking.sessionsBooked,
        skillLevel: booking.skillLevel,
        parentName: booking.parentName,
        notes: booking.notes,
        confirmationEmailSent: booking.confirmationEmailSent,
        adminNotificationSent: booking.adminNotificationSent,
        source: 'booking' // Flag to identify source table
      }
    })

    // Mark program registrations with their source
    const markedProgramRegistrations = programRegistrations.map(reg => ({
      ...reg,
      source: 'program_registration'
    }))

    // Combine both lists and sort by creation date
    const allRegistrations = [...markedProgramRegistrations, ...transformedBookings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json(allRegistrations)
  } catch (error) {
    console.error('Fetch registrations error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const registration = await prisma.programRegistration.create({
      data: {
        programType: data.programType,
        programName: data.programName,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        age: data.age,
        grade: data.grade,
        school: data.school,
        parentName: data.parentName,
        parentEmail: data.parentEmail,
        parentPhone: data.parentPhone,
        emergencyContact: data.emergencyContact,
        medicalInfo: data.medicalInfo,
        sessionDate: data.sessionDate ? new Date(data.sessionDate) : undefined
      }
    })

    return NextResponse.json(registration, { status: 201 })
  } catch (error) {
    console.error('Create registration error:', error)
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status, paymentStatus } = await request.json()
    
    const updateData: any = {}
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus

    const registration = await prisma.programRegistration.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(registration)
  } catch (error) {
    console.error('Update registration error:', error)
    return NextResponse.json(
      { error: 'Failed to update registration' },
      { status: 500 }
    )
  }
}
