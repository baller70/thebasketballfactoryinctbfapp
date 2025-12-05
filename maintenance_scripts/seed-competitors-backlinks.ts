
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seeds initial competitor, backlink, and content gap data
 */
async function seedCompetitorsAndBacklinks() {
  try {
    console.log('🌱 Seeding competitors, backlinks, and content gaps...\n');

    // ===== SEED COMPETITORS =====
    console.log('📊 Seeding competitor data...');
    
    const competitors = [
      {
        name: 'Princeton Basketball Academy',
        domain: 'princetonbasketball.com',
        website: 'https://www.princetonbasketball.com',
        domainRating: 42,
        organicKeywords: 285,
        organicTraffic: 3200,
        backlinks: 142,
        referringDomains: 38,
        location: 'Princeton, NJ',
        targetMarket: 'Basketball Training',
        strengths: ['Established brand', 'Large facility', 'Multiple programs'],
        weaknesses: ['Higher pricing', 'Limited personal attention'],
        topKeywords: [
          { keyword: 'princeton basketball training', position: 1, searchVolume: 480 },
          { keyword: 'basketball camps nj', position: 5, searchVolume: 1200 },
        ],
        contentGaps: ['private coaching', 'youth fundamentals']
      },
      {
        name: 'Jersey Hoop Dreams',
        domain: 'jerseyhoopdreams.com',
        website: 'https://www.jerseyhoopdreams.com',
        domainRating: 38,
        organicKeywords: 192,
        organicTraffic: 2100,
        backlinks: 89,
        referringDomains: 24,
        location: 'North Jersey, NJ',
        targetMarket: 'Youth Basketball',
        strengths: ['Strong social media', 'AAU connections'],
        weaknesses: ['Limited facility access', 'Seasonal programs only'],
        topKeywords: [
          { keyword: 'aau basketball nj', position: 3, searchVolume: 890 },
          { keyword: 'youth basketball training', position: 7, searchVolume: 2400 },
        ],
        contentGaps: ['elite training', 'skills assessment']
      },
      {
        name: 'Elite Basketball Skills',
        domain: 'elitebasketballskills.com',
        website: 'https://www.elitebasketballskills.com',
        domainRating: 35,
        organicKeywords: 156,
        organicTraffic: 1800,
        backlinks: 67,
        referringDomains: 19,
        location: 'Newark, NJ',
        targetMarket: 'Skills Development',
        strengths: ['Specialized training', 'Former pro coaches'],
        weaknesses: ['Limited geographic reach', 'No facility'],
        topKeywords: [
          { keyword: 'basketball skills training', position: 6, searchVolume: 1600 },
          { keyword: 'private basketball lessons nj', position: 4, searchVolume: 720 },
        ],
        contentGaps: ['team training', 'open gym sessions']
      },
    ];

    for (const comp of competitors) {
      await prisma.sEOCompetitor.upsert({
        where: { domain: comp.domain },
        update: comp,
        create: comp,
      });
      console.log(`  ✓ ${comp.name}`);
    }

    // ===== SEED BACKLINKS =====
    console.log('\n🔗 Seeding backlink data...');
    
    const backlinks = [
      {
        sourceUrl: 'https://www.njsportsguide.com/basketball-training',
        targetUrl: 'https://thebasketballfactoryinc.com/',
        anchorText: 'The Basketball Factory',
        domainRating: 52,
        isDofollow: true,
        sourceDomain: 'njsportsguide.com',
        sourceTitle: 'Top Basketball Training Centers in NJ',
        sourceType: 'directory',
        firstSeen: new Date('2024-06-15'),
        lastSeen: new Date(),
        status: 'active'
      },
      {
        sourceUrl: 'https://www.spartachamber.org/member-directory',
        targetUrl: 'https://thebasketballfactoryinc.com/',
        anchorText: 'Basketball Training Sparta NJ',
        domainRating: 48,
        isDofollow: true,
        sourceDomain: 'spartachamber.org',
        sourceTitle: 'Sparta Chamber of Commerce Member Directory',
        sourceType: 'directory',
        firstSeen: new Date('2024-05-20'),
        lastSeen: new Date(),
        status: 'active'
      },
      {
        sourceUrl: 'https://www.localsportsnetwork.com/basketball/training-facilities',
        targetUrl: 'https://thebasketballfactoryinc.com/private-lessons',
        anchorText: 'private basketball coaching',
        domainRating: 45,
        isDofollow: true,
        sourceDomain: 'localsportsnetwork.com',
        sourceTitle: 'Best Basketball Training Facilities',
        sourceType: 'blog',
        firstSeen: new Date('2024-07-10'),
        lastSeen: new Date(),
        status: 'active'
      },
      {
        sourceUrl: 'https://www.youthsportsnetwork.com/resources',
        targetUrl: 'https://thebasketballfactoryinc.com/programs',
        anchorText: 'youth basketball programs',
        domainRating: 51,
        isDofollow: true,
        sourceDomain: 'youthsportsnetwork.com',
        sourceTitle: 'Youth Basketball Resources',
        sourceType: 'blog',
        firstSeen: new Date('2024-08-05'),
        lastSeen: new Date(),
        status: 'active'
      },
      {
        sourceUrl: 'https://www.sussexcountyguide.com/sports',
        targetUrl: 'https://thebasketballfactoryinc.com/',
        anchorText: 'basketball training facility',
        domainRating: 38,
        isDofollow: true,
        sourceDomain: 'sussexcountyguide.com',
        sourceTitle: 'Sussex County Sports Directory',
        sourceType: 'directory',
        firstSeen: new Date('2024-04-12'),
        lastSeen: new Date(),
        status: 'active'
      },
    ];

    for (const bl of backlinks) {
      await prisma.sEOBacklink.create({
        data: bl,
      });
      console.log(`  ✓ ${bl.sourceDomain} → ${bl.targetUrl}`);
    }

    // ===== SEED CONTENT GAPS =====
    console.log('\n🎯 Seeding content gap opportunities...');
    
    const contentGaps = [
      {
        keyword: 'basketball training for beginners',
        searchVolume: 2900,
        difficulty: 35,
        priority: 'high',
        competitorDomain: 'princetonbasketball.com',
        competitorUrl: 'https://www.princetonbasketball.com/beginner-programs',
        competitorPosition: 3,
        competitorTitle: 'Beginner Basketball Programs',
        gapType: 'keyword',
        opportunity: 'High-volume keyword with low difficulty. Competitors rank well but content is dated.',
        suggestedAction: 'Create comprehensive guide page targeting beginners with video tutorials and program information.',
        estimatedImpact: 'high'
      },
      {
        keyword: 'basketball drills for kids',
        searchVolume: 4400,
        difficulty: 42,
        priority: 'high',
        competitorDomain: 'jerseyhoopdreams.com',
        competitorUrl: 'https://www.jerseyhoopdreams.com/drills',
        competitorPosition: 5,
        competitorTitle: 'Basketball Drills Library',
        gapType: 'content',
        opportunity: 'Popular topic with excellent engagement potential. Competitors have basic content.',
        suggestedAction: 'Build interactive drills database with age-specific recommendations and video demonstrations.',
        estimatedImpact: 'high'
      },
      {
        keyword: 'basketball training near me',
        searchVolume: 8200,
        difficulty: 58,
        priority: 'high',
        competitorDomain: 'multiple',
        competitorPosition: 8,
        gapType: 'keyword',
        opportunity: 'Critical local search term. Currently not well-optimized for this query.',
        suggestedAction: 'Optimize homepage and location pages with local schema markup and location-specific content.',
        estimatedImpact: 'high'
      },
      {
        keyword: 'basketball shooting technique',
        searchVolume: 3200,
        difficulty: 45,
        priority: 'medium',
        competitorDomain: 'elitebasketballskills.com',
        competitorUrl: 'https://www.elitebasketballskills.com/shooting',
        competitorPosition: 4,
        competitorTitle: 'Perfect Your Shooting Form',
        gapType: 'content',
        opportunity: 'High-engagement topic. Opportunity to create definitive guide.',
        suggestedAction: 'Create detailed shooting technique guide with progressive skill levels and video breakdowns.',
        estimatedImpact: 'medium'
      },
      {
        keyword: 'aau basketball tryouts nj',
        searchVolume: 1800,
        difficulty: 38,
        priority: 'medium',
        competitorDomain: 'jerseyhoopdreams.com',
        competitorPosition: 2,
        gapType: 'keyword',
        opportunity: 'Seasonal keyword with high conversion potential during tryout season.',
        suggestedAction: 'Create dedicated AAU information page with tryout schedules and preparation tips.',
        estimatedImpact: 'medium'
      },
      {
        keyword: 'basketball conditioning drills',
        searchVolume: 2200,
        difficulty: 40,
        priority: 'medium',
        competitorDomain: 'princetonbasketball.com',
        competitorPosition: 6,
        gapType: 'content',
        opportunity: 'Gap in conditioning-focused content. Complements skill training.',
        suggestedAction: 'Develop conditioning program content showcasing strength and agility training.',
        estimatedImpact: 'medium'
      },
    ];

    for (const gap of contentGaps) {
      await prisma.sEOContentGap.upsert({
        where: { keyword: gap.keyword },
        update: gap,
        create: gap,
      });
      console.log(`  ✓ ${gap.keyword} (${gap.searchVolume} vol, priority: ${gap.priority})`);
    }

    console.log('\n✅ Competitor, backlink, and content gap seeding completed!\n');
    console.log('📊 Summary:');
    console.log(`  - ${competitors.length} competitors added`);
    console.log(`  - ${backlinks.length} backlinks added`);
    console.log(`  - ${contentGaps.length} content gaps identified`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedCompetitorsAndBacklinks()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default seedCompetitorsAndBacklinks;
