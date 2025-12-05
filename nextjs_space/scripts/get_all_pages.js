const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getPages() {
  try {
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' },
      select: {
        pagePath: true,
        pageTitle: true,
        metaDescription: true
      }
    });

    console.log(JSON.stringify(pages, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getPages();
