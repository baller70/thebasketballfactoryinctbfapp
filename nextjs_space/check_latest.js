const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkLatest() {
  try {
    const latest = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_post'
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 3
    });
    
    for (const post of latest) {
      console.log('='.repeat(80));
      console.log('Timestamp:', post.timestamp);
      console.log('Page:', post.pagePath);
      console.log('Tweet ID:', post.changes.tweetId);
      console.log('Text:', post.changes.text);
      console.log('Platform:', post.changes.platform);
      console.log('Success:', post.success);
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkLatest();
