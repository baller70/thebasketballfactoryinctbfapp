const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPages() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const pages = await prisma.sEOPageConfig.findMany({
    where: {
      updatedAt: {
        gte: sevenDaysAgo
      }
    },
    orderBy: {
      updatedAt: 'desc'
    },
    take: 5
  });
  
  console.log('Pages found:', JSON.stringify(pages, null, 2));
  await prisma.$disconnect();
}

checkPages();
