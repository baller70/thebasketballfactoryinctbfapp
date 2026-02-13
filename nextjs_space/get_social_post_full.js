const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getPostDetails() {
  try {
    const recentPosts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_post',
        timestamp: {
          gte: new Date('2025-12-06T00:00:00Z')
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    console.log('\n📊 Today\'s Social Media Posts:\n');
    console.log(`Found ${recentPosts.length} posts today\n`);
    
    const postsData = [];
    
    recentPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.timestamp.toISOString()}`);
      console.log(`   Entity Type: ${post.entityType}`);
      console.log(`   Entity ID: ${post.entityId || 'N/A'}`);
      console.log(`   Page Path: ${post.pagePath || 'N/A'}`);
      console.log(`   Reason: ${post.reason || 'N/A'}`);
      console.log(`   Success: ${post.success}`);
      console.log(`   Changes: ${JSON.stringify(post.changes, null, 2)}`);
      console.log('');
      
      postsData.push({
        timestamp: post.timestamp.toISOString(),
        entityType: post.entityType,
        entityId: post.entityId,
        pagePath: post.pagePath,
        reason: post.reason,
        changes: post.changes,
        success: post.success
      });
    });
    
    return postsData;

  } catch (error) {
    console.error('Error:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

getPostDetails().then(data => {
  console.log('\n✅ Retrieved', data.length, 'posts');
});
