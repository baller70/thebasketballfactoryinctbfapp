const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAllAudits() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const audits = await prisma.sEOAuditLog.findMany({
      where: {
        action: 'social_media_posted',
        timestamp: {
          gte: new Date(today)
        }
      },
      orderBy: { timestamp: 'desc' }
    });
    
    console.log(`Found ${audits.length} social media post audit(s) today`);
    audits.forEach((audit, idx) => {
      console.log(`\n--- Audit ${idx + 1} ---`);
      console.log(`Timestamp: ${audit.timestamp}`);
      console.log(`Posts created: ${audit.changes.postsCreated}`);
      console.log(`Posts:`, JSON.stringify(audit.changes.posts, null, 2));
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllAudits();
