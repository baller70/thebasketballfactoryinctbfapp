
/**
 * SEO Page Speed Monitoring
 * Monitors page load times and identifies performance issues
 */

interface PageSpeedMetrics {
  pagePath: string;
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  speedScore: number;
  issues: string[];
}

interface PageSpeedReport {
  url: string;
  metrics: PageSpeedMetrics;
  recommendations: string[];
  priority: 'critical' | 'important' | 'minor';
}

export async function monitorPageSpeed(pagePaths?: string[]): Promise<PageSpeedReport[]> {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const whereClause = pagePaths
      ? { pagePath: { in: pagePaths }, status: 'active' }
      : { status: 'active' };

    const pages = await prisma.sEOPageConfig.findMany({
      where: whereClause,
      take: 20, // Limit to avoid overwhelming the system
    });

    const reports: PageSpeedReport[] = [];

    for (const page of pages) {
      // Simulate page speed metrics (in production, use Google PageSpeed Insights API)
      const metrics = generateMockPageSpeedMetrics(page.pagePath);
      const recommendations = generateRecommendations(metrics);
      const priority = determinePriority(metrics);

      reports.push({
        url: `https://thebasketballfactoryinc.com${page.pagePath}`,
        metrics,
        recommendations,
        priority,
      });

      // Log slow pages
      if (metrics.speedScore < 70) {
        await prisma.sEOAuditLog.create({
          data: {
            action: 'page_speed_issue',
            entityType: 'page',
            entityId: page.id.toString(),
            performedBy: 'system_automation',
            changes: {
              pagePath: page.pagePath,
              speedScore: metrics.speedScore,
              loadTime: metrics.loadTime,
              issues: metrics.issues,
            },
          },
        });
      }
    }

    await prisma.$disconnect();
    return reports;
  } catch (error) {
    await prisma.$disconnect();
    throw error;
  }
}

function generateMockPageSpeedMetrics(pagePath: string): PageSpeedMetrics {
  // This is a placeholder. In production, integrate with Google PageSpeed Insights API
  // or use real performance monitoring data

  const baseLoadTime = 2000 + Math.random() * 3000; // 2-5 seconds
  const isImageHeavy = pagePath.includes('/programs/') || pagePath === '/';

  const loadTime = isImageHeavy ? baseLoadTime * 1.3 : baseLoadTime;
  const fcp = loadTime * 0.4;
  const lcp = loadTime * 0.7;
  const cls = Math.random() * 0.2;
  const tti = loadTime * 0.9;

  const issues: string[] = [];

  if (loadTime > 4000) issues.push('Slow server response time');
  if (lcp > 2500) issues.push('Large Contentful Paint needs optimization');
  if (cls > 0.1) issues.push('Cumulative Layout Shift detected');
  if (tti > 3500) issues.push('Time to Interactive is high');
  if (isImageHeavy) issues.push('Large images affecting load time');

  const speedScore = Math.max(0, Math.min(100, 100 - (loadTime - 2000) / 50));

  return {
    pagePath,
    loadTime: Math.round(loadTime),
    firstContentfulPaint: Math.round(fcp),
    largestContentfulPaint: Math.round(lcp),
    cumulativeLayoutShift: Math.round(cls * 1000) / 1000,
    timeToInteractive: Math.round(tti),
    speedScore: Math.round(speedScore),
    issues,
  };
}

function generateRecommendations(metrics: PageSpeedMetrics): string[] {
  const recommendations: string[] = [];

  if (metrics.loadTime > 4000) {
    recommendations.push('Enable server-side caching');
    recommendations.push('Use a CDN for static assets');
  }

  if (metrics.largestContentfulPaint > 2500) {
    recommendations.push('Optimize and compress images');
    recommendations.push('Implement lazy loading for images');
    recommendations.push('Use Next.js Image component for automatic optimization');
  }

  if (metrics.cumulativeLayoutShift > 0.1) {
    recommendations.push('Set explicit width and height for images');
    recommendations.push('Reserve space for dynamic content');
    recommendations.push('Avoid inserting content above existing content');
  }

  if (metrics.timeToInteractive > 3500) {
    recommendations.push('Minimize JavaScript execution time');
    recommendations.push('Code-split large JavaScript bundles');
    recommendations.push('Defer non-critical JavaScript');
  }

  if (metrics.issues.includes('Large images affecting load time')) {
    recommendations.push('Convert images to WebP format');
    recommendations.push('Implement responsive images with srcset');
    recommendations.push('Use modern image formats (AVIF, WebP)');
  }

  return recommendations;
}

function determinePriority(metrics: PageSpeedMetrics): 'critical' | 'important' | 'minor' {
  if (metrics.speedScore < 50 || metrics.loadTime > 5000) {
    return 'critical';
  }
  if (metrics.speedScore < 70 || metrics.loadTime > 3500) {
    return 'important';
  }
  return 'minor';
}

export async function getPageSpeedSummary() {
  const reports = await monitorPageSpeed();

  const summary = {
    total: reports.length,
    critical: reports.filter((r) => r.priority === 'critical').length,
    important: reports.filter((r) => r.priority === 'important').length,
    minor: reports.filter((r) => r.priority === 'minor').length,
    avgSpeedScore:
      reports.reduce((sum, r) => sum + r.metrics.speedScore, 0) / reports.length || 0,
    avgLoadTime: reports.reduce((sum, r) => sum + r.metrics.loadTime, 0) / reports.length || 0,
    slowestPages: reports
      .sort((a, b) => b.metrics.loadTime - a.metrics.loadTime)
      .slice(0, 5)
      .map((r) => ({
        url: r.url,
        loadTime: r.metrics.loadTime,
        speedScore: r.metrics.speedScore,
      })),
  };

  return summary;
}
