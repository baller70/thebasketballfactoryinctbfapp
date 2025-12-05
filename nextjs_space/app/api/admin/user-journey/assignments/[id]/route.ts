
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// PUT update journey progress
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { currentStep, status, stepProgress } = body

    const updateData: any = {}
    if (currentStep !== undefined) updateData.currentStep = currentStep
    if (status) updateData.status = status
    if (status === 'completed') updateData.completedAt = new Date()

    const journey = await prisma.customerJourney.update({
      where: { id: params.id },
      data: updateData,
      include: {
        template: true,
        registration: true,
        progress: true
      }
    })

    // Update step progress if provided
    if (stepProgress) {
      await prisma.journeyProgress.updateMany({
        where: {
          journeyId: params.id,
          stepNumber: stepProgress.stepNumber
        },
        data: {
          status: stepProgress.status,
          notes: stepProgress.notes,
          completedBy: stepProgress.completedBy,
          completedAt: stepProgress.status === 'completed' ? new Date() : null,
          startedAt: stepProgress.status === 'in_progress' && !stepProgress.startedAt 
            ? new Date() 
            : undefined
        }
      })
    }

    return NextResponse.json({ journey })
  } catch (error) {
    console.error('Error updating journey:', error)
    return NextResponse.json(
      { error: 'Failed to update journey' },
      { status: 500 }
    )
  }
}

// DELETE journey assignment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.customerJourney.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting journey:', error)
    return NextResponse.json(
      { error: 'Failed to delete journey' },
      { status: 500 }
    )
  }
}
