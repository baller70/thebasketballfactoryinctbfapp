
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all journey templates
export async function GET(request: NextRequest) {
  try {
    const templates = await prisma.journeyTemplate.findMany({
      include: {
        steps: {
          orderBy: {
            stepNumber: 'asc'
          }
        },
        _count: {
          select: {
            assignments: true
          }
        }
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch journey templates' },
      { status: 500 }
    )
  }
}

// POST create new journey template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, category, totalSteps, steps } = body

    if (!name || !totalSteps || !steps || steps.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const template = await prisma.journeyTemplate.create({
      data: {
        name,
        description,
        category,
        totalSteps,
        isDefault: false,
        isActive: true,
        steps: {
          create: steps.map((step: any) => ({
            stepNumber: step.stepNumber,
            title: step.title,
            description: step.description,
            actionRequired: step.actionRequired,
            automatedAction: step.automatedAction,
            daysToComplete: step.daysToComplete
          }))
        }
      },
      include: {
        steps: true
      }
    })

    return NextResponse.json({ template }, { status: 201 })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Failed to create journey template' },
      { status: 500 }
    )
  }
}
