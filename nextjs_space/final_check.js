const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function finalCheck() {
  try {
    const today = new Date('2025-12-04');
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const audits = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_posted',
        timestamp: {
          gte: today,
          lt: tomorrow
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    });
    
    console.log('=== DAILY SOCIAL MEDIA EXECUTION SUMMARY ===\n');
    console.log(`Date: ${today.toDateString()}`);
    console.log(`Total Execution Runs: ${audits.length}\n`);
    
    let totalPosts = 0;
    audits.forEach((audit, idx) => {
      const posts = audit.changes?.posts || [];
      const count = audit.changes?.postsCreated || 0;
      totalPosts += count;
      
      console.log(`Run ${idx + 1}:`);
      console.log(`  Time: ${audit.timestamp.toISOString()}`);
      console.log(`  Posts Created: ${count}`);
      if (posts.length > 0) {
        posts.forEach((post, pidx) => {
          console.log(`  Post ${pidx + 1}:`);
          console.log(`    Content: ${post.content}`);
          console.log(`    URL: ${post.url}`);
        });
      }
      console.log('');
    });
    
    console.log(`=== TOTAL POSTS TODAY: ${totalPosts} ===`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

finalCheck();
