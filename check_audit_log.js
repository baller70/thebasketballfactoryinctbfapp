const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://role_da1a5943:VknB0BsUhy0m5vqg9B8LY0drt50cg8nM@db-da1a5943.db002.hosteddb.reai.io:5432/da1a5943?connect_timeout=15'
    }
  }
});

async function checkAuditLog() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayPosts = await prisma.sEOAuditLog.findMany({
      where: {
        action: { contains: 'social_media' },
        timestamp: { gte: today }
      },
      orderBy: { timestamp: 'desc' }
    });

    console.log('\n=== Today\'s Social Media Posts ===\n');
    console.log(`Found ${todayPosts.length} posts today\n`);
    
    todayPosts.forEach((post, idx) => {
      console.log(`Post ${idx + 1}:`);
      console.log(`  Time: ${post.timestamp.toISOString()}`);
      console.log(`  Action: ${post.action}`);
      console.log(`  Page: ${post.page || 'N/A'}`);
      console.log(`  Details: ${post.details || 'N/A'}`);
      console.log(`  User: ${post.userId || 'system'}`);
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAuditLog();
