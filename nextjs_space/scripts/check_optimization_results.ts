import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkResults() {
  console.log('\n=== Schema Markup Results ===');
  const schemaPages = await prisma.sEOPage.findMany({
    where: {
      schemaMarkup: { not: null }
    },
    select: {
      url: true,
      schemaMarkup: true,
      updatedAt: true
    },
    orderBy: { updatedAt: 'desc' },
    take: 5
  });
  
  console.log(`Found ${schemaPages.length} pages with schema markup:`);
  schemaPages.forEach(page => {
    const schema = JSON.parse(page.schemaMarkup || '{}');
    console.log(`  - ${page.url}: ${schema['@type'] || 'Unknown'} (updated: ${page.updatedAt.toISOString()})`);
  });

  console.log('\n=== Meta Description Optimizations ===');
  const recentMeta = await prisma.sEOPage.findMany({
    where: {
      metaDescription: { not: null },
      updatedAt: { gte: new Date(Date.now() - 60 * 60 * 1000) }
    },
    select: {
      url: true,
      metaDescription: true,
      updatedAt: true
    },
    orderBy: { updatedAt: 'desc' },
    take: 5
  });
  
  console.log(`Found ${recentMeta.length} pages with recent meta updates`);

  console.log('\n=== Internal Links ===');
  const internalLinks = await prisma.internalLink.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      fromUrl: true,
      toUrl: true,
      anchorText: true,
      relevanceScore: true,
      createdAt: true
    }
  });
  
  console.log(`Found ${internalLinks.length} internal link suggestions`);
  internalLinks.forEach(link => {
    console.log(`  - ${link.fromUrl} → ${link.toUrl} (score: ${link.relevanceScore})`);
  });

  console.log('\n=== Page Speed Monitoring ===');
  const pageSpeed = await prisma.pageSpeed.findMany({
    orderBy: { checkedAt: 'desc' },
    take: 5,
    select: {
      url: true,
      loadTime: true,
      checkedAt: true
    }
  });
  
  console.log(`Found ${pageSpeed.length} page speed records:`);
  pageSpeed.forEach(ps => {
    console.log(`  - ${ps.url}: ${ps.loadTime}ms (checked: ${ps.checkedAt.toISOString()})`);
  });

  await prisma.$disconnect();
}

checkResults().catch(console.error);
