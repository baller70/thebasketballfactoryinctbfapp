const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    // Check all SEOPageConfig records
    const allPages = await prisma.sEOPageConfig.findMany({
      select: {
        id: true,
        pagePath: true,
        status: true,
        updatedAt: true,
        contentStrategy: true
      },
      orderBy: { updatedAt: 'desc' }
    });
    
    console.log(`\n📄 Total SEOPageConfig records: ${allPages.length}`);
    
    // Check active pages
    const activePages = allPages.filter(p => p.status === 'active');
    console.log(`✅ Active pages: ${activePages.length}`);
    
    // Check stale pages (30+ days old)
    const stalePages = activePages.filter(p => p.updatedAt < thirtyDaysAgo);
    console.log(`⏰ Stale pages (30+ days): ${stalePages.length}`);
    
    if (stalePages.length > 0) {
      console.log('\nStale pages:');
      for (const page of stalePages.slice(0, 10)) {
        console.log(`  - ${page.pagePath}: updated ${page.updatedAt.toISOString().split('T')[0]}`);
        
        // Check if there's performance data
        const perfData = await prisma.sEOPerformance.findMany({
          where: { pagePath: page.pagePath },
          take: 1
        });
        console.log(`    Performance data: ${perfData.length > 0 ? 'YES' : 'NO'}`);
      }
    }
    
    // Show recent pages
    console.log('\n📊 Most recently updated pages:');
    allPages.slice(0, 5).forEach(p => {
      console.log(`  - ${p.pagePath}: ${p.updatedAt.toISOString().split('T')[0]} (${p.status})`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
