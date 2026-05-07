import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
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

    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' }
    })

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
        sessionDuration: booking.sessionDuration,
        sessionsBooked: booking.sessionsBooked,
        skillLevel: booking.skillLevel,
        parentName: booking.parentName,
        notes: booking.notes,
        confirmationEmailSent: booking.confirmationEmailSent,
        adminNotificationSent: booking.adminNotificationSent,
        source: 'booking'
      }
    })

    const markedProgramRegistrations = programRegistrations.map(reg => ({
      ...reg,
      source: 'program_registration'
    }))

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
    const { id, status, paymentStatus, source } = await request.json()

    const updateData: any = {}
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus

    // Try ProgramRegistration first
    if (source !== 'booking') {
      try {
        const existing = await prisma.programRegistration.findUnique({ where: { id } })
        if (existing) {
          const updated = await prisma.programRegistration.update({
            where: { id },
            data: updateData
          })
          return NextResponse.json(updated)
        }
      } catch {}
    }

    // Try Booking table
    try {
      const bookingUpdateData: any = {}
      if (status) bookingUpdateData.bookingStatus = status
      if (paymentStatus) bookingUpdateData.paymentStatus = paymentStatus

      const updated = await prisma.booking.update({
        where: { id },
        data: bookingUpdateData
      })
      return NextResponse.json({
        ...updated,
        status: updated.bookingStatus,
        source: 'booking'
      })
    } catch (bookingError) {
      console.error('Booking update failed:', bookingError)
    }

    return NextResponse.json(
      { error: 'Record not found in either table' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Update registration error:', error)
    return NextResponse.json(
      { error: 'Failed to update registration' },
      { status: 500 }
    )
  }
}
