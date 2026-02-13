const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyPosts() {
  try {
    // Get all posts from the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const recentPosts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_post',
        timestamp: {
          gte: oneHourAgo
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    
    console.log(`Found ${recentPosts.length} posts in the last hour`);
    
    for (const post of recentPosts) {
      console.log('\n' + '='.repeat(80));
      console.log('Timestamp:', post.timestamp);
      console.log('Page:', post.pagePath);
      console.log('Tweet ID:', post.changes.tweetId);
      console.log('Text:', post.changes.text);
      console.log('Success:', post.success);
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyPosts();
