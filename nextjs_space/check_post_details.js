const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPostDetails() {
  try {
    const recentPosts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_post'
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 5
    });

    console.log(`\n📊 Last 5 social media posts with full details:\n`);
    
    recentPosts.forEach((post, index) => {
      console.log(`\n${index + 1}. Post at ${post.timestamp.toISOString()}`);
      console.log(`   Success: ${post.success}`);
      console.log(`   Details (raw): ${post.details}`);
      console.log(`   Changes: ${JSON.stringify(post.changes)}`);
      console.log(`   Reason: ${post.reason}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkPostDetails();
