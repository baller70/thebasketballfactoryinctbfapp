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
      },
      take: 10
    });
    
    console.log(`\n📊 Social Media Posts Today (${new Date().toISOString().split('T')[0]}):`);
    console.log(`Total posts: ${posts.length}\n`);
    
    posts.forEach((post, idx) => {
      console.log(`${idx + 1}. ${post.timestamp.toISOString()}`);
      console.log(`   Entity: ${post.entityType} - ${post.entityId || 'N/A'}`);
      console.log(`   Success: ${post.success ? '✅' : '❌'}`);
      if (post.changes) {
        const changes = typeof post.changes === 'string' ? JSON.parse(post.changes) : post.changes;
        console.log(`   Content: ${changes.content?.substring(0, 80)}...`);
        console.log(`   Platform: ${changes.platform || 'N/A'}`);
      }
      if (post.errorMessage) {
        console.log(`   Error: ${post.errorMessage.substring(0, 100)}`);
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
