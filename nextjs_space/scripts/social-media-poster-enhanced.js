const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function autoPostToSocial() {
  console.log('🎯 Starting Enhanced Social Media Auto-Posting...');

  try {
    // Load Twitter API credentials
    const secretsPath = process.env.AUTH_SECRETS_PATH || path.join(process.env.HOME || '', '.config', 'abacusai_auth_secrets.json');
    const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
    
    const twitterCreds = secrets['x (twitter) - basketball factory'];
    
    if (!twitterCreds || !twitterCreds.secrets) {
      console.error('❌ Twitter credentials not found');
      return;
    }

    // Get posts from today to avoid duplicates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayPosts = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_post',
        timestamp: {
          gte: today
        }
      }
    });

    const postedPaths = todayPosts.map(p => {
      const changes = typeof p.changes === 'string' ? JSON.parse(p.changes) : p.changes;
      return p.pagePath;
    }).filter(Boolean);

    console.log(`📊 Already posted today: ${postedPaths.length} posts`);
    console.log(`   Paths: ${postedPaths.join(', ')}`);

    // Get all available pages
    const allPages = await prisma.sEOPageConfig.findMany({
      where: {
        status: 'active'
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Filter out already posted pages
    const availablePages = allPages.filter(p => !postedPaths.includes(p.pagePath));
    
    console.log(`📄 Available pages to post: ${availablePages.length}`);

    if (availablePages.length === 0) {
      console.log('⚠️  All pages have been posted today. Using time-varied content...');
      // Use time-varied content for already posted pages
      return await postTimeVariedContent(allPages, twitterCreds.secrets, todayPosts.length);
    }

    // Generate unique posts
    const posts = [];
    const currentHour = new Date().getHours();
    const timeOfDay = currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : 'evening';

    for (const page of availablePages.slice(0, 3)) {
      const post = generateUniquePost(page, timeOfDay, todayPosts.length);
      if (post) posts.push(post);
    }

    // Post to Twitter
    let postedCount = 0;
    const postedDetails = [];

    for (const post of posts) {
      try {
        const result = await postToTwitter(post, twitterCreds.secrets);
        
        if (result.success) {
          postedCount++;
          postedDetails.push({
            platform: 'twitter',
            content: post.text,
            url: post.url,
            tweetId: result.tweetId,
            timestamp: new Date().toISOString()
          });

          // Log to audit
          await prisma.sEOAuditLog.create({
            data: {
              action: 'social_media_post',
              entityType: 'content',
              pagePath: post.pagePath,
              performedBy: 'system',
              success: true,
              changes: {
                platform: 'twitter',
                content: post.text,
                url: post.url,
                tweetId: result.tweetId
              },
              timestamp: new Date()
            }
          });

          console.log(`✅ Posted: ${post.text.substring(0, 60)}...`);
          
          // Wait 2 minutes between posts
          if (posts.indexOf(post) < posts.length - 1) {
            console.log('⏳ Waiting 2 minutes before next post...');
            await new Promise(resolve => setTimeout(resolve, 120000));
          }
        }

      } catch (error) {
        console.error(`❌ Failed to post:`, error.message);
        
        await prisma.sEOAuditLog.create({
          data: {
            action: 'social_media_post',
            entityType: 'content',
            pagePath: post.pagePath,
            performedBy: 'system',
            success: false,
            errorMessage: error.message,
            changes: {
              platform: 'twitter',
              content: post.text,
              url: post.url
            },
            timestamp: new Date()
          }
        });
      }
    }

    console.log(`\n✨ Posting Complete! Posted ${postedCount} of ${posts.length} tweets`);

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

async function postTimeVariedContent(pages, creds, postCount) {
  console.log('🔄 Generating time-varied content for already-posted pages...');
  
  const currentHour = new Date().getHours();
  const dayOfWeek = new Date().getDay();
  
  // Select a page that hasn't been posted in the last few hours
  const selectedPage = pages[postCount % pages.length];
  
  const post = generateTimeVariedPost(selectedPage, currentHour, dayOfWeek, postCount);
  
  try {
    const result = await postToTwitter(post, creds);
    
    if (result.success) {
      await prisma.sEOAuditLog.create({
        data: {
          action: 'social_media_post',
          entityType: 'content',
          pagePath: post.pagePath,
          performedBy: 'system',
          success: true,
          changes: {
            platform: 'twitter',
            content: post.text,
            url: post.url,
            tweetId: result.tweetId,
            variant: 'time-varied'
          },
          timestamp: new Date()
        }
      });
      
      console.log(`✅ Posted time-varied content: ${post.text.substring(0, 60)}...`);
      
      return {
        success: true,
        postsCreated: 1,
        posts: [{
          platform: 'twitter',
          content: post.text,
          url: post.url,
          tweetId: result.tweetId
        }]
      };
    }
  } catch (error) {
    console.error(`❌ Failed to post time-varied content:`, error.message);
  }
  
  return { success: false, postsCreated: 0, posts: [] };
}

function generateTimeVariedPost(page, hour, dayOfWeek, postIndex) {
  const url = `https://riseasoneaau.com${page.pagePath}`;
  const pageName = page.pageTitle || page.pageName || 'Program';
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = dayNames[dayOfWeek];
  
  const emojis = ['🏀', '⭐', '🔥', '💪', '🚀', '⚡', '💯', '🎯', '🏆', '💫', '🙌', '👊'];
  const emoji1 = emojis[postIndex % emojis.length];
  const emoji2 = emojis[(postIndex + 1) % emojis.length];
  
  const timeGreetings = {
    morning: ['Good morning!', 'Rise and grind!', 'Start your day strong!', 'Morning motivation!'],
    afternoon: ['Afternoon check-in!', 'Midday reminder!', 'Keep pushing!', 'Stay focused!'],
    evening: ['Evening update!', 'End your day right!', 'Tonight\'s the night!', 'Don\'t wait!']
  };
  
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  const greeting = timeGreetings[timeOfDay][postIndex % timeGreetings[timeOfDay].length];
  
  const actions = [
    `Register for ${currentDay}`,
    `Book your spot this ${currentDay}`,
    `Join us this ${currentDay}`,
    `Sign up for ${currentDay}`,
    `Reserve your place this ${currentDay}`
  ];
  
  const action = actions[postIndex % actions.length];
  
  const text = `${emoji1} ${greeting} ${emoji2}\n\n${pageName} - Transform your game with expert coaching!\n\n${action}:\n${url}\n\n#Basketball #NJBasketball #YouthSports #RiseAsOne`;
  
  return {
    text,
    url,
    pagePath: page.pagePath,
    hashtags: ['#Basketball', '#NJBasketball', '#YouthSports', '#RiseAsOne']
  };
}

function generateUniquePost(page, timeOfDay, postIndex) {
  const url = `https://riseasoneaau.com${page.pagePath}`;
  const pageName = page.pageTitle || page.pageName || 'Program';
  
  const emojis = ['🏀', '⭐', '🔥', '💪', '🚀', '⚡', '💯', '🎯', '🏆', '💫'];
  const emoji1 = emojis[postIndex % emojis.length];
  const emoji2 = emojis[(postIndex + 1) % emojis.length];
  
  const intros = [
    'Transform your game!',
    'Level up your skills!',
    'Join the best!',
    'Elite training awaits!',
    'Your journey starts here!',
    'Unlock your potential!',
    'Rise to greatness!',
    'Build championship skills!'
  ];
  
  const calls = [
    'Register now',
    'Sign up today',
    'Book your spot',
    'Join us now',
    'Reserve your place',
    'Get started today',
    'Enroll now',
    'Secure your spot'
  ];
  
  const intro = intros[postIndex % intros.length];
  const call = calls[postIndex % calls.length];
  
  const text = `${emoji1} ${intro} ${emoji2}\n\n${pageName} - Expert coaching, proven results!\n\n${call}:\n${url}\n\n#Basketball #NJBasketball #YouthSports #RiseAsOne`;
  
  return {
    text,
    url,
    pagePath: page.pagePath,
    hashtags: ['#Basketball', '#NJBasketball', '#YouthSports', '#RiseAsOne']
  };
}

async function postToTwitter(post, creds) {
  const { TwitterApi } = require('twitter-api-v2');

  const client = new TwitterApi({
    appKey: creds.api_key.value,
    appSecret: creds.api_secret.value,
    accessToken: creds.access_token.value,
    accessSecret: creds.access_token_secret.value,
  });

  const result = await client.v2.tweet(post.text);

  return { 
    success: true,
    tweetId: result.data.id
  };
}

// Run
autoPostToSocial()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
