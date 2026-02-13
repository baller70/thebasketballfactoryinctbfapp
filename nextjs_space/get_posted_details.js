const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getPostedDetails() {
  try {
    const recentPosts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_posted',
        timestamp: {
          gte: new Date('2025-12-04T00:00:00Z')
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    console.log('\n📊 Today\'s Social Media Posts:\n');
    console.log(`Found ${recentPosts.length} posts today\n`);
    
    if (recentPosts.length === 0) {
      console.log('No posts found with action "social_media_posted"');
      console.log('\nChecking for any social media related actions...\n');
      
      const allSocial = await prisma.sEOAuditLog.findMany({
        where: {
          action: {
            contains: 'social'
          },
          timestamp: {
            gte: new Date('2025-12-04T00:00:00Z')
          }
        },
        orderBy: {
          timestamp: 'desc'
        }
      });
      
      console.log(`Found ${allSocial.length} social-related actions:\n`);
      allSocial.forEach((post, index) => {
        console.log(`${index + 1}. ${post.timestamp.toISOString()}`);
        console.log(`   Action: ${post.action}`);
        console.log(`   Changes: ${JSON.stringify(post.changes, null, 2)}`);
        console.log('');
      });
    } else {
      recentPosts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.timestamp.toISOString()}`);
        console.log(`   Action: ${post.action}`);
        console.log(`   Changes: ${JSON.stringify(post.changes, null, 2)}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

getPostedDetails();
