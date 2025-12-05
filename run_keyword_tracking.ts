/**
 * Weekly Keyword Ranking Tracker
 * Tracks keyword ranking changes and generates alerts
 */

import { trackKeywordRankings, generateSEOAlerts } from './nextjs_space/lib/seo-automation';
import { sendEmail } from './nextjs_space/lib/email';
import { writeFileSync, appendFileSync } from 'fs';
import { format } from 'date-fns';

async function runKeywordTracking() {
  const timestamp = new Date();
  const dateStr = format(timestamp, 'yyyy-MM-dd');
  const logTimestamp = format(timestamp, 'yyyy-MM-dd HH:mm:ss');
  
  console.log(`[${logTimestamp}] Starting Weekly Keyword Ranking Tracker...`);
  
  try {
    // Step 1 & 2: Track keyword rankings and save changes
    console.log('Step 1-2: Tracking keyword rankings...');
    const rankingChanges = await trackKeywordRankings();
    
    const changesFilePath = `/home/ubuntu/seo_automation_logs/ranking_changes/changes_${dateStr}.json`;
    writeFileSync(changesFilePath, JSON.stringify(rankingChanges, null, 2));
    console.log(`✓ Saved ${rankingChanges.length} ranking changes to ${changesFilePath}`);
    
    // Step 3 & 4: Generate SEO alerts and save
    console.log('Step 3-4: Generating SEO alerts...');
    const alerts = await generateSEOAlerts();
    
    const alertsFilePath = `/home/ubuntu/seo_automation_logs/alerts/alerts_${dateStr}.json`;
    writeFileSync(alertsFilePath, JSON.stringify(alerts, null, 2));
    console.log(`✓ Saved ${alerts.length} alerts to ${alertsFilePath}`);
    
    // Step 5: Send critical alert emails
    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    if (criticalAlerts.length > 0) {
      console.log(`Step 5: Sending ${criticalAlerts.length} critical alerts via email...`);
      
      const affectedKeywords = criticalAlerts
        .filter(a => a.data && Array.isArray(a.data))
        .flatMap(a => a.data)
        .map((d: any) => d.keyword)
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
    <h1>🚨 Critical SEO Alerts</h1>
    <p>The Basketball Factory Inc. - ${format(timestamp, 'MMMM d, yyyy')}</p>
  </div>
  
  <div style="padding: 20px;">
    <p><strong>${criticalAlerts.length} critical alert(s) detected:</strong></p>
    
    ${criticalAlerts.map(alert => `
      <div class="alert">
        <h3>${alert.title}</h3>
        <p>${alert.message}</p>
        ${alert.data && Array.isArray(alert.data) ? `
          <div class="keyword-list">
            <strong>Affected Keywords:</strong>
            <ul>
              ${alert.data.map((d: any) => `
                <li>${d.keyword}: Position ${d.oldPosition} → ${d.newPosition} (${d.change > 0 ? '+' : ''}${d.change})</li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `).join('')}
    
    <p><strong>Recommended Actions:</strong></p>
    <ul>
      <li>Review content quality on affected pages</li>
      <li>Check for technical SEO issues</li>
      <li>Analyze competitor changes</li>
      <li>Update meta descriptions and titles</li>
    </ul>
    
    <p><a href="https://thebasketballfactoryinc.com/admin/seo">View Full SEO Dashboard</a></p>
  </div>
</body>
</html>
      `;
      
      const emailResult = await sendEmail({
        to: 'khouston@thebasketballfactorynj.com',
        subject: `🚨 Critical SEO Alert - ${criticalAlerts.length} Issue(s) Detected`,
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
${criticalAlerts.length > 0 ? `- Critical alert email sent to khouston@thebasketballfactorynj.com\n` : ''}
---
`;
    
    const logFilePath = '/home/ubuntu/seo_automation_logs/keyword_tracking.log';
    appendFileSync(logFilePath, logEntry);
    console.log(`✓ Logged results to ${logFilePath}`);
    
    console.log('\n✅ Weekly Keyword Ranking Tracker completed successfully');
    console.log(`Summary: ${rankingChanges.length} changes, ${alerts.length} alerts (${criticalAlerts.length} critical)`);
    
  } catch (error: any) {
    console.error('❌ Keyword tracking failed:', error);
    
    const logEntry = `
[${logTimestamp}] Weekly Keyword Ranking Tracker - FAILED
Error: ${error.message}
Stack: ${error.stack}
---
`;
    
    try {
      appendFileSync('/home/ubuntu/seo_automation_logs/keyword_tracking.log', logEntry);
    } catch (logError) {
      console.error('Failed to write error log:', logError);
    }
    
    process.exit(1);
  }
}

runKeywordTracking();
