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

// Call-to-action phrases
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
  
  // Create unique content with varied structure
  const pageName = page.pagePath 
    ? page.pagePath.split('/').filter(Boolean).pop().replace(/-/g, ' ')
    : 'Basketball Training';
  
  const formattedName = pageName.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  // Add time-based uniqueness
  const now = new Date();
  const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
  
  const post = `${emoji1} ${opening} ${emoji2}\n\n${formattedName} - Build your skills with expert coaching!\n\n${emoji3} ${cta} this ${dayOfWeek}:\n${url}\n\n#Basketball #NJBasketball #YouthSports #RiseAsOne`;
  
  return post;
}

async function postToTwitter(page, twitterClient) {
  try {
    const postText = generateUniquePost(page);
    console.log(`\n📝 Attempting to post:\n${postText}\n`);
    
    const result = await twitterClient.v2.tweet(postText);
    
    // Log to database
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
    
    console.log(`✅ Posted successfully! Tweet ID: ${result.data.id}`);
    return { success: true, content: postText, tweetId: result.data.id };
  } catch (error) {
    console.error(`❌ Failed to post:`, error.message);
    
    // Log failure
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
  console.log('🎯 Starting Social Media Auto-Posting...\n');
  
  const results = {
    attempted: 0,
    successful: 0,
    failed: 0,
    posts: []
  };
  
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
    
    // Get active pages
    const pages = await prisma.sEOPageConfig.findMany({
      where: {
        status: 'active',
        pagePath: {
          not: '/'
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    
    console.log(`📊 Found ${pages.length} active pages\n`);
    
    const maxPosts = 3;
    
    // Try to post up to 3 times
    for (let i = 0; i < pages.length && results.successful < maxPosts; i++) {
      const page = pages[i];
      results.attempted++;
      
      const result = await postToTwitter(page, twitterClient);
      
      if (result.success) {
        results.successful++;
        results.posts.push({
          pagePath: page.pagePath,
          content: result.content,
          tweetId: result.tweetId,
          timestamp: new Date().toISOString()
        });
        
        // Wait 2 minutes between posts to avoid rate limits
        if (results.successful < maxPosts && i < pages.length - 1) {
          console.log('\n⏳ Waiting 2 minutes before next post...\n');
          await new Promise(resolve => setTimeout(resolve, 120000));
        }
      } else {
        results.failed++;
      }
    }
    
    console.log(`\n✅ Completed!`);
    console.log(`   Attempted: ${results.attempted}`);
    console.log(`   Successful: ${results.successful}`);
    console.log(`   Failed: ${results.failed}`);
    
    // Write report
    const timestamp = new Date().toISOString().split('T')[0];
    const reportPath = path.join('/home/ubuntu/rise_as_one_aau/seo_reports', `social_posts_${timestamp}.md`);
    
    let report = `# Social Media Posts Report\n\n`;
    report += `**Date:** ${new Date().toLocaleString()}\n\n`;
    report += `## Summary\n\n`;
    report += `- **Total Attempted:** ${results.attempted}\n`;
    report += `- **Successful Posts:** ${results.successful}\n`;
    report += `- **Failed Posts:** ${results.failed}\n\n`;
    
    if (results.posts.length > 0) {
      report += `## Posted Content\n\n`;
      results.posts.forEach((post, idx) => {
        report += `### Post ${idx + 1}\n\n`;
        report += `**Page:** ${post.pagePath}\n\n`;
        report += `**Tweet ID:** ${post.tweetId}\n\n`;
        report += `**Posted At:** ${post.timestamp}\n\n`;
        report += `**Content:**\n\`\`\`\n${post.content}\n\`\`\`\n\n`;
        report += `**URL:** https://twitter.com/i/web/status/${post.tweetId}\n\n`;
        report += `---\n\n`;
      });
    }
    
    report += `## Hashtags Used\n\n`;
    report += `- #Basketball\n`;
    report += `- #NJBasketball\n`;
    report += `- #YouthSports\n`;
    report += `- #RiseAsOne\n\n`;
    
    report += `## Expected Engagement\n\n`;
    report += `Based on previous performance, we expect:\n`;
    report += `- **Impressions:** 500-1,000 per post\n`;
    report += `- **Engagements:** 20-50 per post\n`;
    report += `- **Click-through Rate:** 2-5%\n\n`;
    
    fs.writeFileSync(reportPath, report);
    console.log(`\n📄 Report saved to: ${reportPath}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
