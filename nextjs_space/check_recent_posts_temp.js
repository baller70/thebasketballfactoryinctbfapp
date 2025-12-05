const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRecentPosts() {
  try {
    const posts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'SOCIAL_POST'
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    });
    
    console.log(`📊 Recent Social Media Posts (Last 10):`);
    console.log(`Total posts: ${posts.length}\n`);
    
    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.timestamp.toISOString()}`);
      console.log(`   Details: ${post.details}`);
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecentPosts();
