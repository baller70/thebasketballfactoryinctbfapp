import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking SEO data...\n');
  
  const perfCount = await prisma.sEOPerformance.count();
  console.log(`SEOPerformance records: ${perfCount}`);
  
  if (perfCount > 0) {
    const sample = await prisma.sEOPerformance.findMany({ take: 5 });
    console.log('\nSample records:');
    sample.forEach(r => console.log(`  - ${r.pagePath}: ${r.impressions} impressions, CTR: ${r.ctr}`));
  }
  
  const pageConfigCount = await prisma.sEOPageConfig.count();
  console.log(`\nSEOPageConfig records: ${pageConfigCount}`);
  
  if (pageConfigCount > 0) {
    const configs = await prisma.sEOPageConfig.findMany({ take: 5 });
    console.log('\nSample configs:');
    configs.forEach(c => console.log(`  - ${c.pagePath}: ${c.pageName}`));
  }
  
  const auditCount = await prisma.sEOAuditLog.count();
  console.log(`\nSEOAuditLog records: ${auditCount}`);
  
  if (auditCount > 0) {
    const audits = await prisma.sEOAuditLog.findMany({ 
      orderBy: { timestamp: 'desc' },
      take: 3 
    });
    console.log('\nRecent audit logs:');
    audits.forEach(a => console.log(`  - ${a.action} (${a.entityType}) at ${a.timestamp}`));
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
  });
