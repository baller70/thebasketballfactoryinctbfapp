const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSync() {
  try {
    // Check the latest audit log entry
    const latestLog = await prisma.sEOAuditLog.findFirst({
      where: { action: 'automated_ga_sync' },
      orderBy: { createdAt: 'desc' }
    });
    
    if (latestLog) {
      console.log('Latest GA Sync Audit Log:');
      console.log('- Created At:', latestLog.createdAt);
      console.log('- Action:', latestLog.action);
      console.log('- Performed By:', latestLog.performedBy);
      console.log('- Changes:', JSON.stringify(latestLog.changes, null, 2));
    } else {
      console.log('No audit log found for automated_ga_sync');
    }
    
    // Check keyword count
    const keywordCount = await prisma.sEOKeyword.count({
      where: { isActive: true }
    });
    console.log('\nActive Keywords:', keywordCount);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkSync();
