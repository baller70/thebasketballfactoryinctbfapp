const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getPostDetails() {
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
    
    console.log(`Found ${posts.length} posts today:\n`);
    posts.forEach((post, idx) => {
      console.log(`=== Post ${idx + 1} ===`);
      console.log(`Time: ${post.timestamp.toISOString()}`);
      console.log(`Changes:`, JSON.stringify(post.changes, null, 2));
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getPostDetails();
