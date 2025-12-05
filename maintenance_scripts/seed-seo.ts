import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedSEO() {
  console.log('🔍 Seeding SEO data...')

  // Create SEO settings
  const settings = await prisma.sEOSettings.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      autoGenerateEnabled: true,
      defaultUpdateFrequency: 'weekly',
      contentQualityThreshold: 70.0,
      requireManualApproval: true,
      primaryLocation: 'Sparta, NJ',
      targetRadius: 15,
      targetCities: [
        'Sparta', 'Newton', 'Hopatcong', 'Sussex', 'Andover', 'Franklin',
        'Hamburg', 'Ogdensburg', 'Lake Mohawk', 'Byram', 'Stanhope'
      ],
      targetCounties: ['Sussex County', 'Morris County', 'Warren County'],
      stateTargeting: 'New Jersey',
      contentTone: 'Professional yet friendly and approachable',
      targetAudience: 'Parents of children aged 7-18 interested in basketball skill development',
      keySellingPoints: [
        'Expert coaching with proven track record',
        'Personalized training programs',
        'State-of-the-art facilities',
        'Focus on skill development and character building'
      ],
      primaryKeywords: [
        'basketball training sparta nj',
        'youth basketball programs sparta',
        'basketball skills development sparta nj',
        'private basketball lessons sparta',
        'basketball camps sussex county nj',
        'basketball coaching sparta new jersey'
      ],
      enableWeeklyReport: true,
      enableMonthlyReport: true,
      alertOnDrop: true
    },
    update: {}
  })

  console.log('✅ SEO settings created')

  // No hardcoded keywords - these should come from Google Analytics sync or manual import
  console.log('ℹ️  Skipping keyword seeding - keywords will be populated via Google Analytics sync or CSV import')

  // No hardcoded page configurations - these should come from Google Analytics sync or manual setup
  console.log('ℹ️  Skipping page configuration seeding - pages will be configured via admin interface')

  console.log('✅ SEO seed data completed!')
}

seedSEO()
  .catch((e) => {
    console.error('❌ Error seeding SEO data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
