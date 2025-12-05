import { PrismaClient } from '@prisma/client';
import { monitorBacklinkHealth } from '../lib/seo-backlink-monitoring';

const prisma = new PrismaClient();

/**
 * Monitors backlink health and reports changes
 */
async function monitorBacklinks() {
  try {
    console.log('🔗 Starting backlink monitoring...');

    const { alerts, summary } = await monitorBacklinkHealth();

    console.log('\n📊 Backlink Summary:');
    console.log(`Total Active Backlinks: ${summary.totalBacklinks}`);
    console.log(`New This Week: ${summary.newThisWeek}`);
    console.log(`Lost This Week: ${summary.lostThisWeek}`);
    console.log(`Net Change: ${summary.netChange > 0 ? '+' : ''}${summary.netChange}`);

    if (summary.topDomains && summary.topDomains.length > 0) {
      console.log('\nTop Referring Domains:');
      summary.topDomains.forEach((domain: any, idx: number) => {
        console.log(`${idx + 1}. ${domain.domain} (${domain.count} links, DR: ${Math.round(domain.avgDR)})`);
      });
    }

    if (alerts.length > 0) {
      console.log('\n⚠️  Alerts:');
      alerts.forEach((alert: string) => console.log(`  ${alert}`));
    } else {
      console.log('\n✅ No backlink alerts');
    }

    // Log to audit trail
    await prisma.sEOAuditLog.create({
      data: {
        action: 'backlink_monitor',
        entityType: 'backlinks',
        performedBy: 'system',
        changes: JSON.parse(JSON.stringify({
          summary,
          alerts,
          timestamp: new Date().toISOString()
        }))
      }
    });

    console.log('\n✅ Backlink monitoring completed');
    return { alerts, summary };
  } catch (error) {
    console.error('❌ Backlink monitoring failed:', error);
    
    // Log error
    await prisma.sEOAuditLog.create({
      data: {
        action: 'backlink_monitor',
        entityType: 'backlinks',
        performedBy: 'system',
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        changes: JSON.parse(JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }))
      }
    });
    
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  monitorBacklinks()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default monitorBacklinks;
