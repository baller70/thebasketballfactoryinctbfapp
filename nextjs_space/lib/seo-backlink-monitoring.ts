
/**
 * SEO Backlink Monitoring
 * Tracks new and lost backlinks
 */

interface BacklinkData {
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  domainRating: number;
  firstSeen: Date;
  lastSeen: Date;
  status: 'active' | 'lost';
}

interface BacklinkReport {
  totalBacklinks: number;
  newBacklinks: BacklinkData[];
  lostBacklinks: BacklinkData[];
  topReferringDomains: { domain: string; count: number; avgDR: number }[];
  changes: {
    new: number;
    lost: number;
    netChange: number;
  };
}

export async function checkBacklinks(): Promise<BacklinkReport> {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    // In production, integrate with Ahrefs or Moz API to discover new backlinks
    // For now, we'll track backlinks from the database

    const backlinks = await prisma.sEOBacklink.findMany({
      orderBy: { lastSeen: 'desc' },
    });

    // Identify new backlinks (first seen in last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newBacklinks = backlinks.filter(
      (bl) => bl.firstSeen && bl.firstSeen >= sevenDaysAgo
    );

    // Identify lost backlinks (status is lost and changed in last 7 days)
    const lostBacklinks = backlinks.filter(
      (bl) => bl.status === 'lost' && bl.lastSeen && bl.lastSeen >= sevenDaysAgo
    );

    // Calculate top referring domains
    const domainStats = new Map<string, { count: number; totalDR: number }>();
    backlinks
      .filter((bl) => bl.status === 'active')
      .forEach((bl) => {
        try {
          const domain = bl.sourceDomain || new URL(bl.sourceUrl).hostname;
          const stats = domainStats.get(domain) || { count: 0, totalDR: 0 };
          stats.count++;
          stats.totalDR += bl.domainRating || 0;
          domainStats.set(domain, stats);
        } catch (error) {
          // Invalid URL, skip
        }
      });

    const topReferringDomains = Array.from(domainStats.entries())
      .map(([domain, stats]) => ({
        domain,
        count: stats.count,
        avgDR: stats.totalDR / stats.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const report: BacklinkReport = {
      totalBacklinks: backlinks.filter((bl) => bl.status === 'active').length,
      newBacklinks: newBacklinks.map((bl) => ({
        sourceUrl: bl.sourceUrl,
        targetUrl: bl.targetUrl,
        anchorText: bl.anchorText || '',
        domainRating: bl.domainRating || 0,
        firstSeen: bl.firstSeen,
        lastSeen: bl.lastSeen,
        status: bl.status as 'active' | 'lost',
      })),
      lostBacklinks: lostBacklinks.map((bl) => ({
        sourceUrl: bl.sourceUrl,
        targetUrl: bl.targetUrl,
        anchorText: bl.anchorText || '',
        domainRating: bl.domainRating || 0,
        firstSeen: bl.firstSeen,
        lastSeen: bl.lastSeen,
        status: bl.status as 'active' | 'lost',
      })),
      topReferringDomains,
      changes: {
        new: newBacklinks.length,
        lost: lostBacklinks.length,
        netChange: newBacklinks.length - lostBacklinks.length,
      },
    };

    await prisma.$disconnect();
    return report;
  } catch (error) {
    console.error('Error checking backlinks:', error);
    await prisma.$disconnect();
    throw error;
  }
}

export async function monitorBacklinkHealth(): Promise<{
  alerts: string[];
  summary: any;
}> {
  const report = await checkBacklinks();
  const alerts: string[] = [];

  // Alert if we lost high-DR backlinks
  const highDRLosses = report.lostBacklinks.filter((bl) => bl.domainRating >= 50);
  if (highDRLosses.length > 0) {
    alerts.push(
      `⚠️ Lost ${highDRLosses.length} high-authority backlink(s) (DR 50+)`
    );
  }

  // Alert if backlink count dropped significantly
  if (report.changes.netChange < -10) {
    alerts.push(
      `⚠️ Significant backlink loss: ${Math.abs(report.changes.netChange)} net backlinks lost`
    );
  }

  // Positive alerts
  if (report.changes.new > 5) {
    alerts.push(`✅ Great! Gained ${report.changes.new} new backlinks this week`);
  }

  return {
    alerts,
    summary: {
      totalBacklinks: report.totalBacklinks,
      newThisWeek: report.changes.new,
      lostThisWeek: report.changes.lost,
      netChange: report.changes.netChange,
      topDomains: report.topReferringDomains.slice(0, 5),
    },
  };
}
