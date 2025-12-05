const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAudit() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const posts = await prisma.sEOAuditLog.findMany({
    where: {
      action: 'social_media_post',
      timestamp: {
        gte: today
      }
    },
    orderBy: { timestamp: 'desc' }
  });

  console.log(`\n📊 Social Media Posts Today: ${posts.length}\n`);
  
  posts.forEach((post, i) => {
    const changes = typeof post.changes === 'string' ? JSON.parse(post.changes) : post.changes;
    console.log(`Post ${i + 1}:`);
    console.log(`  Time: ${post.timestamp.toLocaleString()}`);
    console.log(`  Path: ${post.pagePath}`);
    console.log(`  Platform: ${changes.platform}`);
    console.log(`  Content: ${changes.content.substring(0, 100)}...`);
    console.log(`  Tweet ID: ${changes.tweetId || 'N/A'}`);
    console.log('');
  });

  await prisma.$disconnect();
}

checkAudit().catch(console.error);
