const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { TwitterApi } = require('twitter-api-v2');

const prisma = new PrismaClient();

// Emoji sets for variety
const emojiSets = [
  ['🏀', '💪', '🔥', '⭐', '🎯'],
  ['🌟', '💯', '🚀', '⚡', '🏆'],
  ['👊', '💥', '🎉', '✨', '🔝'],
  ['🙌', '💫', '🎊', '🏅', '🔶']
];

// Opening phrases for variety
const openings = [
  "Ready to level up?",
  "Don't miss out!",
  "Join us today!",
  "Take your game higher!",
  "Elevate your skills!",
  "Transform your game!",
  "Unlock your potential!",
  "Start your journey!"
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateUniquePost(content) {
  const emojis = getRandomElement(emojiSets);
  const opening = getRandomElement(openings);
  const emoji1 = getRandomElement(emojis);
  const emoji2 = getRandomElement(emojis.filter(e => e !== emoji1));
  
  const baseUrl = 'https://riseasoneaau.com';
  const url = content.pagePath ? `${baseUrl}${content.pagePath}` : baseUrl;
  
  // Create unique content with timestamp element
  const hour = new Date().getHours();
  const timeContext = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  
  const pageName = content.pagePath 
    ? content.pagePath.split('/').filter(Boolean).pop().replace(/-/g, ' ')
    : 'Basketball Training';
  
  const post = `${emoji1} ${opening} ${emoji2}\n\n${pageName.charAt(0).toUpperCase() + pageName.slice(1)} - where champions are made!\n\nSign up this ${timeContext}: ${url}\n\n#Basketball #NJBasketball #YouthSports #RiseAsOne`;
  
  return post;
}

async function postToTwitter(content, twitterClient) {
  try {
    const postText = generateUniquePost(content);
    console.log(`\n📝 Attempting to post:\n${postText}\n`);
    
    const result = await twitterClient.v2.tweet(postText);
    
    // Log to database
    await prisma.sEOAuditLog.create({
      data: {
        action: 'social_media_post',
        entityType: 'twitter',
        pagePath: content.pagePath,
        changes: {
          platform: 'twitter',
          content: postText,
          tweetId: result.data.id
        },
        performedBy: 'system',
        success: true
      }
    });
    
    console.log(`✅ Posted successfully! Tweet ID: ${result.data.id}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to post:`, error.message);
    
    // Log failure
    await prisma.sEOAuditLog.create({
      data: {
        action: 'social_media_post',
        entityType: 'twitter',
        pagePath: content.pagePath,
        changes: {
          platform: 'twitter',
          content: generateUniquePost(content)
        },
        performedBy: 'system',
        success: false,
        errorMessage: error.message
      }
    });
    
    return false;
  }
}

async function main() {
  console.log('🎯 Starting Social Media Auto-Posting (Unique Content)...\n');
  
  try {
    // Load Twitter credentials
    const secretsPath = process.env.AUTH_SECRETS_PATH || 
      path.join(process.env.HOME || '', '.config', 'abacusai_auth_secrets.json');
    
    const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
    const twitterCreds = secrets['x (twitter) - basketball factory'];
    
    if (!twitterCreds || !twitterCreds.secrets) {
      console.error('❌ Twitter credentials not found');
      return;
    }
    
    const twitterClient = new TwitterApi({
      appKey: twitterCreds.secrets.api_key.value,
      appSecret: twitterCreds.secrets.api_secret.value,
      accessToken: twitterCreds.secrets.access_token.value,
      accessSecret: twitterCreds.secrets.access_token_secret.value,
    });
    
    // Get top performing content from last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const topContent = await prisma.sEOPerformance.findMany({
      where: {
        dateKey: {
          gte: sevenDaysAgo.toISOString().split('T')[0]
        },
        pagePath: {
          not: null,
          notIn: ['/']
        }
      },
      orderBy: { clicks: 'desc' },
      take: 10
    });
    
    console.log(`📊 Found ${topContent.length} top-performing pages\n`);
    
    let successCount = 0;
    const maxPosts = 3;
    
    // Try to post up to 3 times
    for (let i = 0; i < topContent.length && successCount < maxPosts; i++) {
      const content = topContent[i];
      const success = await postToTwitter(content, twitterClient);
      
      if (success) {
        successCount++;
        
        // Wait 2 minutes between posts to avoid rate limits
        if (successCount < maxPosts && i < topContent.length - 1) {
          console.log('\n⏳ Waiting 2 minutes before next post...\n');
          await new Promise(resolve => setTimeout(resolve, 120000));
        }
      }
    }
    
    console.log(`\n✅ Completed! Successfully posted ${successCount} tweets.`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
