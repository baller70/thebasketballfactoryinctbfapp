const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAudit() {
  try {
    const posts = await prisma.sEOAuditLog.findMany({
      where: {
        action: {
          contains: 'social'
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    });
    
    console.log(`\n📊 Social Media Audit Entries: ${posts.length}\n`);
    
    posts.forEach((post, idx) => {
      console.log(`Entry ${idx + 1}:`);
      console.log(`  Action: ${post.action}`);
      console.log(`  Time: ${post.timestamp}`);
      console.log(`  Details: ${JSON.stringify(post.changes, null, 2)}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAudit();
