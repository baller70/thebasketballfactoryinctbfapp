
/**
 * SEO Competitor Tracking
 * Monitors competitors and identifies opportunities
 */

interface CompetitorData {
  domain: string;
  domainRating: number;
  organicKeywords: number;
  organicTraffic: number;
  backlinks: number;
  topKeywords: { keyword: string; position: number; searchVolume: number }[];
  contentGaps: string[];
  strengths: string[];
  weaknesses: string[];
}

interface CompetitorOpportunity {
  type: 'keyword' | 'content' | 'backlink';
  priority: 'high' | 'medium' | 'low';
  competitor: string;
  opportunity: string;
  actionable: string;
  estimatedImpact: string;
}

export async function analyzeCompetitors(): Promise<CompetitorData[]> {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const competitors = await prisma.sEOCompetitor.findMany({
      where: { isActive: true },
      orderBy: { domainRating: 'desc' },
    });

    const competitorData: CompetitorData[] = competitors.map((comp) => {
      // In production, this data would come from Ahrefs/SEMrush API
      // For now, using data from database
      return {
        domain: comp.domain,
        domainRating: comp.domainRating || 0,
        organicKeywords: comp.organicKeywords || 0,
        organicTraffic: comp.organicTraffic || 0,
        backlinks: comp.backlinks || 0,
        topKeywords: (comp.topKeywords as any[]) || [],
        contentGaps: comp.contentGaps || [],
        strengths: comp.strengths || [],
        weaknesses: comp.weaknesses || [],
      };
    });

    await prisma.$disconnect();
    return competitorData;
  } catch (error) {
    console.error('Error analyzing competitors:', error);
    await prisma.$disconnect();
    throw error;
  }
}

function analyzeStrengths(competitor: any): string[] {
  const strengths: string[] = [];

  if (competitor.domainRating && competitor.domainRating > 50) {
    strengths.push('High domain authority');
  }

  if (competitor.backlinks && competitor.backlinks > 1000) {
    strengths.push('Strong backlink profile');
  }

  if (competitor.organicTraffic && competitor.organicTraffic > 10000) {
    strengths.push('High organic traffic');
  }

  if (competitor.organicKeywords && competitor.organicKeywords > 500) {
    strengths.push('Diverse keyword portfolio');
  }

  return strengths;
}

function analyzeWeaknesses(competitor: any): string[] {
  const weaknesses: string[] = [];

  if (competitor.domainRating && competitor.domainRating < 30) {
    weaknesses.push('Lower domain authority');
  }

  if (competitor.backlinks && competitor.backlinks < 100) {
    weaknesses.push('Limited backlink profile');
  }

  if (!competitor.organicTraffic || competitor.organicTraffic < 1000) {
    weaknesses.push('Low organic traffic');
  }

  return weaknesses;
}

export async function identifyKeywordGaps(): Promise<CompetitorOpportunity[]> {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    // Get our current keywords
    const ourKeywords = await prisma.sEOKeyword.findMany({
      where: { isActive: true },
    });

    const ourKeywordSet = new Set(ourKeywords.map((k) => k.keyword.toLowerCase()));

    // Get competitor content gaps
    const contentGaps = await prisma.sEOContentGap.findMany({
      where: {
        status: { in: ['open', 'in_progress'] },
        priority: { in: ['high', 'medium'] },
      },
      orderBy: { searchVolume: 'desc' },
      take: 20,
    });

    const opportunities: CompetitorOpportunity[] = [];

    for (const gap of contentGaps) {
      // If we're not targeting this keyword, it's an opportunity
      if (!ourKeywordSet.has(gap.keyword.toLowerCase())) {
        opportunities.push({
          type: 'keyword',
          priority: gap.priority as 'high' | 'medium' | 'low',
          competitor: gap.competitorDomain || 'Multiple competitors',
          opportunity: `Target keyword "${gap.keyword}" (${gap.searchVolume || 0} monthly searches)`,
          actionable: `Create content optimized for "${gap.keyword}". Competitor ranking at position ${gap.competitorPosition || 'N/A'}.`,
          estimatedImpact: gap.searchVolume && gap.searchVolume > 1000
            ? 'High traffic potential'
            : 'Medium traffic potential',
        });
      }
    }

    // Add specific basketball training opportunities if not already in database
    const localOpportunities = [
      {
        keyword: 'basketball training near me',
        competitor: 'Local competitors',
        searchVolume: 2400,
      },
      {
        keyword: 'youth basketball camps nj',
        competitor: 'Youth Sports Organizations',
        searchVolume: 1200,
      },
      {
        keyword: 'private basketball coach sparta nj',
        competitor: 'Individual coaches',
        searchVolume: 320,
      },
    ];

    for (const local of localOpportunities) {
      if (!ourKeywordSet.has(local.keyword.toLowerCase())) {
        opportunities.push({
          type: 'keyword',
          priority: 'high',
          competitor: local.competitor,
          opportunity: `Target local keyword "${local.keyword}"`,
          actionable: `Optimize homepage and program pages for "${local.keyword}". Add location-specific content.`,
          estimatedImpact: `${local.searchVolume} monthly searches - High conversion potential`,
        });
      }
    }

    await prisma.$disconnect();
    return opportunities.slice(0, 15); // Top 15 opportunities
  } catch (error) {
    console.error('Error identifying keyword gaps:', error);
    await prisma.$disconnect();
    throw error;
  }
}

export async function trackCompetitorChanges(): Promise<{
  alerts: string[];
  summary: any;
}> {
  const competitors = await analyzeCompetitors();
  const alerts: string[] = [];

  // Check for significant competitor improvements
  for (const comp of competitors) {
    if (comp.organicTraffic > 50000) {
      alerts.push(
        `⚠️ ${comp.domain} has high organic traffic (${comp.organicTraffic.toLocaleString()}). Monitor their strategy.`
      );
    }

    if (comp.domainRating > 60) {
      alerts.push(
        `📊 ${comp.domain} has strong domain authority (DR ${comp.domainRating}). Consider backlink opportunities.`
      );
    }
  }

  // Positive alerts
  const weaker = competitors.filter((c) => c.domainRating < 40);
  if (weaker.length > 0) {
    alerts.push(
      `✅ ${weaker.length} competitor(s) with lower domain authority - opportunity to outrank`
    );
  }

  return {
    alerts,
    summary: {
      totalCompetitors: competitors.length,
      avgDomainRating:
        competitors.reduce((sum, c) => sum + c.domainRating, 0) / competitors.length || 0,
      topCompetitor: competitors[0]?.domain || 'None',
      opportunities: await identifyKeywordGaps(),
    },
  };
}
