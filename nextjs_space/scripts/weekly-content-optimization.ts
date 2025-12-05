/**
 * Weekly Content Optimization Script - Phase 2
 * Auto-optimizes content, schema markup, and internal links every Monday at 3 AM
 */

import {
  autoApplySchemaMarkup,
  autoOptimizeMetaDescriptions,
  generateInternalLinks,
  updateContentFreshness,
  monitorPageSpeed
} from '../lib/seo-content-optimization';

async function main() {
  console.log('='.repeat(70));
  console.log('WEEKLY CONTENT OPTIMIZATION - Phase 2 Starting...');
  console.log('Time:', new Date().toISOString());
  console.log('='.repeat(70));

  try {
    // 1. Auto-apply schema markup
    console.log('\n📋 Step 1: Auto-applying Schema Markup...');
    const schemaResult = await autoApplySchemaMarkup();
    console.log(`✅ Schema markup applied to ${schemaResult.updated} pages`);
    if (schemaResult.schemas.length > 0) {
      console.log('   Schemas generated:');
      schemaResult.schemas.forEach(s => console.log(`   - ${s.path}: ${s.type}`));
    }

    // 2. Auto-optimize meta descriptions
    console.log('\n✍️  Step 2: Auto-optimizing Meta Descriptions...');
    const metaResult = await autoOptimizeMetaDescriptions();
    console.log(`✅ Optimized ${metaResult.improved} meta descriptions`);
    if (metaResult.optimized.length > 0) {
      console.log('   Pages optimized:');
      metaResult.optimized.forEach(p => console.log(`   - ${p}`));
    }

    // 3. Generate internal links
    console.log('\n🔗 Step 3: Generating Smart Internal Links...');
    const linksResult = await generateInternalLinks();
    console.log(`✅ Created ${linksResult.created} internal link suggestions`);

    // 4. Update content freshness
    console.log('\n📅 Step 4: Updating Content Freshness...');
    const freshnessResult = await updateContentFreshness();
    console.log(`✅ Updated timestamps for ${freshnessResult.updated.length} pages`);

    // 5. Monitor page speed
    console.log('\n⚡ Step 5: Monitoring Page Speed...');
    const speedResult = await monitorPageSpeed();
    console.log(`✅ Checked ${speedResult.results.length} pages`);
    console.log(`   Slow pages (>3s): ${speedResult.slowPages}`);
    
    if (speedResult.slowPages > 0) {
      console.log('\n   ⚠️  Pages needing attention:');
      speedResult.results
        .filter(r => r.loadTime > 3000)
        .forEach(r => {
          console.log(`   - ${r.pagePath}: ${r.loadTime}ms (Score: ${r.performanceScore})`);
          if (r.issues.length > 0) {
            r.issues.forEach(issue => console.log(`     ⚠️  ${issue}`));
          }
        });
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ Weekly Content Optimization COMPLETE');
    console.log('='.repeat(70));
  } catch (error: any) {
    console.error('\n❌ CRITICAL ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
