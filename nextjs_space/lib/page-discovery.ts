
/**
 * Page Discovery Service
 * Crawls the website to discover all pages and suggest SEO strategies
 */

import { PrismaClient } from '@prisma/client'
import { SEOPageStrategy } from './seo-best-practices'

const prisma = new PrismaClient()

/**
 * Discover all pages from the Next.js app directory structure
 * and existing page configurations
 */
export async function discoverPages(): Promise<string[]> {
  // Main website pages based on the current structure
  const knownPages = [
    // Main pages
    '/',
    '/contact-us',
    '/director',
    '/who-we-are',
    '/staff',
    '/free-apps',
    
    // Program overview pages
    '/programs',
    '/fall-programs',
    '/winter-programs',
    '/spring-programs',
    '/summer-programs',
    
    // Private lessons
    '/private-lessons',
    
    // High School Programs
    '/programs/high-school-fall-workouts',
    '/programs/hs-winter-workouts',
    '/programs/hs-spring-circuit',
    
    // Middle School Programs
    '/programs/ms-fall-skills-academy',
    '/programs/ms-winter-workouts',
    '/programs/ms-spring-circuit',
    
    // Youth Programs
    '/programs/youth-fall-open-gym',
    '/programs/youth-winter-open-gym',
    '/programs/youth-spring-open-gym',
    '/programs/youth-skills-camp',
    
    // Free Programs
    '/programs/free-youth-program',
    '/programs/future-stars-skills',
    '/programs/youth-basketball-basics',
    
    // Other Programs
    '/programs/summer-camp',
    '/programs/friday-night-lights',
    '/programs/training-equipment',
  ]

  // Get any additional configured pages from database
  const configuredPages = await prisma.sEOPageConfig.findMany({
    select: { pagePath: true }
  })

  const allPages = [...new Set([
    ...knownPages,
    ...configuredPages.map(p => p.pagePath)
  ])]

  return allPages.sort()
}

/**
 * Suggest keyword strategy for a page based on its path and purpose
 */
export function suggestKeywordsForPage(pagePath: string): {
  primary: string[]
  secondary: string[]
  intent: 'informational' | 'navigational' | 'transactional'
  businessRelevance: 'high' | 'medium' | 'low'
} {
  // Private Lessons - HIGH PRIORITY (transactional intent)
  if (pagePath === '/private-lessons') {
    return {
      primary: ['basketball private lessons', 'private basketball training', 'one on one basketball lessons'],
      secondary: ['personal basketball coach', 'individual basketball training', 'basketball skills training', 'basketball coaching near me'],
      intent: 'transactional',
      businessRelevance: 'high'
    }
  }

  // High School Programs - HIGH PRIORITY
  if (pagePath.includes('high-school') || pagePath.includes('hs-')) {
    return {
      primary: ['high school basketball training', 'basketball workouts for high school', 'high school basketball camp'],
      secondary: ['basketball training for teens', 'competitive basketball training', 'high school basketball skills'],
      intent: 'transactional',
      businessRelevance: 'high'
    }
  }

  // Middle School Programs - HIGH PRIORITY
  if (pagePath.includes('middle-school') || pagePath.includes('ms-')) {
    return {
      primary: ['middle school basketball training', 'youth basketball skills academy', 'basketball camp middle school'],
      secondary: ['basketball training for kids', 'youth basketball development', 'middle school basketball drills'],
      intent: 'transactional',
      businessRelevance: 'high'
    }
  }

  // Youth Programs
  if (pagePath.includes('youth') || pagePath.includes('kids')) {
    return {
      primary: ['youth basketball training', 'kids basketball camp', 'basketball for kids'],
      secondary: ['youth basketball program', 'basketball lessons for children', 'kids basketball skills'],
      intent: 'transactional',
      businessRelevance: 'high'
    }
  }

  // Free Programs - LEAD GENERATION
  if (pagePath.includes('free')) {
    return {
      primary: ['free basketball training', 'free basketball camp', 'basketball clinic free'],
      secondary: ['free basketball lessons', 'community basketball program', 'basketball introduction program'],
      intent: 'transactional',
      businessRelevance: 'high'
    }
  }

  // Seasonal overview pages
  if (pagePath.includes('fall-programs')) {
    return {
      primary: ['fall basketball programs', 'basketball training fall', 'fall basketball camp'],
      secondary: ['autumn basketball training', 'basketball programs near me', 'fall sports programs'],
      intent: 'navigational',
      businessRelevance: 'medium'
    }
  }

  if (pagePath.includes('winter-programs')) {
    return {
      primary: ['winter basketball programs', 'basketball training winter', 'winter basketball camp'],
      secondary: ['indoor basketball training', 'winter sports programs', 'basketball programs near me'],
      intent: 'navigational',
      businessRelevance: 'medium'
    }
  }

  if (pagePath.includes('spring-programs')) {
    return {
      primary: ['spring basketball programs', 'basketball training spring', 'spring basketball camp'],
      secondary: ['spring sports programs', 'basketball circuit training', 'basketball programs near me'],
      intent: 'navigational',
      businessRelevance: 'medium'
    }
  }

  if (pagePath.includes('summer-programs') || pagePath.includes('summer-camp')) {
    return {
      primary: ['summer basketball camp', 'basketball training summer', 'summer basketball programs'],
      secondary: ['summer camp near me', 'youth summer basketball', 'basketball camp for kids'],
      intent: 'transactional',
      businessRelevance: 'high'
    }
  }

  // About pages
  if (pagePath === '/who-we-are' || pagePath === '/director') {
    return {
      primary: ['basketball training facility', 'basketball academy', 'basketball coaching staff'],
      secondary: ['professional basketball trainer', 'basketball program director', 'basketball training center'],
      intent: 'informational',
      businessRelevance: 'medium'
    }
  }

  // Contact page
  if (pagePath === '/contact-us') {
    return {
      primary: ['basketball training near me', 'contact basketball trainer', 'basketball lessons location'],
      secondary: ['basketball training sparta nj', 'basketball facility contact', 'basketball training schedule'],
      intent: 'transactional',
      businessRelevance: 'high'
    }
  }

  // Homepage
  if (pagePath === '/') {
    return {
      primary: ['basketball training', 'basketball academy', 'basketball lessons'],
      secondary: ['youth basketball training', 'basketball camp', 'basketball coaching', 'basketball skills training'],
      intent: 'navigational',
      businessRelevance: 'high'
    }
  }

  // Default for unknown pages
  return {
    primary: ['basketball training', 'basketball program'],
    secondary: ['basketball skills', 'basketball coaching'],
    intent: 'informational',
    businessRelevance: 'low'
  }
}

/**
 * Auto-populate pages with SEO configurations
 */
export async function autoPopulatePages(): Promise<{
  created: number
  skipped: number
  pages: string[]
}> {
  const discoveredPages = await discoverPages()
  let created = 0
  let skipped = 0
  const createdPages: string[] = []

  for (const pagePath of discoveredPages) {
    // Check if already exists
    const existing = await prisma.sEOPageConfig.findUnique({
      where: { pagePath }
    })

    if (existing) {
      skipped++
      continue
    }

    // Get keyword suggestions
    const suggestions = suggestKeywordsForPage(pagePath)
    
    // Generate page name from path
    const pageName = pagePath
      .split('/')
      .filter(Boolean)
      .map(part => part.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '))
      .join(' - ') || 'Home Page'

    // Create page config (without keywords for now - admin will assign them)
    await prisma.sEOPageConfig.create({
      data: {
        pagePath,
        pageName,
        localAreaTargets: ['Sparta', 'Morris County', 'Sussex County', 'New Jersey'],
        updateFrequency: 'weekly',
        autoUpdateEnabled: true,
        contentStrategy: JSON.stringify({
          intent: suggestions.intent,
          suggestedPrimaryKeywords: suggestions.primary,
          suggestedSecondaryKeywords: suggestions.secondary,
          businessRelevance: suggestions.businessRelevance
        })
      }
    })

    created++
    createdPages.push(pagePath)
  }

  return { created, skipped, pages: createdPages }
}

