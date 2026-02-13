import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkGAData() {
  try {
    // Get keyword count
    const keywordCount = await prisma.sEOKeyword.count();
    console.log('\n=== SEO Keywords ===');
    console.log('Total keywords tracked:', keywordCount);

    // Get recent performance data
    const recentPerformance = await prisma.sEOPerformance.findMany({
      orderBy: { date: 'desc' },
      take: 10,
      include: {
        keyword: true
      }
    });

    console.log('\n=== Recent Performance Data ===');
    console.log(`Found ${recentPerformance.length} recent performance records`);
    
    if (recentPerformance.length > 0) {
      console.log('\nTop 5 recent entries:');
      recentPerformance.slice(0, 5).forEach(perf => {
        console.log(`- ${perf.keyword?.keyword || 'N/A'}: ${perf.clicks} clicks, ${perf.impressions} impressions, pos ${perf.position?.toFixed(1) || 'N/A'} (${perf.date})`);
      });

      // Calculate totals
      const totals = recentPerformance.reduce((acc, perf) => ({
        clicks: acc.clicks + (perf.clicks || 0),
        impressions: acc.impressions + (perf.impressions || 0),
        ctr: acc.ctr + (perf.ctr || 0)
      }), { clicks: 0, impressions: 0, ctr: 0 });

      console.log('\n=== Aggregated Metrics (from recent data) ===');
      console.log('Total Clicks:', totals.clicks);
      console.log('Total Impressions:', totals.impressions);
      console.log('Average CTR:', (totals.ctr / recentPerformance.length).toFixed(2) + '%');
    }

    // Get latest audit log
    const latestAudit = await prisma.sEOAuditLog.findFirst({
      orderBy: { timestamp: 'desc' }
    });

    console.log('\n=== Latest Audit Log ===');
    if (latestAudit) {
      console.log('Action:', latestAudit.action);
      console.log('Entity Type:', latestAudit.entityType);
      console.log('Performed By:', latestAudit.performedBy);
      console.log('Timestamp:', latestAudit.timestamp);
      console.log('Changes:', JSON.stringify(latestAudit.changes, null, 2));
    } else {
      console.log('No audit logs found');
    }

    // Get settings to verify configuration
    const settings = await prisma.sEOSettings.findFirst();
    console.log('\n=== SEO Settings ===');
    if (settings) {
      console.log('GA Property ID:', settings.googleAnalyticsPropertyId);
      console.log('Search Console URL:', settings.googleSearchConsoleSiteUrl);
      console.log('Auth tokens configured:', !!settings.googleAuthTokens);
    } else {
      console.log('No settings found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkGAData();
