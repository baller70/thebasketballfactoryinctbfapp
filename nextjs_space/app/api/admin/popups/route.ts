
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const popups = await prisma.popup.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(popups)
  } catch (error) {
    console.error('Fetch popups error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch popups' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const popup = await prisma.popup.create({
      data: {
        name: data.name,
        title: data.title,
        description: data.description,
        content: data.content,
        trigger: data.trigger,
        delay: data.delay,
        scrollPercent: data.scrollPercent,
        target: data.target,
        isActive: data.isActive,
        priority: data.priority,
        showOnce: data.showOnce,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined
      }
    })

    return NextResponse.json(popup, { status: 201 })
  } catch (error) {
    console.error('Create popup error:', error)
    return NextResponse.json(
      { error: 'Failed to create popup' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json()
    
    const popup = await prisma.popup.update({
      where: { id },
      data: {
        name: data.name,
        title: data.title,
        description: data.description,
        content: data.content,
        trigger: data.trigger,
        delay: data.delay,
        scrollPercent: data.scrollPercent,
        target: data.target,
        isActive: data.isActive,
        priority: data.priority,
        showOnce: data.showOnce
      }
    })

    return NextResponse.json(popup)
  } catch (error) {
    console.error('Update popup error:', error)
    return NextResponse.json(
      { error: 'Failed to update popup' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, isActive } = await request.json()
    
    const popup = await prisma.popup.update({
      where: { id },
      data: { isActive }
    })

    return NextResponse.json(popup)
  } catch (error) {
    console.error('Toggle popup error:', error)
    return NextResponse.json(
      { error: 'Failed to toggle popup' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Popup ID is required' },
        { status: 400 }
      )
    }

    await prisma.popup.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete popup error:', error)
    return NextResponse.json(
      { error: 'Failed to delete popup' },
      { status: 500 }
    )
  }
}
