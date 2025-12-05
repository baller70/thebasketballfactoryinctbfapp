const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const today = new Date('2025-12-03');
  
  const posts = await prisma.sEOAuditLog.findMany({
    where: {
      timestamp: { gte: today }
    },
    orderBy: { timestamp: 'desc' }
  });
  
  console.log(`All audit logs from today (${posts.length} total):\n`);
  posts.forEach((post, i) => {
    console.log(`Log ${i + 1}:`);
    console.log(`  Time: ${post.timestamp.toISOString()}`);
    console.log(`  Action: ${post.action}`);
    console.log(`  Page: ${post.page || 'N/A'}`);
    console.log(`  Details: ${post.details || 'No details'}`);
    console.log('');
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
