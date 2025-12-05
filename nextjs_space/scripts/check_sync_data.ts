import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(__dirname, '../.env') });

import { prisma } from '@/lib/db';

async function checkSync() {
  try {
    // Get the latest audit log entry
    const latestAudit = await prisma.sEOAuditLog.findFirst({
      where: { action: 'automated_ga_sync' },
      orderBy: { timestamp: 'desc' }
    });
    
    console.log('\n=== Latest GA Sync Audit Log ===');
    console.log('Timestamp:', latestAudit?.timestamp);
    console.log('Action:', latestAudit?.action);
    console.log('Performed By:', latestAudit?.performedBy);
    console.log('Changes:', JSON.stringify(latestAudit?.changes, null, 2));
    
    // Get keyword count
    const keywordCount = await prisma.sEOKeyword.count({
      where: { isActive: true }
    });
    
    console.log('\n=== Keyword Statistics ===');
    console.log('Active Keywords:', keywordCount);
    
    // Get recent performance data
    const recentPerformance = await prisma.sEOPerformance.findMany({
      orderBy: { date: 'desc' },
      take: 5,
      select: {
        date: true,
        pagePath: true,
        clicks: true,
        impressions: true,
        position: true,
        ctr: true
      }
    });
    
    console.log('\n=== Recent Performance Data (Last 5 Records) ===');
    recentPerformance.forEach((perf, idx) => {
      console.log(`\n${idx + 1}. Date: ${perf.date}`);
      console.log(`   Page: ${perf.pagePath}`);
      console.log(`   Clicks: ${perf.clicks}, Impressions: ${perf.impressions}`);
      console.log(`   Position: ${perf.position?.toFixed(2)}, CTR: ${perf.ctr?.toFixed(2)}%`);
    });
    
  } catch (error: any) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSync();
