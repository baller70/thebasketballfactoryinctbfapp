/**
 * Weekly SEO Report Email Sender
 * Generates comprehensive weekly SEO performance report and sends via email
 */

import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { writeFileSync, appendFileSync, mkdirSync } from 'fs';

const prisma = new PrismaClient();
const RECIPIENT_EMAIL = 'khouston@thebasketballfactorynj.com';

async function sendWeeklySEOReportEmail() {
  const timestamp = new Date().toISOString();
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

  console.log('='.repeat(60));
  console.log('WEEKLY SEO REPORT EMAIL SENDER');
  console.log(`Date: ${dateStr}`);
  console.log(`Time: ${timestamp}`);
  console.log(`Recipient: ${RECIPIENT_EMAIL}`);
  console.log('='.repeat(60));

  try {
    // Step 1 & 2: Generate report data
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
      alerts,
      recommendations
    };

    // Step 3: Save report data to JSON
    mkdirSync('/home/ubuntu/seo_automation_logs/weekly_reports', { recursive: true });
    const reportPath = `/home/ubuntu/seo_automation_logs/weekly_reports/report_${dateStr}.json`;
    writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`\n✅ Report data saved to: ${reportPath}`);

    // Send email
    console.log(`\n📧 Sending email to ${RECIPIENT_EMAIL}...`);
    const emailSent = await sendEmail(reportData);

    // Step 4: Log the status
    const logPath = '/home/ubuntu/seo_automation_logs/weekly_reports/weekly_reports.log';
    const logEntry = `[${timestamp}] Weekly SEO Report - Status: ${emailSent ? 'SUCCESS' : 'FAILED'} - Recipient: ${RECIPIENT_EMAIL} - Report saved: ${reportPath}\n`;
    appendFileSync(logPath, logEntry);
    console.log(`✅ Log entry added to: ${logPath}`);

    if (emailSent) {
      console.log('\n' + '='.repeat(60));
      console.log('✅ WEEKLY SEO REPORT EMAIL SENT SUCCESSFULLY!');
      console.log('='.repeat(60));
      console.log(`Impressions: ${metrics.impressions.toLocaleString()} (${changes.impressions >= 0 ? '+' : ''}${changes.impressions.toFixed(1)}%)`);
      console.log(`Clicks: ${metrics.clicks.toLocaleString()} (${changes.clicks >= 0 ? '+' : ''}${changes.clicks.toFixed(1)}%)`);
      console.log(`CTR: ${metrics.ctr.toFixed(2)}% (${changes.ctr >= 0 ? '+' : ''}${changes.ctr.toFixed(1)}%)`);
      console.log(`Avg Position: ${metrics.avgPosition.toFixed(1)} (${changes.avgPosition >= 0 ? '+' : ''}${changes.avgPosition.toFixed(1)}%)`);
      console.log(`Alerts: ${alerts.length}`);
      console.log(`Recommendations: ${recommendations.length}`);
      console.log('='.repeat(60));
    } else {
      console.error('\n❌ Failed to send weekly SEO report email');
      process.exit(1);
    }

    return reportData;

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    const logPath = '/home/ubuntu/seo_automation_logs/weekly_reports/weekly_reports.log';
    const logEntry = `[${timestamp}] Weekly SEO Report - Status: ERROR - Error: ${error.message}\n`;
    appendFileSync(logPath, logEntry);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function sendEmail(reportData) {
  try {
    // Get Resend API key from environment or database
    let resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      const settings = await prisma.sEOSettings.findFirst();
      resendApiKey = settings?.resendApiKey;
    }
    
    if (!resendApiKey) {
      console.error('❌ Resend API key not configured');
      return false;
    }

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #C8B273 0%, #A89254 100%); color: white; padding: 30px; text-align: center; }
    .metric-card { background: #f9f9f9; border-left: 4px solid #C8B273; padding: 15px; margin: 15px 0; }
    .metric-value { font-size: 32px; font-weight: bold; color: #C8B273; }
    .change-positive { color: #10b981; }
    .change-negative { color: #ef4444; }
    .alert-critical { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 10px 0; }
    .alert-warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 10px 0; }
    .keyword-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .keyword-table th { background: #C8B273; color: white; padding: 12px; text-align: left; }
    .keyword-table td { padding: 10px; border-bottom: 1px solid #ddd; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏀 Weekly SEO Report</h1>
    <p>The Basketball Factory Inc.</p>
    <p>${reportData.dateRange}</p>
  </div>

  <div style="padding: 30px;">
    <h2>📊 Performance Overview</h2>
    
    <div class="metric-card">
      <h3>Impressions</h3>
      <div class="metric-value">${reportData.metrics.impressions.toLocaleString()}</div>
      <p class="${reportData.changes.impressions >= 0 ? 'change-positive' : 'change-negative'}">
        ${reportData.changes.impressions >= 0 ? '↑' : '↓'} ${Math.abs(reportData.changes.impressions).toFixed(1)}% vs last week
      </p>
    </div>

    <div class="metric-card">
      <h3>Clicks</h3>
      <div class="metric-value">${reportData.metrics.clicks.toLocaleString()}</div>
      <p class="${reportData.changes.clicks >= 0 ? 'change-positive' : 'change-negative'}">
        ${reportData.changes.clicks >= 0 ? '↑' : '↓'} ${Math.abs(reportData.changes.clicks).toFixed(1)}% vs last week
      </p>
    </div>

    <div class="metric-card">
      <h3>Average Position</h3>
      <div class="metric-value">${reportData.metrics.avgPosition.toFixed(1)}</div>
      <p class="${reportData.changes.avgPosition >= 0 ? 'change-positive' : 'change-negative'}">
        ${reportData.changes.avgPosition >= 0 ? '↑' : '↓'} ${Math.abs(reportData.changes.avgPosition).toFixed(1)}% vs last week
      </p>
    </div>

    <div class="metric-card">
      <h3>CTR</h3>
      <div class="metric-value">${reportData.metrics.ctr.toFixed(2)}%</div>
      <p class="${reportData.changes.ctr >= 0 ? 'change-positive' : 'change-negative'}">
        ${reportData.changes.ctr >= 0 ? '↑' : '↓'} ${Math.abs(reportData.changes.ctr).toFixed(1)}% vs last week
      </p>
    </div>

    ${reportData.alerts.length > 0 ? `
    <h2>🚨 Alerts</h2>
    ${reportData.alerts.slice(0, 5).map(alert => `
      <div class="alert-${alert.severity === 'critical' ? 'critical' : 'warning'}">
        <strong>${alert.title}</strong><br>
        ${alert.message}
      </div>
    `).join('')}
    ` : ''}

    <h2>🎯 Top Performing Keywords</h2>
    <table class="keyword-table">
      <thead>
        <tr>
          <th>Keyword</th>
          <th>Position</th>
          <th>Clicks</th>
          <th>Impressions</th>
        </tr>
      </thead>
      <tbody>
        ${reportData.topKeywords.slice(0, 10).map(kw => `
          <tr>
            <td><strong>${kw.keyword}</strong></td>
            <td>${kw.position.toFixed(1)}</td>
            <td>${kw.clicks}</td>
            <td>${kw.impressions}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    ${reportData.recommendations.length > 0 ? `
    <h2>💡 Recommendations</h2>
    <ul>
      ${reportData.recommendations.map(rec => `<li>${rec}</li>`).join('')}
    </ul>
    ` : ''}
  </div>

  <div class="footer">
    <p>This is an automated weekly SEO report from The Basketball Factory Inc.</p>
    <p><a href="https://thebasketballfactoryinc.com/admin/seo">View Full Dashboard</a></p>
  </div>
</body>
</html>
    `;

    // Send via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'SEO Reports <onboarding@resend.dev>',
        to: [RECIPIENT_EMAIL],
        subject: `🏀 Weekly SEO Report - ${reportData.dateRange}`,
        html: emailHtml
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Email sent successfully! Email ID:', result.id);
      
      // Log to audit
      await prisma.sEOAuditLog.create({
        data: {
          action: 'weekly_report_sent',
          entityType: 'report',
          performedBy: 'system',
          changes: { 
            sentTo: RECIPIENT_EMAIL,
            sentAt: new Date().toISOString(),
            metrics: reportData.metrics,
            emailId: result.id
          }
        }
      });
      
      return true;
    } else {
      console.error('❌ Email send failed:', result);
      return false;
    }
  } catch (error) {
    console.error('❌ Email error:', error);
    return false;
  }
}

// Run the report generation and email sending
sendWeeklySEOReportEmail()
  .then(() => {
    console.log('\n✅ Weekly SEO report email task completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed to send weekly SEO report email:', error);
    process.exit(1);
  });
