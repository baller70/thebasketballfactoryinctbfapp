/**
 * Simple Daily Google Analytics Sync
 * Uses direct imports from the Next.js app
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();
const LOG_FILE = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';

function logToFile(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  try {
    fs.appendFileSync(LOG_FILE, logEntry);
    console.log(logEntry.trim());
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

async function runSync() {
  logToFile('=== Daily GA Sync Started ===');
  
  try {
    // Check if Google Analytics is configured
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings) {
      throw new Error('SEO Settings not found in database');
    }
    
    if (!settings.googleAuthTokens || !settings.googleAnalyticsPropertyId || !settings.googleSearchConsoleSiteUrl) {
      throw new Error('Google Analytics not configured - missing tokens or property ID');
    }
    
    logToFile(`Google Analytics Property ID: ${settings.googleAnalyticsPropertyId}`);
    logToFile(`Search Console Site URL: ${settings.googleSearchConsoleSiteUrl}`);
    
    // Get keyword count
    const keywordCount = await prisma.sEOKeyword.count({
      where: { isActive: true }
    });
    
    logToFile(`Active keywords being tracked: ${keywordCount}`);
    
    // Get recent performance data
    const recentPerformance = await prisma.sEOPerformance.findMany({
      orderBy: { date: 'desc' },
      take: 1
    });
    
    if (recentPerformance.length > 0) {
      const latest = recentPerformance[0];
      logToFile(`Latest performance data from: ${latest.date.toISOString().split('T')[0]}`);
      logToFile(`  - Impressions: ${latest.impressions}`);
      logToFile(`  - Clicks: ${latest.clicks}`);
      logToFile(`  - CTR: ${latest.ctr ? (latest.ctr * 100).toFixed(2) : '0.00'}%`);
      logToFile(`  - Avg Position: ${latest.avgPosition ? latest.avgPosition.toFixed(2) : 'N/A'}`);
    }
    
    // Call the API endpoint to trigger sync
    const apiUrl = 'http://localhost:3000/api/seo/sync-analytics';
    logToFile(`Calling sync API: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ days: 30 })
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      logToFile(`SUCCESS: ${result.message || 'GA sync completed'}`);
      logToFile(`Keywords synced: ${keywordCount}`);
      logToFile('=== Daily GA Sync Completed Successfully ===\n');
      process.exit(0);
    } else {
      throw new Error(result.error || result.message || 'Sync failed');
    }
    
  } catch (error) {
    logToFile(`FAILURE: ${error.message}`);
    logToFile(`Stack: ${error.stack}`);
    logToFile('=== Daily GA Sync Failed ===\n');
    
    // Note: Email sending would require additional setup
    logToFile('Alert: Email notification should be sent to khouston@thebasketballfactorynj.com');
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runSync();
