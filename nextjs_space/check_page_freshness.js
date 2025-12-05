const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPages() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    console.log('📊 Checking page freshness status...\n');
    console.log(`30 days ago: ${thirtyDaysAgo.toISOString()}\n`);
    
    // Get all active pages
    const allPages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' },
      select: {
        id: true,
        pagePath: true,
        updatedAt: true,
        contentStrategy: true
      },
      orderBy: { updatedAt: 'asc' }
    });
    
    console.log(`Total active pages: ${allPages.length}\n`);
    
    // Pages older than 30 days
    const oldPages = allPages.filter(p => p.updatedAt < thirtyDaysAgo);
    console.log(`Pages older than 30 days: ${oldPages.length}\n`);
    
    if (oldPages.length > 0) {
      console.log('Old pages:');
      for (const page of oldPages.slice(0, 10)) {
        console.log(`  - ${page.pagePath}`);
        console.log(`    Last updated: ${page.updatedAt.toISOString()}`);
        console.log(`    Days old: ${Math.floor((Date.now() - page.updatedAt.getTime()) / (24 * 60 * 60 * 1000))}`);
        
        // Check performance
        const perf = await prisma.sEOPerformance.findMany({
          where: {
            pagePath: page.pagePath,
            dateKey: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
          }
        });
        console.log(`    Performance records: ${perf.length}`);
        if (perf.length > 0) {
          const avgPos = perf.reduce((sum, p) => sum + (p.position || 0), 0) / perf.length;
          const totalImp = perf.reduce((sum, p) => sum + p.impressions, 0);
          console.log(`    Avg position: ${avgPos.toFixed(2)}, Total impressions: ${totalImp}`);
        }
        console.log('');
      }
    }
    
    // Recent pages
    const recentPages = allPages.filter(p => p.updatedAt >= thirtyDaysAgo);
    console.log(`\nPages updated in last 30 days: ${recentPages.length}`);
    if (recentPages.length > 0) {
      console.log('Recent updates:');
      for (const page of recentPages.slice(0, 5)) {
        console.log(`  - ${page.pagePath} (${page.updatedAt.toISOString()})`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPages();
