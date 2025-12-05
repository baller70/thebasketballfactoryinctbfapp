
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all journey assignments
export async function GET(request: NextRequest) {
  try {
    const assignments = await prisma.customerJourney.findMany({
      include: {
        template: {
          include: {
            steps: {
              orderBy: {
                stepNumber: 'asc'
              }
            }
          }
        },
        registration: true,
        progress: {
          orderBy: {
            stepNumber: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ assignments })
  } catch (error) {
    console.error('Error fetching assignments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch journey assignments' },
      { status: 500 }
    )
  }
}

// POST create new journey assignment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { registrationId, templateId, notes } = body

    if (!registrationId || !templateId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if journey already assigned
    const existing = await prisma.customerJourney.findFirst({
      where: {
        registrationId,
        status: 'active'
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Active journey already assigned to this registration' },
        { status: 400 }
      )
    }

    // Get template to know total steps
    const template = await prisma.journeyTemplate.findUnique({
      where: { id: templateId },
      include: { steps: true }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Create journey and initialize progress for all steps
    const now = new Date()
    const journey = await prisma.customerJourney.create({
      data: {
        registrationId,
        templateId,
        notes,
        currentStep: 1,
        status: 'active',
        progress: {
          create: template.steps.map((step, index) => {
            // Calculate scheduled send date based on delay
            let scheduledDate = new Date(now)
            if (index > 0) {
              // Add up all previous delays
              const totalDelay = template.steps
                .slice(0, index + 1)
                .reduce((sum, s) => sum + (s.delayDays || 0), 0)
              scheduledDate.setDate(now.getDate() + totalDelay)
            }
            
            return {
              stepId: step.id,
              stepNumber: step.stepNumber,
              status: step.stepNumber === 1 ? 'in_progress' : 'not_started',
              scheduledSendDate: step.emailSubject && step.emailBody ? scheduledDate : null
            }
          })
        }
      },
      include: {
        template: {
          include: {
            steps: {
              orderBy: { stepNumber: 'asc' }
            }
          }
        },
        registration: true,
        progress: {
          orderBy: { stepNumber: 'asc' }
        }
      }
    })

    return NextResponse.json({ journey }, { status: 201 })
  } catch (error) {
    console.error('Error creating assignment:', error)
    return NextResponse.json(
      { error: 'Failed to create journey assignment' },
      { status: 500 }
    )
  }
}
