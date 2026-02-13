const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getLatestSocialPost() {
  try {
    const post = await prisma.sEOAuditLog.findFirst({
      where: {
        action: 'social_media_posted'
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    
    if (post) {
      console.log('\n📊 Latest Social Media Post:\n');
      console.log(`Time: ${post.timestamp}`);
      console.log(`Action: ${post.action}`);
      console.log(`Performed By: ${post.performedBy}`);
      console.log(`\nChanges/Details:`);
      console.log(JSON.stringify(post.changes, null, 2));
    } else {
      console.log('No social media posts found');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

getLatestSocialPost();
