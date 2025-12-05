
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET single template
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const template = await prisma.journeyTemplate.findUnique({
      where: { id: params.id },
      include: {
        steps: {
          orderBy: {
            stepNumber: 'asc'
          }
        }
      }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ template })
  } catch (error) {
    console.error('Error fetching template:', error)
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    )
  }
}

// PUT update template
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, category, totalSteps, steps } = body

    // Delete existing steps and create new ones
    await prisma.journeyStep.deleteMany({
      where: { templateId: params.id }
    })

    const template = await prisma.journeyTemplate.update({
      where: { id: params.id },
      data: {
        name,
        description,
        category,
        totalSteps,
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

    return NextResponse.json({ template })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
}

// DELETE template
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if template has active assignments
    const assignmentCount = await prisma.customerJourney.count({
      where: { 
        templateId: params.id,
        status: 'active'
      }
    })

    if (assignmentCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete template with active journey assignments' },
        { status: 400 }
      )
    }

    await prisma.journeyTemplate.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}
