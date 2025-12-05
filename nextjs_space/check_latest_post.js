const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const post = await prisma.sEOAuditLog.findFirst({
    where: {
      OR: [
        { action: { contains: 'Twitter' } },
        { action: { contains: 'social' } },
        { action: { contains: 'Posted' } }
      ]
    },
    orderBy: { timestamp: 'desc' }
  });
  
  if (post) {
    console.log('Most recent social media post:');
    console.log(`  Time: ${post.timestamp.toISOString()}`);
    console.log(`  Action: ${post.action}`);
    console.log(`  Details: ${post.details}`);
  } else {
    console.log('No posts found');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
