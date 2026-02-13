import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getPageSpeedData() {
  try {
    // Get the latest page speed audit logs
    const auditLogs = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'page_speed_monitored'
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 1
    });

    console.log(JSON.stringify(auditLogs, null, 2));
  } catch (error) {
    console.error('Error fetching page speed data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getPageSpeedData();
