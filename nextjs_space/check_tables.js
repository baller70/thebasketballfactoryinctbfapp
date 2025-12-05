const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTables() {
  try {
    // Check SEOPageConfig
    const pages = await prisma.sEOPageConfig.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 10
    });
    
    console.log('\n=== SEO PAGE CONFIG ===');
    console.log(`Found ${pages.length} pages:`);
    pages.forEach(page => {
      console.log(`\n  ${page.pagePath}`);
      console.log(`    Title: ${page.pageTitle || 'N/A'}`);
      console.log(`    Meta: ${page.metaDescription ? page.metaDescription.substring(0, 60) + '...' : 'N/A'}`);
      console.log(`    Updated: ${page.updatedAt.toISOString()}`);
    });

    // Check SEOPerformance
    const performance = await prisma.sEOPerformance.findMany({
      orderBy: { date: 'desc' },
      take: 5
    });
    
    console.log('\n=== SEO PERFORMANCE ===');
    console.log(`Found ${performance.length} recent performance records`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables().catch(console.error);
