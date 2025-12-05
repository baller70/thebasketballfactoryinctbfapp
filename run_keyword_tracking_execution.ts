#!/usr/bin/env tsx

/**
 * Weekly Keyword Ranking Tracker Execution Script
 * Runs every Monday at 7 AM to track keyword ranking changes
 */

import { trackKeywordRankings, generateSEOAlerts } from './nextjs_space/lib/seo-automation';
import { sendEmail } from './nextjs_space/lib/email';
import { writeFileSync, appendFileSync, mkdirSync } from 'fs';
import { format } from 'date-fns';
import path from 'path';

const LOG_DIR = '/home/ubuntu/seo_automation_logs';
const RANKING_CHANGES_DIR = path.join(LOG_DIR, 'ranking_changes');
const ALERTS_DIR = path.join(LOG_DIR, 'alerts');
const LOG_FILE = path.join(LOG_DIR, 'keyword_tracking.log');

// Ensure directories exist
mkdirSync(RANKING_CHANGES_DIR, { recursive: true });
mkdirSync(ALERTS_DIR, { recursive: true });

async function main() {
  const startTime = new Date();
  const dateStr = format(startTime, 'yyyy-MM-dd');
  const timestamp = format(startTime, 'yyyy-MM-dd HH:mm:ss');
  
  console.log(`[${timestamp}] Starting Weekly Keyword Ranking Tracker...`);
  
  try {
    // Step 1 & 2: Track keyword rankings and save changes
    console.log('Step 1-2: Tracking keyword rankings...');
    const rankingChanges = await trackKeywordRankings();
    
    const changesFile = path.join(RANKING_CHANGES_DIR, `changes_${dateStr}.json`);
    writeFileSync(changesFile, JSON.stringify(rankingChanges, null, 2));
    console.log(`✓ Saved ${rankingChanges.length} ranking changes to ${changesFile}`);
    
    // Step 3 & 4: Generate SEO alerts and save
    console.log('Step 3-4: Generating SEO alerts...');
    const alerts = await generateSEOAlerts();
    
    const alertsFile = path.join(ALERTS_DIR, `alerts_${dateStr}.json`);
    writeFileSync(alertsFile, JSON.stringify(alerts, null, 2));
    console.log(`✓ Saved ${alerts.length} alerts to ${alertsFile}`);
    
    // Step 5: Send critical alerts via email
    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    
    if (criticalAlerts.length > 0) {
      console.log(`Step 5: Sending ${criticalAlerts.length} critical alerts via email...`);
      
      const affectedKeywords = criticalAlerts
        .filter(a => a.data && Array.isArray(a.data))
        .flatMap(a => a.data.map((d: any) => d.keyword))
        .join(', ');
      
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: #dc2626; color: white; padding: 20px; }
    .alert { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 15px 0; }
    .keyword-list { background: #f9f9f9; padding: 15px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚨 Critical SEO Alerts - ${dateStr}</h1>
  </div>
  <div style="padding: 20px;">
    <p><strong>${criticalAlerts.length} critical alert(s) detected:</strong></p>
    ${criticalAlerts.map(alert => `
      <div class="alert">
        <h3>${alert.title}</h3>
        <p>${alert.message}</p>
      </div>
    `).join('')}
    
    ${affectedKeywords ? `
      <div class="keyword-list">
        <h3>Affected Keywords:</h3>
        <p>${affectedKeywords}</p>
      </div>
    ` : ''}
    
    <p><strong>Recommended Actions:</strong></p>
    <ul>
      <li>Review content quality and relevance for affected pages</li>
      <li>Check for technical SEO issues (page speed, mobile-friendliness)</li>
      <li>Analyze competitor content for these keywords</li>
      <li>Consider updating meta descriptions and titles</li>
    </ul>
    
    <p><a href="https://thebasketballfactoryinc.com/admin/seo">View Full SEO Dashboard</a></p>
  </div>
</body>
</html>
      `;
      
      const emailResult = await sendEmail({
        to: 'khouston@thebasketballfactorynj.com',
        subject: `🚨 Critical SEO Alerts - ${criticalAlerts.length} Issue(s) Detected`,
        html: emailHtml
      });
      
      if (emailResult.success) {
        console.log('✓ Critical alert email sent successfully');
      } else {
        console.error('✗ Failed to send critical alert email:', emailResult.error);
      }
    } else {
      console.log('Step 5: No critical alerts to send');
    }
    
    // Step 6: Log the tracking results
    const endTime = new Date();
    const duration = (endTime.getTime() - startTime.getTime()) / 1000;
    
    const logEntry = `
[${timestamp}] Weekly Keyword Ranking Tracker Execution
  - Total keywords tracked: ${rankingChanges.length > 0 ? 'Active keywords processed' : 'No active keywords'}
  - Ranking changes detected: ${rankingChanges.length}
  - Alerts generated: ${alerts.length}
  - Critical alerts: ${criticalAlerts.length}
  - Duration: ${duration.toFixed(2)}s
  - Status: SUCCESS
`;
    
    appendFileSync(LOG_FILE, logEntry);
    console.log('✓ Logged tracking results to', LOG_FILE);
    
    console.log(`\n[${format(endTime, 'yyyy-MM-dd HH:mm:ss')}] Weekly Keyword Ranking Tracker completed successfully!`);
    console.log(`Summary: ${rankingChanges.length} changes, ${alerts.length} alerts (${criticalAlerts.length} critical)`);
    
  } catch (error: any) {
    const errorTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const errorLog = `
[${errorTime}] Weekly Keyword Ranking Tracker FAILED
  - Error: ${error.message}
  - Stack: ${error.stack}
`;
    
    appendFileSync(LOG_FILE, errorLog);
    console.error('✗ Keyword tracking failed:', error);
    process.exit(1);
  }
}

main();
