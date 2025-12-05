"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const prisma = new client_1.PrismaClient();
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
                    headers: { 'User-Agent': 'SEO-Automation-Bot/1.0' }
                });
                if (response.status >= 400) {
                    brokenLinks.push(`${page.pagePath} (${response.status})`);
                }
            }
            catch (error) {
                brokenLinks.push(`${page.pagePath} (unreachable)`);
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
    }
    catch (error) {
        console.error('[SEO Automation] Broken link check failed:', error);
        return { broken: [], checked: 0 };
    }
}
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
            const lastmod = page.updatedAt ? (0, date_fns_1.format)(new Date(page.updatedAt), 'yyyy-MM-dd') : (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd');
            return `  <url>
    <loc>${baseUrl}${page.pagePath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
        }).join('\n')}
</urlset>`;
        return sitemapXml;
    }
    catch (error) {
        console.error('[SEO Automation] Sitemap generation failed:', error);
        return '';
    }
}
async function runTechnicalSEOCheck() {
    const date = (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd');
    const logDir = '/home/ubuntu/seo_automation_logs';
    // Ensure log directory exists
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    console.log('=== Starting Weekly Technical SEO Check ===');
    console.log(`Date: ${date}`);
    // Step 1: Check for broken links
    console.log('\n[Step 1] Checking for broken links...');
    const brokenLinksResult = await checkBrokenLinks();
    console.log(`Checked ${brokenLinksResult.checked} pages`);
    console.log(`Found ${brokenLinksResult.broken.length} broken links`);
    // Step 2: Save broken links if found
    if (brokenLinksResult.broken.length > 0) {
        console.log('\n[Step 2] Saving broken links report...');
        const brokenLinksPath = path.join(logDir, `broken_links_${date}.md`);
        const brokenLinksContent = `# Broken Links Report
**Date:** ${date}
**Total Pages Checked:** ${brokenLinksResult.checked}
**Broken Links Found:** ${brokenLinksResult.broken.length}

## Broken Links

${brokenLinksResult.broken.map((link, index) => {
            const [url, status] = link.split(' (');
            const statusCode = status?.replace(')', '') || 'unknown';
            return `${index + 1}. [${url}](https://thebasketballfactoryinc.com${url}) - Status: ${statusCode}`;
        }).join('\n')}

---
*Generated by SEO Automation System*
`;
        fs.writeFileSync(brokenLinksPath, brokenLinksContent);
        console.log(`Broken links report saved to: ${brokenLinksPath}`);
    }
    else {
        console.log('\n[Step 2] No broken links found - skipping report generation');
    }
    // Step 3: Generate sitemap
    console.log('\n[Step 3] Generating XML sitemap...');
    const sitemapXml = await generateSitemap();
    if (sitemapXml) {
        console.log('Sitemap generated successfully');
        // Step 4: Save sitemap
        console.log('\n[Step 4] Saving sitemap to public directory...');
        const sitemapPath = '/home/ubuntu/rise_as_one_aau/nextjs_space/public/sitemap.xml';
        fs.writeFileSync(sitemapPath, sitemapXml);
        console.log(`Sitemap saved to: ${sitemapPath}`);
    }
    else {
        console.error('Failed to generate sitemap');
    }
    // Step 5: Log results
    console.log('\n[Step 5] Logging technical check results...');
    const logPath = path.join(logDir, 'technical_checks.log');
    const logEntry = `[${new Date().toISOString()}] Technical SEO Check - Pages Checked: ${brokenLinksResult.checked}, Broken Links: ${brokenLinksResult.broken.length}, Sitemap: ${sitemapXml ? 'Generated' : 'Failed'}\n`;
    fs.appendFileSync(logPath, logEntry);
    console.log(`Log entry added to: ${logPath}`);
    // Step 6: Send alert email if broken links exceed 5
    if (brokenLinksResult.broken.length > 5) {
        console.log('\n[Step 6] Broken links exceed threshold (>5)');
        console.log('⚠️ ALERT: Email notification would be sent to khouston@thebasketballfactorynj.com');
        console.log(`Subject: 🚨 Technical SEO Alert: ${brokenLinksResult.broken.length} Broken Links Detected`);
        // Save email content to file for reference
        const emailContent = `# Technical SEO Alert Email

**To:** khouston@thebasketballfactorynj.com
**Subject:** 🚨 Technical SEO Alert: ${brokenLinksResult.broken.length} Broken Links Detected
**Date:** ${date}

## Alert Details

- **Total Pages Checked:** ${brokenLinksResult.checked}
- **Broken Links Found:** ${brokenLinksResult.broken.length}

## Broken Links:

${brokenLinksResult.broken.map((link, index) => {
            const [url, status] = link.split(' (');
            const statusCode = status?.replace(')', '') || 'unknown';
            return `${index + 1}. [${url}](https://thebasketballfactoryinc.com${url}) - Status: ${statusCode}`;
        }).join('\n')}

Please review and fix these broken links as soon as possible.

---
*This alert was generated automatically by the SEO Automation System*
`;
        const emailPath = path.join(logDir, `broken_links_alert_${date}.md`);
        fs.writeFileSync(emailPath, emailContent);
        console.log(`Alert email content saved to: ${emailPath}`);
    }
    else {
        console.log('\n[Step 6] Broken links below threshold - no alert email needed');
    }
    console.log('\n=== Technical SEO Check Complete ===');
    await prisma.$disconnect();
    return {
        date,
        pagesChecked: brokenLinksResult.checked,
        brokenLinksFound: brokenLinksResult.broken.length,
        sitemapGenerated: !!sitemapXml
    };
}
runTechnicalSEOCheck()
    .then(result => {
    console.log('\n✅ Summary:', result);
    process.exit(0);
})
    .catch(error => {
    console.error('❌ Technical SEO check failed:', error);
    process.exit(1);
});
