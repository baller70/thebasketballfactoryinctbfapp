import { trackKeywordRankings, generateSEOAlerts } from './nextjs_space/lib/seo-automation';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function executeKeywordTracking() {
  const date = new Date().toISOString().split('T')[0];
  const logDir = '/home/ubuntu/seo_automation_logs';
  
  console.log('Starting keyword ranking tracking...');
  
  try {
    // Step 1 & 2: Track keyword rankings
    console.log('Step 1-2: Tracking keyword rankings...');
    const rankingChanges = await trackKeywordRankings();
    
    const changesFile = join(logDir, 'ranking_changes', `changes_${date}.json`);
    writeFileSync(changesFile, JSON.stringify(rankingChanges, null, 2));
    console.log(`Saved ${rankingChanges.length} ranking changes to ${changesFile}`);
    
    // Step 3 & 4: Generate SEO alerts
    console.log('Step 3-4: Generating SEO alerts...');
    const alerts = await generateSEOAlerts();
    
    const alertsFile = join(logDir, 'alerts', `alerts_${date}.json`);
    writeFileSync(alertsFile, JSON.stringify(alerts, null, 2));
    console.log(`Saved ${alerts.length} alerts to ${alertsFile}`);
    
    // Step 5: Check for critical alerts
    const criticalAlerts = alerts.filter((alert: any) => alert.severity === 'critical');
    console.log(`Found ${criticalAlerts.length} critical alerts`);
    
    if (criticalAlerts.length > 0) {
      console.log('Critical alerts detected:');
      criticalAlerts.forEach((alert: any) => {
        console.log(`- ${alert.type}: ${alert.message}`);
      });
    }
    
    // Step 6: Log results
    const logEntry = `
[${new Date().toISOString()}] Keyword Tracking Execution
- Total keywords tracked: ${rankingChanges.length}
- Number of changes detected: ${rankingChanges.filter((c: any) => Math.abs(c.positionChange) >= 3).length}
- Number of alerts generated: ${alerts.length}
- Critical alerts: ${criticalAlerts.length}
`;
    
    const logFile = join(logDir, 'keyword_tracking.log');
    writeFileSync(logFile, logEntry, { flag: 'a' });
    console.log('Logged results to keyword_tracking.log');
    
    // Output summary
    console.log('\n=== EXECUTION SUMMARY ===');
    console.log(`Date: ${date}`);
    console.log(`Ranking changes: ${rankingChanges.length}`);
    console.log(`Alerts generated: ${alerts.length}`);
    console.log(`Critical alerts: ${criticalAlerts.length}`);
    
    return {
      success: true,
      rankingChanges,
      alerts,
      criticalAlerts
    };
    
  } catch (error) {
    console.error('Error during keyword tracking:', error);
    const logEntry = `\n[${new Date().toISOString()}] ERROR: ${error}\n`;
    writeFileSync(join(logDir, 'keyword_tracking.log'), logEntry, { flag: 'a' });
    throw error;
  }
}

executeKeywordTracking()
  .then(result => {
    console.log('\nKeyword tracking completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('\nKeyword tracking failed:', error);
    process.exit(1);
  });
