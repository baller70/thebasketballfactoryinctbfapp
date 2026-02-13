const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyTodayPosts() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayPosts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_post',
        timestamp: {
          gte: today
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    
    console.log(`\n✅ Found ${todayPosts.length} posts created today (${today.toDateString()})\n`);
    
    todayPosts.forEach((post, index) => {
      console.log(`Post ${index + 1}:`);
      console.log(`  Time: ${post.timestamp.toISOString()}`);
      console.log(`  Page: ${post.pagePath || 'N/A'}`);
      console.log(`  Success: ${post.success}`);
      if (post.changes && typeof post.changes === 'object') {
        console.log(`  Tweet ID: ${post.changes.tweetId || 'N/A'}`);
        console.log(`  Content: ${post.changes.text ? post.changes.text.substring(0, 80) + '...' : 'N/A'}`);
      }
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyTodayPosts();
