import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkMismatch() {
  console.log('🔍 Checking for path mismatches...\n');

  // Get all unique page paths from performance data
  const perfData = await prisma.sEOPerformance.findMany({
    distinct: ['pagePath'],
    select: { pagePath: true }
  });

  console.log('Unique paths in SEOPerformance:');
  perfData.forEach(p => console.log(`  - ${p.pagePath}`));

  // Get all page paths from config
  const configData = await prisma.sEOPageConfig.findMany({
    select: { pagePath: true }
  });

  console.log('\nPaths in SEOPageConfig:');
  configData.forEach(p => console.log(`  - ${p.pagePath}`));

  // Get performance data with actual impressions
  const perfWithImpressions = await prisma.sEOPerformance.findMany({
    where: {
      impressions: { gt: 0 }
    },
    orderBy: { impressions: 'desc' },
    take: 20
  });

  console.log('\n📊 Performance records with impressions > 0:');
  perfWithImpressions.forEach(p => {
    const ctr = p.impressions > 0 ? ((p.clicks / p.impressions) * 100).toFixed(2) : '0.00';
    console.log(`  ${p.pagePath}: ${p.clicks} clicks, ${p.impressions} impressions, ${ctr}% CTR (${p.dateKey})`);
  });

  await prisma.$disconnect();
}

checkMismatch().catch(console.error);
