const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRecentPosts() {
  try {
    const recentAudits = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_posted'
      },
      orderBy: { timestamp: 'desc' },
      take: 1
    });
    
    if (recentAudits.length > 0) {
      console.log('Most recent social media post audit:');
      console.log(JSON.stringify(recentAudits[0], null, 2));
    } else {
      console.log('No social media post audits found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecentPosts();
