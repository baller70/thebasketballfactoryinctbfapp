/**
 * Weekly SEO Report Script
 * Sends comprehensive SEO report every Monday at 9 AM
 */

import { sendWeeklySEOReport, checkBrokenLinks, generateSitemap } from '../lib/seo-automation';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function main() {
  console.log('='.repeat(60));
  console.log('WEEKLY SEO REPORT - Starting...');
  console.log('Time:', new Date().toISOString());
  console.log('='.repeat(60));

  const recipientEmail = 'khouston@thebasketballfactorynj.com';

  try {
    // 1. Generate and send weekly report
    console.log('\n📧 Sending weekly SEO report...');
    const reportSent = await sendWeeklySEOReport(recipientEmail);
    
    if (reportSent) {
      console.log(`✅ Weekly report sent to ${recipientEmail}`);
    } else {
      console.log('❌ Failed to send weekly report');
    }

    // 2. Check for broken links
    console.log('\n🔍 Checking for broken links...');
    const linkCheck = await checkBrokenLinks();
    console.log(`✅ Checked ${linkCheck.checked} pages`);
    
    if (linkCheck.broken.length > 0) {
      console.log(`⚠️  Found ${linkCheck.broken.length} broken links:`);
      linkCheck.broken.forEach(link => console.log(`   - ${link}`));
    } else {
      console.log('✅ No broken links found');
    }

    // 3. Generate sitemap
    console.log('\n🗺️  Generating XML sitemap...');
    const sitemap = await generateSitemap();
    
    if (sitemap) {
      const sitemapPath = join(process.cwd(), 'public', 'sitemap.xml');
      writeFileSync(sitemapPath, sitemap);
      console.log(`✅ Sitemap generated at ${sitemapPath}`);
    } else {
      console.log('❌ Failed to generate sitemap');
    }

  } catch (error: any) {
    console.error('❌ CRITICAL ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }

  console.log('\n' + '='.repeat(60));
  console.log('Weekly SEO Report completed successfully');
  console.log('='.repeat(60));
}

main();
