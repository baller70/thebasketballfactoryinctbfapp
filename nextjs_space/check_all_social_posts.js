const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAllPosts() {
  try {
    const posts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_post'
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 20
    });
    
    console.log(`\n📊 Found ${posts.length} total social media posts:\n`);
    
    posts.forEach((post, idx) => {
      console.log(`${idx + 1}. ${post.timestamp.toISOString()}`);
      console.log(`   Details: ${post.details}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllPosts();
