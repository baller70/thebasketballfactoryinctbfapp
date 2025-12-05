const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAllAudits() {
  try {
    // Get all audit logs from today
    const today = new Date('2025-11-22T00:00:00Z');
    const tomorrow = new Date('2025-11-23T00:00:00Z');
    
    const audits = await prisma.sEOAuditLog.findMany({
      where: {
        timestamp: {
          gte: today,
          lt: tomorrow
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    console.log(`\n📊 Found ${audits.length} audit logs on November 22, 2025:\n`);
    
    audits.forEach((audit, index) => {
      console.log(`${index + 1}. ${audit.timestamp.toISOString()}`);
      console.log(`   Action: ${audit.action}`);
      console.log(`   Entity: ${audit.entityType}`);
      console.log(`   Success: ${audit.success}`);
      console.log(`   Changes: ${JSON.stringify(audit.changes)?.substring(0, 150)}...`);
      console.log();
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllAudits();
