
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Local areas in Sparta, NJ region for SEO targeting
export const LOCAL_AREAS = {
  primary: 'Sparta, NJ',
  cities: [
    'Sparta', 'Newton', 'Hopatcong', 'Sussex', 'Andover', 'Franklin',
    'Hamburg', 'Ogdensburg', 'Lake Mohawk', 'Byram', 'Stanhope',
    'Succasunna', 'Rockaway', 'Dover', 'Wharton', 'Mine Hill'
  ],
  counties: ['Sussex County', 'Morris County', 'Warren County'],
  neighborhoods: [
    'Lake Mohawk', 'Lake Mohawk Estates', 'Alpine Lake',
    'Fox Hollow Golf Club Area', 'Sparta Mountain', 'Glen Road Area'
  ],
  zipCodes: ['07871', '07860', '07821', '07461', '07828', '07822']
}

// Primary keywords for basketball training in Sparta, NJ
export const PRIMARY_KEYWORDS = [
  'basketball training sparta nj',
  'youth basketball programs sparta',
  'basketball skills development sparta',
  'private basketball lessons sparta nj',
  'basketball camps sussex county',
  'basketball coaching sparta',
  'youth basketball training near me',
  'basketball academy sparta nj',
  'kids basketball programs sparta',
  'high school basketball training sparta'
]

// Generate SEO-optimized content using Abacus.AI
export async function generateSEOContent(params: {
  pagePath: string
  pageName: string
  targetKeywords: string[]
  localAreas: string[]
  contentStrategy?: string
  currentContent?: string
}) {
  const { pagePath, pageName, targetKeywords, localAreas, contentStrategy, currentContent } = params

  // Get global SEO settings
  const settings = await prisma.sEOSettings.findFirst()
  
  const prompt = `You are an expert SEO content writer specializing in local business marketing for youth sports programs. Your task is to generate SEO-optimized content for The Basketball Factory Inc, a premier basketball training facility.

**Business Context:**
- Business: The Basketball Factory Inc
- Primary Location: Sparta, New Jersey
- Target Audience: Parents of children aged 7-18 interested in basketball skill development
- Service Area: ${localAreas.join(', ')}
- Brand Voice: ${settings?.contentTone || 'Professional yet friendly and approachable'}
- Key Selling Points: ${settings?.keySellingPoints.join(', ') || 'Expert coaching, proven results, individual attention'}

**Page Information:**
- Page Name: ${pageName}
- Page URL: ${pagePath}
- Target Keywords: ${targetKeywords.join(', ')}
${contentStrategy ? `- Content Strategy: ${contentStrategy}` : ''}

**SEO Requirements:**
1. Generate content that naturally incorporates the target keywords without keyword stuffing
2. Use local SEO best practices - mention Sparta, NJ and surrounding areas naturally
3. Write in a conversational, parent-friendly tone that builds trust
4. Include emotional appeal - focus on child development, confidence, skills
5. Add credibility elements (experience, results, testimonials references)
6. Create urgency and clear calls-to-action
7. Optimize for voice search queries (natural language, question-based)
8. Ensure readability score above 60 (Flesch Reading Ease)

**Current Content (if exists):**
${currentContent || 'No existing content - create from scratch'}

**Output Format (JSON):**
Generate the following in valid JSON format:

{
  "title": "SEO-optimized page title (50-60 characters, include primary keyword and location)",
  "metaDescription": "Compelling meta description (150-160 characters, include call-to-action)",
  "metaKeywords": "Comma-separated relevant keywords (10-15 keywords)",
  "h1Heading": "Primary H1 heading (include main keyword)",
  "h2Headings": ["Array of 4-6 H2 subheadings that structure the content"],
  "contentBlocks": [
    {
      "section": "Introduction",
      "content": "Opening paragraph that hooks the reader and includes primary keyword naturally",
      "position": "top"
    },
    {
      "section": "Benefits",
      "content": "Detailed content about benefits and value proposition",
      "position": "middle"
    },
    {
      "section": "Local Focus",
      "content": "Content emphasizing local presence in Sparta and surrounding areas",
      "position": "middle"
    },
    {
      "section": "Call to Action",
      "content": "Strong closing CTA paragraph",
      "position": "bottom"
    }
  ],
  "keywordsDensity": {
    "primary_keyword": 2.5,
    "secondary_keywords": 1.5
  },
  "seoScore": 85,
  "readabilityScore": 65
}

**IMPORTANT:** 
- Make the content sound natural and human-written, NOT AI-generated
- Avoid generic phrases like "state-of-the-art" or "world-class" 
- Use specific, concrete details when possible
- Write in active voice
- Keep paragraphs short and scannable
- Include local landmarks or references to build authenticity

Generate the SEO content now as valid JSON only.`

  try {
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [{
          role: 'user',
          content: prompt
        }],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 3000
      })
    })

    if (!response.ok) {
      throw new Error(`AI generation failed: ${response.statusText}`)
    }

    const data = await response.json()
    const content = JSON.parse(data.choices[0].message.content)

    return {
      success: true,
      content,
      model: 'gpt-4.1-mini',
      prompt
    }
  } catch (error) {
    console.error('SEO content generation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      model: 'gpt-4.1-mini',
      prompt
    }
  }
}

// Generate weekly analytics report with AI insights
export async function generateAnalyticsReport(params: {
  reportType: 'weekly' | 'monthly' | 'quarterly'
  startDate: Date
  endDate: Date
}) {
  const { reportType, startDate, endDate } = params

  // Fetch performance data for the period
  const performanceData = await prisma.sEOPerformance.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      keyword: true
    }
  })

  // Calculate aggregate metrics
  const totalImpressions = performanceData.reduce((sum, p) => sum + p.impressions, 0)
  const totalClicks = performanceData.reduce((sum, p) => sum + p.clicks, 0)
  const avgCTR = totalClicks > 0 ? (totalClicks / totalImpressions) * 100 : 0
  const avgPosition = performanceData.length > 0
    ? performanceData.reduce((sum, p) => sum + (p.position || 0), 0) / performanceData.length
    : 0
  const totalOrganic = performanceData.reduce((sum, p) => sum + p.organicTraffic, 0)
  const totalConversions = performanceData.reduce((sum, p) => sum + p.conversions, 0)

  // Group by keyword for top performers
  const keywordPerformance = new Map<string, any>()
  performanceData.forEach(p => {
    const keyword = p.keyword?.keyword || 'unknown'
    if (!keywordPerformance.has(keyword)) {
      keywordPerformance.set(keyword, {
        keyword,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        avgPosition: 0,
        count: 0
      })
    }
    const kp = keywordPerformance.get(keyword)!
    kp.impressions += p.impressions
    kp.clicks += p.clicks
    kp.conversions += p.conversions
    kp.avgPosition += p.position || 0
    kp.count += 1
  })

  // Calculate averages and sort
  const topKeywords = Array.from(keywordPerformance.values())
    .map(kp => ({
      ...kp,
      avgPosition: kp.avgPosition / kp.count,
      ctr: kp.impressions > 0 ? (kp.clicks / kp.impressions) * 100 : 0
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10)

  // Generate AI insights
  const insightsPrompt = `You are an SEO analytics expert. Analyze the following performance data and provide actionable insights and recommendations.

**Report Period:** ${reportType} (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()})

**Overall Metrics:**
- Total Impressions: ${totalImpressions}
- Total Clicks: ${totalClicks}
- Average CTR: ${avgCTR.toFixed(2)}%
- Average Position: ${avgPosition.toFixed(1)}
- Organic Traffic: ${totalOrganic}
- Conversions: ${totalConversions}

**Top Performing Keywords:**
${topKeywords.map(k => `- ${k.keyword}: ${k.clicks} clicks, ${k.ctr.toFixed(2)}% CTR, position ${k.avgPosition.toFixed(1)}`).join('\n')}

**Task:**
Generate a JSON response with:
1. 3-5 key insights about the performance
2. 3-5 specific, actionable recommendations
3. 3-5 prioritized action items
4. Competitive analysis suggestions

**Output Format:**
{
  "insights": [
    { "title": "Insight Title", "description": "Detailed insight", "impact": "high/medium/low" }
  ],
  "recommendations": [
    { "title": "Recommendation", "description": "Detailed recommendation", "priority": "high/medium/low", "estimatedImpact": "Expected outcome" }
  ],
  "actionItems": [
    { "action": "Specific action", "priority": 1, "effort": "low/medium/high", "timeline": "timeframe" }
  ],
  "competitorAnalysis": {
    "suggestion": "How to analyze competitors",
    "focusAreas": ["Area 1", "Area 2"]
  }
}

Generate the analysis now as valid JSON only.`

  try {
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [{ role: 'user', content: insightsPrompt }],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    const data = await response.json()
    const insights = JSON.parse(data.choices[0].message.content)

    // Create the report
    const report = await prisma.sEOAnalyticsReport.create({
      data: {
        reportType,
        reportPeriod: `${startDate.getFullYear()}-W${getWeekNumber(startDate)}`,
        startDate,
        endDate,
        totalImpressions,
        totalClicks,
        avgCTR,
        avgPosition,
        totalOrganic,
        totalConversions,
        conversionRate: totalOrganic > 0 ? (totalConversions / totalOrganic) * 100 : 0,
        topKeywords,
        insights: insights.insights,
        recommendations: insights.recommendations,
        actionItems: insights.actionItems,
        competitorAnalysis: insights.competitorAnalysis,
        status: 'completed',
        generatedAt: new Date(),
        generatedBy: 'system'
      }
    })

    return report
  } catch (error) {
    console.error('Report generation error:', error)
    throw error
  }
}

// Calculate SEO score for content
export function calculateSEOScore(content: {
  title?: string
  metaDescription?: string
  h1Heading?: string
  contentBlocks?: any[]
  targetKeywords: string[]
}): number {
  let score = 0
  const maxScore = 100

  // Title optimization (20 points)
  if (content.title) {
    if (content.title.length >= 50 && content.title.length <= 60) score += 10
    else if (content.title.length >= 40 && content.title.length <= 70) score += 5
    
    const titleHasKeyword = content.targetKeywords.some(k => 
      content.title!.toLowerCase().includes(k.toLowerCase())
    )
    if (titleHasKeyword) score += 10
  }

  // Meta description (15 points)
  if (content.metaDescription) {
    if (content.metaDescription.length >= 150 && content.metaDescription.length <= 160) score += 8
    else if (content.metaDescription.length >= 130 && content.metaDescription.length <= 170) score += 4
    
    const descHasKeyword = content.targetKeywords.some(k => 
      content.metaDescription!.toLowerCase().includes(k.toLowerCase())
    )
    if (descHasKeyword) score += 7
  }

  // H1 heading (15 points)
  if (content.h1Heading) {
    score += 10
    const h1HasKeyword = content.targetKeywords.some(k => 
      content.h1Heading!.toLowerCase().includes(k.toLowerCase())
    )
    if (h1HasKeyword) score += 5
  }

  // Content blocks (50 points)
  if (content.contentBlocks && content.contentBlocks.length > 0) {
    score += Math.min(content.contentBlocks.length * 10, 30) // Up to 30 points for multiple sections
    
    // Check for keyword presence in content
    const allContent = content.contentBlocks.map(b => b.content).join(' ').toLowerCase()
    const keywordCount = content.targetKeywords.filter(k => 
      allContent.includes(k.toLowerCase())
    ).length
    score += Math.min(keywordCount * 5, 20) // Up to 20 points for keyword usage
  }

  return Math.min(score, maxScore)
}

// Helper function to get week number
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

// Schedule next update for a page
export function calculateNextUpdate(frequency: string, lastUpdate?: Date): Date {
  const now = lastUpdate || new Date()
  const next = new Date(now)

  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1)
      break
    case 'weekly':
      next.setDate(next.getDate() + 7)
      break
    case 'biweekly':
      next.setDate(next.getDate() + 14)
      break
    case 'monthly':
      next.setMonth(next.getMonth() + 1)
      break
    default:
      next.setDate(next.getDate() + 7) // Default to weekly
  }

  return next
}
