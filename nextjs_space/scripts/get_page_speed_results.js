const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getResults() {
  try {
    const audit = await prisma.sEOAuditLog.findFirst({
      where: { action: 'page_speed_monitored' },
      orderBy: { timestamp: 'desc' }
    });

    if (audit) {
      console.log(JSON.stringify(audit, null, 2));
    } else {
      console.log('No page speed audit found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getResults();
