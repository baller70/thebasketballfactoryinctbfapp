/**
 * Daily Google Analytics Sync Script
 * Automatically syncs GA data every day at 2 AM
 */

import { automatedGASync } from './lib/seo-automation';

async function main() {
  console.log('='.repeat(60));
  console.log('DAILY GA SYNC - Starting...');
  console.log('Time:', new Date().toISOString());
  console.log('='.repeat(60));

  try {
    const result = await automatedGASync();
    
    if (result.success) {
      console.log('✅ SUCCESS:', result.message);
    } else {
      console.log('❌ FAILED:', result.message);
    }
  } catch (error: any) {
    console.error('❌ CRITICAL ERROR:', error.message);
    process.exit(1);
  }

  console.log('='.repeat(60));
  console.log('Daily GA Sync completed');
  console.log('='.repeat(60));
}

main();
