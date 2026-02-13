const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRecentAudits() {
  try {
    const posts = await prisma.sEOAuditLog.findMany({
      orderBy: {
        timestamp: 'desc'
      },
      take: 20
    });
    
    console.log(`\n📊 Last 20 Audit Log Entries:\n`);
    
    posts.forEach((post, idx) => {
      console.log(`Entry ${idx + 1}:`);
      console.log(`  Time: ${post.timestamp}`);
      console.log(`  Action: ${post.action}`);
      console.log(`  Details: ${post.details?.substring(0, 100)}...`);
      console.log(`  Status: ${post.status}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecentAudits();
