const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTodayPosts() {
  const today = new Date().toISOString().split('T')[0];
  
  const posts = await prisma.sEOAuditLog.findMany({
    where: {
      auditType: 'social_media_post',
      createdAt: {
        gte: new Date(today)
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  console.log(`\n📊 Social Media Posts Today (${today}):`);
  console.log(`Total posts: ${posts.length}\n`);
  
  posts.forEach((post, idx) => {
    console.log(`Post ${idx + 1}:`);
    console.log(`  Time: ${post.createdAt.toISOString()}`);
    console.log(`  Details: ${post.details ? JSON.stringify(JSON.parse(post.details), null, 2) : 'N/A'}`);
    console.log('');
  });
  
  await prisma.$disconnect();
}

checkTodayPosts().catch(console.error);
