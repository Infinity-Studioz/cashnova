// scripts/setupCashNova.ts
import { checkEnvironmentSetup } from './checkEnvironment';
import { checkMigrationNeeds } from './checkMigrationNeeds';
import { createOptimizedIndexes, checkIndexStatus } from './createDatabaseIndexes';
import { runModelTests } from './testModels';

async function completeCashNovaSetup() {
  console.log('🚀 CASHNOVA PRE-PHASE 2 SETUP');
  console.log('=====================================\n');
  
  try {
    // Step 1: Environment Check
    console.log('STEP 1: Environment Configuration');
    console.log('==================================');
    const envReady = await checkEnvironmentSetup();
    
    if (!envReady) {
      console.log('\n❌ Environment setup failed. Please fix environment issues first.');
      return false;
    }
    
    console.log('\n✅ Environment check passed\n');
    
    // Step 2: Migration Assessment
    console.log('STEP 2: Database Migration Assessment');
    console.log('====================================');
    await checkMigrationNeeds();
    console.log('\n✅ Migration assessment completed\n');
    
    // Step 3: Database Index Creation
    console.log('STEP 3: Database Optimization');
    console.log('==============================');
    await createOptimizedIndexes();
    await checkIndexStatus();
    console.log('\n✅ Database optimization completed\n');
    
    // Step 4: Model Testing
    console.log('STEP 4: Model Testing');
    console.log('====================');
    await runModelTests();
    console.log('\n✅ Model testing completed\n');
    
    // Setup Summary
    console.log('SETUP SUMMARY');
    console.log('=============');
    console.log('✅ Environment configured and validated');
    console.log('✅ Database migration needs assessed');
    console.log('✅ Nigerian-optimized indexes created');
    console.log('✅ All models tested with Nigerian data');
    console.log('✅ Performance optimizations applied');
    
    console.log('\n🚀 CASHNOVA IS READY FOR PHASE 2!');
    console.log('\nNext Steps:');
    console.log('1. Begin API route integration');
    console.log('2. Connect UI components to new model capabilities');
    console.log('3. Implement real-time AI insights');
    console.log('4. Test with Nigerian user scenarios');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    console.log('\nPlease fix the above issues before proceeding to Phase 2.');
    return false;
  }
}

// Package.json script commands
function generatePackageScripts() {
  console.log('\n📦 ADD THESE SCRIPTS TO YOUR PACKAGE.JSON:');
  console.log('\n"scripts": {');
  console.log('  "setup:cashnova": "tsx scripts/setupCashNova.ts",');
  console.log('  "check:env": "tsx scripts/checkEnvironment.ts",');
  console.log('  "check:migration": "tsx scripts/checkMigrationNeeds.ts",');
  console.log('  "setup:indexes": "tsx scripts/createDatabaseIndexes.ts",');
  console.log('  "test:models": "tsx scripts/testModels.ts",');
  console.log('  "db:status": "tsx scripts/checkIndexStatus.ts"');
  console.log('}');
  
  console.log('\nRun setup with: npm run setup:cashnova');
}

// Run complete setup
if (require.main === module) {
  completeCashNovaSetup().then(success => {
    if (success) {
      generatePackageScripts();
    }
  });
}

export { completeCashNovaSetup };