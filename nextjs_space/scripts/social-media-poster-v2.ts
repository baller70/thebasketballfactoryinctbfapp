import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface PostContent {
  text: string;
  url: string;
  hashtags: string[];
}

interface PostResult {
  success: boolean;
  content?: PostContent;
  error?: string;
  isDuplicate?: boolean;
}

async function autoPostToSocial() {
  console.log('🎯 Starting Social Media Auto-Posting (v2)...');

  const results: PostResult[] = [];
  let postedCount = 0;

  try {
    // Load Twitter API credentials from secrets file
    const secretsPath = process.env.AUTH_SECRETS_PATH || path.join(process.env.HOME || '', '.config', 'abacusai_auth_secrets.json');
    const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
    
    const twitterCreds = secrets['x (twitter) - basketball factory'];
    
    if (!twitterCreds || !twitterCreds.secrets) {
      console.error('❌ Twitter credentials not found');
      return { success: false, error: 'No credentials', results };
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
      take: 3
    });

    console.log(`📋 Found ${recentPrograms.length} recent programs`);

    const posts: PostContent[] = [];

    // Generate posts for top-performing content
    for (const content of topContent) {
      if (content.pagePath && content.pagePath !== '/') {
        const post = await generatePostContent(content);
        if (post) {
          posts.push(post);
          console.log(`📝 Generated post for: ${content.pagePath}`);
        }
      }
    }

    // Generate posts for recent programs
    for (const program of recentPrograms) {
      const post = await generateProgramPost(program);
      if (post) {
        posts.push(post);
        console.log(`📝 Generated program post: ${program.pageTitle}`);
      }
    }

    console.log(`\n🎯 Attempting to post ${Math.min(posts.length, 3)} updates...`);

    // Post to Twitter/X
    for (const post of posts.slice(0, 3)) { // Limit to 3 posts per run
      try {
        console.log(`\n📤 Posting: ${post.text.substring(0, 60)}...`);
        const result = await postToTwitter(post, twitterCreds.secrets);
        
        if (result.success) {
          postedCount++;
          results.push({
            success: true,
            content: post
          });
          console.log(`✅ Successfully posted!`);
        } else {
          results.push({
            success: false,
            content: post,
            error: result.error,
            isDuplicate: result.error?.includes('duplicate')
          });
          console.log(`❌ Failed: ${result.error}`);
        }

        // Wait between posts to avoid rate limiting (only if more posts to come)
        if (posts.indexOf(post) < Math.min(posts.length, 3) - 1) {
          console.log('⏳ Waiting 60 seconds before next post...');
          await new Promise(resolve => setTimeout(resolve, 60000));
        }

      } catch (error: any) {
        console.error(`❌ Error posting:`, error.message);
        results.push({
          success: false,
          content: post,
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
          postsAttempted: results.length,
          postsSuccessful: postedCount,
          postsFailed: results.filter(r => !r.success).length,
          duplicates: results.filter(r => r.isDuplicate).length,
          results: results.map(r => ({
            success: r.success,
            text: r.content?.text.substring(0, 100),
            url: r.content?.url,
            error: r.error,
            isDuplicate: r.isDuplicate
          }))
        }
      }
    });

    console.log(`\n✨ Social Media Auto-Posting Complete!`);
    console.log(`📊 Successfully posted: ${postedCount}`);
    console.log(`❌ Failed: ${results.filter(r => !r.success).length}`);
    console.log(`🔄 Duplicates: ${results.filter(r => r.isDuplicate).length}`);

    return {
      success: true,
      postsCreated: postedCount,
      results
    };

  } catch (error) {
    console.error('❌ Social media posting failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      postsCreated: postedCount,
      results
    };
  } finally {
    await prisma.$disconnect();
  }
}

async function generatePostContent(content: any): Promise<PostContent | null> {
  if (!content.pagePath) {
    return null;
  }
  
  const url = `https://thebasketballfactoryinc.com${content.pagePath}`;
  
  let text = '';
  const hashtags = ['#Basketball', '#NJBasketball', '#YouthSports'];

  // Add timestamp variation to avoid duplicates
  const timeVariation = new Date().getHours() < 12 ? '🌅' : new Date().getHours() < 18 ? '☀️' : '🌙';

  if (content.pagePath.includes('/programs/')) {
    const programName = content.pagePath.split('/').pop()?.replace(/-/g, ' ') || 'Program';
    const templates = [
      `${timeVariation} Join our ${programName}! Elite coaching, proven results. Limited spots!`,
      `🏀 ${programName} - Transform your game with expert training!`,
      `⭐ Ready to level up? ${programName} offers the best basketball training in NJ!`,
    ];
    text = templates[Math.floor(Math.random() * templates.length)];
    hashtags.push('#BasketballTraining', '#EliteCoaching');
  } else if (content.pagePath.includes('/private-lessons')) {
    const templates = [
      `${timeVariation} 1-on-1 basketball training that delivers results! Personalized coaching for serious players.`,
      `⭐ Transform your game with private basketball lessons! Expert coaches, proven methods.`,
      `🏀 Take your skills to the next level with personalized basketball training!`,
    ];
    text = templates[Math.floor(Math.random() * templates.length)];
    hashtags.push('#PrivateTraining', '#SkillDevelopment');
  } else {
    return null;
  }

  return { text, url, hashtags };
}

async function generateProgramPost(program: any): Promise<PostContent | null> {
  const url = `https://thebasketballfactoryinc.com${program.pagePath}`;
  const programName = program.pageTitle || 'Basketball Program';
  
  // Add date variation to avoid duplicates
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  const templates = [
    `🏀 ${programName} - Register now for ${today}! Best basketball training in NJ.`,
    `⭐ ${programName} has spots available! Join today and elevate your game.`,
    `🔥 Don't wait! ${programName} registration open. Limited spots for ${today}.`,
    `💪 ${programName} - Where champions train. Sign up today!`
  ];

  const text = templates[Math.floor(Math.random() * templates.length)];
  const hashtags = ['#Basketball', '#NJBasketball', '#BasketballTraining', '#YouthSports'];

  return { text, url, hashtags };
}

async function postToTwitter(post: PostContent, creds: any): Promise<{ success: boolean; error?: string }> {
  try {
    const { TwitterApi } = require('twitter-api-v2');

    const client = new TwitterApi({
      appKey: creds.api_key.value,
      appSecret: creds.api_secret.value,
      accessToken: creds.access_token.value,
      accessSecret: creds.access_token_secret.value,
    });

    const tweetText = `${post.text}\n\n${post.url}\n\n${post.hashtags.join(' ')}`;

    const result = await client.v2.tweet(tweetText);

    return { success: true };

  } catch (error: any) {
    console.error('Twitter API error details:', {
      message: error.message,
      code: error.code,
      data: error.data
    });
    
    return { 
      success: false, 
      error: error.data?.detail || error.message || 'Unknown error'
    };
  }
}

if (require.main === module) {
  autoPostToSocial()
    .then((result) => {
      console.log('\n📋 Final Results:', JSON.stringify(result, null, 2));
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { autoPostToSocial };
