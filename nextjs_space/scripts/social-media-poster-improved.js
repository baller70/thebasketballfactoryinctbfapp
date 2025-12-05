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

    console.log('✅ Twitter credentials loaded');

    // Get recent posts from last 24 hours to avoid duplicates
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentAudits = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_posted',
        timestamp: { gte: oneDayAgo }
      },
      orderBy: { timestamp: 'desc' }
    });

    const recentlyPostedUrls = new Set();
    recentAudits.forEach(audit => {
      if (audit.changes && audit.changes.posts) {
        audit.changes.posts.forEach(post => {
          if (post.url) recentlyPostedUrls.add(post.url);
        });
      }
    });

    console.log(`📋 Found ${recentlyPostedUrls.size} URLs posted in last 24 hours`);

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
      take: 10
    });

    console.log(`📊 Found ${topContent.length} top-performing pages`);

    // Get latest programs and updates
    const recentPrograms = await prisma.sEOPageConfig.findMany({
      where: {
        status: 'active',
        pagePath: {
          contains: '/programs/'
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 5
    });

    console.log(`📋 Found ${recentPrograms.length} recent programs`);

    const posts = [];

    // Generate posts for top-performing content (skip recently posted)
    for (const content of topContent) {
      if (content.pagePath !== '/') {
        const url = `https://thebasketballfactoryinc.com${content.pagePath}`;
        if (!recentlyPostedUrls.has(url)) {
          const post = await generatePostContent(content);
          if (post) posts.push(post);
        }
      }
    }

    // Generate posts for recent programs (skip recently posted)
    for (const program of recentPrograms) {
      const url = `https://thebasketballfactoryinc.com${program.pagePath}`;
      if (!recentlyPostedUrls.has(url)) {
        const post = await generateProgramPost(program);
        if (post) posts.push(post);
      }
    }

    console.log(`📝 Generated ${posts.length} potential posts (filtered duplicates)`);

    if (posts.length === 0) {
      console.log('⚠️ No new content to post (all recent content already posted)');
      return {
        success: true,
        postsCreated: 0,
        posts: [],
        message: 'No new content available'
      };
    }

    // Post to Twitter/X
    let postedCount = 0;
    const postedDetails = [];
    const failedPosts = [];

    for (const post of posts.slice(0, 3)) { // Limit to 3 posts per run
      try {
        const result = await postToTwitter(post, twitterCreds.secrets);
        
        if (result.success) {
          postedCount++;
          postedDetails.push({
            platform: 'Twitter/X',
            content: post.text,
            url: post.url,
            hashtags: post.hashtags,
            timestamp: new Date().toISOString()
          });

          console.log(`✅ Posted to Twitter: ${post.text.substring(0, 50)}...`);
        } else {
          console.log(`⚠️ Failed to post: ${result.error}`);
          failedPosts.push({
            content: post.text,
            url: post.url,
            error: result.error
          });
        }

        // Wait between posts to avoid rate limiting (only if more posts to come)
        const currentIndex = posts.slice(0, 3).indexOf(post);
        if (currentIndex < posts.slice(0, 3).length - 1) {
          console.log('⏳ Waiting 60 seconds before next post...');
          await new Promise(resolve => setTimeout(resolve, 60000)); // 1 minute delay
        }

      } catch (error) {
        console.error(`❌ Failed to post:`, error.message);
        failedPosts.push({
          content: post.text,
          url: post.url,
          error: error.message
        });
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
          posts: postedDetails,
          failedPosts: failedPosts.length > 0 ? failedPosts : undefined
        }
      }
    });

    console.log(`\n✨ Social Media Auto-Posting Complete!`);
    console.log(`📊 Posted ${postedCount} updates`);
    if (failedPosts.length > 0) {
      console.log(`⚠️ Failed ${failedPosts.length} posts`);
    }

    return {
      success: true,
      postsCreated: postedCount,
      posts: postedDetails,
      failedPosts
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

  // Add time-based variation to make posts unique
  const hour = new Date().getHours();
  const timeEmoji = hour < 12 ? '🌅' : hour < 18 ? '☀️' : '🌙';

  if (content.pagePath.includes('/programs/')) {
    const programName = content.pagePath.split('/').pop()?.replace(/-/g, ' ') || 'Program';
    const templates = [
      `${timeEmoji} Join our ${programName}! Elite coaching, proven results, and a pathway to success.`,
      `🏀 ${programName} - Transform your game with expert training and personalized attention.`,
      `⭐ Ready to level up? Our ${programName} delivers results. Spots filling fast!`,
      `🔥 ${programName}: Where dedication meets excellence. Join us today!`
    ];
    text = templates[Math.floor(Math.random() * templates.length)];
    hashtags.push('#BasketballTraining', '#EliteCoaching');
  } else if (content.pagePath.includes('/private-lessons')) {
    const templates = [
      `${timeEmoji} Transform your game with 1-on-1 basketball training! Personalized programs for maximum results.`,
      `⭐ Private lessons that make a difference. Expert coaches, proven methods, real results.`,
      `🏀 Take your skills to the next level with personalized basketball training.`,
      `💪 One-on-one training that delivers. Book your session today!`
    ];
    text = templates[Math.floor(Math.random() * templates.length)];
    hashtags.push('#PrivateTraining', '#SkillDevelopment');
  } else if (content.pagePath.includes('/about')) {
    text = `${timeEmoji} Learn about our mission to develop basketball excellence in NJ. Join our community!`;
    hashtags.push('#BasketballCommunity', '#YouthDevelopment');
  } else if (content.pagePath.includes('/contact')) {
    text = `${timeEmoji} Ready to start your basketball journey? Get in touch with us today!`;
    hashtags.push('#GetStarted', '#BasketballTraining');
  } else {
    return null;
  }

  return { text, url, hashtags };
}

async function generateProgramPost(program) {
  const url = `https://thebasketballfactoryinc.com${program.pagePath}`;
  const programName = program.pageTitle || 'Basketball Program';
  
  // Add date-based variation
  const dayOfWeek = new Date().getDay();
  const weekdayEmojis = ['🌟', '💪', '🔥', '⚡', '🏆', '🎯', '✨'];
  const emoji = weekdayEmojis[dayOfWeek];
  
  const templates = [
    `${emoji} ${programName} is now open! Join the best basketball training in NJ.`,
    `🏀 Ready to elevate your game? ${programName} offers expert coaching and proven results.`,
    `${emoji} Don't miss out! ${programName} - where champions are made.`,
    `💪 Take your skills to the next level with ${programName}. Limited spots!`,
    `${emoji} ${programName}: Elite training, expert coaches, real results. Register now!`,
    `🏀 Join ${programName} and experience the difference. Your journey starts here!`
  ];

  const text = templates[Math.floor(Math.random() * templates.length)];
  const hashtags = ['#Basketball', '#NJBasketball', '#BasketballTraining', '#YouthSports'];

  return { text, url, hashtags };
}

async function postToTwitter(post, creds) {
  try {
    const { TwitterApi } = require('twitter-api-v2');

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

// Run if called directly
if (require.main === module) {
  autoPostToSocial()
    .then((result) => {
      console.log('\nFinal result:', JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { autoPostToSocial };
