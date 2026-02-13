/**
 * Daily GA Sync Runner
 * Executes the automatedGASync function and logs results
 */

import { automatedGASync } from '../lib/seo-automation';
import { prisma } from '../lib/db';
import * as fs from 'fs';

async function runGASync() {
  const timestamp = new Date().toISOString();
  const logFile = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';
  
  try {
    console.log(`[${timestamp}] Starting automated GA sync...`);
    
    // Execute the sync
    const result = await automatedGASync();
    
    // Count synced keywords
    const keywordCount = await prisma.sEOKeyword.count({
      where: { isActive: true }
    });

    console.log(`[${timestamp}] ${result.message} - Keywords synced: ${keywordCount}`);
    
    // Log to file
    const logEntry = `[${timestamp}] ${result.success ? 'SUCCESS' : 'FAILURE'} - ${result.message} - Keywords synced: ${keywordCount}\n`;
    fs.appendFileSync(logFile, logEntry);
    
    return { ...result, keywordsSynced: keywordCount };
    
  } catch (error: any) {
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
