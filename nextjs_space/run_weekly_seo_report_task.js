#!/usr/bin/env node

/**
 * Weekly SEO Report Task Runner
 * Generates and emails comprehensive weekly SEO performance report
 */

const { PrismaClient } = require('@prisma/client');
const { writeFileSync, appendFileSync, mkdirSync } = require('fs');
const prisma = new PrismaClient();

const RECIPIENT_EMAIL = 'khouston@thebasketballfactorynj.com';
const LOG_DIR = '/home/ubuntu/seo_automation_logs/weekly_reports';
const LOG_FILE = `${LOG_DIR}/weekly_reports.log`;

// Ensure log directory exists
try {
  mkdirSync(LOG_DIR, { recursive: true });
} catch (err) {
  // Directory already exists
}

// Date utilities
function subDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function formatDate(date, formatStr) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  if (formatStr === 'MMM d') {
    return `${month} ${day}`;
  } else if (formatStr === 'MMM d, yyyy') {
    return `${month} ${day}, ${year}`;
  } else if (formatStr === 'yyyy-MM-dd') {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  }
  return date.toISOString();
}

// Generate weekly report data
async function generateWeeklyReport() {
  const today = startOfDay(new Date());
  const weekAgo = subDays(today, 7);
  const twoWeeksAgo = subDays(today, 14);

  // Fetch current week data
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
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Get top keywords
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

  // Get ranking changes (simplified)
  const rankingChanges = [];

  // Generate alerts (simplified)
  const alerts = [];

  // Generate recommendations
  const recommendations = [];
  
  if ((currentWeek._avg.position || 0) > 10) {
    recommendations.push('Focus on improving content quality for top 20 keywords to reach page 1');
  }
  
  if ((currentWeek._avg.ctr || 0) < 3) {
    recommendations.push('Optimize meta titles and descriptions to improve CTR above 3%');
  }

  return {
    dateRange: `${formatDate(weekAgo, 'MMM d')} - ${formatDate(today, 'MMM d, yyyy')}`,
    metrics: {
      impressions: currentWeek._sum?.impressions || 0,
      clicks: currentWeek._sum?.clicks || 0,
      ctr: currentWeek._avg?.ctr || 0,
      avgPosition: currentWeek._avg?.position || 0,
      organicTraffic: currentWeek._sum?.organicTraffic || 0,
      conversions: currentWeek._sum?.conversions || 0
    },
    changes: {
      impressions: calculateChange(currentWeek._sum?.impressions || 0, previousWeek._sum?.impressions || 0),
      clicks: calculateChange(currentWeek._sum?.clicks || 0, previousWeek._sum?.clicks || 0),
      ctr: calculateChange(currentWeek._avg?.ctr || 0, previousWeek._avg?.ctr || 0),
      avgPosition: calculateChange(previousWeek._avg?.position || 1, currentWeek._avg?.position || 1)
    },
    topKeywords: topKeywords.map(k => ({
      keyword: k.keywordId || 'N/A',
      position: k._avg?.position || 0,
      clicks: k._sum?.clicks || 0,
      impressions: k._sum?.impressions || 0
    })),
    rankingChanges,
    alerts,
    recommendations
  };
}

// Send email using Resend
async function sendEmail(reportData) {
  try {
    // Get email settings
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings?.resendApiKey) {
      console.error('Resend API key not configured');
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
        'Authorization': `Bearer ${settings.resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'SEO Reports <seo@thebasketballfactoryinc.com>',
        to: [RECIPIENT_EMAIL],
        subject: `🏀 Weekly SEO Report - ${reportData.dateRange}`,
        html: emailHtml
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('Email sent successfully:', result.id);
      
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
      console.error('Email send failed:', result);
      return false;
    }
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}

async function runWeeklyReport() {
  const timestamp = new Date().toISOString();
  const dateStr = formatDate(new Date(), 'yyyy-MM-dd');
  
  console.log(`[${timestamp}] Starting Weekly SEO Report generation...`);
  
  try {
    // Step 1 & 2: Generate and send the report
    console.log(`[${timestamp}] Generating report data...`);
    const reportData = await generateWeeklyReport();
    
    console.log(`[${timestamp}] Sending email to ${RECIPIENT_EMAIL}...`);
    const emailSent = await sendEmail(reportData);
    
    // Step 3: Save report data to JSON
    const reportFilePath = `${LOG_DIR}/report_${dateStr}.json`;
    console.log(`[${timestamp}] Saving report data to ${reportFilePath}...`);
    writeFileSync(reportFilePath, JSON.stringify(reportData, null, 2));
    
    // Step 4: Log the status
    const logEntry = `[${timestamp}] Weekly SEO Report - Status: ${emailSent ? 'SUCCESS' : 'FAILED'} - Recipient: ${RECIPIENT_EMAIL} - Report saved: ${reportFilePath}\n`;
    appendFileSync(LOG_FILE, logEntry);
    
    if (emailSent) {
      console.log(`[${timestamp}] ✅ Weekly SEO report sent successfully!`);
      console.log(`[${timestamp}] Report metrics:`, {
        impressions: reportData.metrics.impressions,
        clicks: reportData.metrics.clicks,
        ctr: reportData.metrics.ctr.toFixed(2) + '%',
        avgPosition: reportData.metrics.avgPosition.toFixed(1),
        topKeywords: reportData.topKeywords.length,
        alerts: reportData.alerts.length,
        recommendations: reportData.recommendations.length
      });
    } else {
      console.error(`[${timestamp}] ❌ Failed to send weekly SEO report`);
      process.exit(1);
    }
    
  } catch (error) {
    const errorMsg = `[${timestamp}] ERROR: ${error.message}\n${error.stack}\n`;
    console.error(errorMsg);
    appendFileSync(LOG_FILE, errorMsg);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runWeeklyReport();
