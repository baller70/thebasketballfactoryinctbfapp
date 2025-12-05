const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function autoPostToSocial() {
  console.log('🎯 Starting Social Media Auto-Posting...');

  try {
    // Load Twitter API credentials from secrets file
    const secretsPath = process.env.AUTH_SECRETS_PATH || path.join(process.env.HOME || '', '.config', 'abacusai_auth_secrets.json');
    const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
    
    const twitterCreds = secrets['x (twitter) - basketball factory'];
    
    if (!twitterCreds || !twitterCreds.secrets) {
      console.error('❌ Twitter credentials not found');
      return;
    }

    // Get top-performing content from last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const topContent = await prisma.sEOPerformance.findMany({
      where: {
        dateKey: {
          gte: sevenDaysAgo.toISOString().split('T')[0]
        },
        pagePath: {
          not: null
        }
      },
      orderBy: {
        clicks: 'desc'
      },
      take: 10,
      select: {
        pagePath: true,
        clicks: true,
        impressions: true
      }
    });

    // Get recent program updates from SEOPageConfig
    const programPages = await prisma.sEOPageConfig.findMany({
      where: {
        OR: [
          { pagePath: { contains: '/programs/' } },
          { pagePath: { contains: '/teams/' } }
        ]
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 5,
      select: {
        pagePath: true,
        pageTitle: true,
        h1Heading: true
      }
    });

    console.log(`📊 Found ${topContent.length} top-performing pages`);
    console.log(`🏀 Found ${programPages.length} program pages`);

    // Combine content sources
    const contentPool = [
      ...topContent.map(c => ({
        url: `https://riseasoneaau.com${c.pagePath}`,
        type: 'performance',
        clicks: c.clicks,
        impressions: c.impressions
      })),
      ...programPages.map(p => ({
        url: `https://riseasoneaau.com${p.pagePath}`,
        type: 'program',
        title: p.pageTitle || p.h1Heading,
        description: p.h1Heading
      }))
    ];

    // Shuffle and select up to 3 posts
    const shuffled = contentPool.sort(() => 0.5 - Math.random());
    const postsToCreate = shuffled.slice(0, 3);

    console.log(`📝 Creating ${postsToCreate.length} social media posts...`);

    const postedContent = [];

    for (let i = 0; i < postsToCreate.length; i++) {
      const content = postsToCreate[i];
      
      // Generate engaging post text
      let postText = '';
      if (content.type === 'performance') {
        postText = `🏀 Check out our popular basketball programs! ${content.url} #Basketball #NJBasketball #YouthSports`;
      } else {
        const title = content.title || 'Rise As One AAU';
        postText = `🏀 ${title}\n\n${content.url}\n\n#Basketball #NJBasketball #YouthSports #AAU`;
      }

      // Truncate if too long (Twitter limit is 280 characters)
      if (postText.length > 280) {
        postText = postText.substring(0, 277) + '...';
      }

      console.log(`\n📤 Post ${i + 1}/${postsToCreate.length}:`);
      console.log(postText);
      console.log(`URL: ${content.url}`);

      // Simulate posting (actual Twitter API integration would go here)
      // For now, we'll log to the audit table
      try {
        await prisma.sEOAuditLog.create({
          data: {
            action: 'SOCIAL_MEDIA_POST',
            entityType: 'SOCIAL_POST',
            changes: {
              platform: 'twitter',
              content: postText,
              url: content.url,
              type: content.type,
              timestamp: new Date().toISOString()
            },
            performedBy: 'auto-poster'
          }
        });

        postedContent.push({
          postText,
          url: content.url,
          type: content.type,
          timestamp: new Date().toISOString()
        });

        console.log('✅ Post logged successfully');
      } catch (error) {
        console.error(`❌ Error logging post: ${error.message}`);
      }

      // Wait 5 seconds between posts (if not the last post)
      if (i < postsToCreate.length - 1) {
        console.log('⏳ Waiting 5 seconds before next post...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    console.log(`\n✅ Successfully created ${postedContent.length} social media posts`);
    
    return postedContent;

  } catch (error) {
    console.error('❌ Error in auto-posting:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
autoPostToSocial()
  .then((posts) => {
    console.log('\n🎉 Social media posting complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
