const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPerformance() {
  try {
    console.log('📊 Checking page performance...\n');
    
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' },
      select: {
        id: true,
        pagePath: true,
        updatedAt: true
      }
    });
    
    for (const page of pages) {
      const perf = await prisma.sEOPerformance.findMany({
        where: {
          pagePath: page.pagePath,
          dateKey: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        }
      });
      
      if (perf.length > 0) {
        const avgPos = perf.reduce((sum, p) => sum + (p.position || 0), 0) / perf.length;
        const totalImp = perf.reduce((sum, p) => sum + p.impressions, 0);
        const totalClicks = perf.reduce((sum, p) => sum + p.clicks, 0);
        const avgCTR = perf.reduce((sum, p) => sum + p.ctr, 0) / perf.length;
        
        console.log(`\n${page.pagePath}`);
        console.log(`  Last updated: ${page.updatedAt.toISOString().split('T')[0]}`);
        console.log(`  Performance (last 30 days):`);
        console.log(`    Avg Position: ${avgPos.toFixed(2)}`);
        console.log(`    Total Impressions: ${totalImp}`);
        console.log(`    Total Clicks: ${totalClicks}`);
        console.log(`    Avg CTR: ${(avgCTR * 100).toFixed(2)}%`);
        console.log(`    Records: ${perf.length}`);
        
        if (avgPos > 10 || totalImp < 50) {
          console.log(`  ⚠️  Needs attention: ${avgPos > 10 ? 'Poor ranking' : 'Low impressions'}`);
        } else {
          console.log(`  ✅ Performing well`);
        }
      } else {
        console.log(`\n${page.pagePath}`);
        console.log(`  ⚠️  No performance data available`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPerformance();
