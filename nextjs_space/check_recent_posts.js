const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRecentPosts() {
  try {
    // Get posts from the last 2 hours
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    
    const recentPosts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_post',
        timestamp: {
          gte: twoHoursAgo
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    });
    
    console.log('Recent posts in last 2 hours:', recentPosts.length);
    recentPosts.forEach(post => {
      console.log(`\n- ${post.timestamp.toISOString()}`);
      console.log(`  Status: ${post.result}`);
      if (post.details) {
        try {
          const details = JSON.parse(post.details);
          console.log(`  Content: ${details.content?.substring(0, 80)}...`);
        } catch (e) {
          console.log(`  Details: ${post.details.substring(0, 80)}...`);
        }
      }
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecentPosts();
