const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRecentPosts() {
  try {
    const recentPosts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'SOCIAL_MEDIA_POST'
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    });
    
    console.log('Recent Social Media Posts:');
    console.log(JSON.stringify(recentPosts, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecentPosts();
