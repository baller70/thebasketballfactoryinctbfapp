import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ContentSuggestion {
  page: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  issue: string;
  suggestion: string;
  expectedImpact: string;
  implementation: string;
}

async function generateAIContentSuggestions() {
  console.log('🎯 Starting AI Content Suggestions Generation...');

  try {
    // Get all pages with performance data
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' }
    });

    const suggestions: ContentSuggestion[] = [];

    for (const page of pages) {
      // Get recent performance
      const performance = await prisma.sEOPerformance.findMany({
        where: {
          pagePath: page.pagePath,
          dateKey: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        }
      });

      if (performance.length === 0) continue;

      // Calculate metrics
      const avgPosition = performance.reduce((sum, p) => sum + (p.position || 0), 0) / performance.length;
      const totalImpressions = performance.reduce((sum, p) => sum + p.impressions, 0);
      const totalClicks = performance.reduce((sum, p) => sum + p.clicks, 0);
      const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

      // Generate suggestions based on performance
      const pageSuggestions = await analyzePagePerformance(
        page,
        avgPosition,
        totalImpressions,
        totalClicks,
        avgCTR
      );

      suggestions.push(...pageSuggestions);
    }

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    // Save suggestions to audit log
    await prisma.sEOAuditLog.create({
      data: {
        action: 'ai_content_suggestions_generated',
        entityType: 'content',
        performedBy: 'system',
        changes: JSON.parse(JSON.stringify({
          totalSuggestions: suggestions.length,
          critical: suggestions.filter(s => s.priority === 'critical').length,
          high: suggestions.filter(s => s.priority === 'high').length,
          suggestions: suggestions.slice(0, 20) // Store top 20
        }))
      }
    });

    console.log(`\n✨ AI Content Suggestions Complete!`);
    console.log(`📊 Generated ${suggestions.length} suggestions`);
    console.log(`🔴 Critical: ${suggestions.filter(s => s.priority === 'critical').length}`);
    console.log(`🟠 High: ${suggestions.filter(s => s.priority === 'high').length}`);
    console.log(`🟡 Medium: ${suggestions.filter(s => s.priority === 'medium').length}`);

    return {
      success: true,
      totalSuggestions: suggestions.length,
      suggestions
    };

  } catch (error) {
    console.error('❌ AI content suggestions failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function analyzePagePerformance(
  page: any,
  avgPosition: number,
  impressions: number,
  clicks: number,
  ctr: number
): Promise<ContentSuggestion[]> {
  const suggestions: ContentSuggestion[] = [];
  const contentStrategy = page.contentStrategy ? JSON.parse(page.contentStrategy as string) : {};

  // Critical: Page ranking poorly (position > 20)
  if (avgPosition > 20 && impressions > 50) {
    suggestions.push({
      page: page.pagePath,
      priority: 'critical',
      issue: `Page ranking at position ${avgPosition.toFixed(1)} - very low visibility`,
      suggestion: 'Complete content overhaul needed. Add 800+ words of comprehensive, keyword-rich content. Include FAQs, testimonials, and detailed program information.',
      expectedImpact: 'Could improve ranking by 10-15 positions within 2-3 months',
      implementation: '1. Research top-ranking competitors\n2. Identify content gaps\n3. Write comprehensive new content\n4. Add multimedia (images, videos)\n5. Improve internal linking'
    });
  }

  // High: Low CTR (< 2%) despite decent impressions
  if (ctr < 2 && impressions > 100) {
    suggestions.push({
      page: page.pagePath,
      priority: 'high',
      issue: `Very low CTR (${ctr.toFixed(2)}%) despite ${impressions} impressions`,
      suggestion: 'Rewrite title tag and meta description to be more compelling. Use power words like "Elite", "Transform", "Proven Results". Add urgency with "Limited Spots" or "Register Now".',
      expectedImpact: 'Could double CTR to 4%+ within 2-4 weeks',
      implementation: '1. A/B test new title variations\n2. Add emotional triggers\n3. Include specific benefits\n4. Use numbers and statistics\n5. Add call-to-action'
    });
  }

  // High: Page on page 2 (position 11-20) - close to breaking through
  if (avgPosition > 10 && avgPosition <= 20) {
    suggestions.push({
      page: page.pagePath,
      priority: 'high',
      issue: `Page on page 2 (position ${avgPosition.toFixed(1)}) - so close to page 1!`,
      suggestion: 'Focus on building quality backlinks and improving content depth. Add case studies, success stories, and detailed program breakdowns. Optimize for long-tail keywords.',
      expectedImpact: 'High chance of breaking into page 1 within 4-6 weeks',
      implementation: '1. Get 3-5 quality backlinks\n2. Add 300+ words of detailed content\n3. Optimize for question-based queries\n4. Improve page speed\n5. Add schema markup'
    });
  }

  // Medium: Declining impressions
  if (impressions < 50 && avgPosition < 15) {
    suggestions.push({
      page: page.pagePath,
      priority: 'medium',
      issue: `Low impressions (${impressions}) despite decent ranking`,
      suggestion: 'Target higher search volume keywords. Research what people are actually searching for related to your content. Expand keyword targeting to include related terms.',
      expectedImpact: 'Could increase impressions by 100-200%',
      implementation: '1. Keyword research for high-volume terms\n2. Add secondary keywords naturally\n3. Create content silos\n4. Improve internal linking\n5. Build topical authority'
    });
  }

  // Medium: Missing key elements
  if (!contentStrategy.schemaMarkup) {
    suggestions.push({
      page: page.pagePath,
      priority: 'medium',
      issue: 'Missing structured data (Schema markup)',
      suggestion: 'Add Schema.org markup (LocalBusiness, Event, Service depending on page type) to help search engines understand your content better and potentially earn rich snippets.',
      expectedImpact: 'Can improve CTR by 10-30% through rich snippets',
      implementation: '1. Identify appropriate schema type\n2. Generate JSON-LD markup\n3. Add to page head\n4. Test with Google Rich Results Test\n5. Monitor Search Console'
    });
  }

  // Low: Content freshness
  const daysSinceUpdate = Math.floor((Date.now() - new Date(page.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceUpdate > 90) {
    suggestions.push({
      page: page.pagePath,
      priority: 'low',
      issue: `Content not updated in ${daysSinceUpdate} days`,
      suggestion: 'Refresh content with current information, update dates, add recent testimonials or success stories. Google favors fresh, regularly updated content.',
      expectedImpact: 'Minor ranking boost and trust signal',
      implementation: '1. Update publication date\n2. Add recent testimonials\n3. Update statistics\n4. Refresh images\n5. Check and update all links'
    });
  }

  return suggestions;
}

// Run if called directly
if (require.main === module) {
  generateAIContentSuggestions()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { generateAIContentSuggestions };
