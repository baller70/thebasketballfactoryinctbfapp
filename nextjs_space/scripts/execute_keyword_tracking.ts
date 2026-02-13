/**
 * Weekly Keyword Ranking Tracker
 * Tracks keyword ranking changes and generates alerts
 */

import { trackKeywordRankings, generateSEOAlerts } from '@/lib/seo-automation';
import { writeFileSync, appendFileSync } from 'fs';
import { format } from 'date-fns';
import { sendEmail } from '@/lib/email';

async function executeKeywordTracking() {
  const timestamp = new Date().toISOString();
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  
  console.log(`[${timestamp}] Starting Weekly Keyword Ranking Tracker...`);
  
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
    <h1>🚨 Critical SEO Alerts</h1>
    <p>The Basketball Factory Inc. - ${format(new Date(), 'MMMM d, yyyy')}</p>
  </div>
  
  <div style="padding: 20px;">
    <p><strong>${criticalAlerts.length} critical alert(s) detected:</strong></p>
    
    ${criticalAlerts.map(alert => `
      <div class="alert">
        <h3>${alert.title}</h3>
        <p>${alert.message}</p>
        ${alert.data ? `<pre>${JSON.stringify(alert.data, null, 2)}</pre>` : ''}
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
      <li>Consider updating meta titles and descriptions</li>
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
    console.log('Step 6: Logging tracking results...');
    const logEntry = `
[${timestamp}]
Total keywords tracked: ${rankingChanges.length > 0 ? 'Active keywords processed' : 'No active keywords'}
Number of changes detected: ${rankingChanges.length}
Number of alerts generated: ${alerts.length}
Critical alerts: ${criticalAlerts.length}
Status: SUCCESS
---
`;
    
    appendFileSync('/home/ubuntu/seo_automation_logs/keyword_tracking.log', logEntry);
    console.log('✓ Logged tracking results');
    
    // Summary
    console.log('\n=== EXECUTION SUMMARY ===');
    console.log(`Ranking changes detected: ${rankingChanges.length}`);
    console.log(`Total alerts generated: ${alerts.length}`);
    console.log(`Critical alerts: ${criticalAlerts.length}`);
    console.log(`Files created:`);
    console.log(`  - ${changesFilePath}`);
    console.log(`  - ${alertsFilePath}`);
    console.log(`  - /home/ubuntu/seo_automation_logs/keyword_tracking.log`);
    console.log('=========================\n');
    
    return {
      success: true,
      rankingChanges: rankingChanges.length,
      alerts: alerts.length,
      criticalAlerts: criticalAlerts.length
    };
    
  } catch (error: any) {
    console.error('Error executing keyword tracking:', error);
    
    const errorLog = `
[${timestamp}]
Status: FAILURE
Error: ${error.message}
Stack: ${error.stack}
---
`;
    appendFileSync('/home/ubuntu/seo_automation_logs/keyword_tracking.log', errorLog);
    
    throw error;
  }
}

// Execute the task
executeKeywordTracking()
  .then(result => {
    console.log('Keyword tracking completed successfully:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Keyword tracking failed:', error);
    process.exit(1);
  });
