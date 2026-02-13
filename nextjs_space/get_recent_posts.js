const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getRecentPosts() {
  try {
    const posts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_post',
        success: true
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    });
    
    console.log(`\n📊 Last ${posts.length} Successful Social Media Posts:\n`);
    
    posts.forEach((post, idx) => {
      const date = new Date(post.timestamp);
      console.log(`\n${idx + 1}. ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
      console.log(`   Page: ${post.pagePath}`);
      if (post.changes && post.changes.text) {
        console.log(`   Text: ${post.changes.text.substring(0, 100)}...`);
        console.log(`   Tweet ID: ${post.changes.tweetId}`);
      }
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

getRecentPosts();
