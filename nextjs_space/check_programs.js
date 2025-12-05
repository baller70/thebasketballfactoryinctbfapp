const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPrograms() {
  try {
    const programs = await prisma.sEOPageConfig.findMany({
      where: {
        status: 'ACTIVE'
      },
      select: {
        pagePath: true,
        pageTitle: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 20
    });
    
    console.log(`Found ${programs.length} active programs:`);
    programs.forEach((prog, i) => {
      console.log(`${i + 1}. ${prog.pageTitle || prog.pagePath}`);
      console.log(`   Path: ${prog.pagePath}`);
      console.log(`   Updated: ${prog.updatedAt.toISOString()}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkPrograms();
