import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getPrice, isValidLessonType } from '@/lib/pricing'
import { checkRateLimit } from '@/lib/booking-rate-limit'
import { sendBookingConfirmationEmails } from '@/lib/booking-emails'

const privateLessonSchema = z.object({
  lessonType: z.enum(['individual', '10-pack', '20-pack', 'elite']),
  athleteName: z.string().min(1).max(100),
  athleteAge: z.union([z.string(), z.number()]).transform(v => parseInt(String(v))).pipe(z.number().min(5).max(25)),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  parentName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  selectedDates: z.array(z.string()).max(20).default([]),
  selectedTimes: z.array(z.string()).max(20).default([]),
  notes: z.string().max(2000).optional(),
  agreementSigned: z.boolean().optional(),
})

const programSchema = z.object({
  sessionOption: z.string(),
  playerName: z.string().min(1).max(100).optional(),
  athleteName: z.string().min(1).max(100).optional(),
  playerAge: z.union([z.string(), z.number()]).optional(),
  athleteAge: z.union([z.string(), z.number()]).optional(),
  parentName: z.string().min(1).max(100),
  parentEmail: z.string().email().optional(),
  email: z.string().email().optional(),
  parentPhone: z.string().min(7).max(20).optional(),
  phone: z.string().min(7).max(20).optional(),
  skillLevel: z.string().optional(),
  selectedDates: z.array(z.string()).max(20).default([]),
  selectedTimes: z.array(z.string()).max(20).default([]),
  pricingInfo: z.any().optional(),
  isFreeProgram: z.boolean().optional(),
  playerGrade: z.string().optional(),
  schoolName: z.string().optional(),
  trainingGoals: z.string().optional(),
  medicalInfo: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  primaryFocus: z.string().optional(),
  goals: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    // Rate limit
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const rateCheck = checkRateLimit(ip)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Detect if this is a program booking or private lesson booking
    const isProgram = body.sessionOption !== undefined && !body.lessonType

    let lessonType: string
    let athleteName: string
    let athleteAge: number
    let email: string
    let phone: string
    let skillLevel: string
    let parentName: string
    let selectedDates: string[]
    let selectedTimes: string[]
    let primaryFocus: string | null = null
    let goals: string | null = null
    let notes: string | null = null
    let pricingInfo: any

    if (isProgram) {
      // Validate program booking
      const result = programSchema.safeParse(body)
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: 'Invalid booking data', details: result.error.flatten() },
          { status: 400 }
        )
      }
      const data = result.data

      lessonType = data.sessionOption
      athleteName = data.playerName || data.athleteName || ''
      const ageRaw = data.playerAge || data.athleteAge
      athleteAge = parseInt(String(ageRaw)) || 0
      email = data.email || data.parentEmail || ''
      phone = data.phone || data.parentPhone || ''
      skillLevel = data.skillLevel || 'intermediate'
      parentName = data.parentName
      selectedDates = data.selectedDates
      selectedTimes = data.selectedTimes
      pricingInfo = data.pricingInfo || {}

      // Build notes from program-specific fields
      const programDetails = []
      if (data.playerGrade) programDetails.push('Grade: ' + data.playerGrade)
      if (data.schoolName) programDetails.push('School: ' + data.schoolName)
      if (data.trainingGoals) programDetails.push('Training Goals: ' + data.trainingGoals)
      if (data.medicalInfo) programDetails.push('Medical Info: ' + data.medicalInfo)
      if (data.emergencyContact && data.emergencyPhone) {
        programDetails.push('Emergency Contact: ' + data.emergencyContact + ' (' + data.emergencyPhone + ')')
      }
      if (programDetails.length > 0) notes = programDetails.join('\n')
      if (data.trainingGoals) primaryFocus = data.trainingGoals
    } else {
      // Validate private lesson booking
      const result = privateLessonSchema.safeParse(body)
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: 'Invalid booking data', details: result.error.flatten() },
          { status: 400 }
        )
      }
      const data = result.data

      lessonType = data.lessonType
      athleteName = data.athleteName
      athleteAge = data.athleteAge
      email = data.email
      phone = data.phone
      skillLevel = data.skillLevel
      parentName = data.parentName
      selectedDates = data.selectedDates
      selectedTimes = data.selectedTimes
      notes = data.notes || null

      // Get authoritative price from server (NOT from client)
      const serverPricing = getPrice(lessonType)
      pricingInfo = {
        price: serverPricing.price,
        sessionCount: serverPricing.sessionCount,
        pricePerSession: serverPricing.pricePerSession,
      }
    }

    // Determine session details
    let sessionsBooked = 1
    let sessionDuration = 60

    if (isProgram) {
      if (lessonType === 'full-program') {
        sessionsBooked = Array.isArray(selectedDates) ? selectedDates.length : 7
        sessionDuration = 90
      } else {
        sessionsBooked = 1
        sessionDuration = 90
      }
    } else {
      switch (lessonType) {
        case 'individual': sessionsBooked = 1; sessionDuration = 60; break
        case '10-pack': sessionsBooked = 10; sessionDuration = 60; break
        case '20-pack': sessionsBooked = 20; sessionDuration = 60; break
        case 'elite': sessionsBooked = 0; sessionDuration = 0; break
      }
    }

    const isElite = lessonType === 'elite'
    const isFreeProgram = body.isFreeProgram ||
      (pricingInfo && pricingInfo.totalPrice === 0) ||
      lessonType === 'free-youth-program'

    // Determine initial statuses
    const needsPayment = !isElite && !isFreeProgram && pricingInfo.price > 0
    const bookingStatus = needsPayment ? 'pending_payment' : 'confirmed'
    const paymentStatus = isFreeProgram ? 'completed' : 'pending'

    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        lessonType,
        sessionsBooked,
        sessionDuration,
        athleteName,
        athleteAge,
        skillLevel,
        primaryFocus,
        goals,
        parentName,
        email,
        phone,
        selectedDates: selectedDates || [],
        selectedTimes: selectedTimes || [],
        pricingInfo,
        paymentStatus,
        bookingStatus,
        notes,
      },
    })

    console.log('Booking created:', {
      bookingId: booking.id,
      lessonType,
      athleteName,
      bookingStatus,
      needsPayment,
    })

    // For elite and free programs, send emails immediately
    if (isElite || isFreeProgram) {
      await sendBookingConfirmationEmails(booking.id)
    }

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      needsPayment,
    })
  } catch (error: any) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create booking' },
      { status: 500 }
    )
  }
}
