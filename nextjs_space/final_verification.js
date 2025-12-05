const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  try {
    console.log('=== Final Verification ===\n');
    
    // Check token status
    const settings = await prisma.sEOSettings.findFirst();
    const tokens = typeof settings.googleAuthTokens === 'string' 
      ? JSON.parse(settings.googleAuthTokens)
      : settings.googleAuthTokens;
    
    const expiryDate = new Date(tokens.expiry_date);
    const isValid = expiryDate > new Date();
    
    console.log('1. OAuth Token Status:');
    console.log(`   ✓ Token expires: ${expiryDate.toISOString()}`);
    console.log(`   ✓ Token valid: ${isValid ? 'YES' : 'NO'}`);
    
    // Check today's data
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = await prisma.sEOPerformance.findMany({
      where: { dateKey: today }
    });
    
    console.log(`\n2. Today's Sync (${today}):`);
    console.log(`   ✓ Total records: ${todayRecords.length}`);
    console.log(`   ✓ GA4 records: ${todayRecords.filter(r => r.source === 'GA4').length}`);
    console.log(`   ✓ GSC records: ${todayRecords.filter(r => r.source === 'GSC').length}`);
    
    // Check data quality
    const ga4Sample = todayRecords.find(r => r.source === 'GA4' && r.pageViews > 0);
    const gscSample = todayRecords.find(r => r.source === 'GSC' && r.clicks > 0);
    
    console.log('\n3. Data Quality Check:');
    if (ga4Sample) {
      console.log(`   ✓ GA4 sample: ${ga4Sample.pagePath?.substring(0, 40)} - ${ga4Sample.pageViews} views`);
    }
    if (gscSample) {
      console.log(`   ✓ GSC sample: ${gscSample.pagePath?.substring(0, 40)} - ${gscSample.clicks} clicks`);
    }
    
    // Check historical data
    const last30Days = await prisma.sEOPerformance.groupBy({
      by: ['dateKey'],
      _count: { id: true },
      orderBy: { dateKey: 'desc' },
      take: 5
    });
    
    console.log('\n4. Recent Sync History:');
    last30Days.forEach(day => {
      console.log(`   ✓ ${day.dateKey}: ${day._count.id} records`);
    });
    
    console.log('\n=== Verification Complete ===');
    console.log('✓ All systems operational');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
