const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAllPosts() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get all social media related logs
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
  
  // Get top performing pages
  const topPages = await prisma.sEOPageConfig.findMany({
    where: {
      clicks: {
        gt: 0
      }
    },
    orderBy: {
      clicks: 'desc'
    },
    take: 10
  });
  
  console.log(`\n📊 SOCIAL MEDIA ACTIVITY TODAY\n`);
  console.log(`Total Posts/Attempts: ${posts.length}\n`);
  
  posts.forEach((post, idx) => {
    console.log(`\n--- Activity ${idx + 1} ---`);
    console.log(`Time: ${post.timestamp.toLocaleString()}`);
    console.log(`Action: ${post.action}`);
    console.log(`Success: ${post.success}`);
    if (post.errorMessage) {
      console.log(`Error: ${post.errorMessage}`);
    }
    if (post.changes) {
      const details = post.changes;
      if (details.posts) {
        details.posts.forEach((p, i) => {
          console.log(`\nPost ${i + 1}:`);
          console.log(`  Content: ${p.content}`);
          console.log(`  URL: ${p.url}`);
          console.log(`  Platform: ${p.platform}`);
        });
      }
      if (details.postsCreated) {
        console.log(`Posts Created: ${details.postsCreated}`);
      }
    }
  });
  
  console.log(`\n\n📈 TOP PERFORMING PAGES (Last 7 Days)\n`);
  topPages.forEach((page, idx) => {
    console.log(`${idx + 1}. ${page.pagePath}`);
    console.log(`   Clicks: ${page.clicks} | Impressions: ${page.impressions}`);
    console.log(`   CTR: ${((page.clicks / page.impressions) * 100).toFixed(2)}%`);
    console.log(`   Position: ${page.position?.toFixed(1) || 'N/A'}\n`);
  });
  
  await prisma.$disconnect();
}

checkAllPosts().catch(console.error);
