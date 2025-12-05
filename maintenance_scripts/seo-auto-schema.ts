/**
 * Automated Schema Markup Generation Script
 * Runs daily to generate and update JSON-LD schema for all active pages
 */

import { PrismaClient } from '@prisma/client';
import { autoGenerateSchemaForAllPages } from '../lib/seo-schema-generator';

const prisma = new PrismaClient();

async function runSchemaGeneration() {
  console.log('🔄 Starting automated schema generation...');
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

  try {
    const results = await autoGenerateSchemaForAllPages();
    
    const successCount = results.filter(r => r.success).length;
    const totalSchemas = results.reduce((sum, r) => sum + (r.schemasGenerated || 0), 0);
    
    console.log('✅ Schema generation completed successfully');
    console.log(`📊 Pages processed: ${results.length}`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`🔄 Total schemas generated: ${totalSchemas}`);
    
    // Log to audit trail
    await prisma.sEOAuditLog.create({
      data: {
        action: 'auto_schema_generation',
        entityType: 'pages',
        performedBy: 'system',
        changes: JSON.stringify({
          pagesProcessed: results.length,
          schemasGenerated: totalSchemas,
          successful: successCount,
          timestamp: new Date().toISOString()
        })
      }
    });

    return { success: true, ...results };
  } catch (error) {
    console.error('❌ Schema generation failed:', error);
    
    // Log error to audit trail
    await prisma.sEOAuditLog.create({
      data: {
        action: 'auto_schema_generation_failed',
        entityType: 'pages',
        performedBy: 'system',
        changes: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      }
    });

    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute if run directly
if (require.main === module) {
  runSchemaGeneration()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

export { runSchemaGeneration };
