/**
 * Weekly Keyword Ranking Tracker
 * Tracks keyword ranking changes and generates alerts
 */

const { PrismaClient } = require('@prisma/client');
const { writeFileSync, appendFileSync, mkdirSync } = require('fs');
const prisma = new PrismaClient();

// Ensure directories exist
try {
  mkdirSync('/home/ubuntu/seo_automation_logs/ranking_changes', { recursive: true });
  mkdirSync('/home/ubuntu/seo_automation_logs/alerts', { recursive: true });
} catch (err) {
  // Directories already exist
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function formatDateTime(date) {
  return date.toISOString().replace('T', ' ').split('.')[0];
}

async function trackKeywordRankings() {
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
        changes: { rankingChanges: changes }
      }
    });
  }

  return changes;
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

    const previousWeekStart = new Date(weekAgo);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    
    const previousPerformance = await prisma.sEOPerformance.groupBy({
      by: ['dateKey'],
      where: {
        date: { gte: previousWeekStart, lt: weekAgo }
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
        date: { gte: weekAgo },
        pagePath: { not: null }
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

async function sendEmailAlert(criticalAlerts, rankingChanges, dateStr, timestamp) {
  // Note: Email sending requires proper configuration
  // For now, we'll just log that an email would be sent
  console.log(`\n📧 EMAIL ALERT WOULD BE SENT:`);
  console.log(`To: khouston@thebasketballfactorynj.com`);
  console.log(`Subject: 🚨 Critical SEO Alerts - ${criticalAlerts.length} Issues Detected`);
  console.log(`\nCritical Alerts:`);
  criticalAlerts.forEach((alert, idx) => {
    console.log(`  ${idx + 1}. ${alert.title}: ${alert.message}`);
  });
  console.log(`\nRanking Changes: ${rankingChanges.length} keywords with 3+ position changes`);
  
  // Log to file for reference
  const emailLog = {
    timestamp,
    to: 'khouston@thebasketballfactorynj.com',
    subject: `🚨 Critical SEO Alerts - ${criticalAlerts.length} Issues Detected`,
    criticalAlerts,
    rankingChangesSummary: {
      total: rankingChanges.length,
      topChanges: rankingChanges.slice(0, 10)
    }
  };
  
  writeFileSync(
    `/home/ubuntu/seo_automation_logs/alerts/email_log_${dateStr}.json`,
    JSON.stringify(emailLog, null, 2)
  );
}

async function runKeywordTracking() {
  const startTime = new Date();
  const dateStr = formatDate(startTime);
  const timestamp = formatDateTime(startTime);
  
  console.log(`[${timestamp}] Starting Weekly Keyword Ranking Tracker...`);
  
  try {
    // Step 1 & 2: Track keyword rankings and save changes
    console.log('\nStep 1-2: Tracking keyword rankings...');
    const rankingChanges = await trackKeywordRankings();
    
    const changesFilePath = `/home/ubuntu/seo_automation_logs/ranking_changes/changes_${dateStr}.json`;
    writeFileSync(changesFilePath, JSON.stringify(rankingChanges, null, 2));
    console.log(`✓ Saved ${rankingChanges.length} ranking changes to ${changesFilePath}`);
    
    // Step 3 & 4: Generate SEO alerts and save
    console.log('\nStep 3-4: Generating SEO alerts...');
    const alerts = await generateSEOAlerts();
    
    const alertsFilePath = `/home/ubuntu/seo_automation_logs/alerts/alerts_${dateStr}.json`;
    writeFileSync(alertsFilePath, JSON.stringify(alerts, null, 2));
    console.log(`✓ Generated ${alerts.length} alerts, saved to ${alertsFilePath}`);
    
    // Step 5: Send critical alerts via email
    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    if (criticalAlerts.length > 0) {
      console.log(`\nStep 5: Processing ${criticalAlerts.length} critical alerts...`);
      await sendEmailAlert(criticalAlerts, rankingChanges, dateStr, timestamp);
      console.log('✓ Critical alert notification logged');
    } else {
      console.log('\nStep 5: No critical alerts to send');
    }
    
    // Step 6: Log results
    const endTime = new Date();
    const duration = (endTime.getTime() - startTime.getTime()) / 1000;
    
    const logEntry = `
[${timestamp}] Weekly Keyword Ranking Tracker Completed
  - Total keywords tracked: ${rankingChanges.length > 0 ? 'Active keywords processed' : 'No active keywords'}
  - Ranking changes detected: ${rankingChanges.length}
  - Alerts generated: ${alerts.length}
  - Critical alerts: ${criticalAlerts.length}
  - Duration: ${duration.toFixed(2)}s
  - Changes file: ${changesFilePath}
  - Alerts file: ${alertsFilePath}
  - Status: SUCCESS
---
`;
    
    appendFileSync('/home/ubuntu/seo_automation_logs/keyword_tracking.log', logEntry);
    console.log('\n✓ Logged results to keyword_tracking.log');
    
    console.log('\n' + '='.repeat(60));
    console.log('WEEKLY KEYWORD RANKING TRACKER - SUMMARY');
    console.log('='.repeat(60));
    console.log(`Date: ${dateStr}`);
    console.log(`Ranking Changes: ${rankingChanges.length}`);
    console.log(`Total Alerts: ${alerts.length}`);
    console.log(`Critical Alerts: ${criticalAlerts.length}`);
    console.log(`Duration: ${duration.toFixed(2)}s`);
    console.log('='.repeat(60));
    
    if (rankingChanges.length > 0) {
      console.log('\nTop Ranking Changes:');
      rankingChanges.slice(0, 10).forEach((change, idx) => {
        const direction = change.change > 0 ? '↑' : '↓';
        console.log(`  ${idx + 1}. ${change.keyword}: ${change.oldPosition} → ${change.newPosition} (${direction}${Math.abs(change.change)})`);
      });
    }
    
    if (alerts.length > 0) {
      console.log('\nAlerts Summary:');
      const bySeverity = {
        critical: alerts.filter(a => a.severity === 'critical').length,
        warning: alerts.filter(a => a.severity === 'warning').length,
        info: alerts.filter(a => a.severity === 'info').length
      };
      console.log(`  Critical: ${bySeverity.critical}`);
      console.log(`  Warning: ${bySeverity.warning}`);
      console.log(`  Info: ${bySeverity.info}`);
    }
    
    await prisma.$disconnect();
    
    return {
      success: true,
      rankingChanges: rankingChanges.length,
      alerts: alerts.length,
      criticalAlerts: criticalAlerts.length
    };
    
  } catch (error) {
    console.error('\n❌ Error running keyword tracking:', error);
    
    const errorLog = `
[${timestamp}] Weekly Keyword Ranking Tracker FAILED
  - Error: ${error.message}
  - Status: FAILURE
---
`;
    appendFileSync('/home/ubuntu/seo_automation_logs/keyword_tracking.log', errorLog);
    
    await prisma.$disconnect();
    throw error;
  }
}

// Run the task
runKeywordTracking()
  .then(result => {
    console.log('\n✅ Keyword tracking completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Keyword tracking failed');
    process.exit(1);
  });
