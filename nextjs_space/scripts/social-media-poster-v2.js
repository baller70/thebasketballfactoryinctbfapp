const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { TwitterApi } = require('twitter-api-v2');

const prisma = new PrismaClient();

const emojiSets = [
  ['🏀', '💪', '🔥', '⭐', '🎯'],
  ['🌟', '💯', '🚀', '⚡', '🏆'],
  ['👊', '💥', '🎉', '✨', '🔝'],
  ['🙌', '💫', '🎊', '🏅', '🔶']
];

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

const ctas = [
  "Register now",
  "Sign up today",
  "Join the program",
  "Reserve your spot",
  "Get started",
  "Enroll today"
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateUniquePost(page) {
  const emojis = getRandomElement(emojiSets);
  const opening = getRandomElement(openings);
  const cta = getRandomElement(ctas);
  const emoji1 = getRandomElement(emojis);
  const emoji2 = getRandomElement(emojis.filter(e => e !== emoji1));
  const emoji3 = getRandomElement(emojis.filter(e => e !== emoji1 && e !== emoji2));
  
  const baseUrl = 'https://riseasoneaau.com';
  const url = `${baseUrl}${page.pagePath}`;
  
  const pageName = page.pagePath 
    ? page.pagePath.split('/').filter(Boolean).pop().replace(/-/g, ' ')
    : 'Basketball Training';
  
  const formattedName = pageName.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeStamp = `${hour}:${minute.toString().padStart(2, '0')}`;
  
  const post = `${emoji1} ${opening} ${emoji2}\n\n${formattedName} - Expert coaching for all skill levels!\n\n${emoji3} ${cta}:\n${url}\n\n[Posted at ${timeStamp}]\n\n#Basketball #NJBasketball #YouthSports #RiseAsOne`;
  
  return post;
}

async function postToTwitter(page, twitterClient) {
  try {
    const postText = generateUniquePost(page);
    console.log(`\n📝 Posting:\n${postText}\n`);
    
    const result = await twitterClient.v2.tweet(postText);
    
    await prisma.sEOAuditLog.create({
      data: {
        action: 'social_media_post',
        entityType: 'twitter',
        pagePath: page.pagePath,
        changes: {
          platform: 'twitter',
          content: postText,
          tweetId: result.data.id,
          postedAt: new Date().toISOString()
        },
        performedBy: 'system',
        success: true
      }
    });
    
    console.log(`✅ Success! Tweet ID: ${result.data.id}`);
    return { success: true, content: postText, tweetId: result.data.id };
  } catch (error) {
    console.error(`❌ Failed:`, error.message);
    
    await prisma.sEOAuditLog.create({
      data: {
        action: 'social_media_post',
        entityType: 'twitter',
        pagePath: page.pagePath,
        changes: {
          platform: 'twitter',
          content: generateUniquePost(page),
          error: error.message
        },
        performedBy: 'system',
        success: false,
        errorMessage: error.message
      }
    });
    
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🎯 Posting additional content...\n');
  
  try {
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
    
    // Get pages that haven't been posted today
    const today = new Date().toISOString().split('T')[0];
    const postedToday = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_post',
        success: true,
        timestamp: {
          gte: new Date(today)
        }
      },
      select: { pagePath: true }
    });
    
    const postedPaths = postedToday.map(p => p.pagePath);
    
    const pages = await prisma.sEOPageConfig.findMany({
      where: {
        status: 'active',
        pagePath: {
          not: '/',
          notIn: postedPaths
        }
      },
      take: 2
    });
    
    console.log(`📊 Found ${pages.length} pages to post\n`);
    
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      await postToTwitter(page, twitterClient);
      
      if (i < pages.length - 1) {
        console.log('\n⏳ Waiting 1 minute...\n');
        await new Promise(resolve => setTimeout(resolve, 60000));
      }
    }
    
    console.log(`\n✅ Done!`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
