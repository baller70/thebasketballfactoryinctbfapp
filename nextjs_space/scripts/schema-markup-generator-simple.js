const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function generateSchemaMarkup() {
  console.log('Starting schema markup generation...');
  
  try {
    // Fetch all active pages
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' }
    });
    
    console.log(`Found ${pages.length} active pages`);
    
    let updatedCount = 0;
    let errorCount = 0;
    const schemaTypes = {};
    
    for (const page of pages) {
      try {
        const schema = generateSchemaForPage(page);
        
        if (schema) {
          // Parse existing contentStrategy or create new one
          let contentStrategy = {};
          try {
            if (page.contentStrategy) {
              contentStrategy = JSON.parse(page.contentStrategy);
            }
          } catch (e) {
            console.log(`Warning: Could not parse contentStrategy for ${page.pagePath}`);
          }
          
          // Add schema markup
          contentStrategy.schemaMarkup = schema;
          
          // Update the page with schema markup
          await prisma.sEOPageConfig.update({
            where: { id: page.id },
            data: {
              contentStrategy: JSON.stringify(contentStrategy)
            }
          });
          
          // Track schema type
          const schemaType = schema['@type'];
          schemaTypes[schemaType] = (schemaTypes[schemaType] || 0) + 1;
          
          updatedCount++;
          
          // Log to audit
          await prisma.sEOAuditLog.create({
            data: {
              action: 'SCHEMA_GENERATED',
              entityType: 'PAGE',
              entityId: page.id,
              pagePath: page.pagePath,
              reason: `Generated ${schemaType} schema`,
              performedBy: 'system'
            }
          });
        }
      } catch (error) {
        console.error(`Error processing page ${page.pagePath}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\nSchema markup generation complete:`);
    console.log(`- Pages updated: ${updatedCount}`);
    console.log(`- Errors: ${errorCount}`);
    console.log(`- Schema types:`, schemaTypes);
    
    return {
      updatedCount,
      errorCount,
      schemaTypes,
      totalPages: pages.length
    };
    
  } catch (error) {
    console.error('Fatal error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

function generateSchemaForPage(page) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.pageTitle || page.pagePath,
    url: `https://riseasoneaau.com${page.pagePath}`
  };
  
  // Determine schema type based on page path
  if (page.pagePath === '/' || page.pagePath === '/home') {
    return {
      '@context': 'https://schema.org',
      '@type': 'SportsOrganization',
      name: 'Rise As One AAU',
      url: 'https://riseasoneaau.com',
      description: 'Premier AAU basketball organization',
      sport: 'Basketball',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Local Area',
        addressRegion: 'State',
        addressCountry: 'US'
      }
    };
  }
  
  if (page.pagePath.includes('/programs') || page.pagePath.includes('/teams')) {
    return {
      '@context': 'https://schema.org',
      '@type': 'SportsEvent',
      name: page.pageTitle || 'Basketball Program',
      url: `https://riseasoneaau.com${page.pagePath}`,
      sport: 'Basketball',
      organizer: {
        '@type': 'SportsOrganization',
        name: 'Rise As One AAU'
      }
    };
  }
  
  if (page.pagePath.includes('/about') || page.pagePath.includes('/contact')) {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Rise As One AAU',
      url: `https://riseasoneaau.com${page.pagePath}`,
      description: page.metaDescription || 'AAU Basketball Organization'
    };
  }
  
  // Generate breadcrumb schema for all pages
  const pathParts = page.pagePath.split('/').filter(p => p);
  if (pathParts.length > 0) {
    const breadcrumbList = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: pathParts.map((part, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: part.charAt(0).toUpperCase() + part.slice(1),
        item: `https://riseasoneaau.com/${pathParts.slice(0, index + 1).join('/')}`
      }))
    };
    
    return breadcrumbList;
  }
  
  return baseSchema;
}

// Run if called directly
if (require.main === module) {
  generateSchemaMarkup()
    .then(result => {
      console.log('\nSuccess!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\nFailed:', error);
      process.exit(1);
    });
}

module.exports = { generateSchemaMarkup };
