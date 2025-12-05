const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  const posts = await prisma.sEOAuditLog.findMany({
    where: {
      timestamp: { gte: oneHourAgo },
      OR: [
        { action: { contains: 'Twitter' } },
        { action: { contains: 'social' } },
        { action: { contains: 'Posted' } }
      ]
    },
    orderBy: { timestamp: 'desc' }
  });
  
  console.log(`Found ${posts.length} posts in the last hour:\n`);
  posts.forEach((post, i) => {
    console.log(`Post ${i + 1}:`);
    console.log(`  Time: ${post.timestamp.toISOString()}`);
    console.log(`  Action: ${post.action}`);
    console.log(`  Details: ${post.details || 'No details'}`);
    console.log('');
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
