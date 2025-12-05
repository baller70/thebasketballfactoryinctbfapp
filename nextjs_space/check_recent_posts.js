const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRecentPosts() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const posts = await prisma.sEOAuditLog.findMany({
    where: {
      action: "social_media_post",
      timestamp: {
        gte: sevenDaysAgo
      }
    },
    orderBy: {
      timestamp: "desc"
    }
  });
  
  console.log(`\n=== Social Media Posts (Last 7 Days) ===\n`);
  console.log(`Total posts: ${posts.length}\n`);
  
  const contentMap = new Map();
  
  posts.forEach((post) => {
    if (post.changes) {
      const changes = typeof post.changes === 'string' ? JSON.parse(post.changes) : post.changes;
      const content = changes.content || changes.text || 'N/A';
      const date = post.timestamp.toISOString().split('T')[0];
      
      if (!contentMap.has(content)) {
        contentMap.set(content, []);
      }
      contentMap.get(content).push(date);
    }
  });
  
  console.log(`Unique content pieces: ${contentMap.size}\n`);
  
  let idx = 1;
  for (const [content, dates] of contentMap.entries()) {
    console.log(`\n--- Content ${idx++} (Posted ${dates.length} times) ---`);
    console.log(`Dates: ${dates.join(', ')}`);
    console.log(`Content: ${content.substring(0, 150)}...`);
  }
  
  await prisma.$disconnect();
}

checkRecentPosts().catch(console.error);
