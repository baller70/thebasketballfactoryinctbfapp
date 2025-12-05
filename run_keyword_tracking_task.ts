#!/usr/bin/env tsx
/**
 * Weekly Keyword Ranking Tracker
 * Tracks keyword ranking changes and generates alerts
 */

import { trackKeywordRankings, generateSEOAlerts } from './nextjs_space/lib/seo-automation';
import { sendEmail } from './nextjs_space/lib/email';
import { writeFileSync, appendFileSync } from 'fs';
import { format } from 'date-fns';

async function runKeywordTracking() {
  const startTime = new Date();
  const dateStr = format(startTime, 'yyyy-MM-dd');
  const timestamp = format(startTime, 'yyyy-MM-dd HH:mm:ss');
  
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
    console.log(`✓ Generated ${alerts.length} alerts, saved to ${alertsFilePath}`);
    
    // Step 5: Send critical alerts via email
    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    if (criticalAlerts.length > 0) {
      console.log(`Step 5: Sending ${criticalAlerts.length} critical alerts via email...`);
      
      const emailBody = `
        <h2>🚨 Critical SEO Alerts - ${dateStr}</h2>
        <p>The following critical issues require immediate attention:</p>
        
        ${criticalAlerts.map(alert => `
          <div style="border-left: 4px solid #dc2626; padding: 12px; margin: 12px 0; background: #fef2f2;">
            <h3 style="color: #dc2626; margin: 0 0 8px 0;">${alert.title}</h3>
            <p style="margin: 0 0 8px 0;">${alert.message}</p>
            ${alert.data ? `
              <details>
                <summary style="cursor: pointer; color: #991b1b;">View Details</summary>
                <pre style="background: #fff; padding: 8px; overflow-x: auto; font-size: 12px;">${JSON.stringify(alert.data, null, 2)}</pre>
              </details>
            ` : ''}
          </div>
        `).join('')}
        
        <hr style="margin: 24px 0;" />
        
        <h3>📊 Ranking Changes Summary</h3>
        <p>Total keywords with significant changes (3+ positions): ${rankingChanges.length}</p>
        
        ${rankingChanges.length > 0 ? `
          <table style="border-collapse: collapse; width: 100%; margin-top: 12px;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Keyword</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">Old Position</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">New Position</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">Change</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Page</th>
              </tr>
            </thead>
            <tbody>
              ${rankingChanges.slice(0, 20).map(change => `
                <tr>
                  <td style="border: 1px solid #d1d5db; padding: 8px;">${change.keyword}</td>
                  <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">${change.oldPosition}</td>
                  <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">${change.newPosition}</td>
                  <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center; color: ${change.change > 0 ? '#059669' : '#dc2626'};">
                    ${change.change > 0 ? '↑' : '↓'} ${Math.abs(change.change)}
                  </td>
                  <td style="border: 1px solid #d1d5db; padding: 8px; font-size: 12px;">${change.pagePath}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ${rankingChanges.length > 20 ? `<p style="margin-top: 8px; color: #6b7280; font-size: 14px;">Showing top 20 of ${rankingChanges.length} changes. See full report for details.</p>` : ''}
        ` : '<p>No significant ranking changes detected.</p>'}
        
        <hr style="margin: 24px 0;" />
        
        <p style="color: #6b7280; font-size: 14px;">
          Generated on ${timestamp}<br/>
          Full reports available at: /home/ubuntu/seo_automation_logs/
        </p>
      `;
      
      try {
        await sendEmail({
          to: 'khouston@thebasketballfactorynj.com',
          subject: `🚨 Critical SEO Alerts - ${criticalAlerts.length} Issues Detected`,
          html: emailBody
        });
        console.log('✓ Critical alert email sent successfully');
      } catch (emailError) {
        console.error('✗ Failed to send email:', emailError);
      }
    } else {
      console.log('Step 5: No critical alerts to send');
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
    console.log('✓ Logged results to keyword_tracking.log');
    
    console.log('\n' + '='.repeat(60));
    console.log('WEEKLY KEYWORD RANKING TRACKER - SUMMARY');
    console.log('='.repeat(60));
    console.log(`Date: ${dateStr}`);
    console.log(`Ranking Changes: ${rankingChanges.length}`);
    console.log(`Total Alerts: ${alerts.length}`);
    console.log(`Critical Alerts: ${criticalAlerts.length}`);
    console.log(`Duration: ${duration.toFixed(2)}s`);
    console.log('='.repeat(60));
    
    return {
      success: true,
      rankingChanges: rankingChanges.length,
      alerts: alerts.length,
      criticalAlerts: criticalAlerts.length
    };
    
  } catch (error) {
    console.error('Error running keyword tracking:', error);
    
    const errorLog = `
[${timestamp}] Weekly Keyword Ranking Tracker FAILED
  - Error: ${error instanceof Error ? error.message : String(error)}
  - Status: FAILURE
---
`;
    appendFileSync('/home/ubuntu/seo_automation_logs/keyword_tracking.log', errorLog);
    
    throw error;
  }
}

// Run the task
runKeywordTracking()
  .then(result => {
    console.log('\n✓ Keyword tracking completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n✗ Keyword tracking failed:', error);
    process.exit(1);
  });
