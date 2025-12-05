#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

// Load Twitter credentials
const authSecretsPath = '/home/ubuntu/.config/abacusai_auth_secrets.json';
const authSecrets = JSON.parse(fs.readFileSync(authSecretsPath, 'utf8'));
const twitterCreds = authSecrets['x (twitter) - basketball factory'].secrets;

const BASE_URL = 'https://riseasoneaau.com';

// Content variations to avoid duplicates
const EMOJIS = ['🏀', '⚡', '🔥', '💪', '🌟', '⭐', '🚀', '💯', '🎯', '👊'];
const OPENERS = [
  'Ready to elevate your game?',
  'Take your skills to the next level!',
  'Join the best basketball training in NJ!',
  'Transform your game this season!',
  'Elite basketball training awaits!',
  'Unlock your full potential!',
  'Where champions are made!',
  'Your basketball journey starts here!',
  'Train like a pro!',
  'Build championship-level skills!'
];

const CLOSERS = [
  'Sign up today!',
  'Register now!',
  'Book your spot!',
  'Join us today!',
  'Get started now!',
  'Reserve your place!',
  'Enroll today!',
  'Don\'t miss out!',
  'Limited spots available!',
  'Start your journey!'
];

// Programs to promote
const PROGRAMS = [
  { title: 'High School Winter Workouts', url: '/programs/hs-winter-workouts', tags: '#Basketball #NJBasketball #HighSchool' },
  { title: 'Middle School Winter Workouts', url: '/programs/ms-winter-workouts', tags: '#Basketball #NJBasketball #MiddleSchool' },
  { title: 'Future Stars Skills', url: '/programs/future-stars-skills', tags: '#Basketball #YouthSports #NJBasketball' },
  { title: 'Private Lessons', url: '/private-lessons', tags: '#Basketball #Training #NJBasketball' },
  { title: 'Friday Night Lights', url: '/programs/friday-night-lights', tags: '#Basketball #Competition #NJBasketball' }
];

function generateUniquePost(program) {
  const emoji1 = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  const emoji2 = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  const opener = OPENERS[Math.floor(Math.random() * OPENERS.length)];
  const closer = CLOSERS[Math.floor(Math.random() * CLOSERS.length)];
  const timestamp = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  
  return `${emoji1} ${opener}

${program.title} - ${timestamp}

${closer} ${emoji2}
${BASE_URL}${program.url}

${program.tags}`;
}

async function postToTwitter(content) {
  try {
    const { TwitterApi } = require('twitter-api-v2');
    
    const client = new TwitterApi({
      appKey: twitterCreds.api_key.value,
      appSecret: twitterCreds.api_secret.value,
      accessToken: twitterCreds.access_token.value,
      accessSecret: twitterCreds.access_token_secret.value,
    });
    
    const result = await client.v2.tweet(content);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function logToDatabase(program, content, result) {
  try {
    await prisma.sEOAuditLog.create({
      data: {
        action: 'social_media_post',
        entityType: 'program',
        entityId: program.url,
        changes: JSON.stringify({
          content: content,
          platform: 'twitter',
          result: result.success ? 'posted' : 'failed',
          tweetId: result.data?.data?.id || null
        }),
        success: result.success,
        errorMessage: result.error || null,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Database log error:', error.message);
  }
}

async function main() {
  console.log('🎯 Starting Social Media Auto-Poster...\n');
  
  const posts = [];
  const postsToCreate = 3;
  
  // Select random programs
  const shuffled = [...PROGRAMS].sort(() => 0.5 - Math.random());
  const selectedPrograms = shuffled.slice(0, postsToCreate);
  
  for (let i = 0; i < selectedPrograms.length; i++) {
    const program = selectedPrograms[i];
    const content = generateUniquePost(program);
    
    console.log(`\n📝 Post ${i + 1}/${postsToCreate}:`);
    console.log(content);
    console.log('\n' + '='.repeat(60));
    
    const result = await postToTwitter(content);
    
    if (result.success) {
      console.log(`✅ Posted successfully! Tweet ID: ${result.data.data.id}`);
      posts.push({ program: program.title, content, success: true, tweetId: result.data.data.id });
    } else {
      console.log(`❌ Failed: ${result.error}`);
      posts.push({ program: program.title, content, success: false, error: result.error });
    }
    
    await logToDatabase(program, content, result);
    
    // Wait 2 minutes between posts
    if (i < selectedPrograms.length - 1) {
      console.log('\n⏳ Waiting 2 minutes before next post...');
      await new Promise(resolve => setTimeout(resolve, 120000));
    }
  }
  
  // Generate report
  const timestamp = new Date().toISOString().split('T')[0];
  const reportPath = `/home/ubuntu/rise_as_one_aau/seo_reports/social_posts_${timestamp}.md`;
  
  const report = `# Social Media Posts - ${timestamp}

## Summary
- **Date**: ${new Date().toLocaleString()}
- **Posts Created**: ${posts.length}
- **Successful**: ${posts.filter(p => p.success).length}
- **Failed**: ${posts.filter(p => !p.success).length}

## Posts

${posts.map((post, idx) => `
### Post ${idx + 1}: ${post.program}

**Status**: ${post.success ? '✅ Posted' : '❌ Failed'}
${post.tweetId ? `**Tweet ID**: ${post.tweetId}` : ''}
${post.error ? `**Error**: ${post.error}` : ''}

**Content**:
\`\`\`
${post.content}
\`\`\`
`).join('\n')}

## Next Steps
- Monitor engagement on Twitter/X
- Track click-through rates in Google Analytics
- Adjust posting times based on performance data

---
*Generated by Social Media Auto-Poster*
`;
  
  fs.writeFileSync(reportPath, report);
  console.log(`\n📄 Report saved to: ${reportPath}`);
  
  await prisma.$disconnect();
  console.log('\n✅ Social media posting complete!');
}

main().catch(console.error);
