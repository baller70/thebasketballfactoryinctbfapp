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
    
    console.log(`\n📊 Social Media Posts Today: ${posts.length}\n`);
    
    posts.forEach((post, idx) => {
      console.log(`Post ${idx + 1}:`);
      console.log(`  Time: ${post.timestamp}`);
      console.log(`  Details: ${post.details}`);
      console.log(`  Status: ${post.status}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecentPosts();
