const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getTodayPosts() {
  try {
    const today = new Date('2025-12-06');
    const tomorrow = new Date('2025-12-07');
    
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

    console.log('\n📊 Today\'s Social Media Posts (2025-12-06):\n');
    console.log(`Total posts: ${todayPosts.length}\n`);
    
    todayPosts.forEach((post, index) => {
      console.log(`Post ${index + 1}:`);
      console.log(`  Time: ${post.timestamp.toISOString()}`);
      console.log(`  Page: ${post.page || 'N/A'}`);
      console.log(`  Action: ${post.action}`);
      console.log(`  Details: ${post.details || 'N/A'}`);
      console.log(`  Status: ${post.status || 'N/A'}`);
      console.log(`  Metadata: ${post.metadata || 'N/A'}`);
      console.log('');
    });

    // Also get the actual post content from metadata if available
    console.log('\n📝 Post Content:\n');
    todayPosts.forEach((post, index) => {
      if (post.metadata) {
        try {
          const meta = JSON.parse(post.metadata);
          console.log(`Post ${index + 1}:`);
          console.log(`  Text: ${meta.text || meta.content || 'N/A'}`);
          console.log(`  URL: ${meta.url || 'N/A'}`);
          console.log(`  Hashtags: ${meta.hashtags || 'N/A'}`);
          console.log('');
        } catch (e) {
          console.log(`Post ${index + 1}: Unable to parse metadata`);
        }
      }
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

getTodayPosts();
