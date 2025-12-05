const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRecentAudits() {
  try {
    // Get all audit logs from the last 2 hours
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    
    const audits = await prisma.sEOAuditLog.findMany({
      where: {
        timestamp: {
          gte: twoHoursAgo
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    console.log(`\n📊 Found ${audits.length} audit logs in the last 2 hours:\n`);
    
    audits.forEach((audit, index) => {
      console.log(`${index + 1}. ${audit.timestamp.toISOString()}`);
      console.log(`   Action: ${audit.action}`);
      console.log(`   Entity: ${audit.entityType}`);
      console.log(`   Success: ${audit.success}`);
      if (audit.changes) {
        console.log(`   Changes: ${JSON.stringify(audit.changes)?.substring(0, 200)}...`);
      }
      console.log();
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecentAudits();
