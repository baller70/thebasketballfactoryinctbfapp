const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPosts() {
  try {
    const posts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_post'
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    });
    
    console.log(`Found ${posts.length} recent social media posts:`);
    posts.forEach(post => {
      console.log(`\n---`);
      console.log(`Time: ${post.timestamp}`);
      console.log(`Details: ${post.details}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPosts();
