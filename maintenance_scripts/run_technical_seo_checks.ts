import { prisma } from './lib/db';
import * as fs from 'fs';
import * as path from 'path';

interface BrokenLink {
  url: string;
  statusCode: number;
  foundOn: string[];
}

interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: string;
  priority: number;
}

async function checkBrokenLinks(): Promise<BrokenLink[]> {
  console.log('Checking for broken links...');
  
  try {
    // Get all pages from the database
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' },
      select: { pagePath: true, pageName: true }
    });

    const brokenLinks: BrokenLink[] = [];
    const baseUrl = 'https://riseasoneau.abacusai.app';
    
    console.log(`Checking ${pages.length} pages for broken links...`);
    
    // Check each page
    for (const page of pages) {
      const pageUrl = `${baseUrl}${page.pagePath}`;
      
      try {
        const response = await fetch(pageUrl, { 
          method: 'HEAD',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; SEO-Bot/1.0)'
          }
        });
        
        if (response.status >= 400) {
          console.log(`❌ ${pageUrl} - Status: ${response.status}`);
          brokenLinks.push({
            url: pageUrl,
            statusCode: response.status,
            foundOn: [page.pageName]
          });
        } else {
          console.log(`✓ ${pageUrl} - Status: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ ${pageUrl} - Network error`);
        brokenLinks.push({
          url: pageUrl,
          statusCode: 0,
          foundOn: [page.pageName + ' - Network error']
        });
      }
    }

    console.log(`\nFound ${brokenLinks.length} broken links out of ${pages.length} pages checked`);
    return brokenLinks;
  } catch (error) {
    console.error('Error checking broken links:', error);
    throw error;
  }
}

async function generateSitemap(): Promise<string> {
  console.log('Generating sitemap...');
  
  try {
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' },
      select: { 
        pagePath: true, 
        pageName: true,
        updatedAt: true,
        updateFrequency: true
      },
      orderBy: { updatedAt: 'desc' }
    });

    const baseUrl = 'https://riseasoneau.abacusai.app';
    const entries: SitemapEntry[] = [];

    // Add all pages
    for (const page of pages) {
      const priority = page.pagePath === '/' ? 1.0 : 
                      page.pagePath.includes('program') ? 0.9 :
                      page.pagePath.includes('about') || page.pagePath.includes('contact') ? 0.8 : 0.7;
      
      const changeFreq = page.updateFrequency || 'weekly';

      entries.push({
        url: `${baseUrl}${page.pagePath}`,
        lastModified: page.updatedAt,
        changeFrequency: changeFreq,
        priority: priority
      });
    }

    // Generate XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const entry of entries) {
      xml += '  <url>\n';
      xml += `    <loc>${entry.url}</loc>\n`;
      xml += `    <lastmod>${entry.lastModified.toISOString()}</lastmod>\n`;
      xml += `    <changefreq>${entry.changeFrequency}</changefreq>\n`;
      xml += `    <priority>${entry.priority}</priority>\n`;
      xml += '  </url>\n';
    }

    xml += '</urlset>';

    console.log(`Generated sitemap with ${entries.length} URLs`);
    return xml;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
}

async function main() {
  const timestamp = new Date().toISOString();
  const date = new Date().toISOString().split('T')[0];
  
  try {
    // Get total page count first
    const totalPages = await prisma.sEOPageConfig.count({
      where: { status: 'active' }
    });
    
    // Step 1 & 2: Check broken links
    const brokenLinks = await checkBrokenLinks();
    
    if (brokenLinks.length > 0) {
      // Save broken links report
      const logsDir = '/home/ubuntu/seo_automation_logs';
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      
      let markdown = `# Broken Links Report\n\n`;
      markdown += `**Date:** ${date}\n`;
      markdown += `**Total Pages Checked:** ${totalPages}\n`;
      markdown += `**Total Broken Links:** ${brokenLinks.length}\n\n`;
      markdown += `## Broken Links\n\n`;
      
      for (const link of brokenLinks) {
        markdown += `### [${link.url}](${link.url})\n`;
        markdown += `- **Status Code:** ${link.statusCode}\n`;
        markdown += `- **Found On:** ${link.foundOn.join(', ')}\n\n`;
      }
      
      const reportPath = path.join(logsDir, `broken_links_${date}.md`);
      fs.writeFileSync(reportPath, markdown);
      console.log(`Broken links report saved to: ${reportPath}`);
    }
    
    // Step 3 & 4: Generate and save sitemap
    const sitemapXml = await generateSitemap();
    const sitemapPath = '/home/ubuntu/rise_as_one_aau/nextjs_space/public/sitemap.xml';
    fs.writeFileSync(sitemapPath, sitemapXml);
    console.log(`Sitemap saved to: ${sitemapPath}`);
    
    // Step 5: Log results
    const logsDir = '/home/ubuntu/seo_automation_logs';
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    const logPath = path.join(logsDir, 'technical_checks.log');
    
    const logEntry = `[${timestamp}] Technical SEO Check Complete - Pages Checked: ${totalPages}, Broken Links: ${brokenLinks.length}, Sitemap Generated: YES\n`;
    fs.appendFileSync(logPath, logEntry);
    console.log(`Log entry added to: ${logPath}`);
    
    // Step 6: Check if alert needed
    if (brokenLinks.length > 5) {
      console.log(`\n⚠️  ALERT: ${brokenLinks.length} broken links found (threshold: 5)`);
      console.log('Email alert would be sent to: khouston@thebasketballfactorynj.com');
      console.log('Note: Email functionality requires SMTP configuration');
    }
    
    // Output summary
    const summary = {
      timestamp,
      pagesChecked: totalPages,
      brokenLinksFound: brokenLinks.length,
      sitemapGenerated: true,
      alertTriggered: brokenLinks.length > 5
    };
    
    console.log('\n=== TECHNICAL SEO CHECK SUMMARY ===');
    console.log(JSON.stringify(summary, null, 2));
    
  } catch (error) {
    console.error('Error in technical SEO checks:', error);
    throw error;
  }
}

main();
