import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function verifyData() {
  try {
    // Check latest performance records
    const latestRecords = await prisma.sEOPerformance.findMany({
      orderBy: { date: 'desc' },
      take: 5,
      include: {
        keyword: true
      }
    });
    
    console.log('\n📊 Latest 5 Performance Records:');
    console.log('================================');
    latestRecords.forEach((record, i) => {
      console.log(`${i + 1}. ${record.keyword.keyword}`);
      console.log(`   Date: ${record.date.toISOString().split('T')[0]}`);
      console.log(`   Position: ${record.position.toFixed(2)}`);
      console.log(`   Clicks: ${record.clicks}, Impressions: ${record.impressions}`);
      console.log(`   CTR: ${(record.ctr * 100).toFixed(2)}%`);
      console.log('');
    });
    
    // Check total keywords
    const keywordCount = await prisma.sEOKeyword.count();
    console.log(`\n📈 Total Keywords Tracked: ${keywordCount}`);
    
    // Check latest audit log
    const latestAudit = await prisma.sEOAuditLog.findFirst({
      where: { action: 'automated_ga_sync' },
      orderBy: { timestamp: 'desc' }
    });
    
    if (latestAudit) {
      console.log('\n📝 Latest Audit Log:');
      console.log('===================');
      console.log(`Timestamp: ${latestAudit.timestamp.toISOString()}`);
      console.log(`Action: ${latestAudit.action}`);
      console.log(`Performed By: ${latestAudit.performedBy}`);
      console.log(`Changes:`, JSON.stringify(latestAudit.changes, null, 2));
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyData();
