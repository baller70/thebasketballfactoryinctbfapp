const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTodayPosts() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const posts = await prisma.sEOAuditLog.findMany({
    where: {
      action: {
        contains: 'social'
      },
      timestamp: {
        gte: today
      }
    },
    orderBy: {
      timestamp: 'desc'
    }
  });
  
  console.log(`\n📊 Social Media Posts Today: ${posts.length}\n`);
  
  posts.forEach((post, idx) => {
    console.log(`\n--- Post ${idx + 1} ---`);
    console.log(`Time: ${post.timestamp.toLocaleString()}`);
    console.log(`Action: ${post.action}`);
    console.log(`Page: ${post.pagePath}`);
    console.log(`Success: ${post.success}`);
    if (post.errorMessage) {
      console.log(`Error: ${post.errorMessage}`);
    }
    if (post.changes) {
      console.log(`Details: ${JSON.stringify(post.changes, null, 2)}`);
    }
  });
  
  await prisma.$disconnect();
}

checkTodayPosts().catch(console.error);
