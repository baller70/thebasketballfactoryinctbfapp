/**
 * Daily GA Sync Runner
 * Executes the automatedGASync function and logs results
 */

import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';
import { writeFileSync, appendFileSync, existsSync } from 'fs';

const prisma = new PrismaClient();

/**
 * Sync Google Analytics data automatically
 */
async function automatedGASync() {
  try {
    console.log('[SEO Automation] Starting automated GA sync...');
    
    const settings = await prisma.sEOSettings.findFirst();
    if (!settings?.googleAuthTokens || !settings?.googleAnalyticsPropertyId || !settings?.googleSearchConsoleSiteUrl) {
      return { 
        success: false, 
        message: 'Google Analytics not configured',
        keywordsSynced: 0
      };
    }

    // Import syncGAData dynamically
    const googleAnalyticsModule = await import('../lib/google-analytics.ts');
    const syncGAData = googleAnalyticsModule.syncGAData;

    const result = await syncGAData(
      settings.googleAnalyticsPropertyId,
      settings.googleSearchConsoleSiteUrl,
      30 // Last 30 days
    );

    // Count keywords synced
    const keywordCount = await prisma.sEOKeyword.count({
      where: { isActive: true }
    });

    // Log the sync
    await prisma.sEOAuditLog.create({
      data: {
        action: 'automated_ga_sync',
        entityType: 'analytics',
        performedBy: 'system',
        changes: { 
          syncedAt: new Date().toISOString(),
          dataPoints: result.metrics ? 1 : 0,
          warnings: result.warnings || [],
          keywordsSynced: keywordCount
        }
      }
    });

    return { 
      success: true, 
      message: result.success ? 'GA sync successful' : result.error || 'GA sync failed',
      keywordsSynced: keywordCount
    };
  } catch (error) {
    console.error('[SEO Automation] GA sync failed:', error);
    return { 
      success: false, 
      message: error.message,
      keywordsSynced: 0
    };
  }
}

/**
 * Send email alert
 */
async function sendEmailAlert(recipientEmail, errorMessage) {
  try {
    // Import sendEmail dynamically
    const emailModule = await import('../lib/email.ts');
    const sendEmail = emailModule.sendEmail;
    
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .alert-box { background: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; }
    .error-details { background: #f9f9f9; padding: 15px; border-radius: 5px; font-family: monospace; }
  </style>
</head>
<body>
  <h2>🚨 SEO Automation Alert</h2>
  <div class="alert-box">
    <h3>Daily GA Sync Failed</h3>
    <p>The automated Google Analytics sync encountered an error at ${format(new Date(), 'PPpp')}.</p>
  </div>
  
  <h3>Error Details:</h3>
  <div class="error-details">
    ${errorMessage}
  </div>
  
  <p>Please check the system logs and Google Analytics configuration.</p>
  
  <p><a href="https://thebasketballfactoryinc.com/admin/seo">View SEO Dashboard</a></p>
</body>
</html>
    `;

    const result = await sendEmail({
      to: recipientEmail,
      subject: '🚨 SEO Automation Alert - GA Sync Failed',
      html: emailHtml
    });

    return result.success;
  } catch (error) {
    console.error('[Email Alert] Failed to send alert:', error);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  const logFile = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';
  
  console.log(`[${timestamp}] Starting daily GA sync...`);
  
  try {
    // Run the sync
    const result = await automatedGASync();
    
    // Prepare log entry
    const logEntry = `[${timestamp}] Status: ${result.success ? 'SUCCESS' : 'FAILURE'} | Message: ${result.message} | Keywords Synced: ${result.keywordsSynced}\n`;
    
    // Write to log file
    if (existsSync(logFile)) {
      appendFileSync(logFile, logEntry);
    } else {
      writeFileSync(logFile, logEntry);
    }
    
    console.log(logEntry);
    
    // If sync failed, send alert
    if (!result.success) {
      console.log('[Alert] Sending failure notification...');
      const alertSent = await sendEmailAlert('khouston@thebasketballfactorynj.com', result.message);
      
      const alertLogEntry = `[${timestamp}] Alert sent: ${alertSent ? 'YES' : 'NO'}\n`;
      appendFileSync(logFile, alertLogEntry);
      console.log(alertLogEntry);
    }
    
    console.log('[Complete] Daily GA sync finished');
    
  } catch (error) {
    const errorMessage = error.message || String(error);
    const errorLogEntry = `[${timestamp}] Status: ERROR | Message: ${errorMessage}\n`;
    
    if (existsSync(logFile)) {
      appendFileSync(logFile, errorLogEntry);
    } else {
      writeFileSync(logFile, errorLogEntry);
    }
    
    console.error(errorLogEntry);
    
    // Try to send alert
    try {
      await sendEmailAlert('khouston@thebasketballfactorynj.com', errorMessage);
    } catch (alertError) {
      console.error('[Alert] Failed to send error notification:', alertError);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
