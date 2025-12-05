const { Client } = require('pg');
const crypto = require('crypto');
require('dotenv').config();

// Simple cuid-like ID generator
function generateId() {
  return 'c' + crypto.randomBytes(12).toString('base64').replace(/[+/=]/g, '').substring(0, 24);
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

async function generateSchemaMarkup() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('🎯 Starting Schema Markup Generation...');

    // Fetch all active pages
    const result = await client.query(`
      SELECT id, "pagePath", "pageTitle", "metaDescription", "contentStrategy"
      FROM "SEOPageConfig"
      WHERE status = 'active'
    `);

    const pages = result.rows;
    console.log(`Found ${pages.length} active pages`);

    let updatedCount = 0;
    const schemaUpdates = [];
    const errors = [];

    for (const page of pages) {
      try {
        const schemas = [];

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
        let contentStrategy = {};
        try {
          contentStrategy = page.contentStrategy ? JSON.parse(page.contentStrategy) : {};
        } catch (e) {
          // If contentStrategy is not valid JSON, start with empty object
          console.log(`   Note: contentStrategy for ${page.pagePath} is not JSON, creating new object`);
          contentStrategy = {};
        }
        contentStrategy.schemaMarkup = schemas;

        await client.query(`
          UPDATE "SEOPageConfig"
          SET "contentStrategy" = $1, "updatedAt" = NOW()
          WHERE id = $2
        `, [JSON.stringify(contentStrategy), page.id]);

        updatedCount++;
        schemaUpdates.push({
          page: page.pagePath,
          schemasAdded: schemas.length,
          types: schemas.map(s => s['@type'])
        });

        console.log(`✅ Added ${schemas.length} schema(s) to ${page.pagePath}`);
      } catch (pageError) {
        console.error(`❌ Error processing ${page.pagePath}:`, pageError.message);
        errors.push({
          page: page.pagePath,
          error: pageError.message
        });
      }
    }

    // Log to audit
    await client.query(`
      INSERT INTO "SEOAuditLog" (id, action, "entityType", "performedBy", changes, timestamp)
      VALUES ($1, $2, $3, $4, $5, NOW())
    `, [
      generateId(),
      'schema_markup_generated',
      'page',
      'system',
      JSON.stringify({
        pagesUpdated: updatedCount,
        updates: schemaUpdates,
        errors: errors
      })
    ]);

    console.log(`\n✨ Schema Markup Generation Complete!`);
    console.log(`📊 Updated ${updatedCount} pages with structured data`);
    if (errors.length > 0) {
      console.log(`⚠️  ${errors.length} errors encountered`);
    }

    return {
      success: true,
      pagesUpdated: updatedCount,
      updates: schemaUpdates,
      errors: errors
    };

  } catch (error) {
    console.error('❌ Schema markup generation failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

generateSchemaMarkup()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
