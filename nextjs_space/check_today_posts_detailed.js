const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTodayPosts() {
  try {
    // Get posts from the last 24 hours
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);
    
    const recentPosts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_post',
        timestamp: {
          gte: yesterday
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    
    console.log(`\n📊 Posts in last 24 hours: ${recentPosts.length}\n`);
    
    recentPosts.forEach((post, index) => {
      console.log(`\n--- Post ${index + 1} ---`);
      console.log(`Time: ${post.timestamp.toISOString()}`);
      console.log(`Success: ${post.success}`);
      console.log(`Page: ${post.pagePath || 'N/A'}`);
      
      if (post.changes) {
        const changes = typeof post.changes === 'string' ? JSON.parse(post.changes) : post.changes;
        if (changes.tweetId) {
          console.log(`Tweet ID: ${changes.tweetId}`);
          console.log(`Tweet URL: https://twitter.com/i/web/status/${changes.tweetId}`);
        }
        if (changes.text) {
          console.log(`Content: ${changes.text.substring(0, 100)}...`);
        }
      }
    });
    
    console.log('\n✅ Check complete\n');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTodayPosts();
