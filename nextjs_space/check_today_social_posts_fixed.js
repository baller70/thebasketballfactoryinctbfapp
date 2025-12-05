const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTodayPosts() {
  const today = new Date().toISOString().split('T')[0];
  
  const posts = await prisma.sEOAuditLog.findMany({
    where: {
      action: 'social_media_post',
      timestamp: {
        gte: new Date(today)
      }
    },
    orderBy: { timestamp: 'desc' }
  });
  
  console.log(`\n📊 Social Media Posts Today (${today}):`);
  console.log(`Total posts: ${posts.length}\n`);
  
  posts.forEach((post, idx) => {
    console.log(`Post ${idx + 1}:`);
    console.log(`  Time: ${post.timestamp.toISOString()}`);
    console.log(`  Entity: ${post.entityType}`);
    console.log(`  Page: ${post.pagePath || 'N/A'}`);
    if (post.changes) {
      const changes = typeof post.changes === 'string' ? JSON.parse(post.changes) : post.changes;
      console.log(`  Content: ${changes.content || changes.text || 'N/A'}`);
      console.log(`  Platform: ${changes.platform || 'N/A'}`);
    }
    console.log('');
  });
  
  await prisma.$disconnect();
}

checkTodayPosts().catch(console.error);
