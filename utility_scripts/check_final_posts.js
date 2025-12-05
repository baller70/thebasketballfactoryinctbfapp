const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkFinalPosts() {
  try {
    // Check all audit logs related to social media
    const allAudits = await prisma.sEOAuditLog.findMany({
      where: {
        OR: [
          { action: { contains: 'social' } },
          { action: { contains: 'post' } },
          { action: 'SOCIAL_MEDIA_POST' },
          { action: 'social_media_posted' }
        ]
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 20
    });
    
    console.log('\n=== All Social Media Related Audit Logs ===');
    console.log(`Found ${allAudits.length} entries\n`);
    
    if (allAudits.length > 0) {
      allAudits.forEach((log, idx) => {
        console.log(`\n--- Entry ${idx + 1} ---`);
        console.log(`Action: ${log.action}`);
        console.log(`Timestamp: ${log.timestamp}`);
        console.log(`Performed By: ${log.performedBy}`);
        console.log(`Changes:`, JSON.stringify(log.changes, null, 2));
      });
    } else {
      console.log('No social media posts found in audit log.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkFinalPosts();
