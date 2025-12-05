
/**
 * SEO Internal Linking Automation
 * Automatically suggests and creates internal links between related content
 */

interface InternalLinkSuggestion {
  sourcePage: string;
  targetPage: string;
  anchorText: string;
  relevanceScore: number;
  reason: string;
}

interface PageRelationship {
  page1: string;
  page2: string;
  sharedKeywords: string[];
  similarityScore: number;
}

export function calculatePageSimilarity(
  page1Keywords: string[],
  page2Keywords: string[],
  page1Path: string,
  page2Path: string
): number {
  // Don't link a page to itself
  if (page1Path === page2Path) return 0;

  // Calculate keyword overlap
  const shared = page1Keywords.filter((k) => page2Keywords.includes(k));
  const uniqueKeywords = new Set([...page1Keywords, ...page2Keywords]);
  const union = Array.from(uniqueKeywords);
  const keywordSimilarity = shared.length / union.length;

  // Boost similarity for related program pages
  let categoryBonus = 0;
  if (page1Path.includes('/programs/') && page2Path.includes('/programs/')) {
    // High school programs should link to each other
    if (page1Path.includes('high-school') && page2Path.includes('high-school')) categoryBonus = 0.3;
    // Middle school programs should link to each other
    if (page1Path.includes('middle-school') && page2Path.includes('middle-school')) categoryBonus = 0.3;
    // Youth programs should link to each other
    if (page1Path.includes('youth') && page2Path.includes('youth')) categoryBonus = 0.3;
    // Seasonal programs should link to each other
    if (
      (page1Path.includes('fall') && page2Path.includes('fall')) ||
      (page1Path.includes('winter') && page2Path.includes('winter')) ||
      (page1Path.includes('spring') && page2Path.includes('spring')) ||
      (page1Path.includes('summer') && page2Path.includes('summer'))
    ) {
      categoryBonus = 0.2;
    }
  }

  // Private lessons should link to program pages
  if (
    (page1Path === '/private-lessons' && page2Path.includes('/programs/')) ||
    (page2Path === '/private-lessons' && page1Path.includes('/programs/'))
  ) {
    categoryBonus = 0.15;
  }

  return Math.min(keywordSimilarity + categoryBonus, 1.0);
}

export function generateAnchorText(targetPage: string, keywords: string[]): string {
  // Extract page name
  const pageName = targetPage
    .split('/')
    .pop()
    ?.split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  // Program pages
  if (targetPage.includes('/programs/')) {
    if (targetPage.includes('high-school')) {
      return `high school basketball training programs`;
    }
    if (targetPage.includes('middle-school')) {
      return `middle school basketball development`;
    }
    if (targetPage.includes('youth')) {
      return `youth basketball programs`;
    }
    if (targetPage.includes('fall')) {
      return `fall basketball training`;
    }
    if (targetPage.includes('winter')) {
      return `winter basketball programs`;
    }
    if (targetPage.includes('spring')) {
      return `spring basketball circuit`;
    }
    if (targetPage.includes('summer')) {
      return `summer basketball camps`;
    }
    return `${pageName} program`;
  }

  // Private lessons
  if (targetPage === '/private-lessons') {
    return 'private basketball lessons';
  }

  // Seasonal overview pages
  if (targetPage.includes('-programs') && !targetPage.includes('/programs/')) {
    const season = targetPage.split('-')[0].replace('/', '');
    return `${season} basketball programs`;
  }

  // Default
  return pageName || targetPage;
}

export async function suggestInternalLinks(): Promise<InternalLinkSuggestion[]> {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' },
      include: { targetKeywords: true },
    });

    const suggestions: InternalLinkSuggestion[] = [];

    // Compare each page with every other page
    for (let i = 0; i < pages.length; i++) {
      for (let j = i + 1; j < pages.length; j++) {
        const page1 = pages[i];
        const page2 = pages[j];

        const page1Keywords = page1.targetKeywords.map((k) => k.keyword);
        const page2Keywords = page2.targetKeywords.map((k) => k.keyword);

        const similarity = calculatePageSimilarity(
          page1Keywords,
          page2Keywords,
          page1.pagePath,
          page2.pagePath
        );

        // Only suggest links with meaningful similarity
        if (similarity > 0.2) {
          // page1 -> page2
          suggestions.push({
            sourcePage: page1.pagePath,
            targetPage: page2.pagePath,
            anchorText: generateAnchorText(page2.pagePath, page2Keywords),
            relevanceScore: similarity,
            reason: `Related content (${(similarity * 100).toFixed(0)}% similarity)`,
          });

          // page2 -> page1
          suggestions.push({
            sourcePage: page2.pagePath,
            targetPage: page1.pagePath,
            anchorText: generateAnchorText(page1.pagePath, page1Keywords),
            relevanceScore: similarity,
            reason: `Related content (${(similarity * 100).toFixed(0)}% similarity)`,
          });
        }
      }
    }

    await prisma.$disconnect();

    // Sort by relevance score
    return suggestions.sort((a, b) => b.relevanceScore - a.relevanceScore);
  } catch (error) {
    await prisma.$disconnect();
    throw error;
  }
}

export async function autoGenerateInternalLinks(): Promise<InternalLinkSuggestion[]> {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const suggestions = await suggestInternalLinks();

    // Store suggestions in database for admin review
    for (const suggestion of suggestions.slice(0, 50)) {
      // Top 50 suggestions
      await prisma.sEOAuditLog.create({
        data: {
          action: 'internal_link_suggested',
          entityType: 'page',
          entityId: suggestion.sourcePage,
          performedBy: 'system_automation',
          changes: {
            targetPage: suggestion.targetPage,
            anchorText: suggestion.anchorText,
            relevanceScore: suggestion.relevanceScore,
            reason: suggestion.reason,
          },
        },
      });
    }

    await prisma.$disconnect();
    return suggestions;
  } catch (error) {
    await prisma.$disconnect();
    throw error;
  }
}
