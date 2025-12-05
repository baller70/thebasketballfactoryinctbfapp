/**
 * Automated Meta Description Optimization Script
 * Runs weekly to optimize meta descriptions based on performance data
 */

import { PrismaClient } from '@prisma/client';
import { format, subDays } from 'date-fns';

const prisma = new PrismaClient();

interface MetaOptimizationResult {
  pageId: string;
  pagePath: string;
  oldMeta: string;
  newMeta: string;
  reason: string;
}

/**
 * Generate optimized meta description based on page content and keywords
 */
function generateOptimizedMeta(
  pageTitle: string,
  primaryKeyword: string,
  secondaryKeywords: string[],
  location: string = 'Sparta, NJ'
): string {
  // Create compelling meta description with keywords
  const keywords = [primaryKeyword, ...secondaryKeywords.slice(0, 2)].join(', ');
  
  // Keep under 160 characters for optimal display
  const meta = `${pageTitle} in ${location}. Expert ${primaryKeyword} programs. ${secondaryKeywords[0] || 'Professional training'}. Call 909-577-9171 to register today!`;
  
  return meta.substring(0, 160);
}

/**
 * Analyze page performance and determine if meta needs optimization
 */
async function analyzePage(page: any): Promise<MetaOptimizationResult | null> {
  try {
    // Get performance data for last 30 days
    const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');
    
    const performance = await prisma.sEOPerformance.findMany({
      where: {
        pagePath: page.pagePath,
        dateKey: { gte: thirtyDaysAgo }
      },
      orderBy: { dateKey: 'desc' }
    });

    if (performance.length === 0) {
      return null; // No data to analyze
    }

    // Calculate average CTR
    const totalClicks = performance.reduce((sum, p) => sum + (p.clicks || 0), 0);
    const totalImpressions = performance.reduce((sum, p) => sum + (p.impressions || 0), 0);
    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    // Get current meta description
    const currentMeta = page.metaDescription || '';
    
    // Optimize if:
    // 1. CTR is below 2% (industry average is 2-5%)
    // 2. Meta is too short (< 120 chars) or too long (> 160 chars)
    // 3. Meta doesn't contain primary keyword
    
    const needsOptimization = 
      avgCTR < 2 ||
      currentMeta.length < 120 ||
      currentMeta.length > 160 ||
      (page.targetKeywords?.[0] && !currentMeta.toLowerCase().includes(page.targetKeywords[0].toLowerCase()));

    if (!needsOptimization) {
      return null;
    }

    // Generate optimized meta
    const newMeta = generateOptimizedMeta(
      page.pageTitle,
      page.targetKeywords?.[0] || 'basketball training',
      page.targetKeywords?.slice(1) || [],
      'Sparta, NJ'
    );

    return {
      pageId: page.id,
      pagePath: page.pagePath,
      oldMeta: currentMeta,
      newMeta,
      reason: avgCTR < 2 
        ? `Low CTR (${avgCTR.toFixed(2)}%)` 
        : currentMeta.length < 120 
        ? 'Meta too short' 
        : currentMeta.length > 160 
        ? 'Meta too long' 
        : 'Missing primary keyword'
    };
  } catch (error) {
    console.error(`Error analyzing page ${page.pagePath}:`, error);
    return null;
  }
}

/**
 * Main optimization function
 */
async function runMetaOptimization() {
  console.log('🔄 Starting meta description optimization...');
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

  try {
    // Get all active pages
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' }
    });

    console.log(`📄 Analyzing ${pages.length} active pages...`);

    const optimizations: MetaOptimizationResult[] = [];

    // Analyze each page
    for (const page of pages) {
      const result = await analyzePage(page);
      if (result) {
        optimizations.push(result);
      }
    }

    console.log(`🔍 Found ${optimizations.length} pages needing optimization`);

    // Apply optimizations
    for (const opt of optimizations) {
      await prisma.sEOPageConfig.update({
        where: { id: opt.pageId },
        data: { metaDescription: opt.newMeta }
      });

      console.log(`✅ Optimized: ${opt.pagePath}`);
      console.log(`   Reason: ${opt.reason}`);
      console.log(`   Old: ${opt.oldMeta.substring(0, 50)}...`);
      console.log(`   New: ${opt.newMeta.substring(0, 50)}...`);
    }

    // Log to audit trail
    await prisma.sEOAuditLog.create({
      data: {
        action: 'auto_meta_optimization',
        entityType: 'pages',
        performedBy: 'system',
        changes: {
          pagesAnalyzed: pages.length,
          pagesOptimized: optimizations.length,
          optimizations: optimizations.map(o => ({
            pagePath: o.pagePath,
            reason: o.reason
          })),
          timestamp: new Date().toISOString()
        }
      }
    });

    console.log('✅ Meta optimization completed successfully');
    return { 
      success: true, 
      pagesAnalyzed: pages.length,
      pagesOptimized: optimizations.length,
      optimizations
    };
  } catch (error) {
    console.error('❌ Meta optimization failed:', error);
    
    await prisma.sEOAuditLog.create({
      data: {
        action: 'auto_meta_optimization_failed',
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
  runMetaOptimization()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

export { runMetaOptimization };
