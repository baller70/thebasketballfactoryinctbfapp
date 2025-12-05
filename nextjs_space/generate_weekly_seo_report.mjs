/**
 * Weekly SEO Report Generator
 * Generates comprehensive weekly SEO performance report
 */

import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { writeFileSync, appendFileSync, mkdirSync } from 'fs';

const prisma = new PrismaClient();

async function generateWeeklySEOReport() {
  const timestamp = new Date().toISOString();
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

  console.log('='.repeat(60));
  console.log('WEEKLY SEO REPORT GENERATION');
  console.log(`Date: ${dateStr}`);
  console.log(`Time: ${timestamp}`);
  console.log('='.repeat(60));

  try {
    // Fetch current week data
    console.log('\n📊 Fetching current week performance data...');
    const currentWeek = await prisma.sEOPerformance.aggregate({
      where: { date: { gte: weekAgo, lt: today } },
      _sum: {
        impressions: true,
        clicks: true,
        organicTraffic: true,
        conversions: true
      },
      _avg: {
        position: true,
        ctr: true
      }
    });

    // Fetch previous week data
    console.log('📊 Fetching previous week performance data...');
    const previousWeek = await prisma.sEOPerformance.aggregate({
      where: { date: { gte: twoWeeksAgo, lt: weekAgo } },
      _sum: {
        impressions: true,
        clicks: true,
        organicTraffic: true,
        conversions: true
      },
      _avg: {
        position: true,
        ctr: true
      }
    });

    // Calculate changes
    const calculateChange = (current, previous) => {
      if (!previous || previous === 0) return 0;
      return ((current - previous) / previous) * 100;
    };

    const metrics = {
      impressions: currentWeek._sum?.impressions || 0,
      clicks: currentWeek._sum?.clicks || 0,
      ctr: currentWeek._avg?.ctr || 0,
      avgPosition: currentWeek._avg?.position || 0,
      organicTraffic: currentWeek._sum?.organicTraffic || 0,
      conversions: currentWeek._sum?.conversions || 0
    };

    const changes = {
      impressions: calculateChange(
        currentWeek._sum?.impressions || 0,
        previousWeek._sum?.impressions || 0
      ),
      clicks: calculateChange(
        currentWeek._sum?.clicks || 0,
        previousWeek._sum?.clicks || 0
      ),
      ctr: calculateChange(
        currentWeek._avg?.ctr || 0,
        previousWeek._avg?.ctr || 0
      ),
      avgPosition: calculateChange(
        previousWeek._avg?.position || 1,
        currentWeek._avg?.position || 1
      )
    };

    // Get top keywords
    console.log('🎯 Fetching top performing keywords...');
    const topKeywords = await prisma.sEOPerformance.groupBy({
      by: ['keywordId'],
      where: {
        date: { gte: weekAgo },
        keywordId: { not: null }
      },
      _sum: {
        clicks: true,
        impressions: true
      },
      _avg: {
        position: true
      },
      orderBy: {
        _sum: {
          clicks: 'desc'
        }
      },
      take: 10
    });

    // Get recent audit logs
    console.log('📋 Fetching recent SEO activities...');
    const recentActivities = await prisma.sEOAuditLog.findMany({
      where: {
        timestamp: { gte: weekAgo }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    });

    // Generate recommendations
    const recommendations = [];
    
    if (metrics.avgPosition > 10) {
      recommendations.push('Focus on improving content quality for top 20 keywords to reach page 1');
    }
    
    if (metrics.ctr < 3) {
      recommendations.push('Optimize meta titles and descriptions to improve CTR above 3%');
    }

    if (changes.clicks < 0) {
      recommendations.push('Investigate pages with declining clicks - check for ranking drops or seasonal trends');
    }

    if (metrics.conversions === 0) {
      recommendations.push('Set up conversion tracking to measure SEO ROI effectively');
    }

    // Generate alerts
    const alerts = [];
    
    if (changes.impressions < -20) {
      alerts.push({
        severity: 'critical',
        title: 'Significant Impression Drop',
        message: `Impressions decreased by ${Math.abs(changes.impressions).toFixed(1)}% this week`
      });
    }

    if (changes.avgPosition < -15) {
      alerts.push({
        severity: 'warning',
        title: 'Ranking Position Decline',
        message: `Average position worsened by ${Math.abs(changes.avgPosition).toFixed(1)}%`
      });
    }

    if (metrics.ctr < 2) {
      alerts.push({
        severity: 'warning',
        title: 'Low Click-Through Rate',
        message: `Current CTR is ${metrics.ctr.toFixed(2)}%, below industry average of 3-5%`
      });
    }

    // Build report data
    const formatDate = (date) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]} ${date.getDate()}`;
    };
    const formatDateFull = (date) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };
    
    const reportData = {
      dateRange: `${formatDate(weekAgo)} - ${formatDateFull(today)}`,
      generatedAt: timestamp,
      metrics,
      changes,
      topKeywords: topKeywords.map(k => ({
        keyword: k.keywordId || 'N/A',
        position: k._avg?.position || 0,
        clicks: k._sum?.clicks || 0,
        impressions: k._sum?.impressions || 0
      })),
      recentActivities: recentActivities.map(a => ({
        action: a.action,
        entityType: a.entityType,
        timestamp: a.timestamp,
        performedBy: a.performedBy
      })),
      alerts,
      recommendations
    };

    // Save report data to JSON
    mkdirSync('/home/ubuntu/seo_automation_logs/weekly_reports', { recursive: true });
    const reportPath = `/home/ubuntu/seo_automation_logs/weekly_reports/report_${dateStr}.json`;
    writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`\n✅ Report data saved to: ${reportPath}`);

    // Generate markdown report
    const markdownReport = generateMarkdownReport(reportData);
    const mdReportPath = `/home/ubuntu/rise_as_one_aau/seo_reports/weekly_seo_report_${dateStr}.md`;
    writeFileSync(mdReportPath, markdownReport);
    console.log(`✅ Markdown report saved to: ${mdReportPath}`);

    // Log the result
    const logPath = '/home/ubuntu/seo_automation_logs/weekly_reports.log';
    const logEntry = `[${timestamp}] Weekly SEO Report - Status: SUCCESS - Report saved: ${reportPath}\n`;
    appendFileSync(logPath, logEntry);
    console.log(`✅ Log entry added to: ${logPath}`);

    console.log('\n' + '='.repeat(60));
    console.log('REPORT SUMMARY');
    console.log('='.repeat(60));
    console.log(`Impressions: ${metrics.impressions.toLocaleString()} (${changes.impressions >= 0 ? '+' : ''}${changes.impressions.toFixed(1)}%)`);
    console.log(`Clicks: ${metrics.clicks.toLocaleString()} (${changes.clicks >= 0 ? '+' : ''}${changes.clicks.toFixed(1)}%)`);
    console.log(`CTR: ${metrics.ctr.toFixed(2)}% (${changes.ctr >= 0 ? '+' : ''}${changes.ctr.toFixed(1)}%)`);
    console.log(`Avg Position: ${metrics.avgPosition.toFixed(1)} (${changes.avgPosition >= 0 ? '+' : ''}${changes.avgPosition.toFixed(1)}%)`);
    console.log(`Alerts: ${alerts.length}`);
    console.log(`Recommendations: ${recommendations.length}`);
    console.log('='.repeat(60));

    return reportData;

  } catch (error) {
    console.error('\n❌ ERROR generating weekly SEO report:', error);
    const logPath = '/home/ubuntu/seo_automation_logs/weekly_reports.log';
    const logEntry = `[${timestamp}] Weekly SEO Report - Status: ERROR - Error: ${error.message}\n`;
    appendFileSync(logPath, logEntry);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

function generateMarkdownReport(data) {
  const changeIcon = (value) => value >= 0 ? '📈' : '📉';
  const changeColor = (value) => value >= 0 ? '🟢' : '🔴';
  
  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${displayHours}:${displayMinutes} ${ampm}`;
  };

  return `# 🏀 Weekly SEO Report
**The Basketball Factory Inc.**

**Report Period:** ${data.dateRange}  
**Generated:** ${formatDateTime(data.generatedAt)}

---

## 📊 Performance Overview

### Key Metrics

| Metric | Current Week | Change vs Last Week |
|--------|--------------|---------------------|
| **Impressions** | ${data.metrics.impressions.toLocaleString()} | ${changeIcon(data.changes.impressions)} ${data.changes.impressions >= 0 ? '+' : ''}${data.changes.impressions.toFixed(1)}% |
| **Clicks** | ${data.metrics.clicks.toLocaleString()} | ${changeIcon(data.changes.clicks)} ${data.changes.clicks >= 0 ? '+' : ''}${data.changes.clicks.toFixed(1)}% |
| **CTR** | ${data.metrics.ctr.toFixed(2)}% | ${changeIcon(data.changes.ctr)} ${data.changes.ctr >= 0 ? '+' : ''}${data.changes.ctr.toFixed(1)}% |
| **Avg Position** | ${data.metrics.avgPosition.toFixed(1)} | ${changeIcon(data.changes.avgPosition)} ${data.changes.avgPosition >= 0 ? '+' : ''}${data.changes.avgPosition.toFixed(1)}% |
| **Organic Traffic** | ${data.metrics.organicTraffic.toLocaleString()} | - |
| **Conversions** | ${data.metrics.conversions} | - |

---

${data.alerts.length > 0 ? `## 🚨 Alerts

${data.alerts.map(alert => `### ${alert.severity === 'critical' ? '🔴' : '⚠️'} ${alert.title}
${alert.message}
`).join('\n')}

---
` : ''}

## 🎯 Top Performing Keywords

${data.topKeywords.length > 0 ? `
| Keyword | Position | Clicks | Impressions |
|---------|----------|--------|-------------|
${data.topKeywords.map(kw => `| ${kw.keyword} | ${kw.position.toFixed(1)} | ${kw.clicks} | ${kw.impressions} |`).join('\n')}
` : '_No keyword data available for this period_'}

---

## 📋 Recent SEO Activities

${data.recentActivities.length > 0 ? `
${data.recentActivities.map(activity => {
  const date = new Date(activity.timestamp);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
  const timeStr = `${months[date.getMonth()]} ${date.getDate()}, ${displayHours}:${displayMinutes} ${ampm}`;
  return `- **${activity.action}** (${activity.entityType}) - ${timeStr} by ${activity.performedBy}`;
}).join('\n')}
` : '_No recent activities recorded_'}

---

## 💡 Recommendations

${data.recommendations.length > 0 ? data.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n') : '_No specific recommendations at this time_'}

---

## 📈 Week-over-Week Trends

### Impressions
${changeColor(data.changes.impressions)} ${data.changes.impressions >= 0 ? 'Increased' : 'Decreased'} by **${Math.abs(data.changes.impressions).toFixed(1)}%**

### Clicks
${changeColor(data.changes.clicks)} ${data.changes.clicks >= 0 ? 'Increased' : 'Decreased'} by **${Math.abs(data.changes.clicks).toFixed(1)}%**

### CTR
${changeColor(data.changes.ctr)} ${data.changes.ctr >= 0 ? 'Improved' : 'Declined'} by **${Math.abs(data.changes.ctr).toFixed(1)}%**

### Average Position
${changeColor(data.changes.avgPosition)} ${data.changes.avgPosition >= 0 ? 'Improved' : 'Declined'} by **${Math.abs(data.changes.avgPosition).toFixed(1)}%**
${data.changes.avgPosition >= 0 ? '_(Lower position number = better ranking)_' : ''}

---

## 🎯 Next Steps

1. Review and implement the recommendations above
2. Monitor the alerts and take corrective action if needed
3. Continue tracking keyword performance trends
4. Schedule content updates for underperforming pages

---

**Dashboard:** [View Full SEO Dashboard](https://thebasketballfactoryinc.com/admin/seo)

*This report was automatically generated by the SEO Automation System*  
*Next report: ${(() => {
  const nextDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[nextDate.getMonth()]} ${nextDate.getDate()}, ${nextDate.getFullYear()}`;
})()}*
`;
}

// Run the report generation
generateWeeklySEOReport()
  .then(() => {
    console.log('\n✅ Weekly SEO report generation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed to generate weekly SEO report:', error);
    process.exit(1);
  });
