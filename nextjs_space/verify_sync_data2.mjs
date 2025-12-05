import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function verifyData() {
  try {
    // Check total performance records
    const totalRecords = await prisma.sEOPerformance.count();
    console.log(`\n📊 Total Performance Records: ${totalRecords}`);
    
    // Check records from today's sync
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayRecords = await prisma.sEOPerformance.count({
      where: {
        updatedAt: {
          gte: todayStart
        }
      }
    });
    console.log(`📅 Records Updated Today: ${todayRecords}`);
    
    // Check total keywords
    const keywordCount = await prisma.sEOKeyword.count();
    console.log(`\n📈 Total Keywords Tracked: ${keywordCount}`);
    
    // Get some sample keywords
    const keywords = await prisma.sEOKeyword.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' }
    });
    
    console.log('\n🔑 Sample Keywords:');
    keywords.forEach((kw, i) => {
      console.log(`${i + 1}. ${kw.keyword} (Priority: ${kw.priority})`);
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
    
    console.log('\n✅ Data verification complete!');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyData();
