import pkg from '@prisma/client';
import fs from 'fs';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function optimizeMetaDescriptions() {
  console.log('🎯 Starting Meta Description Optimization...');

  try {
    // Get all pages with performance data
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' }
    });

    let optimizedCount = 0;
    const optimizations = [];

    for (const page of pages) {
      // Get performance data for the last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const performance = await prisma.sEOPerformance.findMany({
        where: {
          pagePath: page.pagePath,
          dateKey: {
            gte: thirtyDaysAgo
          }
        },
        orderBy: { dateKey: 'desc' }
      });

      if (performance.length === 0) {
        console.log(`⏭️  Skipping ${page.pagePath} - no performance data`);
        continue;
      }

      // Calculate average CTR
      const totalImpressions = performance.reduce((sum, p) => sum + p.impressions, 0);
      const totalClicks = performance.reduce((sum, p) => sum + p.clicks, 0);
      const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

      // If CTR is below 2%, optimize meta description
      if (avgCTR < 2.0 && totalImpressions > 100) {
        const currentMeta = page.metaDescription || '';
        
        // Generate optimized meta description
        const optimizedMeta = await generateOptimizedMeta(page, currentMeta);

        if (optimizedMeta !== currentMeta) {
          await prisma.sEOPageConfig.update({
            where: { id: page.id },
            data: {
              metaDescription: optimizedMeta,
              updatedAt: new Date()
            }
          });

          optimizedCount++;
          optimizations.push({
            page: page.pagePath,
            oldMeta: currentMeta,
            newMeta: optimizedMeta,
            avgCTR: avgCTR.toFixed(2),
            impressions: totalImpressions
          });

          console.log(`✅ Optimized ${page.pagePath} (CTR: ${avgCTR.toFixed(2)}%)`);
        }
      } else {
        console.log(`✓ ${page.pagePath} CTR is healthy: ${avgCTR.toFixed(2)}%`);
      }
    }

    // Log to audit
    if (optimizedCount > 0) {
      await prisma.sEOAuditLog.create({
        data: {
          action: 'meta_descriptions_optimized',
          entityType: 'page',
          performedBy: 'system',
          changes: {
            pagesOptimized: optimizedCount,
            optimizations
          }
        }
      });
    }

    console.log(`\n✨ Meta Description Optimization Complete!`);
    console.log(`📊 Optimized ${optimizedCount} pages`);

    return {
      success: true,
      pagesOptimized: optimizedCount,
      optimizations
    };

  } catch (error) {
    console.error('❌ Meta description optimization failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function generateOptimizedMeta(page, currentMeta) {
  // Extract keywords from page
  let contentStrategy = {};
  try {
    contentStrategy = page.contentStrategy ? JSON.parse(page.contentStrategy) : {};
  } catch (e) {
    contentStrategy = {};
  }
  
  const primaryKeyword = contentStrategy.primaryKeyword || '';
  const secondaryKeywords = contentStrategy.secondaryKeywords || [];
  
  // Build optimized meta based on page type
  let optimizedMeta = currentMeta;
  const pagePath = page.pagePath.toLowerCase();

  if (pagePath.includes('/programs/')) {
    const programName = page.pageTitle || 'Basketball Training Program';
    optimizedMeta = `Join ${programName} at The Basketball Factory in Sparta, NJ. Expert coaching, proven results. ` +
                    `${primaryKeyword ? `Master ${primaryKeyword.toLowerCase()}.` : ''} Register today!`;
  } else if (pagePath.includes('/private-lessons')) {
    optimizedMeta = `Elite 1-on-1 basketball training in NJ. ${primaryKeyword ? `Improve ${primaryKeyword.toLowerCase()}.` : ''} ` +
                    `Professional coaches, custom programs, proven results. Book your session!`;
  } else if (pagePath === '/') {
    optimizedMeta = `The Basketball Factory - Elite basketball training in Sparta, NJ. Programs for youth & high school athletes. ` +
                    `Expert coaching, skill development, competitive edge. Start your journey today!`;
  } else {
    // Generic optimization - add call to action and keywords
    const keywords = [primaryKeyword, ...secondaryKeywords.slice(0, 2)]
      .filter(Boolean)
      .join(', ');
    
    if (keywords && !currentMeta.toLowerCase().includes(keywords.toLowerCase())) {
      optimizedMeta = currentMeta.replace(/\.$/, '') + `. ${keywords}. Book now!`;
    } else if (!currentMeta.includes('!') && !currentMeta.includes('?')) {
      optimizedMeta = currentMeta.replace(/\.$/, '') + '. Register today!';
    }
  }

  // Ensure meta description is within optimal length (150-160 characters)
  if (optimizedMeta.length > 160) {
    optimizedMeta = optimizedMeta.substring(0, 157) + '...';
  } else if (optimizedMeta.length < 120 && primaryKeyword) {
    optimizedMeta += ` ${primaryKeyword}. Sign up now!`;
  }

  return optimizedMeta;
}

// Run the optimization
optimizeMetaDescriptions()
  .then((result) => {
    // Write report
    const timestamp = new Date().toISOString().split('T')[0];
    const reportPath = `/home/ubuntu/rise_as_one_aau/seo_reports/meta_optimization_report_${timestamp}.md`;
    
    let report = `# Meta Description Optimization Report\n`;
    report += `**Date:** ${new Date().toISOString()}\n\n`;
    report += `## Summary\n`;
    report += `- **Total Pages Optimized:** ${result.pagesOptimized}\n`;
    report += `- **Optimization Threshold:** CTR < 2% with > 100 impressions\n\n`;
    
    if (result.optimizations.length > 0) {
      report += `## Optimizations\n\n`;
      result.optimizations.forEach((opt, idx) => {
        report += `### ${idx + 1}. ${opt.page}\n`;
        report += `- **Average CTR:** ${opt.avgCTR}%\n`;
        report += `- **Impressions:** ${opt.impressions}\n`;
        report += `- **Old Meta:** ${opt.oldMeta}\n`;
        report += `- **New Meta:** ${opt.newMeta}\n\n`;
      });
    } else {
      report += `## No Optimizations Needed\n`;
      report += `All pages are performing well with CTR above 2%.\n\n`;
    }
    
    report += `## Expected Impact\n`;
    report += `- Improved click-through rates from search results\n`;
    report += `- Better keyword targeting in meta descriptions\n`;
    report += `- Enhanced call-to-action messaging\n`;
    report += `- Optimized character length (150-160 chars)\n`;
    
    fs.writeFileSync(reportPath, report);
    console.log(`\n📄 Report written to: ${reportPath}`);
    
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
