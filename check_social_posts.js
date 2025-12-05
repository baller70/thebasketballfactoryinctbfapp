const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://role_da1a5943:VknB0BsUhy0m5vqg9B8LY0drt50cg8nM@db-da1a5943.db002.hosteddb.reai.io:5432/da1a5943?connect_timeout=15'
    }
  }
});

async function checkRecentPosts() {
  try {
    const recentPosts = await prisma.sEOAuditLog.findMany({
      where: {
        OR: [
          { action: { contains: 'social' } },
          { action: { contains: 'twitter' } },
          { action: { contains: 'post' } },
          { action: { contains: 'Tweet' } }
        ]
      },
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    console.log('\n=== Recent Social Media Posts ===\n');
    if (recentPosts.length === 0) {
      console.log('No social media posts found in audit log.');
    } else {
      recentPosts.forEach((post, idx) => {
        console.log(`${idx + 1}. [${post.timestamp.toISOString()}]`);
        console.log(`   Action: ${post.action}`);
        console.log(`   Details: ${post.details || 'N/A'}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecentPosts();
