
/**
 * SEO AI Content Suggestions
 * Provides AI-powered recommendations for content optimization
 */

interface ContentSuggestion {
  pagePath: string;
  currentPerformance: {
    position: number;
    clicks: number;
    impressions: number;
    ctr: number;
  };
  suggestions: {
    type: 'title' | 'meta' | 'content' | 'keywords' | 'structure';
    priority: 'high' | 'medium' | 'low';
    suggestion: string;
    expectedImpact: string;
  }[];
}

export async function generateAISuggestions(
  pagePath?: string
): Promise<ContentSuggestion[]> {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const whereClause = pagePath ? { pagePath, status: 'active' } : { status: 'active' };

    const pages = await prisma.sEOPageConfig.findMany({
      where: whereClause,
      include: {
        targetKeywords: true,
      },
      take: pagePath ? 1 : 10,
    });

    const suggestions: ContentSuggestion[] = [];

    for (const page of pages) {
      // Get performance data separately
      const performance = await prisma.sEOPerformance.findMany({
        where: { pagePath: page.pagePath },
        orderBy: { dateKey: 'desc' },
        take: 30,
      });

      if (performance.length === 0) continue;

      // Calculate average metrics
      const avgPosition =
        performance.reduce((sum: number, p) => sum + (p.position || 0), 0) /
        performance.length;
      const totalImpressions = performance.reduce((sum: number, p) => sum + (p.impressions || 0), 0);
      const totalClicks = performance.reduce((sum: number, p) => sum + (p.clicks || 0), 0);
      const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

      const pageSuggestions: ContentSuggestion['suggestions'] = [];

      // Title optimization
      if (avgCTR < 3 && avgPosition <= 10) {
        pageSuggestions.push({
          type: 'title',
          priority: 'high',
          suggestion: `Revise page title to include power words and local targeting. Current CTR (${avgCTR.toFixed(2)}%) is below industry average for position ${Math.round(avgPosition)}. Consider adding "NJ" or "New Jersey" if not present.`,
          expectedImpact: `+15-25% CTR improvement`,
        });
      }

      // Meta description optimization
      if (avgCTR < 2.5) {
        const firstKeyword = page.targetKeywords && page.targetKeywords[0];
        pageSuggestions.push({
          type: 'meta',
          priority: 'high',
          suggestion: `Optimize meta description with compelling call-to-action and unique value proposition. Include primary keyword "${firstKeyword?.keyword || 'basketball training'}" naturally.`,
          expectedImpact: `+10-20% CTR improvement`,
        });
      }

      // Keyword optimization
      if (avgPosition > 10 && avgPosition <= 20) {
        pageSuggestions.push({
          type: 'keywords',
          priority: 'medium',
          suggestion: `Page is on page 2 (position ${Math.round(avgPosition)}). Increase keyword density and add semantic variations. Consider adding FAQ section with long-tail keywords.`,
          expectedImpact: `Potential to reach page 1 within 2-3 months`,
        });
      }

      // Content structure
      if (avgPosition > 5) {
        pageSuggestions.push({
          type: 'structure',
          priority: 'medium',
          suggestion: `Enhance content structure with clear H2/H3 headings, bullet points, and featured snippets optimization. Add "People Also Ask" section to target featured snippets.`,
          expectedImpact: `Better user engagement and potential featured snippet`,
        });
      }

      // Content freshness
      const daysSinceUpdate = page.lastPublished
        ? Math.floor(
            (Date.now() - page.lastPublished.getTime()) / (1000 * 60 * 60 * 24)
          )
        : 999;

      if (daysSinceUpdate > 60) {
        pageSuggestions.push({
          type: 'content',
          priority: 'medium',
          suggestion: `Content hasn't been updated in ${daysSinceUpdate} days. Add fresh statistics, recent success stories, or updated program information to signal freshness to Google.`,
          expectedImpact: `+5-10% ranking improvement`,
        });
      }

      // Low impressions strategy
      if (totalImpressions < 100 && avgPosition > 20) {
        pageSuggestions.push({
          type: 'content',
          priority: 'high',
          suggestion: `Low visibility (${totalImpressions} impressions). Consider targeting less competitive long-tail keywords and building internal links from high-authority pages.`,
          expectedImpact: `Significant visibility increase`,
        });
      }

      suggestions.push({
        pagePath: page.pagePath,
        currentPerformance: {
          position: Math.round(avgPosition),
          clicks: totalClicks,
          impressions: totalImpressions,
          ctr: avgCTR,
        },
        suggestions: pageSuggestions.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }),
      });
    }

    await prisma.$disconnect();

    return suggestions.filter((s) => s.suggestions.length > 0);
  } catch (error) {
    await prisma.$disconnect();
    throw error;
  }
}

export async function applyAISuggestions(
  pagePath: string,
  suggestionTypes: string[]
): Promise<boolean> {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    // Log that AI suggestions are being applied
    await prisma.sEOAuditLog.create({
      data: {
        action: 'ai_suggestions_applied',
        entityType: 'page',
        entityId: pagePath,
        performedBy: 'system_automation',
        changes: {
          suggestionTypes,
          timestamp: new Date().toISOString(),
        },
      },
    });

    await prisma.$disconnect();
    return true;
  } catch (error) {
    await prisma.$disconnect();
    throw error;
  }
}
