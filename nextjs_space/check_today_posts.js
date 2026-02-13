const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTodayPosts() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayPosts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_post',
        timestamp: {
          gte: today
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    
    console.log(JSON.stringify(todayPosts, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTodayPosts();
