const { PrismaClient } = require('@prisma/client');
const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function runSocialMediaPoster() {
  try {
    console.log('🚀 Starting Social Media Poster...\n');
    
    // Load Twitter credentials
    const secretsPath = '/home/ubuntu/.config/abacusai_auth_secrets.json';
    const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
    const twitterCreds = secrets['x (twitter) - basketball factory'];
    
    if (!twitterCreds) {
      throw new Error('Twitter credentials not found');
    }
    
    const client = new TwitterApi({
      appKey: twitterCreds.secrets.api_key.value,
      appSecret: twitterCreds.secrets.api_secret.value,
      accessToken: twitterCreds.secrets.access_token.value,
      accessSecret: twitterCreds.secrets.access_token_secret.value,
    });
    
    console.log('✅ Twitter API connected\n');
    
    // Get top performing content from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const topContent = await prisma.sEOPageConfig.findMany({
      where: {
        updatedAt: {
          gte: sevenDaysAgo
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 5
    });
    
    console.log(`📊 Found ${topContent.length} recent pages to promote\n`);
    
    const baseUrl = 'https://thebasketballfactoryinc.com';
    const hashtags = '#Basketball #NJBasketball #YouthSports #AAU';
    
    const postsToCreate = [];
    
    // Create posts for top content
    for (const page of topContent.slice(0, 3)) {
      const url = `${baseUrl}${page.pagePath}`;
      const title = page.pageName || page.pageTitle || (page.pagePath ? page.pagePath.split('/').pop()?.replace(/-/g, ' ') : '') || 'Check this out';
      
      let tweetText = '';
      
      if (page.pagePath.includes('programs')) {
        tweetText = `🏀 ${title}! Join our elite basketball program and take your game to the next level. ${url} ${hashtags}`;
      } else if (page.pagePath.includes('about')) {
        tweetText = `🌟 ${title} - Building champions on and off the court. ${url} ${hashtags}`;
      } else if (page.pagePath.includes('contact')) {
        tweetText = `📞 Ready to elevate your game? Get in touch with us today! ${url} ${hashtags}`;
      } else {
        tweetText = `🔥 Don't miss out! ${title} - where champions are made. ${url} ${hashtags}`;
      }
      
      // Ensure tweet is under 280 characters
      if (tweetText.length > 280) {
        const maxTitleLength = 280 - url.length - hashtags.length - 20;
        const shortTitle = title.substring(0, maxTitleLength) + '...';
        tweetText = `🔥 ${shortTitle} ${url} ${hashtags}`;
      }
      
      postsToCreate.push({
        text: tweetText,
        pageId: page.id,
        pagePath: page.pagePath
      });
    }
    
    console.log(`📝 Prepared ${postsToCreate.length} posts\n`);
    
    const results = [];
    
    // Post to Twitter with delays
    for (let i = 0; i < postsToCreate.length; i++) {
      const post = postsToCreate[i];
      
      try {
        console.log(`Posting ${i + 1}/${postsToCreate.length}: ${post.text.substring(0, 60)}...`);
        
        const tweet = await client.v2.tweet(post.text);
        
        // Log to audit
        await prisma.sEOAuditLog.create({
          data: {
            action: 'social_media_post',
            entityType: 'page',
            details: JSON.stringify({
              platform: 'twitter',
              tweetId: tweet.data.id,
              text: post.text,
              pageId: post.pageId,
              pagePath: post.pagePath
            }),
            timestamp: new Date()
          }
        });
        
        results.push({
          success: true,
          text: post.text,
          tweetId: tweet.data.id,
          pagePath: post.pagePath
        });
        
        console.log(`✅ Posted successfully (ID: ${tweet.data.id})\n`);
        
        // Wait 60 seconds between posts (except for the last one)
        if (i < postsToCreate.length - 1) {
          console.log('⏳ Waiting 60 seconds before next post...\n');
          await new Promise(resolve => setTimeout(resolve, 60000));
        }
        
      } catch (error) {
        console.error(`❌ Failed to post: ${error.message}\n`);
        results.push({
          success: false,
          text: post.text,
          error: error.message,
          pagePath: post.pagePath
        });
      }
    }
    
    console.log('\n✅ Social media posting complete!\n');
    console.log(`📊 Results: ${results.filter(r => r.success).length} successful, ${results.filter(r => !r.success).length} failed\n`);
    
    return results;
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

runSocialMediaPoster()
  .then(results => {
    console.log('Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
