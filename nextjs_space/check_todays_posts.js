const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTodaysPosts() {
  try {
    const today = new Date('2025-12-05T00:00:00Z');
    const todaysPosts = await prisma.sEOAuditLog.findMany({
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
    
    console.log(`\n📊 Posts from today (Dec 5, 2025): ${todaysPosts.length}\n`);
    
    if (todaysPosts.length === 0) {
      console.log('No posts found for today yet. Running the poster now...\n');
    } else {
      todaysPosts.forEach((post, idx) => {
        console.log(`${idx + 1}. ${post.timestamp.toISOString()}`);
        console.log(`   Page: ${post.pagePath || 'N/A'}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTodaysPosts();
