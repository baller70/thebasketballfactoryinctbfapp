const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.sEOAuditLog.findMany({
    where: {
      action: 'social_media_post',
    },
    orderBy: {
      timestamp: 'desc'
    },
    take: 5
  });
  
  console.log('\n📝 Recent Social Media Posts:\n');
  
  posts.forEach((post, idx) => {
    console.log(`\nPost ${idx + 1}:`);
    console.log(`  Time: ${post.timestamp.toLocaleString()}`);
    console.log(`  Action: ${post.action}`);
    console.log(`  Success: ${post.success}`);
    console.log(`  Details type: ${typeof post.details}`);
    console.log(`  Details:`, post.details);
    console.log(`  Metadata:`, post.metadata);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
