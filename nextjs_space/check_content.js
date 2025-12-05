const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkContent() {
  try {
    // Get top-performing content from last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const topContent = await prisma.sEOPerformance.findMany({
      where: {
        dateKey: {
          gte: sevenDaysAgo.toISOString().split('T')[0]
        },
        pagePath: {
          not: null
        }
      },
      orderBy: { clicks: 'desc' },
      take: 5
    });

    console.log('Top performing content:');
    topContent.forEach(c => {
      console.log(`- ${c.pagePath}: ${c.clicks} clicks`);
    });

    // Get latest programs
    const recentPrograms = await prisma.sEOPageConfig.findMany({
      where: {
        status: 'active',
        pagePath: {
          contains: '/programs/'
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 3
    });

    console.log('\nRecent programs:');
    recentPrograms.forEach(p => {
      console.log(`- ${p.pagePath}: ${p.pageTitle}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkContent();
