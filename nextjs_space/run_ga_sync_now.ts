import { automatedGASync } from './lib/seo-automation';

async function run() {
  try {
    console.log('[Daily GA Sync] Starting automated sync...');
    const result = await automatedGASync();
    console.log('[Daily GA Sync] Result:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('[Daily GA Sync] ✓ Completed successfully');
      process.exit(0);
    } else {
      console.error('[Daily GA Sync] ✗ Failed:', result.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('[Daily GA Sync] ✗ Error:', error);
    process.exit(1);
  }
}

run();
