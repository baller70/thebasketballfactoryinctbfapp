const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRecentPosts() {
  try {
    const recentPosts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_posted'
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 5
    });

    console.log('\n=== Recent Social Media Posts (Full Details) ===\n');
    
    if (recentPosts.length === 0) {
      console.log('No social media posts found in audit log.');
    } else {
      recentPosts.forEach((post, index) => {
        console.log(`Post ${index + 1}:`);
        console.log(`  Timestamp: ${post.timestamp}`);
        console.log(`  Action: ${post.action}`);
        console.log(`  Entity Type: ${post.entityType}`);
        console.log(`  Performed By: ${post.performedBy}`);
        console.log(`  Changes: ${JSON.stringify(post.changes, null, 2)}`);
        console.log('---\n');
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecentPosts();
