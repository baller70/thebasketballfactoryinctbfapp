
/**
 * SEO Meta Description Optimizer
 * Automatically optimizes meta descriptions for low CTR pages
 */

interface MetaOptimizationResult {
  pagePath: string;
  oldMeta: string;
  newMeta: string;
  reason: string;
  aiGenerated: boolean;
}

interface PagePerformance {
  pagePath: string;
  impressions: number;
  clicks: number;
  ctr: number;
  avgPosition: number;
}

export async function analyzeMetaDescriptions() {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    // Get pages with performance data
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' },
    });

    const results: PagePerformance[] = [];

    for (const page of pages) {
      // Get performance data separately
      const performance = await prisma.sEOPerformance.findMany({
        where: { pagePath: page.pagePath },
        orderBy: { dateKey: 'desc' },
        take: 30, // Last 30 days
      });

      if (performance.length > 0) {
        const totalImpressions = performance.reduce((sum: number, p) => sum + (p.impressions || 0), 0);
        const totalClicks = performance.reduce((sum: number, p) => sum + (p.clicks || 0), 0);
        const avgPosition =
          performance.reduce((sum: number, p) => sum + (p.position || 0), 0) / performance.length;

        const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

        results.push({
          pagePath: page.pagePath,
          impressions: totalImpressions,
          clicks: totalClicks,
          ctr,
          avgPosition,
        });
      }
    }

    await prisma.$disconnect();

    // Identify pages with low CTR (below 2% with decent impressions)
    return results
      .filter((page) => page.impressions > 100 && page.ctr < 2.0)
      .sort((a, b) => b.impressions - a.impressions);
  } catch (error) {
    await prisma.$disconnect();
    throw error;
  }
}

export function generateOptimizedMeta(
  pagePath: string,
  currentMeta: string,
  keywords: string[],
  avgPosition: number
): string {
  const baseUrl = 'https://thebasketballfactoryinc.com';

  // Program-specific optimizations
  if (pagePath.includes('/programs/')) {
    const programName = pagePath
      .split('/')
      .pop()
      ?.split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    if (programName?.includes('High School')) {
      return `Transform your game with elite High School basketball training in NJ. Professional coaching, skill development, and competitive prep. Join ${programName} at The Basketball Factory. Register today!`;
    }

    if (programName?.includes('Middle School')) {
      return `Build basketball fundamentals with expert Middle School training in NJ. Age-appropriate coaching, skill mastery, and confidence building. Enroll in ${programName} now!`;
    }

    if (programName?.includes('Youth')) {
      return `Start your child's basketball journey right! Youth basketball programs in NJ with professional coaches. Fun, educational, and skill-focused training. Sign up for ${programName} today!`;
    }

    return `Elevate your basketball skills with ${programName}. Professional training in NJ with experienced coaches. Proven results, flexible schedules, and comprehensive skill development.`;
  }

  // Private Lessons
  if (pagePath === '/private-lessons') {
    return `1-on-1 basketball training in NJ with professional coaches. Personalized skill development, flexible scheduling, and proven results. Book your private basketball lesson at The Basketball Factory today!`;
  }

  // Contact page
  if (pagePath === '/contact-us') {
    return `Contact The Basketball Factory in Sparta, NJ. Get information about our basketball training programs, private lessons, and coaching services. Call (909) 577-9171 or visit us today!`;
  }

  // About pages
  if (pagePath === '/who-we-are' || pagePath === '/director' || pagePath === '/staff') {
    return `Meet The Basketball Factory team! Professional basketball coaches in NJ dedicated to player development. Learn about our coaching philosophy, credentials, and commitment to excellence.`;
  }

  // Home page
  if (pagePath === '/') {
    return `Premier basketball training in Sparta, NJ. Professional coaching for all ages and skill levels. High school, middle school, youth programs, and private lessons. Join The Basketball Factory today!`;
  }

  // Seasonal program pages
  if (pagePath.includes('-programs')) {
    const season = pagePath.split('-')[0].replace('/', '');
    return `Discover ${season} basketball programs at The Basketball Factory in NJ. Expert coaching, skill development, and competitive training for all ages. View schedules and register online today!`;
  }

  // Default optimization
  return `${currentMeta.substring(0, 120)}... Expert basketball training at The Basketball Factory in NJ. Register now!`;
}

export async function autoOptimizeMetaDescriptions(dryRun = false): Promise<MetaOptimizationResult[]> {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const lowCtrPages = await analyzeMetaDescriptions();
    const results: MetaOptimizationResult[] = [];

    for (const page of lowCtrPages) {
      const pageConfig = await prisma.sEOPageConfig.findFirst({
        where: { pagePath: page.pagePath },
        include: { targetKeywords: true },
      });

      if (!pageConfig) continue;

      const keywords = pageConfig.targetKeywords.map((k) => k.keyword);
      const newMeta = generateOptimizedMeta(
        page.pagePath,
        pageConfig.metaDescription || '',
        keywords,
        page.avgPosition
      );

      results.push({
        pagePath: page.pagePath,
        oldMeta: pageConfig.metaDescription || '',
        newMeta,
        reason: `Low CTR (${page.ctr.toFixed(2)}%) with ${page.impressions} impressions`,
        aiGenerated: false,
      });

      if (!dryRun) {
        await prisma.sEOPageConfig.update({
          where: { id: pageConfig.id },
          data: {
            metaDescription: newMeta,
            lastPublished: new Date(),
          },
        });

        // Log the optimization
        await prisma.sEOAuditLog.create({
          data: {
            action: 'meta_optimized',
            entityType: 'page',
            entityId: pageConfig.id.toString(),
            performedBy: 'system_automation',
            changes: {
              oldMeta: pageConfig.metaDescription,
              newMeta,
              ctr: page.ctr,
              impressions: page.impressions,
            },
          },
        });
      }
    }

    await prisma.$disconnect();
    return results;
  } catch (error) {
    await prisma.$disconnect();
    throw error;
  }
}
