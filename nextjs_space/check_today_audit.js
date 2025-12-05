const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAudit() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const audits = await prisma.sEOAuditLog.findMany({
      where: {
        action: {
          contains: 'social'
        },
        timestamp: {
          gte: today
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    
    console.log(JSON.stringify(audits, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAudit();
