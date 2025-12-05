
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Fetch dashboard statistics
    const [
      totalRegistrations,
      pendingRegistrations,
      activePlayers,
      recentActivity
    ] = await Promise.all([
      prisma.programRegistration.count(),
      prisma.programRegistration.count({ where: { status: 'pending' } }),
      prisma.playerProfile.count({ where: { isActive: true } }),
      prisma.programRegistration.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      })
    ])

    // Calculate revenue (you can customize this based on your pricing)
    const paidRegistrations = await prisma.programRegistration.count({
      where: { paymentStatus: 'paid' }
    })
    const totalRevenue = paidRegistrations * 150 // Example: $150 per registration

    // Calculate conversion rate
    const totalJourneys = await prisma.websiteJourney.count()
    const convertedJourneys = await prisma.websiteJourney.count({
      where: { converted: true }
    })
    const conversionRate = totalJourneys > 0 
      ? Math.round((convertedJourneys / totalJourneys) * 100) 
      : 0

    return NextResponse.json({
      totalRegistrations,
      pendingRegistrations,
      totalRevenue,
      activePlayers,
      recentActivity,
      conversionRate
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
