const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyTodayPosts() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const todayAudits = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_posted',
        timestamp: {
          gte: new Date(today)
        }
      },
      orderBy: { timestamp: 'desc' }
    });

    console.log(`\n✅ Posts created today (${today}):\n`);
    
    let totalPosts = 0;
    for (const audit of todayAudits) {
      const postsCount = audit.changes?.postsCreated || 0;
      totalPosts += postsCount;
      
      console.log(`Run at: ${audit.timestamp.toLocaleString()}`);
      console.log(`Posts in this run: ${postsCount}`);
      
      if (audit.changes?.posts) {
        audit.changes.posts.forEach((post, idx) => {
          console.log(`  ${idx + 1}. ${post.content.substring(0, 60)}...`);
          console.log(`     URL: ${post.url}`);
        });
      }
      console.log('');
    }
    
    console.log(`📊 Total posts today: ${totalPosts}`);
    console.log(`📊 Total runs today: ${todayAudits.length}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyTodayPosts();
