
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const players = await prisma.playerProfile.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            assessments: true,
            attendance: true
          }
        }
      }
    })

    return NextResponse.json(players)
  } catch (error) {
    console.error('Fetch players error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const player = await prisma.playerProfile.create({
      data: {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: new Date(data.dateOfBirth),
        age: data.age,
        grade: data.grade,
        school: data.school,
        height: data.height,
        weight: data.weight,
        position: data.position,
        jerseyNumber: data.jerseyNumber,
        parentName: data.parentName,
        parentEmail: data.parentEmail,
        parentPhone: data.parentPhone,
        skillLevel: data.skillLevel,
        gpa: data.gpa,
        academicNotes: data.academicNotes,
        shootingMetrics: data.shootingMetrics,
        ballHandling: data.ballHandling,
        defense: data.defense,
        athleticism: data.athleticism,
        gameIQ: data.gameIQ,
        goals: data.goals,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        coachNotes: data.coachNotes,
        programsAttended: data.programsAttended || [],
        profileImage: data.profileImage,
        highlightVideo: data.highlightVideo
      }
    })

    return NextResponse.json(player, { status: 201 })
  } catch (error) {
    console.error('Create player error:', error)
    return NextResponse.json(
      { error: 'Failed to create player profile' },
      { status: 500 }
    )
  }
}
