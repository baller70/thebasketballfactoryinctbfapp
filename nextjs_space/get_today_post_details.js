const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getTodayPostDetails() {
  try {
    const today = new Date('2025-12-08');
    const tomorrow = new Date('2025-12-09');
    
    const posts = await prisma.sEOAuditLog.findMany({
      where: {
        action: {
          in: ['social_media_post', 'social_media_posted']
        },
        timestamp: {
          gte: today,
          lt: tomorrow
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    
    console.log(`\n✅ Posts created on December 8, 2025: ${posts.length}\n`);
    
    posts.forEach((post, index) => {
      console.log(`\n=== POST ${index + 1} ===`);
      console.log(`Time: ${post.timestamp.toISOString()}`);
      console.log(`Action: ${post.action}`);
      console.log(`Success: ${post.success}`);
      console.log(`Entity Type: ${post.entityType}`);
      console.log(`Page Path: ${post.pagePath || 'N/A'}`);
      
      if (post.changes) {
        const changes = typeof post.changes === 'string' ? JSON.parse(post.changes) : post.changes;
        console.log('\nChanges/Details:');
        console.log(JSON.stringify(changes, null, 2));
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getTodayPostDetails();
