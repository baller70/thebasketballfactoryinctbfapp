const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function generateReport() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    // Get all active pages
    const allPages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' },
      select: {
        id: true,
        pagePath: true,
        status: true,
        updatedAt: true,
        contentStrategy: true
      },
      orderBy: { updatedAt: 'desc' }
    });
    
    // Identify stale pages
    const stalePages = allPages.filter(p => p.updatedAt < thirtyDaysAgo);
    
    // Get performance data for all pages
    const pagePerformance = [];
    for (const page of allPages) {
      const perfData = await prisma.sEOPerformance.findMany({
        where: {
          pagePath: page.pagePath,
          dateKey: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        }
      });
      
      if (perfData.length > 0) {
        const avgPosition = perfData.reduce((sum, p) => sum + (p.position || 0), 0) / perfData.length;
        const totalImpressions = perfData.reduce((sum, p) => sum + p.impressions, 0);
        const totalClicks = perfData.reduce((sum, p) => sum + p.clicks, 0);
        
        pagePerformance.push({
          pagePath: page.pagePath,
          updatedAt: page.updatedAt,
          avgPosition: avgPosition.toFixed(2),
          impressions: totalImpressions,
          clicks: totalClicks,
          isStale: page.updatedAt < thirtyDaysAgo
        });
      }
    }
    
    // Generate markdown report
    let report = `# Content Freshness Report\n\n`;
    report += `**Generated:** ${new Date().toLocaleString()}\n\n`;
    report += `**Report Period:** Last 30 days\n\n`;
    report += `---\n\n`;
    
    report += `## Executive Summary\n\n`;
    report += `- **Total Active Pages:** ${allPages.length}\n`;
    report += `- **Stale Pages (30+ days):** ${stalePages.length}\n`;
    report += `- **Pages Updated:** 0\n`;
    report += `- **Status:** ${stalePages.length === 0 ? '✅ All pages are fresh' : '⚠️ Action required'}\n\n`;
    
    if (stalePages.length === 0) {
      report += `### 🎉 Excellent Content Freshness\n\n`;
      report += `All active pages have been updated within the last 30 days. No content refresh actions are required at this time.\n\n`;
    }
    
    report += `---\n\n`;
    report += `## Page Status Overview\n\n`;
    report += `| Page Path | Last Updated | Days Since Update | Avg Position | Impressions | Clicks | Status |\n`;
    report += `|-----------|--------------|-------------------|--------------|-------------|--------|--------|\n`;
    
    for (const page of allPages) {
      const daysSince = Math.floor((Date.now() - page.updatedAt.getTime()) / (1000 * 60 * 60 * 24));
      const perf = pagePerformance.find(p => p.pagePath === page.pagePath);
      const status = daysSince > 30 ? '🔴 Stale' : daysSince > 14 ? '🟡 Aging' : '🟢 Fresh';
      
      report += `| ${page.pagePath} | ${page.updatedAt.toISOString().split('T')[0]} | ${daysSince} days | `;
      report += `${perf ? perf.avgPosition : 'N/A'} | ${perf ? perf.impressions : 'N/A'} | `;
      report += `${perf ? perf.clicks : 'N/A'} | ${status} |\n`;
    }
    
    report += `\n---\n\n`;
    
    if (pagePerformance.length > 0) {
      report += `## Performance Analysis\n\n`;
      
      // Pages with poor ranking
      const poorRanking = pagePerformance.filter(p => parseFloat(p.avgPosition) > 10);
      if (poorRanking.length > 0) {
        report += `### ⚠️ Pages with Poor Ranking (Position > 10)\n\n`;
        poorRanking.forEach(p => {
          report += `- **${p.pagePath}**\n`;
          report += `  - Average Position: ${p.avgPosition}\n`;
          report += `  - Impressions: ${p.impressions}\n`;
          report += `  - Clicks: ${p.clicks}\n`;
          report += `  - Recommendation: Consider content optimization and keyword targeting\n\n`;
        });
      }
      
      // Pages with low impressions
      const lowImpressions = pagePerformance.filter(p => p.impressions < 50);
      if (lowImpressions.length > 0) {
        report += `### 📉 Pages with Low Impressions (< 50)\n\n`;
        lowImpressions.forEach(p => {
          report += `- **${p.pagePath}**\n`;
          report += `  - Impressions: ${p.impressions}\n`;
          report += `  - Average Position: ${p.avgPosition}\n`;
          report += `  - Recommendation: Improve visibility through better SEO and content marketing\n\n`;
        });
      }
      
      // Well-performing pages
      const goodPages = pagePerformance.filter(p => parseFloat(p.avgPosition) <= 10 && p.impressions >= 50);
      if (goodPages.length > 0) {
        report += `### ✅ Well-Performing Pages\n\n`;
        goodPages.forEach(p => {
          report += `- **${p.pagePath}**: Position ${p.avgPosition}, ${p.impressions} impressions, ${p.clicks} clicks\n`;
        });
        report += `\n`;
      }
    }
    
    report += `---\n\n`;
    report += `## Recommendations\n\n`;
    
    if (stalePages.length === 0) {
      report += `### Current Status: Optimal\n\n`;
      report += `All pages are being regularly updated. Continue monitoring:\n\n`;
      report += `1. **Weekly Reviews:** Check page performance metrics weekly\n`;
      report += `2. **Content Updates:** Update pages with declining performance\n`;
      report += `3. **Seasonal Content:** Refresh seasonal content as appropriate\n`;
      report += `4. **User Engagement:** Monitor bounce rates and session duration\n\n`;
    } else {
      report += `### Action Items\n\n`;
      stalePages.forEach((page, idx) => {
        report += `${idx + 1}. **${page.pagePath}**\n`;
        report += `   - Last updated: ${page.updatedAt.toISOString().split('T')[0]}\n`;
        report += `   - Action: Review and refresh content\n\n`;
      });
    }
    
    report += `---\n\n`;
    report += `## Next Steps\n\n`;
    report += `1. Review pages marked as "Aging" or "Stale"\n`;
    report += `2. Update content with fresh information, testimonials, or seasonal updates\n`;
    report += `3. Optimize pages with poor performance metrics\n`;
    report += `4. Schedule next content freshness check for next week\n\n`;
    
    report += `---\n\n`;
    report += `*Report generated by Content Freshness Updater*\n`;
    report += `*Next scheduled run: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}*\n`;
    
    // Write report
    const reportPath = path.join('/home/ubuntu/rise_as_one_aau/seo_reports', `content_freshness_report_${timestamp}.md`);
    fs.writeFileSync(reportPath, report);
    
    console.log(`\n✅ Report generated: ${reportPath}`);
    console.log(`\n📊 Summary:`);
    console.log(`   - Total pages: ${allPages.length}`);
    console.log(`   - Stale pages: ${stalePages.length}`);
    console.log(`   - Pages with performance data: ${pagePerformance.length}`);
    
    return reportPath;
    
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

generateReport();
