const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  console.log('\n=== Schema Markup Applied ===');
  const pagesWithSchema = await prisma.sEOPageConfig.findMany({
    where: {
      contentStrategy: { not: null }
    },
    select: {
      pagePath: true,
      pageName: true,
      contentStrategy: true,
      updatedAt: true
    }
  });
  
  pagesWithSchema.forEach(page => {
    try {
      const strategy = JSON.parse(page.contentStrategy);
      if (strategy.schemaMarkup) {
        console.log(`✓ ${page.pagePath}: ${strategy.schemaMarkup['@type']}`);
      }
    } catch (e) {}
  });

  console.log('\n=== Recent Audit Logs ===');
  const logs = await prisma.sEOAuditLog.findMany({
    orderBy: { timestamp: 'desc' },
    take: 5,
    select: {
      action: true,
      changes: true,
      timestamp: true
    }
  });
  
  logs.forEach(log => {
    console.log(`\n${log.action} (${log.timestamp.toISOString()})`);
    console.log(JSON.stringify(log.changes, null, 2));
  });

  await prisma.$disconnect();
}

verify().catch(console.error);
