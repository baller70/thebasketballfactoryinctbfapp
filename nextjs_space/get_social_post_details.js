const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getSocialPostDetails() {
  try {
    const posts = await prisma.sEOAuditLog.findMany({
      where: {
        OR: [
          { action: 'social_media_post' },
          { action: 'social_media_posted' }
        ]
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    });
    
    console.log(`\n📊 Recent Social Media Posts: ${posts.length}\n`);
    
    posts.forEach((post, idx) => {
      console.log(`\n=== Post ${idx + 1} ===`);
      console.log(`Time: ${post.timestamp}`);
      console.log(`Action: ${post.action}`);
      console.log(`Page: ${post.page || 'N/A'}`);
      console.log(`Details: ${post.details || 'N/A'}`);
      console.log(`Status: ${post.status || 'N/A'}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

getSocialPostDetails();
