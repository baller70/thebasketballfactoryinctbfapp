const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const today = new Date('2025-12-03');
  
  const posts = await prisma.sEOAuditLog.findMany({
    where: {
      timestamp: { gte: today },
      action: 'social_media_posted'
    },
    orderBy: { timestamp: 'asc' }
  });
  
  console.log(`Total social media posting sessions today: ${posts.length}\n`);
  
  let totalPosts = 0;
  const allPosts = [];
  
  posts.forEach((session, i) => {
    const changes = session.changes;
    const postsInSession = changes.posts || [];
    totalPosts += postsInSession.length;
    
    console.log(`Session ${i + 1} at ${session.timestamp.toISOString()}:`);
    console.log(`  Posts created: ${changes.postsCreated || 0}`);
    
    postsInSession.forEach((post, j) => {
      console.log(`\n  Post ${j + 1}:`);
      console.log(`    Content: ${post.content}`);
      console.log(`    URL: ${post.url}`);
      console.log(`    Time: ${post.timestamp}`);
      allPosts.push(post);
    });
    console.log('\n---\n');
  });
  
  console.log(`\nTotal posts created today: ${totalPosts}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
