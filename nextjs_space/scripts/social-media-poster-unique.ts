import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface PostContent {
  text: string;
  url: string;
  hashtags: string[];
  pagePath: string;
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

    // Get posts from last 7 days to avoid duplicates
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentPosts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_post',
        success: true,
        timestamp: {
          gte: sevenDaysAgo
        }
      }
    });

    const recentPagePaths = new Set(recentPosts.map(p => p.pagePath));

    // Get top-performing content from last 7 days
    const topContent = await prisma.sEOPerformance.findMany({
      where: {
        dateKey: {
          gte: sevenDaysAgo.toISOString().split('T')[0]
        },
        pagePath: {
          not: null,
          notIn: Array.from(recentPagePaths)
        }
      },
      orderBy: { clicks: 'desc' },
      take: 10
    });

    // Get latest programs and updates
    const recentPrograms = await prisma.sEOPageConfig.findMany({
      where: {
        status: 'active',
        pagePath: {
          contains: '/programs/',
          notIn: Array.from(recentPagePaths)
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 5
    });

    const posts: PostContent[] = [];

    // Generate posts for top-performing content
    for (const content of topContent) {
      if (content.pagePath && content.pagePath !== '/' && !recentPagePaths.has(content.pagePath)) {
        const post = await generatePostContent(content);
        if (post) posts.push(post);
      }
    }

    // Generate posts for recent programs
    for (const program of recentPrograms) {
      if (!recentPagePaths.has(program.pagePath)) {
        const post = await generateProgramPost(program);
        if (post) posts.push(post);
      }
    }

    console.log(`📝 Generated ${posts.length} potential posts`);
    console.log(`🚫 Skipped ${recentPagePaths.size} recently posted pages`);

    // Post to Twitter/X
    let postedCount = 0;
    const postedDetails: any[] = [];

    for (const post of posts.slice(0, 3)) { // Limit to 3 posts per run
      try {
        const result = await postToTwitter(post, twitterCreds.secrets);
        
        if (result.success && result.tweetId) {
          postedCount++;
          
          // Log individual post to audit
          await prisma.sEOAuditLog.create({
            data: {
              action: 'social_media_post',
              entityType: 'page',
              pagePath: post.pagePath,
              performedBy: 'system',
              success: true,
              changes: {
                text: post.text,
                url: post.url,
                tweetId: result.tweetId
              }
            }
          });

          postedDetails.push({
            platform: 'Twitter/X',
            content: post.text,
            url: post.url,
            tweetId: result.tweetId,
            timestamp: new Date().toISOString()
          });

          console.log(`✅ Posted to Twitter: ${post.text.substring(0, 50)}...`);
        } else {
          console.log(`⚠️ Failed to post: ${result.error}`);
        }

        // Wait between posts to avoid rate limiting
        if (posts.indexOf(post) < posts.length - 1) {
          console.log('⏳ Waiting 60 seconds before next post...');
          await new Promise(resolve => setTimeout(resolve, 60000)); // 1 minute delay
        }

      } catch (error) {
        console.error(`❌ Failed to post:`, error);
      }
    }

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

async function generatePostContent(content: any): Promise<PostContent | null> {
  // Skip if pagePath is null or empty
  if (!content.pagePath) {
    return null;
  }
  
  const url = `https://riseasoneaau.com${content.pagePath}`;
  
  let text = '';
  const hashtags = ['#Basketball', '#NJBasketball', '#YouthSports'];

  if (content.pagePath.includes('/programs/')) {
    const programName = content.pagePath.split('/').pop()?.replace(/-/g, ' ') || 'Program';
    const templates = [
      `🏀 Discover ${programName} - Elite basketball training that delivers results! 🏆`,
      `⭐ ${programName} is transforming young athletes. Join us today!`,
      `🔥 ${programName}: Where dedication meets excellence. Limited spots!`,
      `💪 Elevate your game with ${programName}. Expert coaching awaits!`
    ];
    text = templates[Math.floor(Math.random() * templates.length)];
    hashtags.push('#BasketballTraining');
  } else if (content.pagePath.includes('/private-lessons')) {
    const templates = [
      `⭐ 1-on-1 basketball training that gets results! Personalized coaching for serious athletes.`,
      `🏀 Private lessons with expert coaches. Transform your game today!`,
      `💪 Take your skills to the next level with personalized basketball training.`
    ];
    text = templates[Math.floor(Math.random() * templates.length)];
    hashtags.push('#PrivateTraining');
  } else if (content.pagePath.includes('/about')) {
    text = `🏀 Learn about our mission to develop champions on and off the court!`;
  } else if (content.pagePath.includes('/contact')) {
    text = `📞 Ready to start your basketball journey? Get in touch with us today!`;
  } else {
    return null;
  }

  return { text, url, hashtags, pagePath: content.pagePath };
}

async function generateProgramPost(program: any): Promise<PostContent | null> {
  const url = `https://riseasoneaau.com${program.pagePath}`;
  const programName = program.pageTitle || program.pagePath.split('/').pop()?.replace(/-/g, ' ') || 'Basketball Program';
  
  const templates = [
    `🏀 ${programName} - Join the best basketball training in NJ! 🏆`,
    `⭐ Ready to elevate your game? ${programName} offers expert coaching!`,
    `🔥 ${programName} - Where champions are made. Register now!`,
    `💪 ${programName}: Elite training, proven results. Limited spots!`,
    `🏀 Transform your game with ${programName}. Expert coaches, real results!`
  ];

  const text = templates[Math.floor(Math.random() * templates.length)];
  const hashtags = ['#Basketball', '#NJBasketball', '#YouthSports'];

  return { text, url, hashtags, pagePath: program.pagePath };
}

async function postToTwitter(post: PostContent, creds: any): Promise<{ success: boolean; tweetId?: string; error?: string }> {
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

    return { success: true, tweetId: result.data.id };

  } catch (error: any) {
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
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { autoPostToSocial };
