import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { TwitterApi } from 'twitter-api-v2';

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
      orderBy: { clicks: 'desc' },
      take: 5
    });

    // Get latest programs and updates
    const recentPrograms = await prisma.sEOPageConfig.findMany({
      where: {
        status: 'active',
        pagePath: {
          contains: '/programs/'
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 3
    });

    const posts = [];

    // Generate posts for top-performing content
    for (const content of topContent) {
      if (content.pagePath !== '/') {
        const post = await generatePostContent(content);
        if (post) posts.push(post);
      }
    }

    // Generate posts for recent programs
    for (const program of recentPrograms) {
      const post = await generateProgramPost(program);
      if (post) posts.push(post);
    }

    // Post to Twitter/X
    let postedCount = 0;
    const postedDetails = [];

    for (const post of posts.slice(0, 3)) { // Limit to 3 posts per run
      try {
        const result = await postToTwitter(post, twitterCreds.secrets);
        
        if (result.success) {
          postedCount++;
          postedDetails.push({
            platform: 'Twitter/X',
            content: post.text,
            url: post.url,
            timestamp: new Date().toISOString()
          });

          console.log(`✅ Posted to Twitter: ${post.text.substring(0, 50)}...`);
        }

        // Wait between posts to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 60000)); // 1 minute delay

      } catch (error) {
        console.error(`❌ Failed to post:`, error);
      }
    }

    // Log to audit
    await prisma.sEOAuditLog.create({
      data: {
        action: 'social_media_posted',
        entityType: 'content',
        performedBy: 'system',
        changes: {
          postsCreated: postedCount,
          posts: postedDetails
        }
      }
    });

    console.log(`\n✨ Social Media Auto-Posting Complete!`);
    console.log(`📊 Posted ${postedCount} updates`);

    return {
      success: true,
      postsCreated: postedCount,
      posts: postedDetails
    };

  } catch (error) {
    console.error('❌ Social media posting failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function generatePostContent(content) {
  // Skip if pagePath is null or empty
  if (!content.pagePath) {
    return null;
  }
  
  const url = `https://thebasketballfactoryinc.com${content.pagePath}`;
  
  let text = '';
  const hashtags = ['#Basketball', '#NJBasketball', '#YouthSports'];

  if (content.pagePath.includes('/programs/')) {
    const programName = content.pagePath.split('/').pop()?.replace(/-/g, ' ') || 'Program';
    text = `🏀 Join our ${programName}! Elite coaching, proven results, and a pathway to success. Limited spots available!`;
    hashtags.push('#BasketballTraining', '#EliteCoaching');
  } else if (content.pagePath.includes('/private-lessons')) {
    text = `⭐ Transform your game with 1-on-1 basketball training! Our expert coaches create personalized programs for maximum results.`;
    hashtags.push('#PrivateTraining', '#SkillDevelopment');
  } else {
    return null;
  }

  return { text, url, hashtags };
}

async function generateProgramPost(program) {
  const url = `https://thebasketballfactoryinc.com${program.pagePath}`;
  const programName = program.pageTitle || 'Basketball Program';
  
  const templates = [
    `🏀 ${programName} is now open for registration! Join the best basketball training in NJ.`,
    `⭐ Ready to elevate your game? ${programName} offers expert coaching and proven results.`,
    `🔥 Don't miss out! ${programName} - where champions are made. Register today!`,
    `💪 Take your skills to the next level with ${programName}. Limited spots available!`
  ];

  const text = templates[Math.floor(Math.random() * templates.length)];
  const hashtags = ['#Basketball', '#NJBasketball', '#BasketballTraining', '#YouthSports'];

  return { text, url, hashtags };
}

async function postToTwitter(post, creds) {
  try {
    // Initialize Twitter client
    const client = new TwitterApi({
      appKey: creds.api_key.value,
      appSecret: creds.api_secret.value,
      accessToken: creds.access_token.value,
      accessSecret: creds.access_token_secret.value,
    });

    // Compose tweet with URL and hashtags
    const tweetText = `${post.text}\n\n${post.url}\n\n${post.hashtags.join(' ')}`;

    // Post tweet
    const result = await client.v2.tweet(tweetText);

    return { success: true };

  } catch (error) {
    console.error('Twitter API error:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown error'
    };
  }
}

// Run the function
autoPostToSocial()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
