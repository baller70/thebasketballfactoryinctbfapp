const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRecentPosts() {
  try {
    const recentAudits = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_posted'
      },
      orderBy: { timestamp: 'desc' },
      take: 5
    });

    console.log('\n📊 Recent Social Media Posts:');
    console.log('================================\n');

    for (const audit of recentAudits) {
      console.log(`Timestamp: ${audit.timestamp}`);
      console.log(`Posts Created: ${audit.changes?.postsCreated || 0}`);
      
      if (audit.changes?.posts) {
        console.log('\nPosts:');
        for (const post of audit.changes.posts) {
          console.log(`  - Platform: ${post.platform}`);
          console.log(`    Content: ${post.content}`);
          console.log(`    URL: ${post.url}`);
          console.log(`    Time: ${post.timestamp}`);
          console.log('');
        }
      }
      console.log('--------------------------------\n');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecentPosts();
