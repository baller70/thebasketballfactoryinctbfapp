const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPosts() {
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
      }
    });
    
    console.log(`Found ${posts.length} posts today (${today.toDateString()}):`);
    posts.forEach((post, idx) => {
      console.log(`\n=== Post ${idx + 1} ===`);
      console.log(`Time: ${post.timestamp.toISOString()}`);
      console.log(`Page: ${post.page || 'N/A'}`);
      console.log(`Details: ${post.details || 'N/A'}`);
      console.log(`Metadata: ${post.metadata || 'N/A'}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPosts();
