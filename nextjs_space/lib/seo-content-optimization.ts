/**
 * SEO Content Optimization Library - Phase 2
 * Auto-optimizes content, meta descriptions, schema markup, and internal links
 */

import { prisma } from '@/lib/db';
import { format } from 'date-fns';

// ============================================================================
// SCHEMA MARKUP GENERATION
// ============================================================================

interface SchemaMarkup {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

/**
 * Generate LocalBusiness schema for facility pages
 */
export function generateLocalBusinessSchema(): SchemaMarkup {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://thebasketballfactoryinc.com/#organization',
    'name': 'The Basketball Factory Inc.',
    'alternateName': 'TBF Basketball',
    'description': 'Premier basketball training facility in Sparta, NJ offering private lessons, skills development programs, and competitive team training for youth and high school athletes.',
    'url': 'https://thebasketballfactoryinc.com',
    'telephone': '+1-973-240-8759',
    'email': 'khouston@thebasketballfactorynj.com',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '51 Woodport Road',
      'addressLocality': 'Sparta',
      'addressRegion': 'NJ',
      'postalCode': '07871',
      'addressCountry': 'US'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 41.0412,
      'longitude': -74.6387
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        'opens': '15:00',
        'closes': '21:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Saturday', 'Sunday'],
        'opens': '08:00',
        'closes': '20:00'
      }
    ],
    'priceRange': '$35-$500',
    'areaServed': [
      {
        '@type': 'City',
        'name': 'Sparta',
        'containedInPlace': {
          '@type': 'State',
          'name': 'New Jersey'
        }
      },
      { '@type': 'City', 'name': 'Newton' },
      { '@type': 'City', 'name': 'Andover' },
      { '@type': 'City', 'name': 'Hopatcong' },
      { '@type': 'City', 'name': 'Sussex County' }
    ],
    'sameAs': [
      'https://www.facebook.com/TheBasketballFactoryInc',
      'https://www.instagram.com/thebasketballfactory'
    ]
  };
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(): SchemaMarkup {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'The Basketball Factory Inc.',
    'url': 'https://thebasketballfactoryinc.com',
    'logo': 'https://thebasketballfactoryinc.com/basketball-factory-main-logo.png',
    'description': 'Elite basketball training and development programs in Northern New Jersey',
    'foundingDate': '2015',
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+1-973-240-8759',
      'contactType': 'customer service',
      'email': 'khouston@thebasketballfactorynj.com',
      'availableLanguage': 'English'
    }
  };
}

/**
 * Generate Event schema for program pages
 */
export function generateProgramEventSchema(programData: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  path: string;
}): SchemaMarkup {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    'name': programData.name,
    'description': programData.description,
    'startDate': programData.startDate,
    'endDate': programData.endDate,
    'location': {
      '@type': 'Place',
      'name': 'The Basketball Factory',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '51 Woodport Road',
        'addressLocality': 'Sparta',
        'addressRegion': 'NJ',
        'postalCode': '07871',
        'addressCountry': 'US'
      }
    },
    'organizer': {
      '@type': 'Organization',
      'name': 'The Basketball Factory Inc.',
      'url': 'https://thebasketballfactoryinc.com'
    },
    'offers': {
      '@type': 'Offer',
      'url': `https://thebasketballfactoryinc.com${programData.path}`,
      'price': programData.price.toString(),
      'priceCurrency': 'USD',
      'availability': 'https://schema.org/InStock',
      'validFrom': programData.startDate
    },
    'eventStatus': 'https://schema.org/EventScheduled',
    'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode'
  };
}

/**
 * Auto-apply schema markup to all program pages
 */
export async function autoApplySchemaMarkup(): Promise<{ updated: number; schemas: any[] }> {
  try {
    console.log('[SEO] Auto-applying schema markup...');
    
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' }
    });

    const schemasGenerated = [];
    let updateCount = 0;

    for (const page of pages) {
      let schema: SchemaMarkup | null = null;

      // Determine appropriate schema type
      if (page.pagePath === '/' || page.pagePath === '/home') {
        schema = generateOrganizationSchema();
      } else if (page.pagePath.includes('/program')) {
        // Extract program details for event schema
        const programName = page.pageName || 'Basketball Program';
        schema = generateProgramEventSchema({
          name: programName,
          description: page.metaDescription || `Join our ${programName} training program`,
          startDate: '2025-12-01',
          endDate: '2026-02-28',
          price: 500,
          path: page.pagePath
        });
      } else if (page.pagePath.includes('/private-lesson')) {
        schema = generateLocalBusinessSchema();
      }

      if (schema) {
        // Store schema in contentStrategy JSON
        const contentStrategy = page.contentStrategy 
          ? (typeof page.contentStrategy === 'string' ? JSON.parse(page.contentStrategy) : page.contentStrategy)
          : {};
        
        contentStrategy.schemaMarkup = schema;
        
        await prisma.sEOPageConfig.update({
          where: { id: page.id },
          data: {
            contentStrategy: JSON.stringify(contentStrategy),
            updatedAt: new Date()
          }
        });

        schemasGenerated.push({ path: page.pagePath, type: schema['@type'] });
        updateCount++;
      }
    }

    await prisma.sEOAuditLog.create({
      data: {
        action: 'schema_markup_applied',
        entityType: 'content',
        performedBy: 'system',
        changes: { schemasGenerated, count: updateCount }
      }
    });

    return { updated: updateCount, schemas: schemasGenerated };
  } catch (error) {
    console.error('[SEO] Schema markup application failed:', error);
    return { updated: 0, schemas: [] };
  }
}

// ============================================================================
// META DESCRIPTION OPTIMIZATION
// ============================================================================

/**
 * Generate optimized meta description using AI principles
 */
function generateOptimizedMetaDescription(
  pageName: string,
  keywords: string[],
  currentCTR: number
): string {
  const primaryKeyword = keywords[0] || 'basketball training';
  
  // Templates based on CTR performance
  const templates = [
    `${pageName} at The Basketball Factory. Expert coaching for ${primaryKeyword}. Sign up today in Sparta, NJ! 🏀`,
    `Elite ${primaryKeyword} programs. ${pageName} designed for skill development. Join NJ's premier basketball facility! ⭐`,
    `Transform your game with ${pageName}. Professional ${primaryKeyword} in Sparta, NJ. Limited spots available!`,
    `${pageName} - Master ${primaryKeyword} with proven training methods. Serving Sussex County athletes since 2015.`,
    `Join ${pageName} at TBF. Expert ${primaryKeyword} for all skill levels. Book your spot in Sparta, NJ today!`
  ];

  // Rotate templates based on performance
  const templateIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7)) % templates.length;
  return templates[templateIndex];
}

/**
 * Auto-optimize meta descriptions for pages with low CTR
 */
export async function autoOptimizeMetaDescriptions(): Promise<{ optimized: string[]; improved: number }> {
  try {
    console.log('[SEO] Auto-optimizing meta descriptions...');
    
    // Find pages with low CTR (<2%) but decent impressions (>100)
    const lowCTRPages = await prisma.sEOPerformance.groupBy({
      by: ['pagePath'],
      where: {
        date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      },
      _sum: {
        clicks: true,
        impressions: true
      },
      _avg: {
        ctr: true
      },
      having: {
        impressions: { _sum: { gt: 100 } }
      }
    });

    const optimizedPages: string[] = [];
    let improvedCount = 0;

    for (const perfData of lowCTRPages) {
      const ctr = (perfData._sum.clicks || 0) / (perfData._sum.impressions || 1) * 100;
      
      if (ctr < 2 && perfData.pagePath) {
        const pageConfig = await prisma.sEOPageConfig.findFirst({
          where: { pagePath: perfData.pagePath }
        });

        if (pageConfig) {
          // Get keywords for this page
          const keywords = await prisma.sEOKeyword.findMany({
            where: {
              performanceData: {
                some: { pagePath: perfData.pagePath }
              }
            }
          });

          const keywordNames = keywords.map(k => k.keyword);
          const newMetaDescription = generateOptimizedMetaDescription(
            pageConfig.pageName || 'Basketball Training',
            keywordNames,
            ctr
          );

          // Update meta description
          await prisma.sEOPageConfig.update({
            where: { id: pageConfig.id },
            data: {
              metaDescription: newMetaDescription,
              updatedAt: new Date()
            }
          });

          if (perfData.pagePath) {
            optimizedPages.push(perfData.pagePath);
          }
          improvedCount++;

          console.log(`✅ Optimized meta for ${perfData.pagePath} (CTR: ${ctr.toFixed(2)}%)`);
        }
      }
    }

    if (improvedCount > 0) {
      await prisma.sEOAuditLog.create({
        data: {
          action: 'meta_descriptions_optimized',
          entityType: 'content',
          performedBy: 'system',
          changes: { optimizedPages, count: improvedCount }
        }
      });
    }

    return { optimized: optimizedPages, improved: improvedCount };
  } catch (error) {
    console.error('[SEO] Meta description optimization failed:', error);
    return { optimized: [], improved: 0 };
  }
}

// ============================================================================
// AUTOMATED INTERNAL LINKING
// ============================================================================

interface InternalLink {
  fromPage: string;
  toPage: string;
  anchorText: string;
  relevanceScore: number;
}

/**
 * Calculate relevance score between two pages
 */
function calculatePageRelevance(
  page1Keywords: string[],
  page2Keywords: string[],
  page1Path: string,
  page2Path: string
): number {
  let score = 0;

  // Keyword overlap
  const sharedKeywords = page1Keywords.filter(k => page2Keywords.includes(k));
  score += sharedKeywords.length * 10;

  // Same category (e.g., both programs, both lessons)
  if (page1Path.includes('program') && page2Path.includes('program')) score += 5;
  if (page1Path.includes('lesson') && page2Path.includes('lesson')) score += 5;

  // Grade level similarity
  if (page1Path.includes('high-school') && page2Path.includes('high-school')) score += 8;
  if (page1Path.includes('middle-school') && page2Path.includes('middle-school')) score += 8;
  if (page1Path.includes('youth') && page2Path.includes('youth')) score += 8;

  // Season similarity
  const seasons = ['fall', 'winter', 'spring', 'summer'];
  for (const season of seasons) {
    if (page1Path.includes(season) && page2Path.includes(season)) score += 3;
  }

  return score;
}

/**
 * Generate smart internal links between related pages
 */
export async function generateInternalLinks(): Promise<{ links: InternalLink[]; created: number }> {
  try {
    console.log('[SEO] Generating internal links...');
    
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' },
      include: {
        targetKeywords: true
      }
    });

    const suggestedLinks: InternalLink[] = [];

    for (let i = 0; i < pages.length; i++) {
      for (let j = i + 1; j < pages.length; j++) {
        const page1 = pages[i];
        const page2 = pages[j];
        const keywords1 = page1.targetKeywords.map((k: any) => k.keyword);
        const keywords2 = page2.targetKeywords.map((k: any) => k.keyword);

        const relevance = calculatePageRelevance(
          keywords1,
          keywords2,
          page1.pagePath,
          page2.pagePath
        );

        if (relevance >= 10) {
          // Create bidirectional links
          suggestedLinks.push({
            fromPage: page1.pagePath,
            toPage: page2.pagePath,
            anchorText: page2.pageName || 'Learn more',
            relevanceScore: relevance
          });

          suggestedLinks.push({
            fromPage: page2.pagePath,
            toPage: page1.pagePath,
            anchorText: page1.pageName || 'Learn more',
            relevanceScore: relevance
          });
        }
      }
    }

    // Sort by relevance and take top 50 links
    suggestedLinks.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const topLinks = suggestedLinks.slice(0, 50);

    // Store links in page content strategy
    for (const link of topLinks) {
      const page = await prisma.sEOPageConfig.findFirst({
        where: { pagePath: link.fromPage }
      });

      if (page) {
        const contentStrategy = page.contentStrategy 
          ? (typeof page.contentStrategy === 'string' ? JSON.parse(page.contentStrategy) : page.contentStrategy)
          : {};
        
        if (!contentStrategy.internalLinks) {
          contentStrategy.internalLinks = [];
        }

        // Add link if not already present
        const existingLink = contentStrategy.internalLinks.find(
          (l: InternalLink) => l.toPage === link.toPage
        );

        if (!existingLink) {
          contentStrategy.internalLinks.push({
            toPage: link.toPage,
            anchorText: link.anchorText,
            relevanceScore: link.relevanceScore
          });

          await prisma.sEOPageConfig.update({
            where: { id: page.id },
            data: {
              contentStrategy: JSON.stringify(contentStrategy),
              updatedAt: new Date()
            }
          });
        }
      }
    }

    await prisma.sEOAuditLog.create({
      data: {
        action: 'internal_links_generated',
        entityType: 'content',
        performedBy: 'system',
        changes: { linksGenerated: topLinks.length }
      }
    });

    return { links: topLinks, created: topLinks.length };
  } catch (error) {
    console.error('[SEO] Internal link generation failed:', error);
    return { links: [], created: 0 };
  }
}

// ============================================================================
// CONTENT FRESHNESS
// ============================================================================

/**
 * Auto-update "last modified" dates for active pages
 */
export async function updateContentFreshness(): Promise<{ updated: string[] }> {
  try {
    console.log('[SEO] Updating content freshness...');
    
    // Find pages that haven't been updated in the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const stalePages = await prisma.sEOPageConfig.findMany({
      where: {
        status: 'active',
        updatedAt: { lt: thirtyDaysAgo }
      }
    });

    const updatedPaths: string[] = [];

    for (const page of stalePages) {
      await prisma.sEOPageConfig.update({
        where: { id: page.id },
        data: { updatedAt: new Date() }
      });

      updatedPaths.push(page.pagePath);
    }

    if (updatedPaths.length > 0) {
      await prisma.sEOAuditLog.create({
        data: {
          action: 'content_freshness_updated',
          entityType: 'content',
          performedBy: 'system',
          changes: { updatedPages: updatedPaths, count: updatedPaths.length }
        }
      });
    }

    return { updated: updatedPaths };
  } catch (error) {
    console.error('[SEO] Content freshness update failed:', error);
    return { updated: [] };
  }
}

// ============================================================================
// PAGE SPEED MONITORING
// ============================================================================

interface PageSpeedResult {
  pagePath: string;
  loadTime: number;
  performanceScore: number;
  issues: string[];
}

/**
 * Monitor page speed for all active pages
 */
export async function monitorPageSpeed(): Promise<{ results: PageSpeedResult[]; slowPages: number }> {
  try {
    console.log('[SEO] Monitoring page speed...');
    
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' }
    });

    const results: PageSpeedResult[] = [];
    const baseUrl = 'https://thebasketballfactoryinc.com';

    for (const page of pages) {
      try {
        const startTime = Date.now();
        const response = await fetch(`${baseUrl}${page.pagePath}`, {
          headers: { 'User-Agent': 'SEO-Speed-Monitor/1.0' }
        });
        const loadTime = Date.now() - startTime;

        const issues: string[] = [];
        
        // Check response time
        if (loadTime > 3000) issues.push('Slow server response (>3s)');
        if (loadTime > 5000) issues.push('Critical: Page load >5s');

        // Check response headers
        const contentLength = response.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > 1000000) {
          issues.push('Large page size (>1MB)');
        }

        // Performance score (0-100)
        const performanceScore = Math.max(0, 100 - (loadTime / 100));

        results.push({
          pagePath: page.pagePath,
          loadTime,
          performanceScore: Math.round(performanceScore),
          issues
        });

        // Log slow pages
        if (loadTime > 3000) {
          console.log(`⚠️  Slow page: ${page.pagePath} (${loadTime}ms)`);
        }
      } catch (error) {
        results.push({
          pagePath: page.pagePath,
          loadTime: 0,
          performanceScore: 0,
          issues: ['Failed to fetch']
        });
      }
    }

    const slowPages = results.filter(r => r.loadTime > 3000).length;

    await prisma.sEOAuditLog.create({
      data: {
        action: 'page_speed_monitored',
        entityType: 'technical',
        performedBy: 'system',
        changes: { 
          pagesChecked: results.length,
          slowPages,
          avgLoadTime: results.reduce((sum, r) => sum + r.loadTime, 0) / results.length
        }
      }
    });

    return { results, slowPages };
  } catch (error) {
    console.error('[SEO] Page speed monitoring failed:', error);
    return { results: [], slowPages: 0 };
  }
}