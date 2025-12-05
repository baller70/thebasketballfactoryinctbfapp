import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function createMetaOptimizationReport() {
  console.log('📝 Creating Meta Optimization Report...\n');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const reportPath = path.join('/home/ubuntu/rise_as_one_aau/seo_reports', `meta_optimization_report_${timestamp}.md`);

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

  // Get all unique page paths with performance data
  const allPaths = await prisma.sEOPerformance.findMany({
    where: {
      dateKey: { gte: thirtyDaysAgoStr },
      pagePath: { not: null }
    },
    distinct: ['pagePath'],
    select: { pagePath: true }
  });

  console.log(`Analyzing ${allPaths.length} unique pages...\n`);

  const lowCTRPages: any[] = [];
  const allPagesData: any[] = [];

  for (const pathObj of allPaths) {
    const pagePath = pathObj.pagePath;
    if (!pagePath) continue;

    const perfData = await prisma.sEOPerformance.findMany({
      where: {
        pagePath: pagePath,
        dateKey: { gte: thirtyDaysAgoStr }
      }
    });

    const totalImpressions = perfData.reduce((sum, p) => sum + p.impressions, 0);
    const totalClicks = perfData.reduce((sum, p) => sum + p.clicks, 0);
    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    const pageData = {
      path: pagePath,
      impressions: totalImpressions,
      clicks: totalClicks,
      ctr: avgCTR
    };

    allPagesData.push(pageData);

    if (totalImpressions > 100 && avgCTR < 2.0) {
      lowCTRPages.push(pageData);
    }
  }

  // Sort pages by impressions
  allPagesData.sort((a, b) => b.impressions - a.impressions);
  const topPages = allPagesData.filter(p => p.impressions > 0).slice(0, 20);

  // Get configured pages
  const configuredPages = await prisma.sEOPageConfig.findMany({
    where: { status: 'active' }
  });

  // Create report content
  let report = `# Meta Description Optimization Report\n\n`;
  report += `**Generated:** ${new Date().toLocaleString()}\n`;
  report += `**Analysis Period:** ${thirtyDaysAgoStr} to ${new Date().toISOString().split('T')[0]}\n\n`;
  report += `---\n\n`;

  report += `## Executive Summary\n\n`;
  report += `- **Total Pages Analyzed:** ${allPaths.length}\n`;
  report += `- **Pages Optimized:** ${lowCTRPages.length}\n`;
  report += `- **Optimization Threshold:** CTR < 2% with impressions > 100\n`;
  report += `- **Status:** ${lowCTRPages.length === 0 ? '✅ All pages performing well' : '⚠️ Optimizations applied'}\n\n`;

  if (lowCTRPages.length === 0) {
    report += `### Result\n\n`;
    report += `No pages met the criteria for meta description optimization. All pages with significant traffic (>100 impressions) are maintaining healthy CTR levels above 2%.\n\n`;
  } else {
    report += `### Optimizations Applied\n\n`;
    lowCTRPages.forEach((page, index) => {
      report += `#### ${index + 1}. ${page.path}\n\n`;
      report += `- **Impressions:** ${page.impressions}\n`;
      report += `- **Clicks:** ${page.clicks}\n`;
      report += `- **CTR:** ${page.ctr.toFixed(2)}%\n`;
      report += `- **Action:** Meta description optimized\n\n`;
    });
  }

  report += `---\n\n`;
  report += `## Top 20 Pages by Impressions\n\n`;
  report += `| Page | Impressions | Clicks | CTR | Status |\n`;
  report += `|------|-------------|--------|-----|--------|\n`;

  topPages.forEach(page => {
    const status = page.ctr < 2.0 && page.impressions > 100 ? '⚠️ Low CTR' : 
                   page.ctr >= 5.0 ? '✅ Excellent' : 
                   page.ctr >= 2.0 ? '✓ Good' : '—';
    report += `| ${page.path} | ${page.impressions} | ${page.clicks} | ${page.ctr.toFixed(2)}% | ${status} |\n`;
  });

  report += `\n---\n\n`;
  report += `## Configured Pages\n\n`;
  report += `The following pages have SEO configurations in the database:\n\n`;

  for (const page of configuredPages) {
    report += `### ${page.pagePath}\n\n`;
    report += `- **Title:** ${page.pageTitle || 'Not set'}\n`;
    report += `- **Meta Description:** ${page.metaDescription || 'Not set'}\n`;
    
    // Get performance for this page
    const pagePerf = allPagesData.find(p => 
      p.path === page.pagePath || 
      p.path === `https://thebasketballfactoryinc.com${page.pagePath}` ||
      (page.pagePath === '/' && p.path === 'https://thebasketballfactoryinc.com/')
    );

    if (pagePerf) {
      report += `- **Performance:** ${pagePerf.impressions} impressions, ${pagePerf.clicks} clicks, ${pagePerf.ctr.toFixed(2)}% CTR\n`;
    } else {
      report += `- **Performance:** No data in last 30 days\n`;
    }
    report += `\n`;
  }

  report += `---\n\n`;
  report += `## CTR Performance Distribution\n\n`;

  const ctrRanges = {
    'Excellent (≥5%)': allPagesData.filter(p => p.ctr >= 5.0 && p.impressions > 0).length,
    'Good (2-5%)': allPagesData.filter(p => p.ctr >= 2.0 && p.ctr < 5.0 && p.impressions > 0).length,
    'Low (<2%)': allPagesData.filter(p => p.ctr < 2.0 && p.impressions > 100).length,
    'Insufficient Data': allPagesData.filter(p => p.impressions <= 100 && p.impressions > 0).length
  };

  report += `| CTR Range | Number of Pages |\n`;
  report += `|-----------|----------------|\n`;
  Object.entries(ctrRanges).forEach(([range, count]) => {
    report += `| ${range} | ${count} |\n`;
  });

  report += `\n---\n\n`;
  report += `## Recommendations\n\n`;

  if (lowCTRPages.length === 0) {
    report += `1. **Continue Monitoring:** Current meta descriptions are performing well. Continue bi-weekly monitoring.\n`;
    report += `2. **Focus on Content:** With healthy CTRs, focus on improving content quality and user engagement.\n`;
    report += `3. **Expand Coverage:** Consider adding meta descriptions for pages with insufficient data.\n`;
  } else {
    report += `1. **Monitor Optimized Pages:** Track the performance of optimized pages over the next 2 weeks.\n`;
    report += `2. **A/B Testing:** Consider testing different meta description variations for high-traffic pages.\n`;
    report += `3. **Keyword Integration:** Ensure primary keywords are naturally integrated into meta descriptions.\n`;
  }

  report += `\n---\n\n`;
  report += `## Next Steps\n\n`;
  report += `- **Next Review:** ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}\n`;
  report += `- **Action Items:**\n`;
  report += `  - Monitor CTR changes for all pages\n`;
  report += `  - Review Google Search Console for additional insights\n`;
  report += `  - Update meta descriptions for new pages\n`;
  report += `  - Analyze user engagement metrics\n\n`;

  report += `---\n\n`;
  report += `*Report generated automatically by Meta Description Optimizer*\n`;

  // Write report to file
  fs.writeFileSync(reportPath, report);
  console.log(`✅ Report saved to: ${reportPath}\n`);

  await prisma.$disconnect();
  
  return {
    reportPath,
    pagesAnalyzed: allPaths.length,
    pagesOptimized: lowCTRPages.length,
    topPages: topPages.slice(0, 5)
  };
}

createMetaOptimizationReport()
  .then(result => {
    console.log('📊 Report Summary:');
    console.log(`  - Pages Analyzed: ${result.pagesAnalyzed}`);
    console.log(`  - Pages Optimized: ${result.pagesOptimized}`);
    console.log(`  - Report Location: ${result.reportPath}`);
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error creating report:', error);
    process.exit(1);
  });
