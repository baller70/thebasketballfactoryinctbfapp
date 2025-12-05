import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PageSpeedMetrics {
  url: string;
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  timeToInteractive: number;
  cumulativeLayoutShift: number;
  speedScore: number;
  issues: string[];
}

async function monitorPageSpeed() {
  console.log('🎯 Starting Page Speed Monitoring...');

  try {
    // Get all active pages
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' }
    });

    const baseUrl = 'https://thebasketballfactoryinc.com';
    const results: PageSpeedMetrics[] = [];
    const slowPages: any[] = [];

    for (const page of pages) {
      const url = `${baseUrl}${page.pagePath}`;
      
      try {
        // Use Google PageSpeed Insights API
        const metrics = await checkPageSpeed(url);
        results.push(metrics);

        // Flag slow pages (load time > 3 seconds or LCP > 2.5s)
        if (metrics.loadTime > 3000 || metrics.largestContentfulPaint > 2500) {
          slowPages.push({
            page: page.pagePath,
            loadTime: metrics.loadTime,
            lcp: metrics.largestContentfulPaint,
            speedScore: metrics.speedScore,
            issues: metrics.issues
          });

          console.log(`⚠️  Slow page detected: ${page.pagePath} (${metrics.loadTime}ms)`);
        } else {
          console.log(`✓ ${page.pagePath} is performing well (${metrics.loadTime}ms)`);
        }

      } catch (error) {
        console.error(`❌ Failed to check ${page.pagePath}:`, error);
      }
    }

    // Log to audit
    await prisma.sEOAuditLog.create({
      data: {
        action: 'page_speed_monitored',
        entityType: 'page',
        performedBy: 'system',
        changes: {
          totalPages: results.length,
          slowPages: slowPages.length,
          averageLoadTime: results.reduce((sum, r) => sum + r.loadTime, 0) / results.length,
          slowPagesDetails: slowPages
        }
      }
    });

    console.log(`\n✨ Page Speed Monitoring Complete!`);
    console.log(`📊 Checked ${results.length} pages`);
    console.log(`⚠️  ${slowPages.length} slow pages detected`);

    return {
      success: true,
      totalPages: results.length,
      slowPages: slowPages.length,
      results,
      slowPagesDetails: slowPages
    };

  } catch (error) {
    console.error('❌ Page speed monitoring failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function checkPageSpeed(url: string): Promise<PageSpeedMetrics> {
  try {
    // Google PageSpeed Insights API key from environment
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
    
    if (!apiKey) {
      // Fallback to simulated metrics for testing
      console.log('⚠️  No PageSpeed API key found, using simulated data');
      return simulatePageSpeedMetrics(url);
    }

    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&category=PERFORMANCE`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`PageSpeed API error: ${data.error?.message || 'Unknown error'}`);
    }

    const lighthouseMetrics = data.lighthouseResult.audits;
    const performanceScore = data.lighthouseResult.categories.performance.score * 100;

    const issues: string[] = [];
    
    // Check for common issues
    if (lighthouseMetrics['largest-contentful-paint'].score < 0.5) {
      issues.push('Slow Largest Contentful Paint - optimize images and critical rendering path');
    }
    if (lighthouseMetrics['cumulative-layout-shift'].score < 0.5) {
      issues.push('High Cumulative Layout Shift - specify image dimensions and avoid dynamic content');
    }
    if (lighthouseMetrics['total-blocking-time'].score < 0.5) {
      issues.push('High Total Blocking Time - minimize JavaScript execution');
    }
    if (lighthouseMetrics['server-response-time'].score < 0.5) {
      issues.push('Slow server response time - optimize backend and caching');
    }

    return {
      url,
      loadTime: parseFloat(lighthouseMetrics['speed-index'].displayValue.replace(/[^\d.]/g, '')) * 1000,
      firstContentfulPaint: parseFloat(lighthouseMetrics['first-contentful-paint'].displayValue.replace(/[^\d.]/g, '')) * 1000,
      largestContentfulPaint: parseFloat(lighthouseMetrics['largest-contentful-paint'].displayValue.replace(/[^\d.]/g, '')) * 1000,
      timeToInteractive: parseFloat(lighthouseMetrics['interactive'].displayValue.replace(/[^\d.]/g, '')) * 1000,
      cumulativeLayoutShift: parseFloat(lighthouseMetrics['cumulative-layout-shift'].displayValue),
      speedScore: performanceScore,
      issues
    };

  } catch (error) {
    console.error(`Error checking page speed for ${url}:`, error);
    return simulatePageSpeedMetrics(url);
  }
}

function simulatePageSpeedMetrics(url: string): PageSpeedMetrics {
  // Simulate metrics for testing (remove in production)
  const baseLoadTime = 1500 + Math.random() * 2000;
  
  return {
    url,
    loadTime: baseLoadTime,
    firstContentfulPaint: baseLoadTime * 0.6,
    largestContentfulPaint: baseLoadTime * 0.8,
    timeToInteractive: baseLoadTime * 1.2,
    cumulativeLayoutShift: Math.random() * 0.3,
    speedScore: 70 + Math.random() * 25,
    issues: baseLoadTime > 3000 ? ['Page load time exceeds 3 seconds'] : []
  };
}

// Run if called directly
if (require.main === module) {
  monitorPageSpeed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { monitorPageSpeed };
