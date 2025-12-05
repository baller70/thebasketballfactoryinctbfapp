const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSchemaUpdates() {
  try {
    const pages = await prisma.sEOPageConfig.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    
    console.log('\n=== SCHEMA MARKUP IN CONTENT STRATEGY ===');
    console.log(`Checking ${pages.length} pages:\n`);
    
    pages.forEach(page => {
      console.log(`\n📄 ${page.pagePath}`);
      console.log(`   Page Name: ${page.pageName}`);
      
      if (page.contentStrategy) {
        try {
          const strategy = typeof page.contentStrategy === 'string' 
            ? JSON.parse(page.contentStrategy) 
            : page.contentStrategy;
          
          if (strategy.schemaMarkup) {
            console.log(`   ✅ Schema Markup: YES`);
            console.log(`   Schema Type: ${strategy.schemaMarkup['@type']}`);
            console.log(`   Schema Name: ${strategy.schemaMarkup.name || 'N/A'}`);
          } else {
            console.log(`   ❌ Schema Markup: NO`);
          }
        } catch (e) {
          console.log(`   ⚠️  Error parsing contentStrategy: ${e.message}`);
        }
      } else {
        console.log(`   ❌ No contentStrategy field`);
      }
      
      console.log(`   Updated: ${page.updatedAt.toISOString()}`);
    });

    // Check audit log
    console.log('\n\n=== AUDIT LOG ===');
    const auditLogs = await prisma.sEOAuditLog.findMany({
      where: { action: 'schema_markup_applied' },
      orderBy: { timestamp: 'desc' },
      take: 5
    });
    
    console.log(`Found ${auditLogs.length} schema markup audit entries:\n`);
    auditLogs.forEach(log => {
      console.log(`  ${log.timestamp.toISOString()}`);
      console.log(`  Action: ${log.action}`);
      if (log.changes) {
        const changes = typeof log.changes === 'string' ? JSON.parse(log.changes) : log.changes;
        console.log(`  Count: ${changes.count || 0}`);
        if (changes.schemasGenerated) {
          changes.schemasGenerated.forEach(s => {
            console.log(`    - ${s.path}: ${s.type}`);
          });
        }
      }
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchemaUpdates().catch(console.error);
