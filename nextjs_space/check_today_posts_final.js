const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTodayPosts() {
  try {
    // Get posts from today (Nov 22, 2025)
    const today = new Date('2025-11-22T00:00:00Z');
    const tomorrow = new Date('2025-11-23T00:00:00Z');
    
    const todayPosts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_post',
        timestamp: {
          gte: today,
          lt: tomorrow
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    console.log(`\n📊 Found ${todayPosts.length} posts on November 22, 2025:\n`);
    
    todayPosts.forEach((post, index) => {
      const changes = post.changes || {};
      console.log(`${index + 1}. ${post.timestamp.toISOString()}`);
      console.log(`   Platform: ${changes.platform || 'Unknown'}`);
      console.log(`   Content: ${changes.content?.substring(0, 100) || 'N/A'}...`);
      console.log(`   URL: ${changes.url || 'N/A'}`);
      console.log(`   Tweet ID: ${changes.tweetId || 'N/A'}`);
      console.log(`   Success: ${post.success}\n`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTodayPosts();
