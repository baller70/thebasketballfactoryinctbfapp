import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('='.repeat(70));
  console.log('VERIFICATION: Weekly Content Optimization Updates');
  console.log('='.repeat(70));
  
  // Check recent audit logs
  console.log('\n📋 Recent Audit Logs:');
  const recentAudits = await prisma.sEOAuditLog.findMany({
    where: {
      action: {
        in: ['internal_links_generated', 'page_speed_monitored', 'content_freshness_updated']
      }
    },
    orderBy: { timestamp: 'desc' },
    take: 5
  });
  
  recentAudits.forEach(audit => {
    console.log(`  ✅ ${audit.action} (${audit.entityType})`);
    console.log(`     Time: ${audit.timestamp}`);
    console.log(`     Success: ${audit.success}`);
  });
  
  // Check SEOPageConfig updates
  console.log('\n📄 SEOPageConfig Records:');
  const configs = await prisma.sEOPageConfig.findMany({
    select: {
      pagePath: true,
      pageName: true,
      metaDescription: true,
      lastGenerated: true
    },
    orderBy: { lastGenerated: 'desc' },
    take: 5
  });
  
  configs.forEach(config => {
    console.log(`  📄 ${config.pagePath} (${config.pageName})`);
    console.log(`     Last Updated: ${config.lastGenerated}`);
    if (config.metaDescription) {
      console.log(`     Meta: ${config.metaDescription.substring(0, 60)}...`);
    }
  });
  
  console.log('\n' + '='.repeat(70));
  console.log('✅ Verification Complete');
  console.log('='.repeat(70));
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
  });
