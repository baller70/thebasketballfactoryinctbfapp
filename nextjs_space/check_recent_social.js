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
      take: 20
    });
    
    console.log(`\n📊 Recent Social Media Posts:`);
    console.log(`Total found: ${posts.length}\n`);
    
    posts.forEach((post, idx) => {
      console.log(`${idx + 1}. ${post.timestamp.toISOString()}`);
      console.log(`   Success: ${post.success ? '✅' : '❌'}`);
      if (post.changes) {
        const changes = typeof post.changes === 'string' ? JSON.parse(post.changes) : post.changes;
        console.log(`   Content: ${changes.content?.substring(0, 100)}...`);
      }
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkPosts();
