const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkRecentPosts() {
  try {
    // Get recent social media posts from audit log
    const recentPosts = await prisma.sEOAuditLog.findMany({
      where: {
        action: {
          contains: 'social_media'
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    });

    console.log('\n=== Recent Social Media Posts ===\n');
    
    if (recentPosts.length === 0) {
      console.log('No social media posts found in audit log.');
    } else {
      recentPosts.forEach((post, index) => {
        console.log(`\n--- Post ${index + 1} ---`);
        console.log(`Timestamp: ${post.timestamp}`);
        console.log(`Action: ${post.action}`);
        console.log(`Details: ${post.details}`);
        if (post.metadata) {
          console.log(`Metadata: ${JSON.stringify(post.metadata, null, 2)}`);
        }
      });
    }

    // Get count of posts today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayPosts = await prisma.sEOAuditLog.count({
      where: {
        action: {
          contains: 'social_media'
        },
        timestamp: {
          gte: today
        }
      }
    });

    console.log(`\n\nTotal posts today: ${todayPosts}`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecentPosts();
