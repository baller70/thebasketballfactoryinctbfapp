import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPosts() {
  try {
    const posts = await prisma.socialMediaAudit.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        platform: true,
        postId: true,
        content: true,
        status: true,
        createdAt: true
      }
    });
    
    console.log('Recent Social Media Posts:');
    console.log('='.repeat(70));
    posts.forEach(post => {
      console.log(`Platform: ${post.platform}`);
      console.log(`Post ID: ${post.postId}`);
      console.log(`Status: ${post.status}`);
      console.log(`Content: ${post.content.substring(0, 100)}...`);
      console.log(`Created: ${post.createdAt}`);
      console.log('-'.repeat(70));
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkPosts();
