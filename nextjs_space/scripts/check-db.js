const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDB() {
  try {
    const allLogs = await prisma.sEOAuditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 5
    });
    
    console.log('Total logs:', allLogs.length);
    console.log(JSON.stringify(allLogs, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDB();
