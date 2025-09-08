// scripts/checkMigrationNeeds.ts
import mongoose from 'mongoose';

// Check existing collections and their structure
async function checkMigrationNeeds() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('🔍 EXISTING COLLECTIONS:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    // Check for potential migration issues
    const migrationChecks = {
      users: await checkUsersMigration(db),
      transactions: await checkTransactionsMigration(db),
      goals: await checkGoalsMigration(db),
      aiinsights: await checkAIInsightsMigration(db),
      notifications: await checkNotificationsMigration(db)
    };
    
    console.log('\n📋 MIGRATION REQUIREMENTS:');
    Object.entries(migrationChecks).forEach(([collection, needs]) => {
      console.log(`\n${collection.toUpperCase()}:`);
      if (needs.length === 0) {
        console.log('  ✅ No migration needed');
      } else {
        needs.forEach(need => console.log(`  ⚠️  ${need}`));
      }
    });
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Error checking migration needs:', error);
  }
}

async function checkUsersMigration(db: any): Promise<string[]> {
  const issues: string[] = [];
  
  try {
    const users = await db.collection('users');
    const sampleUser = await users.findOne({});
    
    if (sampleUser) {
      // Check for missing fields
      if (!sampleUser.preferences) {
        issues.push('Add preferences field with currency, theme, notifications');
      }
      if (!sampleUser.provider) {
        issues.push('Add provider field (default: "credentials")');
      }
      if (!sampleUser.isActive) {
        issues.push('Add isActive field (default: true)');
      }
    }
  } catch (error) {
    issues.push('Collection may not exist - will be created on first use');
  }
  
  return issues;
}

async function checkTransactionsMigration(db: any): Promise<string[]> {
  const issues: string[] = [];
  
  try {
    const transactions = await db.collection('transactions');
    const sampleTransaction = await transactions.findOne({});
    
    if (sampleTransaction) {
      // Check for new fields
      if (!sampleTransaction.autoCategory) {
        issues.push('Add autoCategory field for AI categorization');
      }
      if (!sampleTransaction.userCategory) {
        issues.push('Add userCategory field for user overrides');
      }
      if (!sampleTransaction.status) {
        issues.push('Add status field (default: "completed")');
      }
      if (!sampleTransaction.tags) {
        issues.push('Add tags array field');
      }
    }
  } catch (error) {
    issues.push('Collection may not exist - will be created on first use');
  }
  
  return issues;
}

async function checkGoalsMigration(db: any): Promise<string[]> {
  const issues: string[] = [];
  
  try {
    const goals = await db.collection('goals');
    const sampleGoal = await goals.findOne({});
    
    if (sampleGoal) {
      // Check for Nigerian context
      if (!sampleGoal.nigerianContext) {
        issues.push('Add nigerianContext field with school fees, salary linking');
      }
      if (!sampleGoal.insights) {
        issues.push('Add insights field for AI calculations');
      }
      if (!sampleGoal.autoSaveRules) {
        issues.push('Add autoSaveRules for automatic contributions');
      }
    }
  } catch (error) {
    issues.push('Collection may not exist - will be created on first use');
  }
  
  return issues;
}

async function checkAIInsightsMigration(db: any): Promise<string[]> {
  const issues: string[] = [];
  
  try {
    const insights = await db.collection('aiinsights');
    const count = await insights.countDocuments();
    
    if (count === 0) {
      issues.push('New collection - no migration needed');
    }
  } catch (error) {
    issues.push('New collection - will be created on first use');
  }
  
  return issues;
}

async function checkNotificationsMigration(db: any): Promise<string[]> {
  const issues: string[] = [];
  
  try {
    const notifications = await db.collection('notifications');
    const sampleNotification = await notifications.findOne({});
    
    if (sampleNotification) {
      if (!sampleNotification.channels) {
        issues.push('Add channels field for multi-channel delivery');
      }
      if (!sampleNotification.metadata) {
        issues.push('Add metadata field for Nigerian context');
      }
    }
  } catch (error) {
    issues.push('Collection may not exist - will be created on first use');
  }
  
  return issues;
}

// Run the check
if (require.main === module) {
  checkMigrationNeeds();
}

export { checkMigrationNeeds };