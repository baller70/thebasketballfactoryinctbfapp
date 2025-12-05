const { PrismaClient } = require('@prisma/client');
const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function postToSocialMedia() {
  console.log('Starting social media poster...');
  
  try {
    // Load Twitter credentials
    const authPath = '/home/ubuntu/.config/abacusai_auth_secrets.json';
    const authData = JSON.parse(fs.readFileSync(authPath, 'utf8'));
    const twitterCreds = authData['x (twitter) - basketball factory'];
    
    if (!twitterCreds) {
      throw new Error('Twitter credentials not found');
    }
    
    const client = new TwitterApi({
      appKey: twitterCreds.secrets.api_key.value,
      appSecret: twitterCreds.secrets.api_secret.value,
      accessToken: twitterCreds.secrets.access_token.value,
      accessSecret: twitterCreds.secrets.access_token_secret.value,
    });
    
    console.log('Twitter client initialized');
    
    // Get top performing pages from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const topPages = await prisma.sEOPageConfig.findMany({
      where: {
        autoUpdateEnabled: true,
        updatedAt: { gte: sevenDaysAgo }
      },
      orderBy: { updatedAt: 'desc' },
      take: 10
    });
    
    console.log(`Found ${topPages.length} pages to consider`);
    
    // Get recent posts to avoid duplicates
    const recentPosts = await prisma.sEOAuditLog.findMany({
      where: {
        action: { in: ['social_media_post', 'social_media_posted'] },
        timestamp: { gte: sevenDaysAgo }
      },
      orderBy: { timestamp: 'desc' }
    });
    
    console.log(`Found ${recentPosts.length} recent posts`);
    
    // Filter out already posted pages
    const recentUrls = new Set();
    recentPosts.forEach(post => {
      if (post.pagePath) recentUrls.add(post.pagePath);
      if (post.changes) {
        try {
          const changes = typeof post.changes === 'string' ? JSON.parse(post.changes) : post.changes;
          if (changes.url) {
            const urlPath = changes.url.replace('https://riseasoneaau.com', '');
            recentUrls.add(urlPath);
          }
        } catch (e) {}
      }
    });
    
    const pagesToPost = topPages.filter(page => !recentUrls.has(page.pagePath));
    console.log(`${pagesToPost.length} pages available to post`);
    
    if (pagesToPost.length === 0) {
      console.log('No new content to post. All recent pages have been posted.');
      return;
    }
    
    // Post up to 3 updates
    const postsToMake = Math.min(3, pagesToPost.length);
    const baseUrl = 'https://riseasoneaau.com';
    
    for (let i = 0; i < postsToMake; i++) {
      const page = pagesToPost[i];
      const fullUrl = `${baseUrl}${page.pagePath}`;
      
      // Generate engaging post text
      const hashtags = ['#Basketball', '#NJBasketball', '#YouthSports', '#AAU'];
      const selectedHashtags = hashtags.slice(0, 2 + Math.floor(Math.random() * 2)).join(' ');
      
      let postText = '';
      const title = page.pageTitle || page.pageName;
      if (page.pagePath.includes('programs')) {
        postText = `🏀 Check out our ${title}! Join us for elite basketball training. ${selectedHashtags}\n\n${fullUrl}`;
      } else if (page.pagePath.includes('private-lessons')) {
        postText = `⭐ Elevate your game with personalized training! ${title} ${selectedHashtags}\n\n${fullUrl}`;
      } else if (page.pagePath.includes('about')) {
        postText = `Learn more about Rise As One AAU and our mission to develop young athletes. ${selectedHashtags}\n\n${fullUrl}`;
      } else {
        postText = `🏀 ${title} - Building champions on and off the court! ${selectedHashtags}\n\n${fullUrl}`;
      }
      
      console.log(`\nPosting ${i + 1}/${postsToMake}:`);
      console.log(postText);
      
      try {
        const tweet = await client.v2.tweet(postText);
        console.log(`✓ Posted successfully! Tweet ID: ${tweet.data.id}`);
        
        // Log to audit
        await prisma.sEOAuditLog.create({
          data: {
            action: 'social_media_post',
            entityType: 'page',
            pagePath: page.pagePath,
            changes: JSON.stringify({
              text: postText,
              url: fullUrl,
              tweetId: tweet.data.id
            }),
            success: true,
            timestamp: new Date()
          }
        });
        
        // Wait 1 minute between posts
        if (i < postsToMake - 1) {
          console.log('Waiting 60 seconds before next post...');
          await new Promise(resolve => setTimeout(resolve, 60000));
        }
      } catch (error) {
        console.error(`✗ Failed to post: ${error.message}`);
        
        // Log error to audit
        await prisma.sEOAuditLog.create({
          data: {
            action: 'social_media_post',
            entityType: 'page',
            pagePath: page.pagePath,
            changes: JSON.stringify({
              text: postText,
              url: fullUrl,
              error: error.message
            }),
            success: false,
            errorMessage: error.message,
            timestamp: new Date()
          }
        });
        
        // If duplicate content error, continue to next post
        if (error.message.includes('duplicate')) {
          console.log('Skipping to next post...');
          continue;
        }
      }
    }
    
    console.log('\n✓ Social media posting complete!');
    
  } catch (error) {
    console.error('Error in social media poster:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

postToSocialMedia();
