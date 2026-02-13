const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRecentPosts() {
  try {
    const recentPosts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_post'
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    });

    console.log('\n=== Recent Social Media Posts ===\n');
    
    if (recentPosts.length === 0) {
      console.log('No social media posts found in audit log.');
    } else {
      recentPosts.forEach((post, index) => {
        console.log(`Post ${index + 1}:`);
        console.log(`  Timestamp: ${post.timestamp}`);
        console.log(`  Details: ${post.details}`);
        console.log(`  Status: ${post.status}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecentPosts();
