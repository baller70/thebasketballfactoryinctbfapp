import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedPerformanceData() {
  try {
    console.log('⚠️  SKIPPING SEO performance data seeding - Performance data should come from Google Analytics sync only')
    console.log('ℹ️  This script has been disabled to prevent hardcoded data. Use Google Analytics sync instead.')
    return // Exit early - no seeding

    // Get all keywords
    const keywords = await prisma.sEOKeyword.findMany()
    
    if (keywords.length === 0) {
      console.log('No keywords found. Please run the main seed script first.')
      return
    }

    // Create performance data for the last 30 days
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)

    const performanceRecords = []

    // For each keyword, create daily performance records
    for (const keyword of keywords) {
      const currentDate = new Date(startDate)
      
      while (currentDate <= endDate) {
        const dateKey = currentDate.toISOString().split('T')[0]
        
        // Generate realistic performance data based on keyword
        const baseImpressions = Math.floor(Math.random() * 500) + 100
        const clickRate = (Math.random() * 5) + 1  // 1-6% CTR
        const clicks = Math.floor(baseImpressions * (clickRate / 100))
        const conversions = Math.floor(clicks * (Math.random() * 0.15)) // 0-15% conversion
        const position = Math.random() * 30 + 1 // Position 1-30
        
        performanceRecords.push({
          keywordId: keyword.id,
          date: new Date(currentDate),
          dateKey: dateKey,
          impressions: baseImpressions,
          clicks: clicks,
          ctr: clickRate,
          position: position,
          conversions: conversions,
          organicTraffic: Math.floor(clicks * 0.9),
          pageViews: Math.floor(clicks * 1.3),
          bounceRate: Math.random() * 40 + 30, // 30-70%
          avgSessionDuration: Math.floor(Math.random() * 180) + 60 // 60-240 seconds
        })
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1)
      }
    }

    // Bulk create performance records
    console.log(`Creating ${performanceRecords.length} performance records...`)
    const result = await prisma.sEOPerformance.createMany({
      data: performanceRecords,
      skipDuplicates: true
    })

    console.log(`✓ Created ${result.count} performance records`)
    console.log('SEO performance data seeding completed!')

  } catch (error) {
    console.error('Error seeding performance data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedPerformanceData()
