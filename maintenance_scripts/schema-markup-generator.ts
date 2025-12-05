import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SchemaMarkup {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

async function generateSchemaMarkup() {
  console.log('🎯 Starting Schema Markup Generation...');

  try {
    // Fetch SEO settings for business info
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings) {
      console.error('❌ No SEO settings found');
      return;
    }

    const businessInfo = {
      name: 'The Basketball Factory Inc.',
      description: 'Elite basketball training and development programs in New Jersey',
      telephone: '+1-909-577-9171',
      email: 'khouston@thebasketballfactorynj.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '91 Woodport Rd',
        addressLocality: 'Sparta',
        addressRegion: 'NJ',
        postalCode: '07871',
        addressCountry: 'US'
      },
      url: 'https://thebasketballfactoryinc.com',
      logo: 'https://pbs.twimg.com/profile_images/858860958646587392/N92hwyRL_400x400.jpg',
      image: 'https://i.ytimg.com/vi/pTcF4FRBndU/mqdefault.jpg'
    };

    // Fetch all active pages
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' }
    });

    let updatedCount = 0;
    const schemaUpdates: any[] = [];

    for (const page of pages) {
      const schemas: SchemaMarkup[] = [];

      // Add LocalBusiness schema for homepage and location pages
      if (page.pagePath === '/' || page.pagePath.includes('location')) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          '@id': `${businessInfo.url}#localbusiness`,
          name: businessInfo.name,
          description: businessInfo.description,
          telephone: businessInfo.telephone,
          email: businessInfo.email,
          address: businessInfo.address,
          url: businessInfo.url,
          logo: businessInfo.logo,
          image: businessInfo.image,
          priceRange: '$$',
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '16:00',
              closes: '21:00'
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Saturday', 'Sunday'],
              opens: '09:00',
              closes: '18:00'
            }
          ]
        });
      }

      // Add Organization schema for all pages
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'SportsOrganization',
        '@id': `${businessInfo.url}#organization`,
        name: businessInfo.name,
        description: businessInfo.description,
        url: businessInfo.url,
        logo: businessInfo.logo,
        sameAs: [
          'https://www.facebook.com/thebasketballfactoryinc',
          'https://www.instagram.com/thebasketballfactoryinc',
          'https://twitter.com/basketballfactorynj'
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: businessInfo.telephone,
          contactType: 'Customer Service',
          email: businessInfo.email,
          availableLanguage: 'English'
        }
      });

      // Add Event schema for program pages
      if (page.pagePath.includes('/programs/')) {
        const programName = page.pageTitle || 'Basketball Training Program';
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'SportsEvent',
          name: programName,
          description: page.metaDescription || 'Professional basketball training program',
          organizer: {
            '@type': 'SportsOrganization',
            name: businessInfo.name,
            url: businessInfo.url
          },
          location: {
            '@type': 'Place',
            name: 'The Basketball Factory',
            address: businessInfo.address
          },
          offers: {
            '@type': 'Offer',
            price: '35.00',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `${businessInfo.url}${page.pagePath}`
          }
        });
      }

      // Add Service schema for private lessons
      if (page.pagePath.includes('/private-lessons')) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: 'Private Basketball Training',
          provider: {
            '@type': 'SportsOrganization',
            name: businessInfo.name,
            url: businessInfo.url
          },
          areaServed: {
            '@type': 'State',
            name: 'New Jersey'
          },
          offers: {
            '@type': 'Offer',
            price: '85.00',
            priceCurrency: 'USD'
          }
        });
      }

      // Add BreadcrumbList schema for navigation
      const pathParts = page.pagePath.split('/').filter(p => p);
      if (pathParts.length > 0) {
        const breadcrumbItems = [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: businessInfo.url
          }
        ];

        pathParts.forEach((part, index) => {
          breadcrumbItems.push({
            '@type': 'ListItem',
            position: index + 2,
            name: part.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            item: `${businessInfo.url}/${pathParts.slice(0, index + 1).join('/')}`
          });
        });

        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbItems
        });
      }

      // Update page config with schema markup
      const contentStrategy = page.contentStrategy ? JSON.parse(page.contentStrategy as string) : {};
      contentStrategy.schemaMarkup = schemas;

      await prisma.sEOPageConfig.update({
        where: { id: page.id },
        data: {
          contentStrategy: JSON.stringify(contentStrategy),
          updatedAt: new Date()
        }
      });

      updatedCount++;
      schemaUpdates.push({
        page: page.pagePath,
        schemasAdded: schemas.length,
        types: schemas.map(s => s['@type'])
      });

      console.log(`✅ Added ${schemas.length} schema(s) to ${page.pagePath}`);
    }

    // Log to audit
    await prisma.sEOAuditLog.create({
      data: {
        action: 'schema_markup_generated',
        entityType: 'page',
        performedBy: 'system',
        changes: {
          pagesUpdated: updatedCount,
          updates: schemaUpdates
        }
      }
    });

    console.log(`\n✨ Schema Markup Generation Complete!`);
    console.log(`📊 Updated ${updatedCount} pages with structured data`);

    return {
      success: true,
      pagesUpdated: updatedCount,
      updates: schemaUpdates
    };

  } catch (error) {
    console.error('❌ Schema markup generation failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  generateSchemaMarkup()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { generateSchemaMarkup };
