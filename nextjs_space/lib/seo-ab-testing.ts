
/**
 * SEO A/B Testing
 * Tests different titles and meta descriptions for optimization
 */

interface ABTest {
  id: string;
  pagePath: string;
  elementType: 'title' | 'meta_description';
  variantA: string;
  variantB: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'paused';
  results?: {
    variantA: { impressions: number; clicks: number; ctr: number };
    variantB: { impressions: number; clicks: number; ctr: number };
    winner: 'A' | 'B' | 'inconclusive';
    confidence: number;
  };
}

interface ABTestConfig {
  pagePath: string;
  elementType: 'title' | 'meta_description';
  variantA: string;
  variantB: string;
  duration: number; // days
}

export async function createABTest(config: ABTestConfig): Promise<string> {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + config.duration * 24 * 60 * 60 * 1000);

    // Store test configuration in audit log
    const testId = `ab_test_${Date.now()}`;

    await prisma.sEOAuditLog.create({
      data: {
        action: 'ab_test_created',
        entityType: 'page',
        entityId: config.pagePath,
        performedBy: 'system_automation',
        changes: {
          testId,
          elementType: config.elementType,
          variantA: config.variantA,
          variantB: config.variantB,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          status: 'active',
        },
      },
    });

    await prisma.$disconnect();
    return testId;
  } catch (error) {
    await prisma.$disconnect();
    throw error;
  }
}

export async function analyzeABTest(testId: string): Promise<ABTest['results']> {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    // In production, this would analyze real performance data
    // For now, we'll simulate results

    const variantAImpressions = 1000 + Math.floor(Math.random() * 500);
    const variantBImpressions = 1000 + Math.floor(Math.random() * 500);

    const variantACTR = 2.0 + Math.random() * 2.0;
    const variantBCTR = 2.5 + Math.random() * 2.0;

    const variantAClicks = Math.floor((variantAImpressions * variantACTR) / 100);
    const variantBClicks = Math.floor((variantBImpressions * variantBCTR) / 100);

    // Calculate statistical significance
    const confidence = calculateConfidence(
      variantAClicks,
      variantAImpressions,
      variantBClicks,
      variantBImpressions
    );

    let winner: 'A' | 'B' | 'inconclusive';
    if (confidence < 0.95) {
      winner = 'inconclusive';
    } else {
      winner = variantBCTR > variantACTR ? 'B' : 'A';
    }

    const results = {
      variantA: {
        impressions: variantAImpressions,
        clicks: variantAClicks,
        ctr: variantACTR,
      },
      variantB: {
        impressions: variantBImpressions,
        clicks: variantBClicks,
        ctr: variantBCTR,
      },
      winner,
      confidence,
    };

    await prisma.$disconnect();
    return results;
  } catch (error) {
    await prisma.$disconnect();
    throw error;
  }
}

function calculateConfidence(
  clicksA: number,
  impressionsA: number,
  clicksB: number,
  impressionsB: number
): number {
  // Simplified confidence calculation
  // In production, use proper statistical significance testing (chi-square, etc.)

  const sampleSize = Math.min(impressionsA, impressionsB);

  if (sampleSize < 100) return 0;
  if (sampleSize < 500) return 0.8;
  if (sampleSize < 1000) return 0.9;

  const ctrA = clicksA / impressionsA;
  const ctrB = clicksB / impressionsB;
  const diff = Math.abs(ctrA - ctrB);

  if (diff < 0.005) return 0.7; // Less than 0.5% difference
  if (diff < 0.01) return 0.85; // Less than 1% difference
  if (diff < 0.02) return 0.95; // Less than 2% difference

  return 0.99; // Significant difference
}

export async function suggestABTests(): Promise<ABTestConfig[]> {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' },
      include: {
        targetKeywords: true,
      },
    });

    const suggestions: ABTestConfig[] = [];

    for (const page of pages) {
      // Get performance data for this page
      const performance = await prisma.sEOPerformance.findMany({
        where: { pagePath: page.pagePath },
        orderBy: { date: 'desc' },
        take: 30,
      });

      if (performance.length === 0) continue;

      const totalImpressions = performance.reduce((sum, p) => sum + (p.impressions || 0), 0);
      const totalClicks = performance.reduce((sum, p) => sum + (p.clicks || 0), 0);
      const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

      // Suggest A/B test for pages with decent impressions but low CTR
      if (totalImpressions > 500 && avgCTR < 3) {
        const currentTitle = page.pageTitle || '';
        const currentMeta = page.metaDescription || '';

        // Generate variant B (optimized version)
        let variantBTitle = currentTitle;
        if (!currentTitle.includes('NJ') && !currentTitle.includes('New Jersey')) {
          variantBTitle = `${currentTitle} | NJ`;
        } else {
          variantBTitle = `🏀 ${currentTitle} - Professional Training`;
        }

        suggestions.push({
          pagePath: page.pagePath,
          elementType: 'title',
          variantA: currentTitle,
          variantB: variantBTitle,
          duration: 30,
        });

        // Also suggest meta description test
        const variantBMeta = currentMeta.includes('Register')
          ? currentMeta.replace('Register', 'Enroll today')
          : `${currentMeta} Call (909) 577-9171.`;

        suggestions.push({
          pagePath: page.pagePath,
          elementType: 'meta_description',
          variantA: currentMeta,
          variantB: variantBMeta,
          duration: 30,
        });
      }
    }

    await prisma.$disconnect();
    return suggestions.slice(0, 10); // Top 10 suggestions
  } catch (error) {
    await prisma.$disconnect();
    throw error;
  }
}
