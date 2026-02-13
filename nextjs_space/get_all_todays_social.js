const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllTodaysSocial() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const posts = await prisma.sEOAuditLog.findMany({
      where: {
        OR: [
          { action: 'social_media_posted' },
          { action: 'social_media_post' }
        ],
        timestamp: {
          gte: today
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    
    console.log(JSON.stringify(posts, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

getAllTodaysSocial();
