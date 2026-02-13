const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function logPosts() {
  const posts = [
    {
      tweetId: '1999616635825778862',
      text: '🔥 Don\'t miss out! Private Lessons - where champions are made. https://thebasketballfactoryinc.com/private-lessons #Basketball #NJBasketball #YouthSports #AAU',
      pageId: 'cmhaay6ty000bs3xqebu0kfg8',
      pagePath: '/private-lessons'
    },
    {
      tweetId: '1999616636601721235',
      text: '🔥 Don\'t miss out! Homepage - where champions are made. https://thebasketballfactoryinc.com/ #Basketball #NJBasketball #YouthSports #AAU',
      pageId: 'cmhaay6tw000as3xq8tvf4z7x',
      pagePath: '/'
    },
    {
      tweetId: '1999616637318889812',
      text: '🏀 Youth Skills Camp! Join our elite basketball program and take your game to the next level. https://thebasketballfactoryinc.com/programs/youth-skills-camp #Basketball #NJBasketball #YouthSports #AAU',
      pageId: 'cmhaay6u1000cs3xqqx74t3qy',
      pagePath: '/programs/youth-skills-camp'
    }
  ];
  
  for (const post of posts) {
    await prisma.sEOAuditLog.create({
      data: {
        action: 'social_media_post',
        entityType: 'page',
        entityId: post.pageId,
        pagePath: post.pagePath,
        changes: {
          platform: 'twitter',
          tweetId: post.tweetId,
          text: post.text
        },
        performedBy: 'system',
        reason: 'Daily social media auto-poster',
        timestamp: new Date('2025-12-12T23:05:31.000Z')
      }
    });
    console.log(`✅ Logged tweet ${post.tweetId}`);
  }
  
  await prisma.$disconnect();
  console.log('\n✅ All posts logged to audit');
}

logPosts();
