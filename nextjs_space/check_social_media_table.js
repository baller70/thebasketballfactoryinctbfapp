const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSocialMediaPosts() {
  try {
    // Check if SocialMediaPost table exists and get recent posts
    const posts = await prisma.socialMediaPost.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    console.log('\n📱 Recent Social Media Posts:\n');
    console.log(`Found ${posts.length} posts\n`);
    
    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.createdAt.toISOString()}`);
      console.log(`   Platform: ${post.platform}`);
      console.log(`   Content: ${post.content}`);
      console.log(`   URL: ${post.url || 'N/A'}`);
      console.log(`   Status: ${post.status}`);
      console.log(`   Post ID: ${post.postId || 'N/A'}`);
      console.log('');
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSocialMediaPosts();
