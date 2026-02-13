import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface PostContent {
  text: string;
  url: string;
  hashtags: string[];
}

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

    const posts: PostContent[] = [];

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
    const postedDetails: any[] = [];
    const failedPosts: any[] = [];

    for (const post of posts.slice(0, 3)) { // Limit to 3 posts per run
      try {
        const result = await postToTwitter(post, twitterCreds.secrets);
        
        if (result.success) {
          postedCount++;
          postedDetails.push({
            platform: 'Twitter/X',
            content: post.text,
            url: post.url,
            timestamp: new Date().toISOString(),
            tweetId: result.tweetId
          });

          console.log(`✅ Posted to Twitter: ${post.text.substring(0, 50)}...`);
        } else {
          failedPosts.push({
            content: post.text,
            error: result.error,
            timestamp: new Date().toISOString()
          });
          console.log(`⚠️ Skipped (${result.error}): ${post.text.substring(0, 50)}...`);
        }

        // Wait between posts to avoid rate limiting
        if (posts.indexOf(post) < posts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 60000)); // 1 minute delay
        }

      } catch (error) {
        console.error(`❌ Failed to post:`, error);
        failedPosts.push({
          content: post.text,
          error: String(error),
          timestamp: new Date().toISOString()
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
          failed: failedPosts
        }
      }
    });

    console.log(`\n✨ Social Media Auto-Posting Complete!`);
    console.log(`📊 Posted ${postedCount} updates`);
    console.log(`⚠️ Failed/Skipped ${failedPosts.length} posts`);

    return {
      success: true,
      postsCreated: postedCount,
      posts: postedDetails,
      failed: failedPosts
    };

  } catch (error) {
    console.error('❌ Social media posting failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function generatePostContent(content: any): Promise<PostContent | null> {
  // Skip if pagePath is null or empty
  if (!content.pagePath) {
    return null;
  }
  
  const url = `https://thebasketballfactoryinc.com${content.pagePath}`;
  
  let text = '';
  const hashtags = ['#Basketball', '#NJBasketball', '#YouthSports'];

  // Add time-based variation to avoid duplicates
  const hour = new Date().getHours();
  const timeEmoji = hour < 12 ? '🌅' : hour < 18 ? '☀️' : '🌙';

  if (content.pagePath.includes('/programs/')) {
    const programName = content.pagePath.split('/').pop()?.replace(/-/g, ' ') || 'Program';
    const variations = [
      `${timeEmoji} Join our ${programName}! Elite coaching, proven results, and a pathway to success. Limited spots available!`,
      `🏀 ${programName} is transforming young athletes! Expert training that delivers real results. Sign up today!`,
      `⭐ Ready to take your game to the next level? Our ${programName} offers personalized coaching and proven methods.`,
      `🔥 ${programName} - Where dedication meets excellence! Join NJ's premier basketball training program.`
    ];
    text = variations[Math.floor(Math.random() * variations.length)];
    hashtags.push('#BasketballTraining', '#EliteCoaching');
  } else if (content.pagePath.includes('/private-lessons')) {
    const variations = [
      `${timeEmoji} Transform your game with 1-on-1 basketball training! Our expert coaches create personalized programs for maximum results.`,
      `⭐ Private basketball lessons that make a difference! Customized training plans designed for your success.`,
      `🏀 Elevate your skills with personalized coaching! One-on-one training sessions now available.`,
      `💪 Individual attention, exceptional results! Book your private basketball training session today.`
    ];
    text = variations[Math.floor(Math.random() * variations.length)];
    hashtags.push('#PrivateTraining', '#SkillDevelopment');
  } else {
    return null;
  }

  return { text, url, hashtags };
}

async function generateProgramPost(program: any): Promise<PostContent | null> {
  const url = `https://thebasketballfactoryinc.com${program.pagePath}`;
  const programName = program.pageTitle || 'Basketball Program';
  
  // Add date-based variation
  const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  
  const templates = [
    `🏀 ${programName} is now open for registration! Join the best basketball training in NJ. #${dayOfWeek}Motivation`,
    `⭐ Ready to elevate your game? ${programName} offers expert coaching and proven results. Register now!`,
    `🔥 Don't miss out! ${programName} - where champions are made. Limited spots for this season!`,
    `💪 Take your skills to the next level with ${programName}. Join us this ${dayOfWeek}!`,
    `🌟 ${programName} - Building better athletes, one practice at a time. Enroll today!`
  ];

  const text = templates[Math.floor(Math.random() * templates.length)];
  const hashtags = ['#Basketball', '#NJBasketball', '#BasketballTraining', '#YouthSports'];

  return { text, url, hashtags };
}

async function postToTwitter(post: PostContent, creds: any): Promise<{ success: boolean; error?: string; tweetId?: string }> {
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

    return { 
      success: true,
      tweetId: result.data.id
    };

  } catch (error: any) {
    console.error('Twitter API error:', error);
    
    // Check if it's a duplicate content error
    if (error.code === 403 && error.data?.detail?.includes('duplicate')) {
      return { 
        success: false, 
        error: 'Duplicate content'
      };
    }
    
    return { 
      success: false, 
      error: error.message || 'Unknown error'
    };
  }
}

// Run if called directly
if (require.main === module) {
  autoPostToSocial()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { autoPostToSocial };
