const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPosted() {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const recentPosts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_posted',
        timestamp: {
          gte: oneHourAgo
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    
    console.log(`Found ${recentPosts.length} posting sessions in the last hour`);
    
    for (const post of recentPosts) {
      console.log('\n' + '='.repeat(80));
      console.log('Timestamp:', post.timestamp);
      console.log('Posts Created:', post.changes.postsCreated);
      console.log('\nDetails:');
      for (const detail of post.changes.posts || []) {
        console.log('  - Platform:', detail.platform);
        console.log('    Content:', detail.content);
        console.log('    URL:', detail.url);
        console.log('    Time:', detail.timestamp);
        console.log('');
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkPosted();
