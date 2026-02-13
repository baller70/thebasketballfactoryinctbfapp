const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRecentPosts() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const posts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_post',
        timestamp: {
          gte: today
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    });
    
    console.log(`\n📊 Found ${posts.length} social media posts today:\n`);
    
    posts.forEach((post, idx) => {
      console.log(`${idx + 1}. ${post.timestamp.toISOString()}`);
      console.log(`   Page: ${post.pagePath}`);
      if (post.changes) {
        console.log(`   Tweet ID: ${post.changes.tweetId}`);
        console.log(`   Text: ${post.changes.text.substring(0, 60)}...`);
      }
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecentPosts();
