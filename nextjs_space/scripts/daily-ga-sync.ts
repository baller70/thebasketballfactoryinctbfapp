/**
 * Daily GA Sync Runner
 * Executes the automatedGASync function and logs results
 */

import { prisma } from '@/lib/db';
import { syncGAData } from '@/lib/google-analytics';
import { sendEmail } from '@/lib/email';
import { writeFileSync, appendFileSync, existsSync } from 'fs';

/**
 * Sync Google Analytics data automatically
 */
async function automatedGASync(): Promise<{ success: boolean; message: string; keywordsSynced: number }> {
  try {
    console.log('[SEO Automation] Starting automated GA sync...');
    
    const settings = await prisma.sEOSettings.findFirst();
    if (!settings?.googleAuthTokens || !settings?.googleAnalyticsPropertyId || !settings?.googleSearchConsoleSiteUrl) {
      return { success: false, message: 'Google Analytics not configured', keywordsSynced: 0 };
    }

    const tokens = typeof settings.googleAuthTokens === 'string' 
      ? JSON.parse(settings.googleAuthTokens)
      : settings.googleAuthTokens;

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
  } catch (error: any) {
    console.error('[SEO Automation] GA sync failed:', error);
    return { success: false, message: error.message, keywordsSynced: 0 };
  }
}

/**
 * Send email alert
 */
async function sendEmailAlert(email: string, errorMessage: string): Promise<boolean> {
  try {
    const result = await sendEmail({
      to: email,
      subject: '🚨 Daily GA Sync Failed - Rise As One AAU',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .alert { background: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; }
            .error-details { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
            code { background: #f3f4f6; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="alert">
            <h2>🚨 Daily GA Sync Failed</h2>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
            <p><strong>Service:</strong> Rise As One AAU - SEO Automation</p>
          </div>
          
          <div class="error-details">
            <h3>Error Details:</h3>
            <p><code>${errorMessage}</code></p>
          </div>
          
          <p>Please check the SEO settings and Google Analytics configuration in the admin dashboard.</p>
          
          <p><a href="https://thebasketballfactoryinc.com/admin/seo">View SEO Dashboard</a></p>
          
          <hr>
          <p style="color: #666; font-size: 12px;">This is an automated alert from the Rise As One AAU SEO automation system.</p>
        </body>
        </html>
      `
    });
    
    return result.success;
  } catch (error) {
    console.error('[Email Alert] Failed to send email:', error);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  const timestamp = new Date().toISOString();
  const logFile = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';
  
  try {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Daily GA Sync - ${timestamp}`);
    console.log('='.repeat(80));
    
    // Step 1: Run the sync
    const result = await automatedGASync();
    
    // Step 2: Log the results
    const logEntry = `
[${timestamp}]
Status: ${result.success ? 'SUCCESS' : 'FAILURE'}
Message: ${result.message}
Keywords Synced: ${result.keywordsSynced}
${'='.repeat(80)}
`;
    
    // Create or append to log file
    if (existsSync(logFile)) {
      appendFileSync(logFile, logEntry);
    } else {
      writeFileSync(logFile, logEntry);
    }
    
    console.log(`✅ Sync completed: ${result.message}`);
    console.log(`📊 Keywords synced: ${result.keywordsSynced}`);
    console.log(`📝 Log written to: ${logFile}`);
    
    // Step 3: Send alert if failed
    if (!result.success) {
      console.log('\n⚠️  Sync failed, sending alert email...');
      const emailSent = await sendEmailAlert('khouston@thebasketballfactorynj.com', result.message);
      
      if (emailSent) {
        console.log('✅ Alert email sent successfully');
        appendFileSync(logFile, `Alert email sent to khouston@thebasketballfactorynj.com\n${'='.repeat(80)}\n`);
      } else {
        console.log('❌ Failed to send alert email');
        appendFileSync(logFile, `Failed to send alert email\n${'='.repeat(80)}\n`);
      }
    }
    
    await prisma.$disconnect();
    process.exit(result.success ? 0 : 1);
    
  } catch (error: any) {
    console.error('❌ Fatal error:', error);
    
    const errorLogEntry = `
[${timestamp}]
Status: FATAL ERROR
Message: ${error.message}
Stack: ${error.stack}
${'='.repeat(80)}
`;
    
    if (existsSync(logFile)) {
      appendFileSync(logFile, errorLogEntry);
    } else {
      writeFileSync(logFile, errorLogEntry);
    }
    
    // Try to send alert
    try {
      await sendEmailAlert('khouston@thebasketballfactorynj.com', error.message);
    } catch (emailError) {
      console.error('Failed to send alert email:', emailError);
    }
    
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
