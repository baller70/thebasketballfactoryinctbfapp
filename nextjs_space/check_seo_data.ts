import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  console.log('📊 Checking SEO Data...\n');

  // Check SEO Page Config
  const pages = await prisma.sEOPageConfig.findMany({
    where: { status: 'active' }
  });
  console.log(`✓ Found ${pages.length} active pages`);

  // Check SEO Performance data
  const performance = await prisma.sEOPerformance.findMany({
    take: 10,
    orderBy: { dateKey: 'desc' }
  });
  console.log(`✓ Found ${performance.length} performance records (showing latest 10)`);

  if (performance.length > 0) {
    console.log('\nLatest Performance Data:');
    performance.forEach(p => {
      const ctr = p.impressions > 0 ? ((p.clicks / p.impressions) * 100).toFixed(2) : '0.00';
      console.log(`  ${p.pagePath}: ${p.clicks} clicks, ${p.impressions} impressions, ${ctr}% CTR (${p.dateKey})`);
    });
  }

  // Check for pages with low CTR
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  console.log(`\n📅 Checking performance since ${thirtyDaysAgo}...`);

  for (const page of pages) {
    const pagePerf = await prisma.sEOPerformance.findMany({
      where: {
        pagePath: page.pagePath,
        dateKey: { gte: thirtyDaysAgo }
      }
    });

    if (pagePerf.length > 0) {
      const totalImpressions = pagePerf.reduce((sum, p) => sum + p.impressions, 0);
      const totalClicks = pagePerf.reduce((sum, p) => sum + p.clicks, 0);
      const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

      console.log(`\n${page.pagePath}:`);
      console.log(`  Records: ${pagePerf.length}`);
      console.log(`  Total Impressions: ${totalImpressions}`);
      console.log(`  Total Clicks: ${totalClicks}`);
      console.log(`  Average CTR: ${avgCTR.toFixed(2)}%`);
      console.log(`  Current Meta: ${page.metaDescription || 'None'}`);
      
      if (avgCTR < 2.0 && totalImpressions > 100) {
        console.log(`  ⚠️  NEEDS OPTIMIZATION (CTR < 2% and impressions > 100)`);
      }
    } else {
      console.log(`\n${page.pagePath}: No performance data in last 30 days`);
    }
  }

  await prisma.$disconnect();
}

checkData().catch(console.error);
