const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasourceUrl: 'postgresql://role_da1a5943:VknB0BsUhy0m5vqg9B8LY0drt50cg8nM@db-da1a5943.db002.hosteddb.reai.io:5432/da1a5943?connect_timeout=15'
});

async function getTodayPosts() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const posts = await prisma.sEOAuditLog.findMany({
      where: {
        action: { contains: 'social_media' },
        timestamp: { gte: today }
      },
      orderBy: { timestamp: 'desc' }
    });

    console.log('\n=== Today\'s Social Media Posts ===\n');
    console.log(`Total posts today: ${posts.length}\n`);
    
    posts.forEach((post, idx) => {
      console.log(`Post #${idx + 1}:`);
      console.log(`Time: ${post.timestamp.toISOString()}`);
      console.log(`Action: ${post.action}`);
      console.log(`Details: ${post.details || 'N/A'}`);
      console.log(`Page: ${post.page || 'N/A'}`);
      console.log('---\n');
    });

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

getTodayPosts();
