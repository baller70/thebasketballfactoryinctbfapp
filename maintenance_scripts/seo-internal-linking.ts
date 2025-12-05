/**
 * Automated Internal Linking Suggestions Script
 * Runs weekly to analyze content and suggest strategic internal links
 */

import { PrismaClient } from '@prisma/client';
import { format, subDays } from 'date-fns';

const prisma = new PrismaClient();

interface LinkSuggestion {
  sourcePage: string;
  targetPage: string;
  anchorText: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Calculate page authority score based on performance
 */
async function calculatePageAuthority(pagePath: string): Promise<number> {
  const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');
  
  const performance = await prisma.sEOPerformance.findMany({
    where: {
      pagePath,
      dateKey: { gte: thirtyDaysAgo }
    }
  });

  if (performance.length === 0) return 0;

  const totalClicks = performance.reduce((sum, p) => sum + (p.clicks || 0), 0);
  const totalTraffic = performance.reduce((sum, p) => sum + (p.organicTraffic || 0), 0);
  const avgPosition = performance.reduce((sum, p) => sum + (p.position || 100), 0) / performance.length;

  // Higher score = better page authority
  const authorityScore = (totalClicks * 2) + totalTraffic + (100 - avgPosition);
  return authorityScore;
}

/**
 * Find related pages based on keywords
 */
function findRelatedPages(sourcePage: any, allPages: any[]): any[] {
  const sourceKeywords = sourcePage.targetKeywords || [];
  
  return allPages
    .filter(page => page.id !== sourcePage.id && page.isActive)
    .map(page => {
      const targetKeywords = page.targetKeywords || [];
      // Count overlapping keywords
      const overlap = sourceKeywords.filter((kw: string) => 
        targetKeywords.some((tk: string) => tk.toLowerCase().includes(kw.toLowerCase()))
      ).length;
      
      return { page, overlap };
    })
    .filter(({ overlap }) => overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .map(({ page }) => page);
}

/**
 * Generate link suggestions for a page
 */
async function generateLinkSuggestions(
  sourcePage: any,
  allPages: any[]
): Promise<LinkSuggestion[]> {
  const suggestions: LinkSuggestion[] = [];
  
  // Find related pages
  const relatedPages = findRelatedPages(sourcePage, allPages);
  
  // Get authority scores for related pages
  const pageAuthorities = await Promise.all(
    relatedPages.slice(0, 10).map(async page => ({
      page,
      authority: await calculatePageAuthority(page.pagePath)
    }))
  );

  // Sort by authority (link to high-authority pages)
  pageAuthorities.sort((a, b) => b.authority - a.authority);

  // Generate suggestions for top 5 related high-authority pages
  for (const { page, authority } of pageAuthorities.slice(0, 5)) {
    const primaryKeyword = page.targetKeywords?.[0] || page.pageTitle;
    
    suggestions.push({
      sourcePage: sourcePage.pagePath,
      targetPage: page.pagePath,
      anchorText: primaryKeyword,
      reason: `High authority page (score: ${authority.toFixed(0)}) with related keywords`,
      priority: authority > 1000 ? 'high' : authority > 500 ? 'medium' : 'low'
    });
  }

  return suggestions;
}

/**
 * Main internal linking analysis function
 */
async function runInternalLinkingAnalysis() {
  console.log('🔄 Starting internal linking analysis...');
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

  try {
    // Get all active pages
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' }
    });

    console.log(`📄 Analyzing ${pages.length} active pages...`);

    const allSuggestions: LinkSuggestion[] = [];

    // Generate suggestions for each page
    for (const page of pages) {
      const suggestions = await generateLinkSuggestions(page, pages);
      allSuggestions.push(...suggestions);
    }

    // Group by priority
    const highPriority = allSuggestions.filter(s => s.priority === 'high');
    const mediumPriority = allSuggestions.filter(s => s.priority === 'medium');
    const lowPriority = allSuggestions.filter(s => s.priority === 'low');

    console.log(`\n📊 Link Suggestions Summary:`);
    console.log(`   High Priority: ${highPriority.length}`);
    console.log(`   Medium Priority: ${mediumPriority.length}`);
    console.log(`   Low Priority: ${lowPriority.length}`);
    console.log(`   Total: ${allSuggestions.length}`);

    // Display top 10 high-priority suggestions
    console.log(`\n🔗 Top 10 High-Priority Link Suggestions:`);
    highPriority.slice(0, 10).forEach((suggestion, index) => {
      console.log(`\n${index + 1}. ${suggestion.sourcePage} → ${suggestion.targetPage}`);
      console.log(`   Anchor: "${suggestion.anchorText}"`);
      console.log(`   Reason: ${suggestion.reason}`);
    });

    // Store suggestions in database (as audit log for now)
    await prisma.sEOAuditLog.create({
      data: {
        action: 'internal_linking_analysis',
        entityType: 'pages',
        performedBy: 'system',
        changes: JSON.parse(JSON.stringify({
          pagesAnalyzed: pages.length,
          suggestionsGenerated: allSuggestions.length,
          highPriority: highPriority.length,
          mediumPriority: mediumPriority.length,
          lowPriority: lowPriority.length,
          topSuggestions: highPriority.slice(0, 10),
          timestamp: new Date().toISOString()
        }))
      }
    });

    console.log('\n✅ Internal linking analysis completed successfully');
    return {
      success: true,
      pagesAnalyzed: pages.length,
      suggestionsGenerated: allSuggestions.length,
      suggestions: allSuggestions
    };
  } catch (error) {
    console.error('❌ Internal linking analysis failed:', error);
    
    await prisma.sEOAuditLog.create({
      data: {
        action: 'internal_linking_analysis_failed',
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
  runInternalLinkingAnalysis()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

export { runInternalLinkingAnalysis };
