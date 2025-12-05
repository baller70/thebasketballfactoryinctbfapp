
/**
 * Google SEO Best Practices Implementation
 * 
 * Core Principles:
 * 1. One primary keyword per page (avoid keyword cannibalization)
 * 2. 3-5 secondary/LSI keywords per page
 * 3. Match user intent (informational, navigational, transactional)
 * 4. Optimize title, meta, H1 with primary keyword
 * 5. Regular content updates based on performance
 */

export interface SEOPageStrategy {
  pagePath: string
  pageName: string
  primaryKeyword: string
  secondaryKeywords: string[]
  intent: 'informational' | 'navigational' | 'transactional'
  contentStrategy: {
    titleTag: string
    metaDescription: string
    h1: string
    contentFocus: string
    updateFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  }
  performance: {
    currentPosition: number | null
    targetPosition: number
    clicks: number
    impressions: number
    ctr: number
  }
}

export interface SEORecommendation {
  type: 'critical' | 'important' | 'opportunity'
  category: 'keyword' | 'content' | 'technical' | 'performance'
  message: string
  action: string
  impact: 'high' | 'medium' | 'low'
  pagePath?: string
}

/**
 * Analyze keyword competition and suggest strategy
 */
export function analyzeKeywordStrategy(
  keyword: string,
  searchVolume: number,
  difficulty: number,
  currentPosition: number | null
): SEORecommendation[] {
  const recommendations: SEORecommendation[] = []

  // High-volume, low-difficulty = golden opportunity
  if (searchVolume > 100 && difficulty < 30) {
    recommendations.push({
      type: 'opportunity',
      category: 'keyword',
      message: `"${keyword}" is a golden opportunity keyword`,
      action: 'Create dedicated landing page with optimized content',
      impact: 'high'
    })
  }

  // Already ranking but not on page 1
  if (currentPosition && currentPosition > 10 && currentPosition <= 50) {
    recommendations.push({
      type: 'important',
      category: 'content',
      message: `"${keyword}" is on page ${Math.ceil(currentPosition / 10)} - close to page 1`,
      action: 'Enhance existing content, add internal links, update meta tags',
      impact: 'high'
    })
  }

  // High volume but high difficulty
  if (searchVolume > 200 && difficulty > 60) {
    recommendations.push({
      type: 'important',
      category: 'keyword',
      message: `"${keyword}" is competitive - consider long-tail variations`,
      action: 'Target related long-tail keywords first to build authority',
      impact: 'medium'
    })
  }

  return recommendations
}

/**
 * Generate SEO recommendations based on page performance
 */
export function generatePageRecommendations(
  page: SEOPageStrategy
): SEORecommendation[] {
  const recommendations: SEORecommendation[] = []

  // No impressions = visibility issue
  if (page.performance.impressions < 10) {
    recommendations.push({
      type: 'critical',
      category: 'technical',
      message: `Page "${page.pageName}" has very low visibility`,
      action: 'Check if page is indexed, add internal links, submit to Search Console',
      impact: 'high',
      pagePath: page.pagePath
    })
  }

  // Good impressions but low CTR
  if (page.performance.impressions > 100 && page.performance.ctr < 2) {
    recommendations.push({
      type: 'important',
      category: 'content',
      message: `Page "${page.pageName}" has low CTR (${page.performance.ctr.toFixed(1)}%)`,
      action: 'Optimize title tag and meta description to be more compelling',
      impact: 'high',
      pagePath: page.pagePath
    })
  }

  // Ranking but not on page 1
  if (page.performance.currentPosition && 
      page.performance.currentPosition > 10 && 
      page.performance.currentPosition <= 30) {
    recommendations.push({
      type: 'opportunity',
      category: 'content',
      message: `Page "${page.pageName}" ranks #${page.performance.currentPosition} for "${page.primaryKeyword}"`,
      action: 'Add fresh content, improve internal linking, get backlinks',
      impact: 'high',
      pagePath: page.pagePath
    })
  }

  // Target not met
  if (page.performance.currentPosition && 
      page.performance.currentPosition > page.performance.targetPosition) {
    const gap = page.performance.currentPosition - page.performance.targetPosition
    recommendations.push({
      type: 'important',
      category: 'performance',
      message: `Page "${page.pageName}" is ${gap} positions away from target`,
      action: `Focus on: 1) Content depth, 2) E-A-T signals, 3) User engagement metrics`,
      impact: gap > 20 ? 'high' : 'medium',
      pagePath: page.pagePath
    })
  }

  return recommendations
}

/**
 * Prevent keyword cannibalization
 */
export function detectKeywordCannibalization(
  pages: SEOPageStrategy[]
): SEORecommendation[] {
  const recommendations: SEORecommendation[] = []
  const keywordMap = new Map<string, string[]>()

  // Group pages by primary keyword
  pages.forEach(page => {
    const keyword = page.primaryKeyword.toLowerCase()
    if (!keywordMap.has(keyword)) {
      keywordMap.set(keyword, [])
    }
    keywordMap.get(keyword)!.push(page.pagePath)
  })

  // Find duplicates
  keywordMap.forEach((pagePaths, keyword) => {
    if (pagePaths.length > 1) {
      recommendations.push({
        type: 'critical',
        category: 'keyword',
        message: `Keyword cannibalization detected for "${keyword}"`,
        action: `Multiple pages (${pagePaths.join(', ')}) target the same keyword. Consolidate or differentiate them.`,
        impact: 'high'
      })
    }
  })

  return recommendations
}

/**
 * Suggest content updates based on Google's freshness factor
 */
export function suggestContentUpdates(
  pages: SEOPageStrategy[],
  lastUpdated: Map<string, Date>
): SEORecommendation[] {
  const recommendations: SEORecommendation[] = []
  const now = new Date()

  pages.forEach(page => {
    const lastUpdate = lastUpdated.get(page.pagePath)
    if (!lastUpdate) return

    const daysSinceUpdate = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24))

    // Content freshness matters for rankings
    if (daysSinceUpdate > 90 && page.performance.currentPosition && page.performance.currentPosition > 5) {
      recommendations.push({
        type: 'important',
        category: 'content',
        message: `Page "${page.pageName}" hasn't been updated in ${daysSinceUpdate} days`,
        action: 'Update with fresh statistics, new examples, or expanded sections',
        impact: 'medium',
        pagePath: page.pagePath
      })
    }
  })

  return recommendations
}

/**
 * Priority scoring for keyword targeting (0-100)
 */
export function calculateKeywordPriority(
  keyword: string,
  searchVolume: number,
  difficulty: number,
  currentPosition: number | null,
  businessRelevance: 'high' | 'medium' | 'low'
): number {
  let score = 0

  // Search volume contribution (0-30 points)
  score += Math.min(30, searchVolume / 10)

  // Difficulty (inverse - easier is better) (0-20 points)
  score += 20 - (difficulty / 5)

  // Current position (0-25 points)
  if (currentPosition) {
    if (currentPosition <= 10) score += 25
    else if (currentPosition <= 20) score += 20
    else if (currentPosition <= 50) score += 10
  }

  // Business relevance (0-25 points)
  if (businessRelevance === 'high') score += 25
  else if (businessRelevance === 'medium') score += 15
  else score += 5

  return Math.min(100, Math.round(score))
}

