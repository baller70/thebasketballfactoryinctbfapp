import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function optimizeMetaDescriptions() {
  console.log('🎯 Starting Meta Description Optimization...');

  try {
    // Get all pages with performance data
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' }
    });

    let optimizedCount = 0;
    const optimizations: any[] = [];

    for (const page of pages) {
      // Get performance data for the last 30 days
      const performance = await prisma.sEOPerformance.findMany({
        where: {
          pagePath: page.pagePath,
          dateKey: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        },
        orderBy: { dateKey: 'desc' }
      });

      if (performance.length === 0) {
        console.log(`⏭️  Skipping ${page.pagePath} - no performance data`);
        continue;
      }

      // Calculate average CTR
      const totalImpressions = performance.reduce((sum, p) => sum + p.impressions, 0);
      const totalClicks = performance.reduce((sum, p) => sum + p.clicks, 0);
      const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

      // If CTR is below 2%, optimize meta description
      if (avgCTR < 2.0 && totalImpressions > 100) {
        const currentMeta = page.metaDescription || '';
        
        // Generate optimized meta description
        const optimizedMeta = await generateOptimizedMeta(page, currentMeta);

        if (optimizedMeta !== currentMeta) {
          await prisma.sEOPageConfig.update({
            where: { id: page.id },
            data: {
              metaDescription: optimizedMeta,
              updatedAt: new Date()
            }
          });

          optimizedCount++;
          optimizations.push({
            page: page.pagePath,
            oldMeta: currentMeta,
            newMeta: optimizedMeta,
            avgCTR: avgCTR.toFixed(2),
            impressions: totalImpressions
          });

          console.log(`✅ Optimized ${page.pagePath} (CTR: ${avgCTR.toFixed(2)}%)`);
        }
      } else {
        console.log(`✓ ${page.pagePath} CTR is healthy: ${avgCTR.toFixed(2)}%`);
      }
    }

    // Log to audit
    if (optimizedCount > 0) {
      await prisma.sEOAuditLog.create({
        data: {
          action: 'meta_descriptions_optimized',
          entityType: 'page',
          performedBy: 'system',
          changes: {
            pagesOptimized: optimizedCount,
            optimizations
          }
        }
      });
    }

    console.log(`\n✨ Meta Description Optimization Complete!`);
    console.log(`📊 Optimized ${optimizedCount} pages`);

    return {
      success: true,
      pagesOptimized: optimizedCount,
      optimizations
    };

  } catch (error) {
    console.error('❌ Meta description optimization failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function generateOptimizedMeta(page: any, currentMeta: string): Promise<string> {
  // Extract keywords from page
  const contentStrategy = page.contentStrategy ? JSON.parse(page.contentStrategy as string) : {};
  const primaryKeyword = contentStrategy.primaryKeyword || '';
  const secondaryKeywords = contentStrategy.secondaryKeywords || [];
  
  // Get target keywords from database
  const targetKeywords = await prisma.sEOKeyword.findMany({
    where: {
      keyword: {
        in: [primaryKeyword, ...secondaryKeywords]
      }
    }
  });

  // Build optimized meta based on page type
  let optimizedMeta = currentMeta;
  const pagePath = page.pagePath.toLowerCase();

  if (pagePath.includes('/programs/')) {
    const programName = page.pageTitle || 'Basketball Training Program';
    optimizedMeta = `Join ${programName} at The Basketball Factory in Sparta, NJ. Expert coaching, proven results. ` +
                    `${primaryKeyword ? `Master ${primaryKeyword.toLowerCase()}.` : ''} Register today!`;
  } else if (pagePath.includes('/private-lessons')) {
    optimizedMeta = `Elite 1-on-1 basketball training in NJ. ${primaryKeyword ? `Improve ${primaryKeyword.toLowerCase()}.` : ''} ` +
                    `Professional coaches, custom programs, proven results. Book your session!`;
  } else if (pagePath === '/') {
    optimizedMeta = `The Basketball Factory - Elite basketball training in Sparta, NJ. Programs for youth & high school athletes. ` +
                    `Expert coaching, skill development, competitive edge. Start your journey today!`;
  } else {
    // Generic optimization - add call to action and keywords
    const keywords = [primaryKeyword, ...secondaryKeywords.slice(0, 2)]
      .filter(Boolean)
      .join(', ');
    
    if (keywords && !currentMeta.toLowerCase().includes(keywords.toLowerCase())) {
      optimizedMeta = currentMeta.replace(/\.$/, '') + `. ${keywords}. Book now!`;
    } else if (!currentMeta.includes('!') && !currentMeta.includes('?')) {
      optimizedMeta = currentMeta.replace(/\.$/, '') + '. Register today!';
    }
  }

  // Ensure meta description is within optimal length (150-160 characters)
  if (optimizedMeta.length > 160) {
    optimizedMeta = optimizedMeta.substring(0, 157) + '...';
  } else if (optimizedMeta.length < 120 && primaryKeyword) {
    optimizedMeta += ` ${primaryKeyword}. Sign up now!`;
  }

  return optimizedMeta;
}

// Run if called directly
if (require.main === module) {
  optimizeMetaDescriptions()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { optimizeMetaDescriptions };
