const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getYesterdayPosts() {
  try {
    const yesterday = new Date('2025-12-04T00:00:00Z');
    const today = new Date('2025-12-05T00:00:00Z');
    
    const posts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_post',
        timestamp: {
          gte: yesterday,
          lt: today
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    });
    
    console.log(`\n📊 Posts from December 4, 2025: ${posts.length}\n`);
    
    posts.forEach((post, idx) => {
      console.log(`Post ${idx + 1}:`);
      console.log(`  Time: ${post.timestamp.toISOString()}`);
      console.log(`  Page: ${post.pagePath || 'N/A'}`);
      console.log('');
    });
    
    // Also check for social_media_posted action
    const postedLogs = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_posted',
        timestamp: {
          gte: yesterday,
          lt: today
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    
    console.log(`\n📝 Social media posted logs: ${postedLogs.length}\n`);
    
    postedLogs.forEach((log, idx) => {
      console.log(`Log ${idx + 1}:`);
      console.log(`  Time: ${log.timestamp.toISOString()}`);
      console.log(`  Changes: ${JSON.stringify(log.changes, null, 2)}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

getYesterdayPosts();
