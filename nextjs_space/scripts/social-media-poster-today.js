const { PrismaClient } = require('@prisma/client');
const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');

const prisma = new PrismaClient();

// Load Twitter credentials
const authSecretsPath = '/home/ubuntu/.config/abacusai_auth_secrets.json';
const authSecrets = JSON.parse(fs.readFileSync(authSecretsPath, 'utf8'));
const twitterCreds = authSecrets['x (twitter) - basketball factory'].secrets;

const client = new TwitterApi({
  appKey: twitterCreds.api_key.value,
  appSecret: twitterCreds.api_secret.value,
  accessToken: twitterCreds.access_token.value,
  accessSecret: twitterCreds.access_token_secret.value,
});

const rwClient = client.readWrite;

async function postToTwitter() {
  console.log('🎯 Starting Social Media Auto-Posting for December 14, 2025...\n');
  
  try {
    // Get top performing pages
    const topPages = await prisma.sEOPageConfig.findMany({
      where: {
        status: 'active'
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 10
    });
    
    console.log(`Found ${topPages.length} active pages\n`);
    
    // Filter pages with valid pagePath
    const validPages = topPages.filter(p => p.pagePath && p.pagePath.length > 0);
    console.log(`${validPages.length} pages have valid paths\n`);
    
    // Create varied posts with different templates
    const templates = [
      { emoji: '🏀', prefix: 'Transform your game with', suffix: 'Join us today!' },
      { emoji: '⭐', prefix: 'Discover excellence at', suffix: 'Limited spots available!' },
      { emoji: '💪', prefix: 'Elevate your skills with', suffix: 'Start your journey now!' }
    ];
    
    const hashtags = '#Basketball #NJBasketball #YouthSports #AAU';
    const baseUrl = 'https://thebasketballfactoryinc.com';
    
    let postsCreated = 0;
    const maxPosts = 3;
    const postedDetails = [];
    
    for (let i = 0; i < Math.min(validPages.length, maxPosts); i++) {
      const page = validPages[i];
      const template = templates[i % templates.length];
      
      // Create unique post text
      const pageName = page.pageTitle || page.pagePath.split('/').pop().replace(/-/g, ' ');
      const postText = `${template.emoji} ${template.prefix} ${pageName}! ${template.suffix} ${baseUrl}${page.pagePath} ${hashtags}`;
      
      try {
        console.log(`Attempting to post: ${postText.substring(0, 80)}...`);
        
        const tweet = await rwClient.v2.tweet(postText);
        
        console.log(`✅ Posted to Twitter: ${postText.substring(0, 50)}...`);
        
        // Log to audit
        await prisma.sEOAuditLog.create({
          data: {
            action: 'social_media_post',
            entityType: 'page',
            entityId: page.id,
            pagePath: page.pagePath,
            changes: {
              text: postText,
              tweetId: tweet.data.id,
              platform: 'twitter'
            },
            reason: 'Daily social media auto-poster - Dec 14, 2025',
            performedBy: 'system',
            success: true
          }
        });
        
        postedDetails.push({
          page: page.pagePath,
          text: postText,
          tweetId: tweet.data.id,
          timestamp: new Date().toISOString()
        });
        
        postsCreated++;
        
        // Wait 90 seconds between posts
        if (i < maxPosts - 1) {
          console.log('⏳ Waiting 90 seconds before next post...\n');
          await new Promise(resolve => setTimeout(resolve, 90000));
        }
        
      } catch (error) {
        console.error(`❌ Error posting for ${page.pagePath}:`, error.message);
        
        // Log failed attempt
        await prisma.sEOAuditLog.create({
          data: {
            action: 'social_media_post',
            entityType: 'page',
            entityId: page.id,
            pagePath: page.pagePath,
            changes: {
              text: postText,
              platform: 'twitter',
              error: error.message
            },
            reason: 'Daily social media auto-poster - Dec 14, 2025',
            performedBy: 'system',
            success: false,
            errorMessage: error.message
          }
        });
      }
    }
    
    console.log(`\n✅ Social media posting complete! Created ${postsCreated} posts.`);
    return postedDetails;
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

postToTwitter().then(details => {
  console.log('\n📊 Summary:', JSON.stringify(details, null, 2));
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
