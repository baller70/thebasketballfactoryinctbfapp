const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    console.log('Checking SEOPerformance data...');
    const perfCount = await prisma.sEOPerformance.count();
    console.log(`Total SEOPerformance records: ${perfCount}`);
    
    const topContent = await prisma.sEOPerformance.findMany({
      where: {
        dateKey: {
          gte: sevenDaysAgo.toISOString().split('T')[0]
        }
      },
      orderBy: { clicks: 'desc' },
      take: 5
    });
    console.log(`Top content from last 7 days: ${topContent.length} records`);
    if (topContent.length > 0) {
      console.log('Sample record:', JSON.stringify(topContent[0], null, 2));
    }
    
    console.log('\nChecking SEOPageConfig data...');
    const configCount = await prisma.sEOPageConfig.count();
    console.log(`Total SEOPageConfig records: ${configCount}`);
    
    const recentPrograms = await prisma.sEOPageConfig.findMany({
      where: {
        status: 'active',
        pagePath: {
          contains: '/programs/'
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 3
    });
    console.log(`Recent programs: ${recentPrograms.length} records`);
    if (recentPrograms.length > 0) {
      console.log('Sample program:', JSON.stringify(recentPrograms[0], null, 2));
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
