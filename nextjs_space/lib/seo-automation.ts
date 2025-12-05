/**
 * SEO Automation Core Library
 * Handles automated SEO tasks, monitoring, and optimization
 */

import { prisma } from '@/lib/db';
import { syncGAData } from '@/lib/google-analytics';
import { sendEmail } from '@/lib/email';
import { format, subDays, startOfDay } from 'date-fns';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface RankingChange {
  keyword: string;
  oldPosition: number;
  newPosition: number;
  change: number;
  pagePath: string;
}

export interface SEOAlert {
  type: 'ranking_drop' | 'traffic_drop' | 'error' | 'opportunity';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  data?: any;
}

export interface WeeklyReportData {
  dateRange: string;
  metrics: {
    impressions: number;
    clicks: number;
    ctr: number;
    avgPosition: number;
    organicTraffic: number;
    conversions: number;
  };
  changes: {
    impressions: number;
    clicks: number;
    ctr: number;
    avgPosition: number;
  };
  topKeywords: Array<{
    keyword: string;
    position: number;
    clicks: number;
    impressions: number;
  }>;
  rankingChanges: RankingChange[];
  alerts: SEOAlert[];
  recommendations: string[];
}

// ============================================================================
// CORE AUTOMATION FUNCTIONS
// ============================================================================

/**
 * Sync Google Analytics data automatically
 */
export async function automatedGASync(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('[SEO Automation] Starting automated GA sync...');
    
    const settings = await prisma.sEOSettings.findFirst();
    if (!settings?.googleAuthTokens || !settings?.googleAnalyticsPropertyId || !settings?.googleSearchConsoleSiteUrl) {
      return { success: false, message: 'Google Analytics not configured' };
    }

    const tokens = typeof settings.googleAuthTokens === 'string' 
      ? JSON.parse(settings.googleAuthTokens)
      : settings.googleAuthTokens;

    const result = await syncGAData(
      settings.googleAnalyticsPropertyId,
      settings.googleSearchConsoleSiteUrl,
      30 // Last 30 days
    );

    // Log the sync
    await prisma.sEOAuditLog.create({
      data: {
        action: 'automated_ga_sync',
        entityType: 'analytics',
        performedBy: 'system',
        changes: { 
          syncedAt: new Date().toISOString(),
          dataPoints: result.metrics ? 1 : 0,
          warnings: result.warnings || []
        }
      }
    });

    return { success: true, message: result.success ? 'GA sync successful' : result.error || 'GA sync failed' };
  } catch (error: any) {
    console.error('[SEO Automation] GA sync failed:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Track keyword ranking changes
 */
export async function trackKeywordRankings(): Promise<RankingChange[]> {
  try {
    console.log('[SEO Automation] Tracking keyword rankings...');
    
    const keywords = await prisma.sEOKeyword.findMany({
      where: { isActive: true },
      include: {
        performanceData: {
          orderBy: { date: 'desc' },
          take: 2
        }
      }
    });

    const changes: RankingChange[] = [];

    for (const keyword of keywords) {
      if (keyword.performanceData.length >= 2) {
        const [latest, previous] = keyword.performanceData;
        const positionChange = (previous.position || 0) - (latest.position || 0);

        if (Math.abs(positionChange) >= 3) {
          changes.push({
            keyword: keyword.keyword,
            oldPosition: previous.position || 0,
            newPosition: latest.position || 0,
            change: positionChange,
            pagePath: latest.pagePath || 'N/A'
          });
        }
      }
    }

    // Log significant changes
    if (changes.length > 0) {
      await prisma.sEOAuditLog.create({
        data: {
          action: 'keyword_ranking_change',
          entityType: 'keyword',
          performedBy: 'system',
          changes: JSON.parse(JSON.stringify({ rankingChanges: changes }))
        }
      });
    }

    return changes;
  } catch (error) {
    console.error('[SEO Automation] Ranking tracking failed:', error);
    return [];
  }
}

/**
 * Generate SEO alerts based on performance data
 */
export async function generateSEOAlerts(): Promise<SEOAlert[]> {
  const alerts: SEOAlert[] = [];
  const today = startOfDay(new Date());
  const weekAgo = subDays(today, 7);

  try {
    // Check for ranking drops
    const rankingChanges = await trackKeywordRankings();
    const criticalDrops = rankingChanges.filter(c => c.change < -5);
    
    if (criticalDrops.length > 0) {
      alerts.push({
        type: 'ranking_drop',
        severity: 'critical',
        title: 'Critical Ranking Drops Detected',
        message: `${criticalDrops.length} keywords dropped by 5+ positions`,
        data: criticalDrops
      });
    }

    // Check for traffic drops
    const recentPerformance = await prisma.sEOPerformance.groupBy({
      by: ['dateKey'],
      where: {
        date: { gte: weekAgo }
      },
      _sum: {
        clicks: true,
        impressions: true
      }
    });

    const previousPerformance = await prisma.sEOPerformance.groupBy({
      by: ['dateKey'],
      where: {
        date: { gte: subDays(weekAgo, 7), lt: weekAgo }
      },
      _sum: {
        clicks: true,
        impressions: true
      }
    });

    const recentClicks = recentPerformance.reduce((sum, p) => sum + (p._sum.clicks || 0), 0);
    const previousClicks = previousPerformance.reduce((sum, p) => sum + (p._sum.clicks || 0), 0);
    
    if (previousClicks > 0) {
      const trafficChange = ((recentClicks - previousClicks) / previousClicks) * 100;
      if (trafficChange < -20) {
        alerts.push({
          type: 'traffic_drop',
          severity: 'warning',
          title: 'Traffic Decline',
          message: `Organic traffic down ${Math.abs(trafficChange).toFixed(1)}% this week`,
          data: { recentClicks, previousClicks, change: trafficChange }
        });
      }
    }

    // Check for low CTR pages
    const lowCTRPages = await prisma.sEOPerformance.groupBy({
      by: ['pagePath'],
      where: {
        date: { gte: weekAgo }
      },
      _sum: {
        clicks: true,
        impressions: true
      },
      having: {
        impressions: { _sum: { gt: 100 } }
      }
    });

    for (const page of lowCTRPages) {
      const ctr = (page._sum.clicks || 0) / (page._sum.impressions || 1) * 100;
      if (ctr < 2) {
        alerts.push({
          type: 'opportunity',
          severity: 'info',
          title: 'Low CTR Detected',
          message: `${page.pagePath} has ${ctr.toFixed(2)}% CTR - optimize meta description`,
          data: { pagePath: page.pagePath, ctr, impressions: page._sum.impressions }
        });
      }
    }

    return alerts;
  } catch (error) {
    console.error('[SEO Automation] Alert generation failed:', error);
    return alerts;
  }
}

/**
 * Generate weekly SEO report data
 */
export async function generateWeeklyReport(): Promise<WeeklyReportData> {
  const today = startOfDay(new Date());
  const weekAgo = subDays(today, 7);
  const twoWeeksAgo = subDays(today, 14);

  // Fetch current week data
  const currentWeek = await prisma.sEOPerformance.aggregate({
    where: { date: { gte: weekAgo, lt: today } },
    _sum: {
      impressions: true,
      clicks: true,
      organicTraffic: true,
      conversions: true
    },
    _avg: {
      position: true,
      ctr: true
    }
  });

  // Fetch previous week data
  const previousWeek = await prisma.sEOPerformance.aggregate({
    where: { date: { gte: twoWeeksAgo, lt: weekAgo } },
    _sum: {
      impressions: true,
      clicks: true,
      organicTraffic: true,
      conversions: true
    },
    _avg: {
      position: true,
      ctr: true
    }
  });

  // Calculate changes
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Get top keywords
  const topKeywords = await prisma.sEOPerformance.groupBy({
    by: ['keywordId'],
    where: {
      date: { gte: weekAgo },
      keywordId: { not: null }
    },
    _sum: {
      clicks: true,
      impressions: true
    },
    _avg: {
      position: true
    },
    orderBy: {
      _sum: {
        clicks: 'desc'
      }
    },
    take: 10
  });

  // Get ranking changes
  const rankingChanges = await trackKeywordRankings();

  // Generate alerts
  const alerts = await generateSEOAlerts();

  // Generate recommendations
  const recommendations: string[] = [];
  
  if ((currentWeek._avg.position || 0) > 10) {
    recommendations.push('Focus on improving content quality for top 20 keywords to reach page 1');
  }
  
  if ((currentWeek._avg.ctr || 0) < 3) {
    recommendations.push('Optimize meta titles and descriptions to improve CTR above 3%');
  }

  if (rankingChanges.some(c => c.change < 0)) {
    recommendations.push('Investigate pages with ranking drops - check for technical issues or content gaps');
  }

  return {
    dateRange: `${format(weekAgo, 'MMM d')} - ${format(today, 'MMM d, yyyy')}`,
    metrics: {
      impressions: currentWeek._sum?.impressions || 0,
      clicks: currentWeek._sum?.clicks || 0,
      ctr: currentWeek._avg?.ctr || 0,
      avgPosition: currentWeek._avg?.position || 0,
      organicTraffic: currentWeek._sum?.organicTraffic || 0,
      conversions: currentWeek._sum?.conversions || 0
    },
    changes: {
      impressions: calculateChange(currentWeek._sum?.impressions || 0, previousWeek._sum?.impressions || 0),
      clicks: calculateChange(currentWeek._sum?.clicks || 0, previousWeek._sum?.clicks || 0),
      ctr: calculateChange(currentWeek._avg?.ctr || 0, previousWeek._avg?.ctr || 0),
      avgPosition: calculateChange(previousWeek._avg?.position || 1, currentWeek._avg?.position || 1) // Reversed for position (lower is better)
    },
    topKeywords: topKeywords.map(k => ({
      keyword: k.keywordId || 'N/A',
      position: k._avg?.position || 0,
      clicks: k._sum?.clicks || 0,
      impressions: k._sum?.impressions || 0
    })),
    rankingChanges: rankingChanges.slice(0, 10),
    alerts,
    recommendations
  };
}

/**
 * Send weekly SEO report email
 */
export async function sendWeeklySEOReport(recipientEmail: string): Promise<boolean> {
  try {
    console.log('[SEO Automation] Generating weekly report...');
    
    const reportData = await generateWeeklyReport();
    
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #C8B273 0%, #A89254 100%); color: white; padding: 30px; text-align: center; }
    .metric-card { background: #f9f9f9; border-left: 4px solid #C8B273; padding: 15px; margin: 15px 0; }
    .metric-value { font-size: 32px; font-weight: bold; color: #C8B273; }
    .change-positive { color: #10b981; }
    .change-negative { color: #ef4444; }
    .alert-critical { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 10px 0; }
    .alert-warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 10px 0; }
    .keyword-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .keyword-table th { background: #C8B273; color: white; padding: 12px; text-align: left; }
    .keyword-table td { padding: 10px; border-bottom: 1px solid #ddd; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏀 Weekly SEO Report</h1>
    <p>The Basketball Factory Inc.</p>
    <p>${reportData.dateRange}</p>
  </div>

  <div style="padding: 30px;">
    <h2>📊 Performance Overview</h2>
    
    <div class="metric-card">
      <h3>Impressions</h3>
      <div class="metric-value">${reportData.metrics.impressions.toLocaleString()}</div>
      <p class="${reportData.changes.impressions >= 0 ? 'change-positive' : 'change-negative'}">
        ${reportData.changes.impressions >= 0 ? '↑' : '↓'} ${Math.abs(reportData.changes.impressions).toFixed(1)}% vs last week
      </p>
    </div>

    <div class="metric-card">
      <h3>Clicks</h3>
      <div class="metric-value">${reportData.metrics.clicks.toLocaleString()}</div>
      <p class="${reportData.changes.clicks >= 0 ? 'change-positive' : 'change-negative'}">
        ${reportData.changes.clicks >= 0 ? '↑' : '↓'} ${Math.abs(reportData.changes.clicks).toFixed(1)}% vs last week
      </p>
    </div>

    <div class="metric-card">
      <h3>Average Position</h3>
      <div class="metric-value">${reportData.metrics.avgPosition.toFixed(1)}</div>
      <p class="${reportData.changes.avgPosition >= 0 ? 'change-positive' : 'change-negative'}">
        ${reportData.changes.avgPosition >= 0 ? '↑' : '↓'} ${Math.abs(reportData.changes.avgPosition).toFixed(1)}% vs last week
      </p>
    </div>

    <div class="metric-card">
      <h3>CTR</h3>
      <div class="metric-value">${reportData.metrics.ctr.toFixed(2)}%</div>
      <p class="${reportData.changes.ctr >= 0 ? 'change-positive' : 'change-negative'}">
        ${reportData.changes.ctr >= 0 ? '↑' : '↓'} ${Math.abs(reportData.changes.ctr).toFixed(1)}% vs last week
      </p>
    </div>

    ${reportData.alerts.length > 0 ? `
    <h2>🚨 Alerts</h2>
    ${reportData.alerts.slice(0, 5).map(alert => `
      <div class="alert-${alert.severity === 'critical' ? 'critical' : 'warning'}">
        <strong>${alert.title}</strong><br>
        ${alert.message}
      </div>
    `).join('')}
    ` : ''}

    <h2>🎯 Top Performing Keywords</h2>
    <table class="keyword-table">
      <thead>
        <tr>
          <th>Keyword</th>
          <th>Position</th>
          <th>Clicks</th>
          <th>Impressions</th>
        </tr>
      </thead>
      <tbody>
        ${reportData.topKeywords.slice(0, 10).map(kw => `
          <tr>
            <td><strong>${kw.keyword}</strong></td>
            <td>${kw.position.toFixed(1)}</td>
            <td>${kw.clicks}</td>
            <td>${kw.impressions}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    ${reportData.rankingChanges.length > 0 ? `
    <h2>📈 Significant Ranking Changes</h2>
    <table class="keyword-table">
      <thead>
        <tr>
          <th>Keyword</th>
          <th>Old Position</th>
          <th>New Position</th>
          <th>Change</th>
        </tr>
      </thead>
      <tbody>
        ${reportData.rankingChanges.slice(0, 10).map(rc => `
          <tr>
            <td><strong>${rc.keyword}</strong></td>
            <td>${rc.oldPosition.toFixed(1)}</td>
            <td>${rc.newPosition.toFixed(1)}</td>
            <td class="${rc.change > 0 ? 'change-positive' : 'change-negative'}">
              ${rc.change > 0 ? '↑' : '↓'} ${Math.abs(rc.change).toFixed(1)}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    ` : ''}

    ${reportData.recommendations.length > 0 ? `
    <h2>💡 Recommendations</h2>
    <ul>
      ${reportData.recommendations.map(rec => `<li>${rec}</li>`).join('')}
    </ul>
    ` : ''}
  </div>

  <div class="footer">
    <p>This is an automated weekly SEO report from The Basketball Factory Inc.</p>
    <p><a href="https://thebasketballfactoryinc.com/admin/seo">View Full Dashboard</a></p>
  </div>
</body>
</html>
    `;

    const result = await sendEmail({
      to: recipientEmail,
      subject: `🏀 Weekly SEO Report - ${reportData.dateRange}`,
      html: emailHtml
    });

    if (result.success) {
      await prisma.sEOAuditLog.create({
        data: {
          action: 'weekly_report_sent',
          entityType: 'report',
          performedBy: 'system',
          changes: { 
            sentTo: recipientEmail,
            sentAt: new Date().toISOString(),
            metrics: reportData.metrics
          }
        }
      });
    }

    return result.success;
  } catch (error) {
    console.error('[SEO Automation] Failed to send weekly report:', error);
    return false;
  }
}

/**
 * Check for broken links on the site
 */
export async function checkBrokenLinks(): Promise<{ broken: string[]; checked: number }> {
  try {
    console.log('[SEO Automation] Checking for broken links...');
    
    // Get all pages
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' }
    });

    const brokenLinks: string[] = [];
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
      } catch (error) {
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
  } catch (error) {
    console.error('[SEO Automation] Broken link check failed:', error);
    return { broken: [], checked: 0 };
  }
}

/**
 * Generate XML sitemap
 */
export async function generateSitemap(): Promise<string> {
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
  const lastmod = page.updatedAt ? format(new Date(page.updatedAt), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');

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
