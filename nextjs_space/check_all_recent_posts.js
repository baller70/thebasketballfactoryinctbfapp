const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAllRecentPosts() {
  try {
    // Get all posts from December 2025
    const posts = await prisma.sEOAuditLog.findMany({
      where: {
        action: {
          in: ['social_media_post', 'social_media_posted']
        },
        timestamp: {
          gte: new Date('2025-12-01')
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    
    console.log(`\n📊 Total posts in December 2025: ${posts.length}\n`);
    
    // Group by date
    const byDate = {};
    posts.forEach(post => {
      const date = post.timestamp.toISOString().split('T')[0];
      if (!byDate[date]) byDate[date] = [];
      byDate[date].push(post);
    });
    
    Object.keys(byDate).sort().reverse().forEach(date => {
      console.log(`\n📅 ${date}: ${byDate[date].length} posts`);
      byDate[date].forEach((post, i) => {
        console.log(`  ${i+1}. ${post.timestamp.toISOString().split('T')[1].split('.')[0]} - Success: ${post.success}`);
      });
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllRecentPosts();
