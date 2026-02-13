/**
 * Daily GA Sync Runner - API Version
 * Calls the Next.js API endpoint to sync GA data
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function runGASync() {
  const timestamp = new Date().toISOString();
  const logFile = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';
  
  try {
    console.log(`[${timestamp}] Starting automated GA sync...`);
    
    // Get settings from database
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings?.googleAuthTokens || !settings?.googleAnalyticsPropertyId || !settings?.googleSearchConsoleSiteUrl) {
      const errorMsg = 'Google Analytics not configured - missing credentials or property IDs';
      console.error(`[${timestamp}] ERROR: ${errorMsg}`);
      
      // Log to file
      const logEntry = `[${timestamp}] FAILURE - ${errorMsg}\n`;
      fs.appendFileSync(logFile, logEntry);
      
      return { success: false, message: errorMsg, keywordsSynced: 0 };
    }

    console.log(`[${timestamp}] Found GA configuration - Property ID: ${settings.googleAnalyticsPropertyId}`);
    console.log(`[${timestamp}] Search Console URL: ${settings.googleSearchConsoleSiteUrl}`);

    // Call the sync API endpoint
    const response = await fetch('http://localhost:3000/api/seo/google/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        propertyId: settings.googleAnalyticsPropertyId,
        siteUrl: settings.googleSearchConsoleSiteUrl,
        days: 30
      })
    });

    const result = await response.json();

    // Count synced keywords
    const keywordCount = await prisma.sEOKeyword.count({
      where: { isActive: true }
    });

    // Log the sync to database
    await prisma.sEOAuditLog.create({
      data: {
        action: 'automated_ga_sync',
        entityType: 'analytics',
        performedBy: 'system',
        changes: { 
          syncedAt: timestamp,
          success: result.success || false,
          dataPoints: result.metrics ? 1 : 0,
          warnings: result.warnings || [],
          keywordsSynced: keywordCount,
          apiResponse: result
        }
      }
    });

    const successMsg = result.success ? 'GA sync successful' : (result.error || 'GA sync failed');
    console.log(`[${timestamp}] ${successMsg} - Keywords synced: ${keywordCount}`);
    
    if (result.warnings && result.warnings.length > 0) {
      console.log(`[${timestamp}] Warnings:`, result.warnings);
    }
    
    // Log to file
    const logEntry = `[${timestamp}] ${result.success ? 'SUCCESS' : 'FAILURE'} - ${successMsg} - Keywords synced: ${keywordCount}\n`;
    fs.appendFileSync(logFile, logEntry);
    
    return { 
      success: result.success || false, 
      message: successMsg, 
      keywordsSynced: keywordCount,
      warnings: result.warnings 
    };
    
  } catch (error) {
    const errorMsg = error.message || 'Unknown error occurred';
    console.error(`[${timestamp}] ERROR:`, error);
    
    // Log error to file
    const logEntry = `[${timestamp}] FAILURE - Error: ${errorMsg}\nStack: ${error.stack}\n`;
    fs.appendFileSync(logFile, logEntry);
    
    return { success: false, message: errorMsg, keywordsSynced: 0, error: error.stack };
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the sync
runGASync()
  .then(result => {
    console.log('Sync completed:', result);
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
