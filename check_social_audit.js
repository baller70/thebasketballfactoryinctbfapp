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
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    
    console.log(`Found ${posts.length} social media related audit entries:\n`);
    posts.forEach(post => {
      console.log(`[${post.createdAt.toISOString()}] ${post.action}`);
      if (post.details) {
        const details = JSON.parse(post.details);
        if (details.text) console.log(`  Text: ${details.text.substring(0, 100)}...`);
        if (details.url) console.log(`  URL: ${details.url}`);
        if (details.error) console.log(`  Error: ${details.error}`);
      }
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSocialPosts();
