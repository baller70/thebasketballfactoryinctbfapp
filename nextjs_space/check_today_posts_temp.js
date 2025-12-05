const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTodayPosts() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const posts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'SOCIAL_POST',
        timestamp: {
          gte: today
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    
    console.log(`Found ${posts.length} posts today:`);
    posts.forEach((post, i) => {
      console.log(`\n${i + 1}. ${post.timestamp.toISOString()}`);
      console.log(`   Details: ${post.details}`);
    });
    
    // Also check all programs
    const programs = await prisma.sEOPageConfig.findMany({
      where: {
        isActive: true
      },
      select: {
        pagePath: true,
        title: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 10
    });
    
    console.log(`\n\nRecent active programs (${programs.length}):`);
    programs.forEach((prog, i) => {
      console.log(`${i + 1}. ${prog.title} - ${prog.pagePath}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTodayPosts();
