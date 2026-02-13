import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const recentPosts = await prisma.socialMediaAudit.findMany({
      orderBy: { postedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        platform: true,
        postId: true,
        contentUrl: true,
        postedAt: true,
        success: true
      }
    });
    
    console.log('✅ Recent Social Media Posts:');
    recentPosts.forEach(post => {
      console.log(`\n- Platform: ${post.platform}`);
      console.log(`  Post ID: ${post.postId}`);
      console.log(`  Content: ${post.contentUrl}`);
      console.log(`  Posted: ${post.postedAt}`);
      console.log(`  Success: ${post.success}`);
    });
    
    const totalPosts = await prisma.socialMediaAudit.count();
    console.log(`\n📊 Total posts in database: ${totalPosts}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
