const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.sEOAuditLog.findMany({
    where: {
      OR: [
        { action: { contains: 'Twitter' } },
        { action: { contains: 'social' } },
        { action: { contains: 'Posted' } }
      ]
    },
    orderBy: { timestamp: 'desc' },
    take: 10
  });
  
  console.log(`Found ${posts.length} recent social media posts:\n`);
  posts.forEach(post => {
    console.log(`[${post.timestamp.toISOString()}] ${post.action}`);
    if (post.details) console.log(`  Details: ${post.details}`);
    console.log('');
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
