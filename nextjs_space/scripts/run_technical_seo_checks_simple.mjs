/**
 * Weekly Technical SEO Checks Script
 * Runs broken link detection and sitemap generation
 */

import pg from 'pg';
import { writeFileSync, appendFileSync } from 'fs';

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

/**
 * Check for broken links on the site
 */
async function checkBrokenLinks(client) {
  try {
    console.log('[SEO Automation] Checking for broken links...');
    
    // Get all pages
    const result = await client.query(
      `SELECT "pagePath" FROM "SEOPageConfig" WHERE status = 'active'`
    );
    const pages = result.rows;

    const brokenLinks = [];
    const baseUrl = 'https://thebasketballfactoryinc.com';

    for (const page of pages) {
      try {
        const response = await fetch(`${baseUrl}${page.pagePath}`, {
          method: 'HEAD',
          headers: { 'User-Agent': 'SEO-Automation-Bot/1.0' },
          timeout: 10000
        });

        if (response.status >= 400) {
          brokenLinks.push(`${page.pagePath} (${response.status})`);
          console.log(`  ❌ ${page.pagePath} - Status: ${response.status}`);
        } else {
          console.log(`  ✓ ${page.pagePath} - OK`);
        }
      } catch (error) {
        brokenLinks.push(`${page.pagePath} (unreachable)`);
        console.log(`  ❌ ${page.pagePath} - Unreachable: ${error.message}`);
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

/**
 * Generate XML sitemap
 */
async function generateSitemap(client) {
  try {
    const result = await client.query(
      `SELECT "pagePath", "updateFrequency", "updatedAt" 
       FROM "SEOPageConfig" 
       WHERE status = 'active'
       ORDER BY "pagePath"`
    );
    const pages = result.rows;

    const baseUrl = 'https://thebasketballfactoryinc.com';
    
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => {
  // Get priority based on page type
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
  
  console.log(`[${timestamp}] Starting Weekly Technical SEO Checks...`);
  
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');
    
    // Step 1: Check for broken links
    console.log('\nStep 1: Checking for broken links...');
    const brokenLinksResult = await checkBrokenLinks(client);
    
    console.log(`\nChecked ${brokenLinksResult.checked} pages, found ${brokenLinksResult.broken.length} broken links`);
    
    // Step 2: Save broken links report if any found
    if (brokenLinksResult.broken.length > 0) {
      console.log('\nStep 2: Saving broken links report...');
      const brokenLinksReport = `# Broken Links Report
**Date:** ${formatDateLong(new Date())}
**Pages Checked:** ${brokenLinksResult.checked}
**Broken Links Found:** ${brokenLinksResult.broken.length}

## Broken Links

${brokenLinksResult.broken.map((link, index) => {
  const [path, status] = link.split(' (');
  const statusCode = status.replace(')', '');
  return `${index + 1}. **${path}**
   - Status: \`${statusCode}\`
   - URL: https://thebasketballfactoryinc.com${path}`;
}).join('\n\n')}

## Recommendations

${brokenLinksResult.broken.length > 5 ? '⚠️ **CRITICAL:** More than 5 broken links detected. Immediate action required.\n\n' : ''}
- Review each broken link and determine if the page should be:
  - Fixed (if the page should exist)
  - Redirected (if the page has moved)
  - Removed (if the page is no longer needed)
- Update internal links pointing to broken pages
- Check for any external links that may have changed

---
*Generated automatically by SEO Automation System*
`;
      
      writeFileSync(`/home/ubuntu/seo_automation_logs/broken_links_${dateStr}.md`, brokenLinksReport);
      console.log(`Broken links report saved to /home/ubuntu/seo_automation_logs/broken_links_${dateStr}.md`);
    } else {
      console.log('\nStep 2: No broken links found, skipping report generation');
    }
    
    // Step 3: Generate sitemap
    console.log('\nStep 3: Generating XML sitemap...');
    const sitemapXml = await generateSitemap(client);
    
    if (sitemapXml) {
      // Step 4: Save sitemap to public directory
      console.log('Step 4: Saving sitemap to public directory...');
      writeFileSync('/home/ubuntu/rise_as_one_aau/nextjs_space/public/sitemap.xml', sitemapXml);
      console.log('Sitemap saved successfully');
      
      const urlCount = (sitemapXml.match(/<url>/g) || []).length;
      console.log(`Sitemap contains ${urlCount} URLs`);
    } else {
      console.error('Step 4: Failed to generate sitemap');
    }
    
    // Step 5: Log results
    console.log('\nStep 5: Logging technical check results...');
    const logEntry = `[${timestamp}] Technical SEO Check Complete
  - Pages Checked: ${brokenLinksResult.checked}
  - Broken Links Found: ${brokenLinksResult.broken.length}
  - Sitemap Generated: ${sitemapXml ? 'Yes' : 'No'}
  - Sitemap URL Count: ${sitemapXml ? (sitemapXml.match(/<url>/g) || []).length : 0}
${brokenLinksResult.broken.length > 0 ? `  - Broken Links: ${brokenLinksResult.broken.join(', ')}\n` : ''}
`;
    
    appendFileSync('/home/ubuntu/seo_automation_logs/technical_checks.log', logEntry);
    console.log('Results logged to technical_checks.log');
    
    // Step 6: Send alert email if broken links exceed 5
    if (brokenLinksResult.broken.length > 5) {
      console.log('\nStep 6: ⚠️  ALERT: Broken links exceed 5!');
      console.log(`${brokenLinksResult.broken.length} broken links detected - exceeds critical threshold`);
      console.log('Alert email should be sent to: khouston@thebasketballfactorynj.com');
      console.log('(Email functionality requires SMTP configuration)');
    } else {
      console.log('\nStep 6: Broken links below threshold, no alert email needed');
    }
    
    console.log('\n✅ Weekly Technical SEO Checks completed successfully');
    
    await client.end();
    
    return {
      success: true,
      pagesChecked: brokenLinksResult.checked,
      brokenLinksFound: brokenLinksResult.broken.length,
      sitemapGenerated: !!sitemapXml
    };
    
  } catch (error) {
    console.error('Error during technical SEO checks:', error);
    
    const errorLog = `[${timestamp}] Technical SEO Check FAILED
  - Error: ${error instanceof Error ? error.message : String(error)}
  - Stack: ${error instanceof Error ? error.stack : 'N/A'}
`;
    
    appendFileSync('/home/ubuntu/seo_automation_logs/technical_checks.log', errorLog);
    
    try {
      await client.end();
    } catch (e) {
      // Ignore disconnect errors
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Run the checks
runTechnicalSEOChecks()
  .then(result => {
    console.log('\n' + '='.repeat(60));
    console.log('FINAL RESULT:');
    console.log(JSON.stringify(result, null, 2));
    console.log('='.repeat(60));
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
