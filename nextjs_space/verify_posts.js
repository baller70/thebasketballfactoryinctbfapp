const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyPosts() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const posts = await prisma.sEOAuditLog.findMany({
    where: {
      action: "social_media_post",
      timestamp: { gte: today },
      success: true
    },
    orderBy: { timestamp: "asc" }
  });
  
  console.log('\n✅ VERIFICATION REPORT\n');
  console.log(`Date: ${new Date().toISOString().split('T')[0]}`);
  console.log(`Total successful posts today: ${posts.length}\n`);
  
  posts.forEach((post, idx) => {
    const changes = typeof post.changes === 'string' ? JSON.parse(post.changes) : post.changes;
    const time = post.timestamp.toISOString().split('T')[1].substring(0, 5);
    console.log(`${idx + 1}. [${time} UTC] ${changes.platform || 'twitter'}`);
    
    // Extract program name from content
    const content = changes.content || changes.text || '';
    const lines = content.split('\n');
    const programLine = lines.find(l => l.includes(' - ')) || lines[1] || '';
    console.log(`   Program: ${programLine.split(' - ')[0].replace(/[🔥💪⭐🎯🌟💯🚀⚡🏆👊💥🎉✨🔝🙌💫🎊🏅🔶]/g, '').trim()}`);
    
    // Extract URL
    const urlMatch = content.match(/https:\/\/[^\s]+/);
    if (urlMatch) {
      console.log(`   URL: ${urlMatch[0]}`);
    }
    console.log('');
  });
  
  await prisma.$disconnect();
}

verifyPosts().catch(console.error);
