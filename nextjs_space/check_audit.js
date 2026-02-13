const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAudit() {
  try {
    const audits = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'page_speed_monitored'
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 1
    });

    console.log('Latest Page Speed Audit:');
    console.log(JSON.stringify(audits, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAudit();
