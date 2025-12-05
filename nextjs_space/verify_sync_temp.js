const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifySyncData() {
  try {
    const ga4Count = await prisma.sEOPerformance.count({
      where: {
        date: {
          gte: new Date('2025-10-27'),
          lte: new Date('2025-11-26')
        }
      }
    });
    
    const latestGA4 = await prisma.sEOPerformance.findMany({
      orderBy: { date: 'desc' },
      take: 5,
      select: {
        date: true,
        page: true,
        sessions: true,
        pageviews: true
      }
    });
    
    console.log('\n=== GA4 Data Verification ===');
    console.log(`Total GA4 records in date range: ${ga4Count}`);
    console.log('\nLatest 5 GA4 records:');
    latestGA4.forEach(record => {
      console.log(`  ${record.date.toISOString().split('T')[0]} | ${record.page} | Sessions: ${record.sessions} | Pageviews: ${record.pageviews}`);
    });
    
    const gscCount = await prisma.searchConsoleData.count({
      where: {
        date: {
          gte: new Date('2025-10-27'),
          lte: new Date('2025-11-26')
        }
      }
    });
    
    const latestGSC = await prisma.searchConsoleData.findMany({
      orderBy: { date: 'desc' },
      take: 5,
      select: {
        date: true,
        page: true,
        query: true,
        clicks: true,
        impressions: true,
        position: true
      }
    });
    
    console.log('\n=== Search Console Data Verification ===');
    console.log(`Total GSC records in date range: ${gscCount}`);
    console.log('\nLatest 5 GSC records:');
    latestGSC.forEach(record => {
      console.log(`  ${record.date.toISOString().split('T')[0]} | ${record.query} | Clicks: ${record.clicks} | Impressions: ${record.impressions} | Pos: ${record.position.toFixed(1)}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifySyncData();
