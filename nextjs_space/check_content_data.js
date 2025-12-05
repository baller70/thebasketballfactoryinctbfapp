const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    // Check SEOPerformance records
    const seoPerf = await prisma.sEOPerformance.findMany({
      take: 5,
      orderBy: { lastUpdated: 'desc' },
      select: {
        id: true,
        url: true,
        avgPosition: true,
        impressions: true,
        lastUpdated: true
      }
    });
    
    console.log('\n📊 Recent SEO Performance Records:', seoPerf.length);
    seoPerf.forEach(p => {
      console.log(`  - ${p.url}: pos=${p.avgPosition}, imp=${p.impressions}, updated=${p.lastUpdated}`);
    });
    
    // Check ContentStrategy records
    const contentStrat = await prisma.contentStrategy.findMany({
      take: 5,
      orderBy: { lastRefreshDate: 'desc' },
      select: {
        id: true,
        url: true,
        lastRefreshDate: true,
        suggestions: true
      }
    });
    
    console.log('\n📝 Recent Content Strategy Records:', contentStrat.length);
    contentStrat.forEach(c => {
      console.log(`  - ${c.url}: lastRefresh=${c.lastRefreshDate}`);
    });
    
    // Check for stale content (30+ days old)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const staleContent = await prisma.contentStrategy.findMany({
      where: {
        OR: [
          { lastRefreshDate: { lt: thirtyDaysAgo } },
          { lastRefreshDate: null }
        ]
      },
      take: 10,
      select: {
        id: true,
        url: true,
        lastRefreshDate: true
      }
    });
    
    console.log(`\n⏰ Stale Content (30+ days or never refreshed):`, staleContent.length);
    staleContent.forEach(c => {
      console.log(`  - ${c.url}: lastRefresh=${c.lastRefreshDate || 'NEVER'}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
