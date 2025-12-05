const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function postToTwitter(post, credentials) {
  const fetch = (await import('node-fetch')).default;
  
  const accessToken = credentials.access_token?.value;
  
  if (!accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: `${post.text}\n\n${post.url}\n\n${post.hashtags.join(' ')}`
    })
  });

  const data = await response.json();
  
  return {
    success: response.ok,
    data: data,
    status: response.status
  };
}

async function generatePostContent(content) {
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
  } else if (content.pagePath.includes('/about')) {
    text = `🌟 Discover The Basketball Factory difference! Building champions on and off the court since day one.`;
    hashtags.push('#BasketballFamily', '#Champions');
  } else {
    return null;
  }

  return { text, url, hashtags };
}

async function generateProgramPost(program) {
  if (!program.pagePath) {
    return null;
  }
  
  const url = `https://thebasketballfactoryinc.com${program.pagePath}`;
  const programName = program.title || program.pagePath.split('/').pop()?.replace(/-/g, ' ') || 'Basketball Program';
  
  const templates = [
    `🔥 Don't miss out! ${programName} - where champions are made. Sign up today!`,
    `💪 Ready to level up? ${programName} is now enrolling. Join the best!`,
    `🏆 ${programName} - Elite training for serious athletes. Limited spots remaining!`
  ];
  
  const text = templates[Math.floor(Math.random() * templates.length)];
  const hashtags = ['#Basketball', '#NJBasketball', '#YouthSports', '#BasketballTraining'];
  
  return { text, url, hashtags };
}

async function autoPostToSocial() {
  console.log('🎯 Starting Social Media Auto-Posting (Fast Mode)...');

  try {
    const secretsPath = process.env.AUTH_SECRETS_PATH || path.join(process.env.HOME || '', '.config', 'abacusai_auth_secrets.json');
    const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
    
    const twitterCreds = secrets['x (twitter) - basketball factory'];
    
    if (!twitterCreds || !twitterCreds.secrets) {
      console.error('❌ Twitter credentials not found');
      return;
    }

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

    for (const content of topContent) {
      if (content.pagePath !== '/') {
        const post = await generatePostContent(content);
        if (post) posts.push(post);
      }
    }

    for (const program of recentPrograms) {
      const post = await generateProgramPost(program);
      if (post) posts.push(post);
    }

    let postedCount = 0;
    const postedDetails = [];
    const errors = [];

    for (const post of posts.slice(0, 3)) {
      try {
        const result = await postToTwitter(post, twitterCreds.secrets);
        
        if (result.success) {
          postedCount++;
          postedDetails.push({
            platform: 'Twitter/X',
            content: post.text,
            url: post.url,
            hashtags: post.hashtags,
            timestamp: new Date().toISOString(),
            tweetId: result.data?.data?.id
          });

          console.log(`✅ Posted to Twitter: ${post.text.substring(0, 50)}...`);
        } else {
          errors.push({
            post: post.text.substring(0, 50),
            error: result.data
          });
          console.log(`⚠️ Post failed: ${JSON.stringify(result.data)}`);
        }

        // Short delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        errors.push({
          post: post.text.substring(0, 50),
          error: error.message
        });
        console.error(`❌ Failed to post:`, error.message);
      }
    }

    await prisma.sEOAuditLog.create({
      data: {
        action: 'social_media_post',
        entityType: 'content',
        performedBy: 'system',
        details: JSON.stringify({
          postsCreated: postedCount,
          posts: postedDetails,
          errors: errors
        })
      }
    });

    console.log(`\n✨ Social Media Auto-Posting Complete!`);
    console.log(`📊 Posted ${postedCount} updates`);
    if (errors.length > 0) {
      console.log(`⚠️ ${errors.length} posts failed`);
    }

    return {
      success: true,
      postsCreated: postedCount,
      posts: postedDetails,
      errors: errors
    };

  } catch (error) {
    console.error('❌ Social media posting failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

autoPostToSocial().catch(console.error);
