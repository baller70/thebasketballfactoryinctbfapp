/**
 * Standalone Weekly Technical SEO Checks
 * Runs broken link detection and sitemap generation
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Format date helper
function formatDate(date, formatStr) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  if (formatStr === 'yyyy-MM-dd') {
    return `${year}-${month}-${day}`;
  } else if (formatStr === 'yyyy-MM-dd HH:mm:ss') {
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  return d.toISOString();
}

// Check broken links
async function checkBrokenLinks() {
  console.log('Checking for broken links...');
  
  try {
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' }
    });

    const brokenLinks = [];
    const baseUrl = 'https://thebasketballfactoryinc.com';

    for (const page of pages) {
      try {
        const response = await fetch(`${baseUrl}${page.pagePath}`, {
          method: 'HEAD',
          headers: { 'User-Agent': 'SEO-Automation-Bot/1.0' },
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        if (response.status >= 400) {
          brokenLinks.push(`${page.pagePath} (${response.status})`);
          console.log(`  ✗ ${page.pagePath} - Status ${response.status}`);
        } else {
          console.log(`  ✓ ${page.pagePath} - OK`);
        }
      } catch (error) {
        brokenLinks.push(`${page.pagePath} (unreachable)`);
        console.log(`  ✗ ${page.pagePath} - Unreachable: ${error.message}`);
      }
    }

    if (brokenLinks.length > 0) {
      await prisma.sEOAuditLog.create({
        data: {
          action: 'broken_links_detected',
          entityType: 'technical',
          performedBy: 'system',
          changes: { brokenLinks, checkedPages: pages.length }
        }
      });
    }

    return { broken: brokenLinks, checked: pages.length };
  } catch (error) {
    console.error('Error checking broken links:', error);
    return { broken: [], checked: 0 };
  }
}

// Generate sitemap
async function generateSitemap() {
  console.log('Generating XML sitemap...');
  
  try {
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' }
    });

    const baseUrl = 'https://thebasketballfactoryinc.com';
    
    const urlEntries = pages.map(page => {
      // Get priority based on page type
      const priority = page.pagePath === '/' ? '1.0' : 
        page.pagePath.startsWith('/programs/') ? '0.8' : '0.6';
      
      const changefreq = page.updateFrequency || 'weekly';
      const lastmod = page.updatedAt ? formatDate(page.updatedAt, 'yyyy-MM-dd') : formatDate(new Date(), 'yyyy-MM-dd');

      return `  <url>
    <loc>${baseUrl}${page.pagePath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    }).join('\n');

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

    return sitemapXml;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return '';
  }
}

// Send email alert (simplified version)
async function sendEmailAlert(brokenLinksCount, brokenLinks, date) {
  console.log(`Attempting to send alert email for ${brokenLinksCount} broken links...`);
  
  // Note: Email functionality requires proper email service configuration
  // This is a placeholder that logs the intent
  console.log('Email alert would be sent to: khouston@thebasketballfactorynj.com');
  console.log(`Subject: 🚨 CRITICAL: ${brokenLinksCount} Broken Links Detected`);
  console.log('Broken links:', brokenLinks.slice(0, 5).join(', '), brokenLinks.length > 5 ? '...' : '');
  
  // In production, this would use the actual email service
  // For now, we'll just log that an email should be sent
  return { success: false, message: 'Email service not configured in standalone mode' };
}

// Main function
async function runTechnicalSEOChecks() {
  const date = formatDate(new Date(), 'yyyy-MM-dd');
  const timestamp = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
  
  console.log(`[${timestamp}] Starting Weekly Technical SEO Checks...\n`);
  
  try {
    // Step 1 & 2: Check for broken links
    console.log('Step 1: Checking for broken links...');
    const brokenLinksResult = await checkBrokenLinks();
    
    console.log(`\nChecked ${brokenLinksResult.checked} pages, found ${brokenLinksResult.broken.length} broken links\n`);
    
    // Step 2: Save broken links if any found
    if (brokenLinksResult.broken.length > 0) {
      const brokenLinksReport = `# Broken Links Report - ${date}

**Generated:** ${timestamp}
**Pages Checked:** ${brokenLinksResult.checked}
**Broken Links Found:** ${brokenLinksResult.broken.length}

## Broken Links

${brokenLinksResult.broken.map((link, index) => {
  const [pagePath, status] = link.split(' (');
  const statusCode = status.replace(')', '');
  return `${index + 1}. **${pagePath}**
   - Status: \`${statusCode}\`
   - URL: https://thebasketballfactoryinc.com${pagePath}`;
}).join('\n\n')}

## Recommended Actions

${brokenLinksResult.broken.length > 5 ? '⚠️ **CRITICAL:** More than 5 broken links detected. Immediate action required.\n\n' : ''}
1. Review each broken link and determine if the page should be:
   - Fixed (if the page should exist)
   - Redirected (if the page has moved)
   - Removed (if the page is no longer needed)

2. Update internal links pointing to these pages

3. Set up proper 301 redirects for moved content

4. Update sitemap after fixes are applied

---
*This report was automatically generated by the SEO Automation System*
`;

      const logsDir = '/home/ubuntu/seo_automation_logs';
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }

      fs.writeFileSync(path.join(logsDir, `broken_links_${date}.md`), brokenLinksReport);
      console.log(`✓ Broken links report saved to ${logsDir}/broken_links_${date}.md\n`);
    } else {
      console.log('✓ No broken links found\n');
    }
    
    // Step 3: Generate sitemap
    console.log('Step 3: Generating XML sitemap...');
    const sitemapXml = await generateSitemap();
    
    if (sitemapXml) {
      // Step 4: Save sitemap
      const sitemapPath = '/home/ubuntu/rise_as_one_aau/nextjs_space/public/sitemap.xml';
      fs.writeFileSync(sitemapPath, sitemapXml);
      console.log(`✓ Sitemap generated and saved to ${sitemapPath}\n`);
    } else {
      console.error('✗ Failed to generate sitemap\n');
    }
    
    // Step 5: Log results
    const logEntry = `[${timestamp}] Technical SEO Check Complete
  - Pages Checked: ${brokenLinksResult.checked}
  - Broken Links Found: ${brokenLinksResult.broken.length}
  - Sitemap Generated: ${sitemapXml ? 'Yes' : 'No'}
  - Status: ${brokenLinksResult.broken.length > 5 ? 'ALERT - Critical' : 'OK'}
\n`;
    
    const logPath = '/home/ubuntu/seo_automation_logs/technical_checks.log';
    fs.appendFileSync(logPath, logEntry);
    console.log(`✓ Results logged to ${logPath}\n`);
    
    // Step 6: Send alert email if broken links exceed 5
    if (brokenLinksResult.broken.length > 5) {
      console.log('Step 6: Sending alert email (broken links > 5)...');
      const emailResult = await sendEmailAlert(brokenLinksResult.broken.length, brokenLinksResult.broken, date);
      
      if (emailResult.success) {
        console.log('✓ Alert email sent successfully\n');
      } else {
        console.log(`⚠ Email alert not sent: ${emailResult.message}\n`);
      }
    } else {
      console.log('Step 6: Skipped (broken links <= 5)\n');
    }
    
    console.log('=== Technical SEO Check Complete ===');
    console.log(`Pages Checked: ${brokenLinksResult.checked}`);
    console.log(`Broken Links: ${brokenLinksResult.broken.length}`);
    console.log(`Sitemap: ${sitemapXml ? 'Generated' : 'Failed'}`);
    console.log(`Status: ${brokenLinksResult.broken.length > 5 ? '🚨 CRITICAL' : '✓ OK'}`);
    
  } catch (error) {
    console.error('Error during technical SEO checks:', error);
    
    // Log the error
    const errorLog = `[${timestamp}] Technical SEO Check FAILED
  - Error: ${error.message}
\n`;
    fs.appendFileSync('/home/ubuntu/seo_automation_logs/technical_checks.log', errorLog);
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the checks
runTechnicalSEOChecks().catch(console.error);
