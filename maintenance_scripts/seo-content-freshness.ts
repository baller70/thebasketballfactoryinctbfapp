/**
 * Automated Content Freshness Monitoring Script
 * Runs monthly to identify and prioritize pages needing content updates
 */

import { PrismaClient } from '@prisma/client';
import { format, subDays, differenceInDays } from 'date-fns';

const prisma = new PrismaClient();

interface ContentFreshnessReport {
  pageId: string;
  pagePath: string;
  pageTitle: string;
  lastUpdated: Date;
  daysSinceUpdate: number;
  updateFrequency: string;
  isOverdue: boolean;
  performanceImpact: 'critical' | 'high' | 'medium' | 'low';
  avgPosition: number;
  trafficTrend: 'increasing' | 'stable' | 'decreasing';
  recommendation: string;
}

/**
 * Calculate days until next update based on frequency
 */
function getUpdateThresholdDays(frequency: string): number {
  switch (frequency) {
    case 'daily': return 1;
    case 'weekly': return 7;
    case 'biweekly': return 14;
    case 'monthly': return 30;
    default: return 30;
  }
}

/**
 * Analyze performance trend for a page
 */
async function analyzePerformanceTrend(pagePath: string): Promise<{
  avgPosition: number;
  trafficTrend: 'increasing' | 'stable' | 'decreasing';
}> {
  const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');
  const sixtyDaysAgo = format(subDays(new Date(), 60), 'yyyy-MM-dd');
  
  // Get last 30 days performance
  const recentPerf = await prisma.sEOPerformance.findMany({
    where: {
      pagePath,
      dateKey: { gte: thirtyDaysAgo }
    }
  });

  // Get 30-60 days ago performance
  const previousPerf = await prisma.sEOPerformance.findMany({
    where: {
      pagePath,
      dateKey: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }
    }
  });

  if (recentPerf.length === 0) {
    return { avgPosition: 100, trafficTrend: 'stable' };
  }

  // Calculate average position
  const avgPosition = recentPerf.reduce((sum, p) => sum + (p.position || 100), 0) / recentPerf.length;

  // Calculate traffic trend
  const recentTraffic = recentPerf.reduce((sum, p) => sum + (p.organicTraffic || 0), 0);
  const previousTraffic = previousPerf.reduce((sum, p) => sum + (p.organicTraffic || 0), 0);

  let trafficTrend: 'increasing' | 'stable' | 'decreasing' = 'stable';
  if (previousTraffic > 0) {
    const change = ((recentTraffic - previousTraffic) / previousTraffic) * 100;
    if (change > 10) trafficTrend = 'increasing';
    else if (change < -10) trafficTrend = 'decreasing';
  }

  return { avgPosition, trafficTrend };
}

/**
 * Determine performance impact level
 */
function determinePerformanceImpact(
  daysSinceUpdate: number,
  avgPosition: number,
  trafficTrend: string,
  updateFrequency: string
): 'critical' | 'high' | 'medium' | 'low' {
  const threshold = getUpdateThresholdDays(updateFrequency);
  const overdueMultiplier = daysSinceUpdate / threshold;

  if (trafficTrend === 'decreasing' && avgPosition > 10 && overdueMultiplier > 2) {
    return 'critical';
  } else if (trafficTrend === 'decreasing' || (avgPosition > 10 && overdueMultiplier > 1.5)) {
    return 'high';
  } else if (overdueMultiplier > 1.2) {
    return 'medium';
  } else {
    return 'low';
  }
}

/**
 * Generate recommendation based on analysis
 */
function generateRecommendation(report: ContentFreshnessReport): string {
  const { performanceImpact, trafficTrend, avgPosition, daysSinceUpdate } = report;

  if (performanceImpact === 'critical') {
    return `URGENT: Update immediately. Traffic declining and position is ${avgPosition.toFixed(1)}. Last updated ${daysSinceUpdate} days ago.`;
  } else if (performanceImpact === 'high') {
    if (trafficTrend === 'decreasing') {
      return `High priority: Traffic is declining. Refresh content to maintain rankings (position ${avgPosition.toFixed(1)}).`;
    } else {
      return `High priority: Content is overdue for update. Refresh within next 3 days to maintain rankings.`;
    }
  } else if (performanceImpact === 'medium') {
    return `Medium priority: Schedule content refresh within next week to maintain SEO performance.`;
  } else {
    return `Low priority: Content is relatively fresh or performing well. Monitor for next update cycle.`;
  }
}

/**
 * Main content freshness analysis function
 */
async function runContentFreshnessAnalysis() {
  console.log('🔄 Starting content freshness analysis...');
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

  try {
    // Get all active pages with auto-update enabled
    const pages = await prisma.sEOPageConfig.findMany({
      where: { 
        status: 'active',
        autoUpdateEnabled: true 
      }
    });

    console.log(`📄 Analyzing ${pages.length} active pages...`);

    const reports: ContentFreshnessReport[] = [];

    // Analyze each page
    for (const page of pages) {
      const lastUpdated = page.lastGenerated || page.updatedAt;
      const daysSinceUpdate = differenceInDays(new Date(), lastUpdated);
      const threshold = getUpdateThresholdDays(page.updateFrequency || 'monthly');
      const isOverdue = daysSinceUpdate > threshold;

      // Get performance data
      const { avgPosition, trafficTrend } = await analyzePerformanceTrend(page.pagePath);

      // Determine impact
      const performanceImpact = determinePerformanceImpact(
        daysSinceUpdate,
        avgPosition,
        trafficTrend,
        page.updateFrequency || 'monthly'
      );

      const report: ContentFreshnessReport = {
        pageId: page.id,
        pagePath: page.pagePath,
        pageTitle: page.pageTitle || "",
        lastUpdated,
        daysSinceUpdate,
        updateFrequency: page.updateFrequency || 'monthly',
        isOverdue,
        performanceImpact,
        avgPosition,
        trafficTrend,
        recommendation: ''
      };

      // Generate recommendation
      report.recommendation = generateRecommendation(report);

      reports.push(report);
    }

    // Sort by performance impact
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    reports.sort((a, b) => priorityOrder[a.performanceImpact] - priorityOrder[b.performanceImpact]);

    // Summary statistics
    const critical = reports.filter(r => r.performanceImpact === 'critical').length;
    const high = reports.filter(r => r.performanceImpact === 'high').length;
    const medium = reports.filter(r => r.performanceImpact === 'medium').length;
    const low = reports.filter(r => r.performanceImpact === 'low').length;

    console.log(`\n📊 Content Freshness Summary:`);
    console.log(`   Critical: ${critical} pages`);
    console.log(`   High: ${high} pages`);
    console.log(`   Medium: ${medium} pages`);
    console.log(`   Low: ${low} pages`);
    console.log(`   Total Analyzed: ${reports.length}`);

    // Display top 10 priority pages
    console.log(`\n🚨 Top 10 Pages Needing Updates:`);
    reports.slice(0, 10).forEach((report, index) => {
      console.log(`\n${index + 1}. ${report.pageTitle} (${report.pagePath})`);
      console.log(`   Priority: ${report.performanceImpact.toUpperCase()}`);
      console.log(`   Last Updated: ${format(report.lastUpdated, 'MMM dd, yyyy')} (${report.daysSinceUpdate} days ago)`);
      console.log(`   Position: ${report.avgPosition.toFixed(1)} | Trend: ${report.trafficTrend}`);
      console.log(`   ${report.recommendation}`);
    });

    // Store analysis in database
    await prisma.sEOAuditLog.create({
      data: {
        action: 'content_freshness_analysis',
        entityType: 'pages',
        performedBy: 'system',
        changes: {
          pagesAnalyzed: pages.length,
          critical,
          high,
          medium,
          low,
          topPriority: reports.slice(0, 10).map(r => ({
            pagePath: r.pagePath,
            impact: r.performanceImpact,
            daysSinceUpdate: r.daysSinceUpdate,
            recommendation: r.recommendation
          })),
          timestamp: new Date().toISOString()
        }
      }
    });

    console.log('\n✅ Content freshness analysis completed successfully');
    return {
      success: true,
      pagesAnalyzed: pages.length,
      reports
    };
  } catch (error) {
    console.error('❌ Content freshness analysis failed:', error);
    
    await prisma.sEOAuditLog.create({
      data: {
        action: 'content_freshness_analysis_failed',
        entityType: 'pages',
        performedBy: 'system',
        changes: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      }
    });

    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute if run directly
if (require.main === module) {
  runContentFreshnessAnalysis()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

export { runContentFreshnessAnalysis };
