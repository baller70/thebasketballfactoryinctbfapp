import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateContentFreshness() {
  console.log('🎯 Starting Content Freshness Update...');

  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    // Find pages that haven't been updated in 30+ days and have poor performance
    const pages = await prisma.sEOPageConfig.findMany({
      where: {
        status: 'active',
        updatedAt: {
          lt: thirtyDaysAgo
        }
      }
    });

    let updatedCount = 0;
    const updates: any[] = [];

    for (const page of pages) {
      // Get performance data
      const performance = await prisma.sEOPerformance.findMany({
        where: {
          pagePath: page.pagePath,
          dateKey: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        }
      });

      if (performance.length === 0) {
        console.log(`⏭️  Skipping ${page.pagePath} - no performance data`);
        continue;
      }

      // Calculate metrics
      const avgPosition = performance.reduce((sum, p) => sum + (p.position ?? 0), 0) / performance.length;
      const totalImpressions = performance.reduce((sum, p) => sum + p.impressions, 0);

      // Update if position > 10 or low impressions
      if (avgPosition > 10 || totalImpressions < 50) {
        const contentStrategy = page.contentStrategy ? JSON.parse(page.contentStrategy as string) : {};
        
        // Generate fresh content suggestions
        const freshContent = await generateFreshContent(page, performance);
        
        contentStrategy.lastRefreshDate = new Date().toISOString();
        contentStrategy.refreshReason = avgPosition > 10 ? 'poor_ranking' : 'low_impressions';
        contentStrategy.freshContentSuggestions = freshContent;

        await prisma.sEOPageConfig.update({
          where: { id: page.id },
          data: {
            contentStrategy: JSON.stringify(contentStrategy),
            updatedAt: new Date()
          }
        });

        updatedCount++;
        updates.push({
          page: page.pagePath,
          avgPosition: avgPosition.toFixed(2),
          impressions: totalImpressions,
          reason: contentStrategy.refreshReason,
          suggestions: freshContent
        });

        console.log(`✅ Updated ${page.pagePath} (Pos: ${avgPosition.toFixed(2)}, Imp: ${totalImpressions})`);
      } else {
        console.log(`✓ ${page.pagePath} is performing well`);
      }
    }

    // Log to audit
    if (updatedCount > 0) {
      await prisma.sEOAuditLog.create({
        data: {
          action: 'content_freshness_updated',
          entityType: 'page',
          performedBy: 'system',
          changes: {
            pagesUpdated: updatedCount,
            updates
          }
        }
      });
    }

    console.log(`\n✨ Content Freshness Update Complete!`);
    console.log(`📊 Updated ${updatedCount} pages`);

    return {
      success: true,
      pagesUpdated: updatedCount,
      updates
    };

  } catch (error) {
    console.error('❌ Content freshness update failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function generateFreshContent(page: any, performance: any[]): Promise<string[]> {
  const suggestions: string[] = [];
  const contentStrategy = page.contentStrategy ? JSON.parse(page.contentStrategy as string) : {};
  const pagePath = page.pagePath.toLowerCase();

  // Get current date info for seasonal updates
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const season = currentMonth >= 2 && currentMonth <= 5 ? 'spring' : 
                 currentMonth >= 6 && currentMonth <= 8 ? 'summer' : 
                 currentMonth >= 9 && currentMonth <= 11 ? 'fall' : 'winter';

  // Page-specific suggestions
  if (pagePath.includes('/programs/')) {
    suggestions.push(`Update program dates for ${season} ${currentYear}`);
    suggestions.push('Add recent success stories or testimonials');
    suggestions.push('Include updated training schedule');
    suggestions.push('Highlight any new coaching additions');
    suggestions.push('Add FAQ section if missing');
  } else if (pagePath.includes('/private-lessons')) {
    suggestions.push('Update availability calendar');
    suggestions.push('Add recent athlete achievements');
    suggestions.push('Include new training packages or special offers');
    suggestions.push('Update coach bios and qualifications');
  } else if (pagePath === '/') {
    suggestions.push(`Highlight ${season} ${currentYear} programs`);
    suggestions.push('Update featured testimonials');
    suggestions.push('Showcase recent tournament results');
    suggestions.push('Add current enrollment numbers or stats');
  }

  // Performance-based suggestions
  const avgPosition = performance.reduce((sum, p) => sum + p.position || 0 || 0, 0) / performance.length;
  const totalClicks = performance.reduce((sum, p) => sum + p.clicks, 0);

  if (avgPosition > 15) {
    suggestions.push('Add more target keywords naturally to content');
    suggestions.push('Improve internal linking to this page');
    suggestions.push('Add more comprehensive content sections');
  }

  if (totalClicks < 20) {
    suggestions.push('Enhance title tag with action words');
    suggestions.push('Add compelling call-to-action buttons');
    suggestions.push('Include video content if possible');
  }

  // General suggestions
  suggestions.push(`Last updated: ${new Date().toLocaleDateString()} - Content refreshed for ${season} ${currentYear}`);
  suggestions.push('Add fresh images or update existing ones');
  suggestions.push('Review and update all links');

  return suggestions;
}

// Run if called directly
if (require.main === module) {
  updateContentFreshness()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { updateContentFreshness };
