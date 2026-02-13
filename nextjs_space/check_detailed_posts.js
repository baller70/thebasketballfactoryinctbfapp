const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDetailedPosts() {
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
    
    console.log(`\n📊 Found ${posts.length} social media posts:\n`);
    
    posts.forEach((post, idx) => {
      console.log(`${idx + 1}. ${post.timestamp.toISOString()}`);
      console.log(`   Action: ${post.action}`);
      console.log(`   Changes: ${JSON.stringify(post.changes, null, 2)}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDetailedPosts();
