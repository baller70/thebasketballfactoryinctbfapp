const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkResults() {
  console.log('\n=== SCHEMA MARKUP RESULTS ===');
  const schemaPages = await prisma.sEOPageData.findMany({
    where: {
      schemaMarkup: { not: null }
    },
    select: {
      url: true,
      schemaMarkup: true,
      updatedAt: true
    },
    orderBy: { updatedAt: 'desc' },
    take: 10
  });
  
  console.log(`Found ${schemaPages.length} pages with schema markup:`);
  schemaPages.forEach(page => {
    const schema = JSON.parse(page.schemaMarkup);
    console.log(`\n  ${page.url}`);
    console.log(`    Type: ${schema['@type']}`);
    console.log(`    Updated: ${page.updatedAt.toISOString()}`);
  });

  console.log('\n=== PAGE SPEED RESULTS ===');
  const speedData = await prisma.pageSpeedData.findMany({
    orderBy: { checkedAt: 'desc' },
    take: 10
  });
  
  console.log(`Found ${speedData.length} recent page speed checks:`);
  speedData.forEach(data => {
    console.log(`\n  ${data.url}`);
    console.log(`    Load Time: ${data.loadTime}ms`);
    console.log(`    Performance Score: ${data.performanceScore}`);
    console.log(`    Checked: ${data.checkedAt.toISOString()}`);
  });

  console.log('\n=== INTERNAL LINKS ===');
  const links = await prisma.internalLink.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  
  console.log(`Found ${links.length} internal link suggestions`);
  
  await prisma.$disconnect();
}

checkResults().catch(console.error);
