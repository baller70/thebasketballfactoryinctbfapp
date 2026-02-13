const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getRecentDetailedPosts() {
  try {
    const posts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_posted',
        changes: {
          path: ['posts'],
          not: []
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 3
    });
    
    console.log(JSON.stringify(posts, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

getRecentDetailedPosts();
