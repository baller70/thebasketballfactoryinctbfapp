/**
 * Weekly Technical SEO Checks Runner
 * Executes broken link checks and sitemap generation
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Check for broken links
async function checkBrokenLinks() {
  try {
    console.log('[SEO Automation] Checking for broken links...');
    
    // Get all pages
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
          brokenLinks.push({
            url: `${baseUrl}${page.pagePath}`,
            path: page.pagePath,
            status: response.status,
            statusText: response.statusText
          });
        }
      } catch (error) {
        brokenLinks.push({
          url: `${baseUrl}${page.pagePath}`,
          path: page.pagePath,
          status: 'unreachable',
          statusText: error.message
        });
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
    console.error('[SEO Automation] Broken link check failed:', error);
    return { broken: [], checked: 0 };
  }
}

// Generate XML sitemap
async function generateSitemap() {
  try {
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' }
    });

    const baseUrl = 'https://thebasketballfactoryinc.com';
    
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => {
  // Get priority based on page type
  const priority = page.pagePath === '/' ? '1.0' : 
    page.pagePath.startsWith('/programs/') ? '0.8' : '0.6';
  
  const changefreq = page.updateFrequency || 'weekly';
  const lastmod = page.updatedAt ? new Date(page.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

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

// Send alert email
async function sendAlertEmail(brokenLinks) {
  try {
    const nodemailer = require('nodemailer');
    
    // Create transporter (using environment variables or default config)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: #dc2626; color: white; padding: 20px; }
    .content { padding: 20px; }
    .broken-link { background: #fee2e2; border-left: 4px solid #dc2626; padding: 10px; margin: 10px 0; }
    .link-url { font-weight: bold; color: #dc2626; }
    .status { color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚨 Broken Links Alert</h1>
    <p>The Basketball Factory Inc. - Technical SEO Check</p>
  </div>
  <div class="content">
    <p><strong>Alert:</strong> ${brokenLinks.length} broken links detected on your website.</p>
    <p>The following pages are returning errors or are unreachable:</p>
    
    ${brokenLinks.map(link => `
      <div class="broken-link">
        <div class="link-url">${link.url}</div>
        <div class="status">Status: ${link.status} - ${link.statusText}</div>
      </div>
    `).join('')}
    
    <p><strong>Action Required:</strong> Please review and fix these broken links to maintain SEO health.</p>
    <p>Full details are available in the broken links report.</p>
  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@thebasketballfactoryinc.com',
      to: 'khouston@thebasketballfactorynj.com',
      subject: `🚨 Broken Links Alert - ${brokenLinks.length} Issues Detected`,
      html: emailHtml
    });

    console.log('[SEO Automation] Alert email sent successfully');
    return true;
  } catch (error) {
    console.error('[SEO Automation] Failed to send alert email:', error);
    return false;
  }
}

// Main execution
async function main() {
  const timestamp = new Date().toISOString();
  const dateStr = new Date().toISOString().split('T')[0];
  
  console.log(`\n========================================`);
  console.log(`Weekly Technical SEO Checks`);
  console.log(`Started at: ${timestamp}`);
  console.log(`========================================\n`);

  let logContent = `# Weekly Technical SEO Check\n\n`;
  logContent += `**Date:** ${timestamp}\n\n`;

  try {
    // Step 1: Check for broken links
    console.log('Step 1: Checking for broken links...');
    const brokenLinksResult = await checkBrokenLinks();
    
    logContent += `## Broken Links Check\n\n`;
    logContent += `- **Pages Checked:** ${brokenLinksResult.checked}\n`;
    logContent += `- **Broken Links Found:** ${brokenLinksResult.broken.length}\n\n`;

    // Step 2: Save broken links report if any found
    if (brokenLinksResult.broken.length > 0) {
      console.log(`Step 2: Saving broken links report (${brokenLinksResult.broken.length} issues found)...`);
      
      let brokenLinksReport = `# Broken Links Report\n\n`;
      brokenLinksReport += `**Date:** ${dateStr}\n`;
      brokenLinksReport += `**Total Broken Links:** ${brokenLinksResult.broken.length}\n\n`;
      brokenLinksReport += `## Broken Links\n\n`;
      
      brokenLinksResult.broken.forEach((link, index) => {
        brokenLinksReport += `### ${index + 1}. ${link.path}\n\n`;
        brokenLinksReport += `- **URL:** [${link.url}](${link.url})\n`;
        brokenLinksReport += `- **Status:** ${link.status}\n`;
        brokenLinksReport += `- **Error:** ${link.statusText}\n\n`;
      });

      const brokenLinksPath = `/home/ubuntu/seo_automation_logs/broken_links_${dateStr}.md`;
      fs.writeFileSync(brokenLinksPath, brokenLinksReport);
      console.log(`✓ Broken links report saved to: ${brokenLinksPath}`);
      
      logContent += `- **Report Saved:** broken_links_${dateStr}.md\n\n`;
    } else {
      console.log('Step 2: No broken links found, skipping report generation.');
      logContent += `- **Status:** No broken links detected ✓\n\n`;
    }

    // Step 3: Generate sitemap
    console.log('Step 3: Generating XML sitemap...');
    const sitemapXml = await generateSitemap();
    
    if (sitemapXml) {
      logContent += `## Sitemap Generation\n\n`;
      logContent += `- **Status:** Success ✓\n`;
      
      // Step 4: Save sitemap
      console.log('Step 4: Saving sitemap to public directory...');
      const sitemapPath = '/home/ubuntu/rise_as_one_aau/nextjs_space/public/sitemap.xml';
      fs.writeFileSync(sitemapPath, sitemapXml);
      console.log(`✓ Sitemap saved to: ${sitemapPath}`);
      
      const urlCount = (sitemapXml.match(/<url>/g) || []).length;
      logContent += `- **URLs Included:** ${urlCount}\n`;
      logContent += `- **Location:** /public/sitemap.xml\n\n`;
    } else {
      logContent += `## Sitemap Generation\n\n`;
      logContent += `- **Status:** Failed ✗\n\n`;
    }

    // Step 5: Save technical checks log
    console.log('Step 5: Saving technical checks log...');
    const logPath = '/home/ubuntu/seo_automation_logs/technical_checks.log';
    const logEntry = `[${timestamp}] Pages Checked: ${brokenLinksResult.checked} | Broken Links: ${brokenLinksResult.broken.length} | Sitemap: ${sitemapXml ? 'Generated' : 'Failed'}\n`;
    fs.appendFileSync(logPath, logEntry);
    console.log(`✓ Log entry added to: ${logPath}`);

    // Step 6: Send alert email if broken links exceed 5
    if (brokenLinksResult.broken.length > 5) {
      console.log(`Step 6: Sending alert email (${brokenLinksResult.broken.length} broken links exceed threshold)...`);
      const emailSent = await sendAlertEmail(brokenLinksResult.broken);
      
      logContent += `## Alert Email\n\n`;
      logContent += `- **Threshold Exceeded:** Yes (${brokenLinksResult.broken.length} > 5)\n`;
      logContent += `- **Email Sent:** ${emailSent ? 'Yes ✓' : 'Failed ✗'}\n`;
      logContent += `- **Recipient:** khouston@thebasketballfactorynj.com\n\n`;
    } else {
      console.log('Step 6: Broken links below threshold, no alert email needed.');
      logContent += `## Alert Email\n\n`;
      logContent += `- **Threshold Exceeded:** No (${brokenLinksResult.broken.length} ≤ 5)\n`;
      logContent += `- **Email Sent:** Not required\n\n`;
    }

    // Save summary report
    logContent += `## Summary\n\n`;
    logContent += `✓ Technical SEO checks completed successfully\n`;
    
    const summaryPath = `/home/ubuntu/seo_automation_logs/weekly_check_${dateStr}.md`;
    fs.writeFileSync(summaryPath, logContent);
    console.log(`\n✓ Summary report saved to: ${summaryPath}`);

    console.log(`\n========================================`);
    console.log(`Weekly Technical SEO Checks Completed`);
    console.log(`========================================\n`);

  } catch (error) {
    console.error('\n✗ Error during SEO checks:', error);
    
    logContent += `## Error\n\n`;
    logContent += `\`\`\`\n${error.message}\n\`\`\`\n`;
    
    const summaryPath = `/home/ubuntu/seo_automation_logs/weekly_check_${dateStr}.md`;
    fs.writeFileSync(summaryPath, logContent);
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
