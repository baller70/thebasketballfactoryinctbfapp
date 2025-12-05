const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSchema() {
  try {
    const pages = await prisma.sEOPageConfig.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    
    console.log('\n=== SCHEMA MARKUP DETAILS ===');
    console.log(`Checking ${pages.length} pages for schema markup:\n`);
    
    pages.forEach(page => {
      console.log(`\n📄 ${page.pagePath}`);
      console.log(`   Page Name: ${page.pageName}`);
      console.log(`   Schema Markup: ${page.schemaMarkup ? 'YES ✅' : 'NO ❌'}`);
      
      if (page.schemaMarkup) {
        try {
          const schema = JSON.parse(page.schemaMarkup);
          console.log(`   Schema Type: ${schema['@type']}`);
          console.log(`   Schema Context: ${schema['@context']}`);
          if (schema.name) console.log(`   Name: ${schema.name}`);
        } catch (e) {
          console.log(`   Error parsing schema: ${e.message}`);
        }
      }
      console.log(`   Updated: ${page.updatedAt.toISOString()}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchema().catch(console.error);
