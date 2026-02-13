const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
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
    }
  });
  
  console.log(`\n📅 Social Media Posts Today (${today.toDateString()}):\n`);
  console.log(`Total posts: ${posts.length}\n`);
  
  if (posts.length === 0) {
    console.log('No posts found today.');
    return;
  }
  
  posts.forEach((post, idx) => {
    const changes = post.changes || {};
    console.log(`Post ${idx + 1}:`);
    console.log(`  Time: ${post.timestamp.toLocaleString()}`);
    console.log(`  Text: ${changes.text || 'N/A'}`);
    console.log(`  URL: ${changes.url || 'N/A'}`);
    console.log(`  Tweet ID: ${changes.tweetId || 'N/A'}`);
    console.log(`  Success: ${post.success}`);
    console.log('');
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
