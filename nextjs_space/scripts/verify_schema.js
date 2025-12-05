const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifySchema() {
  try {
    const page = await prisma.sEOPageConfig.findFirst({
      where: { pagePath: '/' }
    });
    
    if (page && page.contentStrategy) {
      const strategy = JSON.parse(page.contentStrategy);
      console.log('Homepage Schema Markup:');
      console.log(JSON.stringify(strategy.schemaMarkup, null, 2));
    } else {
      console.log('No schema found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifySchema();
