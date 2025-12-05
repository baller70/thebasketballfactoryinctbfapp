const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAllPosts() {
  try {
    // Get all social media posts
    const allPosts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_post'
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 20
    });

    console.log(`\n📊 Found ${allPosts.length} total social media posts (showing last 20):\n`);
    
    allPosts.forEach((post, index) => {
      const details = JSON.parse(post.details || '{}');
      console.log(`${index + 1}. ${post.timestamp.toISOString()}`);
      console.log(`   Platform: ${details.platform || 'Unknown'}`);
      console.log(`   Content: ${details.content?.substring(0, 100) || 'N/A'}...`);
      console.log(`   URL: ${details.url || 'N/A'}`);
      console.log(`   Success: ${post.success}\n`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllPosts();
