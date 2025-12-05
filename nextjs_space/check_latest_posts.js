const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkLatestPosts() {
  try {
    const latestPosts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_post'
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 3
    });
    
    console.log(`Latest ${latestPosts.length} posts:\n`);
    
    latestPosts.forEach((post, idx) => {
      const changes = typeof post.changes === 'string' ? JSON.parse(post.changes) : post.changes;
      console.log(`\n=== Post ${idx + 1} ===`);
      console.log(`Time: ${post.timestamp}`);
      console.log(`Entity: ${post.entityId || post.pagePath}`);
      console.log(`Tweet ID: ${changes.tweetId}`);
      console.log(`Tweet URL: https://twitter.com/user/status/${changes.tweetId}`);
      console.log(`Content:\n${changes.content}`);
      console.log(`Success: ${post.success}`);
      console.log(`Platform: ${changes.platform}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLatestPosts();
