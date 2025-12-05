import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function verifyData() {
  try {
    // Check total performance records
    const totalRecords = await prisma.sEOPerformance.count();
    console.log(`\n📊 Total Performance Records: ${totalRecords}`);
    
    // Check total keywords
    const keywordCount = await prisma.sEOKeyword.count();
    console.log(`📈 Total Keywords Tracked: ${keywordCount}`);
    
    // Get some sample keywords
    const keywords = await prisma.sEOKeyword.findMany({
      take: 5,
      orderBy: { keyword: 'asc' }
    });
    
    console.log('\n🔑 Sample Keywords:');
    keywords.forEach((kw, i) => {
      console.log(`${i + 1}. ${kw.keyword} (Priority: ${kw.priority}, Active: ${kw.isActive})`);
    });
    
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
    
    // Check date range of performance data
    const oldestRecord = await prisma.sEOPerformance.findFirst({
      orderBy: { date: 'asc' }
    });
    
    const newestRecord = await prisma.sEOPerformance.findFirst({
      orderBy: { date: 'desc' }
    });
    
    if (oldestRecord && newestRecord) {
      console.log('\n📅 Data Date Range:');
      console.log(`Oldest: ${oldestRecord.date.toISOString().split('T')[0]}`);
      console.log(`Newest: ${newestRecord.date.toISOString().split('T')[0]}`);
    }
    
    console.log('\n✅ Data verification complete!');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyData();
