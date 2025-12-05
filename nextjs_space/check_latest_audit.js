const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkLatestAudit() {
  try {
    // Get the most recent audit logs
    const logs = await prisma.sEOAuditLog.findMany({
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    });
    
    console.log('Latest audit logs:');
    logs.forEach((log, idx) => {
      console.log(`\n${idx + 1}. Action: ${log.action}`);
      console.log(`   Time: ${log.timestamp}`);
      console.log(`   Entity: ${log.entityType} - ${log.entityId}`);
      console.log(`   Reason: ${log.reason}`);
      console.log(`   Success: ${log.success}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkLatestAudit();
