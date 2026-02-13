const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasourceUrl: 'postgresql://role_da1a5943:VknB0BsUhy0m5vqg9B8LY0drt50cg8nM@db-da1a5943.db002.hosteddb.reai.io:5432/da1a5943?connect_timeout=15'
});

async function checkRecentPosts() {
  try {
    const posts = await prisma.sEOAuditLog.findMany({
      where: {
        OR: [
          { action: { contains: 'social' } },
          { action: { contains: 'twitter' } },
          { action: { contains: 'post' } }
        ]
      },
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    console.log('\n=== Recent Social Media Posts ===\n');
    posts.forEach(post => {
      console.log(`[${post.timestamp.toISOString()}]`);
      console.log(`Action: ${post.action}`);
      console.log(`Details: ${post.details}`);
      console.log('---\n');
    });

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkRecentPosts();
