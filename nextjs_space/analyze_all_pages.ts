import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function analyzeAllPages() {
  console.log('📊 Analyzing all pages with performance data...\n');

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Get all unique page paths with performance data
  const allPaths = await prisma.sEOPerformance.findMany({
    where: {
      dateKey: { gte: thirtyDaysAgo },
      pagePath: { not: null }
    },
    distinct: ['pagePath'],
    select: { pagePath: true }
  });

  console.log(`Found ${allPaths.length} unique pages with performance data in last 30 days\n`);

  const lowCTRPages: any[] = [];

  for (const pathObj of allPaths) {
    const path = pathObj.pagePath;
    if (!path) continue;

    const perfData = await prisma.sEOPerformance.findMany({
      where: {
        pagePath: path,
        dateKey: { gte: thirtyDaysAgo }
      }
    });

    const totalImpressions = perfData.reduce((sum, p) => sum + p.impressions, 0);
    const totalClicks = perfData.reduce((sum, p) => sum + p.clicks, 0);
    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    if (totalImpressions > 100 && avgCTR < 2.0) {
      lowCTRPages.push({
        path,
        impressions: totalImpressions,
        clicks: totalClicks,
        ctr: avgCTR
      });
    }
  }

  console.log(`\n🎯 Pages needing optimization (CTR < 2% and impressions > 100):\n`);
  
  if (lowCTRPages.length === 0) {
    console.log('✓ No pages found that meet the criteria for optimization');
  } else {
    lowCTRPages
      .sort((a, b) => b.impressions - a.impressions)
      .forEach(page => {
        console.log(`${page.path}`);
        console.log(`  Impressions: ${page.impressions}`);
        console.log(`  Clicks: ${page.clicks}`);
        console.log(`  CTR: ${page.ctr.toFixed(2)}%\n`);
      });
  }

  // Show top pages by impressions
  const topPages: any[] = [];
  for (const pathObj of allPaths.slice(0, 20)) {
    const path = pathObj.pagePath;
    if (!path) continue;

    const perfData = await prisma.sEOPerformance.findMany({
      where: {
        pagePath: path,
        dateKey: { gte: thirtyDaysAgo }
      }
    });

    const totalImpressions = perfData.reduce((sum, p) => sum + p.impressions, 0);
    const totalClicks = perfData.reduce((sum, p) => sum + p.clicks, 0);
    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    if (totalImpressions > 0) {
      topPages.push({
        path,
        impressions: totalImpressions,
        clicks: totalClicks,
        ctr: avgCTR
      });
    }
  }

  console.log(`\n📈 Top 10 pages by impressions:\n`);
  topPages
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10)
    .forEach(page => {
      console.log(`${page.path}`);
      console.log(`  Impressions: ${page.impressions}, Clicks: ${page.clicks}, CTR: ${page.ctr.toFixed(2)}%\n`);
    });

  await prisma.$disconnect();
  
  return { lowCTRPages, topPages };
}

analyzeAllPages().catch(console.error);
