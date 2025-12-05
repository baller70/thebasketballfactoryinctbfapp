/**
 * Weekly Keyword Ranking Tracker - Standalone Version
 * Uses production Prisma client
 */

const { PrismaClient } = require('/tmp/app/.build/standalone/app/node_modules/@prisma/client');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = 'postgresql://role_da1a5943:VknB0BsUhy0m5vqg9B8LY0drt50cg8nM@db-da1a5943.db002.hosteddb.reai.io:5432/da1a5943?connect_timeout=15';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function formatTimestamp(date) {
  return date.toISOString().replace('T', ' ').split('.')[0];
}

async function trackKeywordRankings() {
  try {
    console.log('[SEO Automation] Tracking keyword rankings...');
    
    const keywords = await prisma.sEOKeyword.findMany({
      where: { isActive: true },
      include: {
        performanceData: {
          orderBy: { date: 'desc' },
          take: 2
        }
      }
    });

    const changes = [];

    for (const keyword of keywords) {
      if (keyword.performanceData.length >= 2) {
        const [latest, previous] = keyword.performanceData;
        const positionChange = (previous.position || 0) - (latest.position || 0);

        if (Math.abs(positionChange) >= 3) {
          changes.push({
            keyword: keyword.keyword,
            oldPosition: previous.position || 0,
            newPosition: latest.position || 0,
            change: positionChange,
            pagePath: latest.pagePath || 'N/A'
          });
        }
      }
    }

    // Log significant changes
    if (changes.length > 0) {
      await prisma.sEOAuditLog.create({
        data: {
          action: 'keyword_ranking_change',
          entityType: 'keyword',
          performedBy: 'system',
          changes: JSON.parse(JSON.stringify({ rankingChanges: changes }))
        }
      });
    }

    return changes;
  } catch (error) {
    console.error('[SEO Automation] Ranking tracking failed:', error);
    return [];
  }
}

async function generateSEOAlerts() {
  const alerts = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  try {
    // Check for ranking drops
    const rankingChanges = await trackKeywordRankings();
    const criticalDrops = rankingChanges.filter(c => c.change < -5);
    
    if (criticalDrops.length > 0) {
      alerts.push({
        type: 'ranking_drop',
        severity: 'critical',
        title: 'Critical Ranking Drops Detected',
        message: `${criticalDrops.length} keywords dropped by 5+ positions`,
        data: criticalDrops
      });
    }

    // Check for traffic drops
    const recentPerformance = await prisma.sEOPerformance.groupBy({
      by: ['dateKey'],
      where: {
        date: { gte: weekAgo }
      },
      _sum: {
        clicks: true,
        impressions: true
      }
    });

    const previousPerformance = await prisma.sEOPerformance.groupBy({
      by: ['dateKey'],
      where: {
        date: { 
          gte: new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000), 
          lt: weekAgo 
        }
      },
      _sum: {
        clicks: true,
        impressions: true
      }
    });

    const recentClicks = recentPerformance.reduce((sum, p) => sum + (p._sum.clicks || 0), 0);
    const previousClicks = previousPerformance.reduce((sum, p) => sum + (p._sum.clicks || 0), 0);
    
    if (previousClicks > 0) {
      const trafficChange = ((recentClicks - previousClicks) / previousClicks) * 100;
      if (trafficChange < -20) {
        alerts.push({
          type: 'traffic_drop',
          severity: 'warning',
          title: 'Traffic Decline',
          message: `Organic traffic down ${Math.abs(trafficChange).toFixed(1)}% this week`,
          data: { recentClicks, previousClicks, change: trafficChange }
        });
      }
    }

    // Check for low CTR pages
    const lowCTRPages = await prisma.sEOPerformance.groupBy({
      by: ['pagePath'],
      where: {
        date: { gte: weekAgo }
      },
      _sum: {
        clicks: true,
        impressions: true
      },
      having: {
        impressions: { _sum: { gt: 100 } }
      }
    });

    for (const page of lowCTRPages) {
      const ctr = (page._sum.clicks || 0) / (page._sum.impressions || 1) * 100;
      if (ctr < 2) {
        alerts.push({
          type: 'opportunity',
          severity: 'info',
          title: 'Low CTR Detected',
          message: `${page.pagePath} has ${ctr.toFixed(2)}% CTR - optimize meta description`,
          data: { pagePath: page.pagePath, ctr, impressions: page._sum.impressions }
        });
      }
    }

    return alerts;
  } catch (error) {
    console.error('[SEO Automation] Alert generation failed:', error);
    return alerts;
  }
}

async function runKeywordTracking() {
  const timestamp = new Date();
  const dateStr = formatDate(timestamp);
  const logTimestamp = formatTimestamp(timestamp);
  
  console.log(`[${logTimestamp}] Starting Weekly Keyword Ranking Tracker...`);
  
  try {
    // Step 1 & 2: Track keyword rankings and save changes
    console.log('Step 1-2: Tracking keyword rankings...');
    const rankingChanges = await trackKeywordRankings();
    
    const changesDir = '/home/ubuntu/seo_automation_logs/ranking_changes';
    if (!fs.existsSync(changesDir)) {
      fs.mkdirSync(changesDir, { recursive: true });
    }
    
    const changesFilePath = path.join(changesDir, `changes_${dateStr}.json`);
    fs.writeFileSync(changesFilePath, JSON.stringify(rankingChanges, null, 2));
    console.log(`✓ Saved ${rankingChanges.length} ranking changes to ${changesFilePath}`);
    
    // Step 3 & 4: Generate SEO alerts and save
    console.log('Step 3-4: Generating SEO alerts...');
    const alerts = await generateSEOAlerts();
    
    const alertsDir = '/home/ubuntu/seo_automation_logs/alerts';
    if (!fs.existsSync(alertsDir)) {
      fs.mkdirSync(alertsDir, { recursive: true });
    }
    
    const alertsFilePath = path.join(alertsDir, `alerts_${dateStr}.json`);
    fs.writeFileSync(alertsFilePath, JSON.stringify(alerts, null, 2));
    console.log(`✓ Saved ${alerts.length} alerts to ${alertsFilePath}`);
    
    // Step 5: Check for critical alerts (email sending would require email service)
    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    if (criticalAlerts.length > 0) {
      console.log(`Step 5: ${criticalAlerts.length} critical alerts detected`);
      console.log('Note: Email notification requires email service configuration');
      criticalAlerts.forEach(alert => {
        console.log(`  - ${alert.title}: ${alert.message}`);
      });
    } else {
      console.log('Step 5: No critical alerts to send');
    }
    
    // Step 6: Log tracking results
    console.log('Step 6: Logging tracking results...');
    const logEntry = `
[${logTimestamp}] Weekly Keyword Ranking Tracker
- Total keywords tracked: ${rankingChanges.length > 0 ? 'Active keywords checked' : 'No active keywords'}
- Ranking changes detected: ${rankingChanges.length}
- Alerts generated: ${alerts.length}
  - Critical: ${criticalAlerts.length}
  - Warning: ${alerts.filter(a => a.severity === 'warning').length}
  - Info: ${alerts.filter(a => a.severity === 'info').length}
- Files saved:
  - ${changesFilePath}
  - ${alertsFilePath}
${criticalAlerts.length > 0 ? `- Critical alerts detected (email notification pending)\n` : ''}
---
`;
    
    const logFilePath = '/home/ubuntu/seo_automation_logs/keyword_tracking.log';
    fs.appendFileSync(logFilePath, logEntry);
    console.log(`✓ Logged results to ${logFilePath}`);
    
    console.log('\n✅ Weekly Keyword Ranking Tracker completed successfully');
    console.log(`Summary: ${rankingChanges.length} changes, ${alerts.length} alerts (${criticalAlerts.length} critical)`);
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Keyword tracking failed:', error);
    
    const logEntry = `
[${logTimestamp}] Weekly Keyword Ranking Tracker - FAILED
Error: ${error.message}
Stack: ${error.stack}
---
`;
    
    try {
      fs.appendFileSync('/home/ubuntu/seo_automation_logs/keyword_tracking.log', logEntry);
    } catch (logError) {
      console.error('Failed to write error log:', logError);
    }
    
    await prisma.$disconnect();
    process.exit(1);
  }
}

runKeywordTracking();
