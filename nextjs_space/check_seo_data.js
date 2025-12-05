const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  console.log('\n=== Checking SEO Data ===\n');
  
  // Check SEOPageConfig
  const pages = await prisma.sEOPageConfig.findMany({
    take: 5,
    orderBy: { updatedAt: 'desc' }
  });
  console.log(`SEOPageConfig records: ${pages.length}`);
  if (pages.length > 0) {
    console.log('Sample page:', pages[0].pagePath);
  }
  
  // Check SEOPerformance
  const performance = await prisma.sEOPerformance.findMany({
    take: 5,
    orderBy: { date: 'desc' }
  });
  console.log(`\nSEOPerformance records: ${performance.length}`);
  if (performance.length > 0) {
    console.log('Latest date:', performance[0].date);
    console.log('Sample:', performance[0].pagePath, '- Clicks:', performance[0].clicks);
  }
  
  // Check recent performance with clicks
  const recentPerf = await prisma.sEOPerformance.findMany({
    where: {
      clicks: { gt: 0 }
    },
    take: 10,
    orderBy: { clicks: 'desc' }
  });
  console.log(`\nPages with clicks: ${recentPerf.length}`);
  recentPerf.forEach((p, idx) => {
    console.log(`${idx + 1}. ${p.pagePath} - ${p.clicks} clicks on ${p.date.toISOString().split('T')[0]}`);
  });
  
  await prisma.$disconnect();
}

checkData().catch(console.error);
