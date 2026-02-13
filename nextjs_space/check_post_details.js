const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPostDetails() {
  try {
    const posts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_post'
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 5
    });
    
    console.log(`\n📊 Recent Social Media Posts: ${posts.length}\n`);
    
    posts.forEach((post, idx) => {
      console.log(`\n--- Post ${idx + 1} ---`);
      console.log(JSON.stringify(post, null, 2));
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkPostDetails();
