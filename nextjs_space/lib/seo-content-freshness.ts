
/**
 * SEO Content Freshness Automation
 * Updates page timestamps and identifies stale content
 */

interface ContentFreshnessReport {
  stalePage: string;
  lastModified: Date | null;
  daysSinceUpdate: number;
  avgPosition: number;
  needsUpdate: boolean;
  priority: 'high' | 'medium' | 'low';
}

export async function analyzeContentFreshness(): Promise<ContentFreshnessReport[]> {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' },
    });

    const reports: ContentFreshnessReport[] = [];
    const now = new Date();

    for (const page of pages) {
      const lastModified = page.lastPublished || page.updatedAt;
      const daysSinceUpdate = Math.floor(
        (now.getTime() - lastModified.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Get performance data separately
      const performance = await prisma.sEOPerformance.findMany({
        where: { pagePath: page.pagePath },
        orderBy: { dateKey: 'desc' },
        take: 30,
      });

      // Calculate average position
      let avgPosition = 0;
      if (performance.length > 0) {
        avgPosition =
          performance.reduce((sum: number, p) => sum + (p.position || 0), 0) / performance.length;
      }

      // Determine if update is needed
      let needsUpdate = false;
      let priority: 'high' | 'medium' | 'low' = 'low';

      // High priority: Pages not updated in 60+ days with declining performance
      if (daysSinceUpdate > 60 && avgPosition > 10) {
        needsUpdate = true;
        priority = 'high';
      }
      // Medium priority: Pages not updated in 30+ days
      else if (daysSinceUpdate > 30) {
        needsUpdate = true;
        priority = 'medium';
      }
      // Low priority: Pages not updated in 14+ days with poor performance
      else if (daysSinceUpdate > 14 && avgPosition > 20) {
        needsUpdate = true;
        priority = 'low';
      }

      reports.push({
        stalePage: page.pagePath,
        lastModified,
        daysSinceUpdate,
        avgPosition,
        needsUpdate,
        priority,
      });
    }

    await prisma.$disconnect();

    // Sort by priority and days since update
    return reports
      .filter((r) => r.needsUpdate)
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return b.daysSinceUpdate - a.daysSinceUpdate;
      });
  } catch (error) {
    await prisma.$disconnect();
    throw error;
  }
}

export async function updateContentTimestamps(pagePaths?: string[]): Promise<number> {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const whereClause = pagePaths
      ? { pagePath: { in: pagePaths }, status: 'active' }
      : { status: 'active' };

    const result = await prisma.sEOPageConfig.updateMany({
      where: whereClause,
      data: {
        lastPublished: new Date(),
      },
    });

    // Log the update
    await prisma.sEOAuditLog.create({
      data: {
        action: 'content_freshness_updated',
        entityType: 'page',
        entityId: pagePaths?.join(',') || 'all_pages',
        performedBy: 'system_automation',
        changes: {
          pagesUpdated: result.count,
          timestamp: new Date().toISOString(),
        },
      },
    });

    await prisma.$disconnect();
    return result.count;
  } catch (error) {
    await prisma.$disconnect();
    throw error;
  }
}

export async function autoUpdateStaleContent(dryRun = false): Promise<ContentFreshnessReport[]> {
  const stalePages = await analyzeContentFreshness();

  if (!dryRun && stalePages.length > 0) {
    const pagePaths = stalePages.map((p) => p.stalePage);
    await updateContentTimestamps(pagePaths);
  }

  return stalePages;
}
