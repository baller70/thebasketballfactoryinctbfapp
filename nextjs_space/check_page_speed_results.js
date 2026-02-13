const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkResults() {
  try {
    // Get the most recent page speed audit logs
    const recentAudits = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'page_speed_check'
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    });

    console.log('Recent Page Speed Audits:');
    console.log(JSON.stringify(recentAudits, null, 2));

    // Get SEO page configs to see what pages were checked
    const pages = await prisma.sEOPageConfig.findMany({
      select: {
        pagePath: true,
        pageTitle: true,
        status: true
      }
    });

    console.log('\nActive Pages:');
    console.log(JSON.stringify(pages, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkResults();
