/**
 * Weekly Technical SEO Checks Script
 * Standalone version with minimal dependencies
 * 
 * This script performs:
 * 1. Broken link detection across all active pages
 * 2. XML sitemap generation
 * 3. Logging of results
 * 4. Alert generation if broken links exceed threshold
 * 
 * Usage: node scripts/technical_seo_check_standalone.mjs
 */

import { writeFileSync, appendFileSync, mkdirSync, existsSync } from 'fs';
import pg from 'pg';

const { Client } = pg;

const DATABASE_URL = 'postgresql://role_da1a5943:VknB0BsUhy0m5vqg9B8LY0drt50cg8nM@db-da1a5943.db002.hosteddb.reai.io:5432/da1a5943?connect_timeout=15';

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateLong(date) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

async function checkBrokenLinks(client) {
  try {
    console.log('[Step 1] Checking for broken links...');
    
    const result = await client.query(
      `SELECT "pagePath" FROM "SEOPageConfig" WHERE status = 'active'`
    );
    const pages = result.rows;

    const brokenLinks = [];
    const baseUrl = 'https://thebasketballfactoryinc.com';

    for (const page of pages) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`${baseUrl}${page.pagePath}`, {
          method: 'HEAD',
          headers: { 'User-Agent': 'SEO-Automation-Bot/1.0' },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (response.status >= 400) {
          brokenLinks.push(`${page.pagePath} (${response.status})`);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          brokenLinks.push(`${page.pagePath} (timeout)`);
        } else {
          brokenLinks.push(`${page.pagePath} (unreachable)`);
        }
      }
    }

    if (brokenLinks.length > 0) {
      await client.query(
        `INSERT INTO "SEOAuditLog" (action, "entityType", "performedBy", changes, "createdAt")
         VALUES ($1, $2, $3, $4, NOW())`,
        ['broken_links_detected', 'technical', 'system', JSON.stringify({ brokenLinks, checkedPages: pages.length })]
      );
    }

    return { broken: brokenLinks, checked: pages.length };
  } catch (error) {
    console.error('[SEO Automation] Broken link check failed:', error);
    return { broken: [], checked: 0 };
  }
}

async function generateSitemap(client) {
  try {
    console.log('[Step 3] Generating XML sitemap...');
    
    const result = await client.query(
      `SELECT "pagePath", "updatedAt", "updateFrequency" 
       FROM "SEOPageConfig" 
       WHERE status = 'active'
       ORDER BY "pagePath"`
    );
    const pages = result.rows;

    const baseUrl = 'https://thebasketballfactoryinc.com';
    
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => {
  const priority = page.pagePath === '/' ? '1.0' : 
    page.pagePath.startsWith('/programs/') ? '0.8' : '0.6';
  
  const changefreq = page.updateFrequency || 'weekly';
  const lastmod = page.updatedAt ? formatDate(new Date(page.updatedAt)) : formatDate(new Date());

  return `  <url>
    <loc>${baseUrl}${page.pagePath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n')}
</urlset>`;

    return sitemapXml;
  } catch (error) {
    console.error('[SEO Automation] Sitemap generation failed:', error);
    return '';
  }
}

async function runTechnicalSEOChecks() {
  const timestamp = new Date().toISOString();
  const dateStr = formatDate(new Date());
  const logDir = '/home/ubuntu/seo_automation_logs';
  
  // Ensure log directory exists
  if (!existsSync(logDir)) {
    mkdirSync(logDir, { recursive: true });
  }

  console.log('=== Starting Weekly Technical SEO Check ===');
  console.log(`Date: ${dateStr}`);
  console.log(`Timestamp: ${timestamp}\n`);
  
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('✓ Database connected\n');
    
    // Step 1: Check for broken links
    const brokenLinksResult = await checkBrokenLinks(client);
    console.log(`✓ Checked ${brokenLinksResult.checked} pages`);
    console.log(`✓ Found ${brokenLinksResult.broken.length} broken links\n`);
    
    // Step 2: Save broken links report if any found
    if (brokenLinksResult.broken.length > 0) {
      console.log('[Step 2] Saving broken links report...');
      const brokenLinksPath = `${logDir}/broken_links_${dateStr}.md`;
      
      const brokenLinksContent = `# Broken Links Report
**Date:** ${formatDateLong(new Date())}
**Total Pages Checked:** ${brokenLinksResult.checked}
**Broken Links Found:** ${brokenLinksResult.broken.length}

## Broken Links

${brokenLinksResult.broken.map((link, index) => {
  const [url, status] = link.split(' (');
  const statusCode = status?.replace(')', '') || 'unknown';
  return `${index + 1}. [${url}](https://thebasketballfactoryinc.com${url}) - Status: \`${statusCode}\``;
}).join('\n')}

## Recommendations

${brokenLinksResult.broken.length > 5 ? '⚠️ **CRITICAL:** More than 5 broken links detected. Immediate action required.\n\n' : ''}
- Review each broken link and determine if the page should be:
  - Fixed (if the page should exist)
  - Redirected (if the page has moved)
  - Removed (if the page is no longer needed)
- Update internal links pointing to broken pages
- Check for any external links that may have changed

---
*Generated by SEO Automation System*
`;
      
      writeFileSync(brokenLinksPath, brokenLinksContent);
      console.log(`✓ Broken links report saved to: ${brokenLinksPath}\n`);
    } else {
      console.log('[Step 2] No broken links found - skipping report generation\n');
    }
    
    // Step 3 & 4: Generate and save sitemap
    const sitemapXml = await generateSitemap(client);
    
    if (sitemapXml) {
      console.log('[Step 4] Saving sitemap to public directory...');
      const sitemapPath = '/home/ubuntu/rise_as_one_aau/nextjs_space/public/sitemap.xml';
      writeFileSync(sitemapPath, sitemapXml);
      const urlCount = (sitemapXml.match(/<url>/g) || []).length;
      console.log(`✓ Sitemap saved with ${urlCount} URLs: ${sitemapPath}\n`);
    } else {
      console.error('✗ Failed to generate sitemap\n');
    }
    
    // Step 5: Log results
    console.log('[Step 5] Logging technical check results...');
    const logPath = `${logDir}/technical_checks.log`;
    const logEntry = `[${timestamp}] Technical SEO Check - Pages Checked: ${brokenLinksResult.checked}, Broken Links: ${brokenLinksResult.broken.length}, Sitemap: ${sitemapXml ? 'Generated' : 'Failed'}\n`;
    
    appendFileSync(logPath, logEntry);
    console.log(`✓ Log entry added to: ${logPath}\n`);
    
    // Step 6: Alert if broken links exceed 5
    if (brokenLinksResult.broken.length > 5) {
      console.log('[Step 6] ⚠️  ALERT: Broken links exceed threshold (>5)');
      console.log(`Email notification should be sent to: khouston@thebasketballfactorynj.com`);
      console.log(`Subject: 🚨 Technical SEO Alert: ${brokenLinksResult.broken.length} Broken Links Detected\n`);
      
      // Save email content for reference
      const emailContent = `# Technical SEO Alert Email

**To:** khouston@thebasketballfactorynj.com
**Subject:** 🚨 Technical SEO Alert: ${brokenLinksResult.broken.length} Broken Links Detected
**Date:** ${formatDateLong(new Date())}

## Alert Details

- **Total Pages Checked:** ${brokenLinksResult.checked}
- **Broken Links Found:** ${brokenLinksResult.broken.length}
- **Threshold:** 5 broken links
- **Status:** ⚠️ CRITICAL - Immediate action required

## Broken Links:

${brokenLinksResult.broken.map((link, index) => {
  const [url, status] = link.split(' (');
  const statusCode = status?.replace(')', '') || 'unknown';
  return `${index + 1}. [${url}](https://thebasketballfactoryinc.com${url}) - Status: \`${statusCode}\``;
}).join('\n')}

## Recommended Actions:

1. Review each broken link and determine the appropriate fix
2. Update or redirect pages as needed
3. Check internal links pointing to these pages
4. Verify external links haven't changed

## Full Report

View the complete report at: \`/home/ubuntu/seo_automation_logs/broken_links_${dateStr}.md\`

---
*This alert was generated automatically by the SEO Automation System*
*For more details, visit the [SEO Dashboard](https://thebasketballfactoryinc.com/admin/seo)*
`;
      
      const emailPath = `${logDir}/broken_links_alert_${dateStr}.md`;
      writeFileSync(emailPath, emailContent);
      console.log(`✓ Alert email content saved to: ${emailPath}\n`);
    } else {
      console.log('[Step 6] Broken links below threshold - no alert email needed\n');
    }
    
    console.log('=== Technical SEO Check Complete ===\n');
    
    return {
      success: true,
      date: dateStr,
      pagesChecked: brokenLinksResult.checked,
      brokenLinksFound: brokenLinksResult.broken.length,
      sitemapGenerated: !!sitemapXml,
      alertSent: brokenLinksResult.broken.length > 5
    };
    
  } catch (error) {
    console.error('✗ Error during technical SEO checks:', error);
    
    const errorLog = `[${timestamp}] Technical SEO Check FAILED - Error: ${error.message}\n`;
    appendFileSync(`${logDir}/technical_checks.log`, errorLog);
    
    return {
      success: false,
      error: error.message
    };
  } finally {
    await client.end();
  }
}

// Run the checks
runTechnicalSEOChecks()
  .then(result => {
    console.log('✅ Final Result:', JSON.stringify(result, null, 2));
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
