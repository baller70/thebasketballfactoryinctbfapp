const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkStatus() {
  try {
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check audit logs for today's posts
    const todayPosts = await prisma.sEOAuditLog.findMany({
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
    
    console.log(`\n📊 Posts Today: ${todayPosts.length}`);
    
    if (todayPosts.length > 0) {
      console.log('\n📝 Recent Posts:');
      todayPosts.slice(0, 5).forEach((post, i) => {
        const changes = typeof post.changes === 'string' ? JSON.parse(post.changes) : post.changes;
        console.log(`\n${i + 1}. ${post.timestamp.toISOString()}`);
        console.log(`   Page: ${post.pagePath || 'N/A'}`);
        console.log(`   Platform: ${changes?.platform || 'N/A'}`);
        console.log(`   Success: ${post.success ? '✅' : '❌'}`);
      });
    }
    
    // Check available pages
    const pages = await prisma.sEOPageConfig.findMany({
      where: {
        isActive: true
      },
      select: {
        pagePath: true,
        title: true
      }
    });
    
    console.log(`\n\n📄 Available Pages: ${pages.length}`);
    console.log('Sample pages:', pages.slice(0, 5).map(p => p.pagePath).join(', '));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkStatus();
