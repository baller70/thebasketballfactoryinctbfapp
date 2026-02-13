const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPosts() {
  try {
    const recentPosts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_post'
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    });
    
    console.log(JSON.stringify(recentPosts, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkPosts();
