const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSocialPosts() {
  try {
    const posts = await prisma.sEOAuditLog.findMany({
      where: {
        OR: [
          { action: { contains: 'social' } },
          { action: { contains: 'twitter' } },
          { action: { contains: 'post' } }
        ]
      },
      orderBy: { timestamp: 'desc' },
      take: 20
    });
    
    console.log(`Found ${posts.length} social media related audit entries:\n`);
    posts.forEach(post => {
      console.log(`[${post.timestamp.toISOString()}] ${post.action}`);
      if (post.changes) {
        try {
          const details = typeof post.changes === 'string' ? JSON.parse(post.changes) : post.changes;
          if (details.text) console.log(`  Text: ${details.text.substring(0, 100)}...`);
          if (details.url) console.log(`  URL: ${details.url}`);
          if (details.error) console.log(`  Error: ${details.error}`);
          if (details.tweetId) console.log(`  Tweet ID: ${details.tweetId}`);
        } catch (e) {
          console.log(`  Changes: ${JSON.stringify(post.changes).substring(0, 100)}...`);
        }
      }
      if (post.success !== null) console.log(`  Success: ${post.success}`);
      if (post.errorMessage) console.log(`  Error: ${post.errorMessage}`);
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSocialPosts();
