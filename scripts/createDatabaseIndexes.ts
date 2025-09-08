// scripts/createDatabaseIndexes.ts
import dotenv from 'dotenv';
import { join } from 'path';
import mongoose from 'mongoose';

// Load environment variables from .env.local
dotenv.config({ path: join(process.cwd(), '.env.local') });

async function createOptimizedIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const db = mongoose.connection.db;
    
    console.log('🔨 CREATING OPTIMIZED INDEXES FOR NIGERIAN USAGE PATTERNS...\n');
    
    // User Collection Indexes
    await createUserIndexes(db);
    
    // Transaction Collection Indexes (Most Critical)
    await createTransactionIndexes(db);
    
    // Goal Collection Indexes
    await createGoalIndexes(db);
    
    // Budget Collection Indexes
    await createBudgetIndexes(db);
    
    // AI Insight Collection Indexes
    await createAIInsightIndexes(db);
    
    // Notification Collection Indexes
    await createNotificationIndexes(db);
    
    // Settings & Alert Settings Indexes
    await createSettingsIndexes(db);
    
    console.log('\n✅ ALL INDEXES CREATED SUCCESSFULLY');
    console.log('🚀 Database optimized for Nigerian financial patterns');
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  }
}

// Helper function to safely create indexes
async function safeCreateIndex(collection: any, indexSpec: any, options: any = {}) {
  try {
    await collection.createIndex(indexSpec, options);
  } catch (error: any) {
    if (error.code === 85) { // IndexOptionsConflict
      console.log(`  ⚠️  Index ${JSON.stringify(indexSpec)} already exists with different options, skipping`);
    } else if (error.code === 86) { // IndexKeySpecsConflict
      console.log(`  ⚠️  Index ${JSON.stringify(indexSpec)} already exists, skipping`);
    } else {
      throw error; // Re-throw other errors
    }
  }
}

async function createUserIndexes(db: any) {
  console.log('👤 Creating User indexes...');
  
  const users = db.collection('users');
  
  // Primary indexes - these should be handled by schema unique constraints
  await safeCreateIndex(users, { email: 1 }, { unique: true });
  await safeCreateIndex(users, { provider: 1 });
  await safeCreateIndex(users, { isActive: 1 });
  
  console.log('  ✅ User indexes created');
}

async function createTransactionIndexes(db: any) {
  console.log('💰 Creating Transaction indexes (Critical for performance)...');
  
  const transactions = db.collection('transactions');
  
  // Core query patterns for Nigerian usage
  await safeCreateIndex(transactions, { userId: 1, date: -1 }); // Most common: user's recent transactions
  await safeCreateIndex(transactions, { userId: 1, category: 1 }); // Category analysis
  await safeCreateIndex(transactions, { userId: 1, type: 1 }); // Income vs expense
  await safeCreateIndex(transactions, { userId: 1, recurring: 1 }); // Recurring patterns
  
  // Nigerian-specific patterns
  await safeCreateIndex(transactions, { userId: 1, paymentMethod: 1 }); // Cash vs digital payments
  await safeCreateIndex(transactions, { userId: 1, status: 1, date: -1 }); // Status filtering
  await safeCreateIndex(transactions, { merchant: 1 }); // Merchant recognition
  
  // Monthly analytics (salary cycle awareness)
  await safeCreateIndex(transactions, { 
    userId: 1, 
    date: 1 
  }, { 
    partialFilterExpression: { 
      date: { $gte: new Date('2024-01-01') } 
    } 
  });
  
  console.log('  ✅ Transaction indexes created (optimized for Nigerian patterns)');
}

async function createGoalIndexes(db: any) {
  console.log('🎯 Creating Goal indexes...');
  
  const goals = db.collection('goals');
  
  // Primary goal queries
  await safeCreateIndex(goals, { userId: 1, isActive: 1, priority: -1 });
  await safeCreateIndex(goals, { userId: 1, category: 1 });
  await safeCreateIndex(goals, { userId: 1, deadline: 1 });
  await safeCreateIndex(goals, { userId: 1, isCompleted: 1, completedAt: -1 });
  
  // Nigerian context queries
  await safeCreateIndex(goals, { userId: 1, 'nigerianContext.isSchoolFeesGoal': 1 });
  await safeCreateIndex(goals, { userId: 1, 'nigerianContext.isEmergencyFund': 1 });
  
  console.log('  ✅ Goal indexes created');
}

async function createBudgetIndexes(db: any) {
  console.log('📊 Creating Budget indexes...');
  
  const budgets = db.collection('budgets');
  const categoryBudgets = db.collection('categorybudgets');
  
  // Budget indexes
  await safeCreateIndex(budgets, { userId: 1, month: 1 }, { unique: true });
  
  // Category budget indexes
  await safeCreateIndex(categoryBudgets, { userId: 1, month: 1, category: 1 }, { unique: true });
  await safeCreateIndex(categoryBudgets, { userId: 1, month: 1 });
  
  console.log('  ✅ Budget indexes created');
}

async function createAIInsightIndexes(db: any) {
  console.log('🤖 Creating AI Insight indexes...');
  
  const insights = db.collection('aiinsights');
  
  // Core AI insight queries
  await safeCreateIndex(insights, { userId: 1, status: 1, priority: -1, createdAt: -1 });
  await safeCreateIndex(insights, { userId: 1, category: 1, status: 1 });
  await safeCreateIndex(insights, { userId: 1, type: 1, createdAt: -1 });
  
  // Performance optimization indexes
  await safeCreateIndex(insights, { 'displayConditions.validUntil': 1 });
  await safeCreateIndex(insights, { 'metrics.urgencyScore': -1, 'metrics.impactScore': -1 });
  
  console.log('  ✅ AI Insight indexes created');
}

async function createNotificationIndexes(db: any) {
  console.log('🔔 Creating Notification indexes...');
  
  const notifications = db.collection('notifications');
  
  // Core notification queries
  await safeCreateIndex(notifications, { userId: 1, status: 1, createdAt: -1 });
  await safeCreateIndex(notifications, { userId: 1, type: 1, createdAt: -1 });
  await safeCreateIndex(notifications, { scheduledFor: 1, status: 1 });
  
  // Check if TTL index already exists before creating
  const existingIndexes = await notifications.listIndexes().toArray();
  const hasTTLIndex = existingIndexes.some(index => 
    index.key.expiresAt && (index.expireAfterSeconds !== undefined || index.background)
  );
  
  if (!hasTTLIndex) {
    await safeCreateIndex(notifications, { expiresAt: 1 }, { expireAfterSeconds: 0 });
    console.log('  ✅ TTL index created for notifications');
  } else {
    console.log('  ✅ TTL index already exists for notifications');
  }
  
  console.log('  ✅ Notification indexes created');
}

async function createSettingsIndexes(db: any) {
  console.log('⚙️ Creating Settings indexes...');
  
  const settings = db.collection('settings');
  const alertSettings = db.collection('alertsettings');
  
  // Settings indexes
  await safeCreateIndex(settings, { userId: 1 }, { unique: true });
  
  // Alert settings indexes
  await safeCreateIndex(alertSettings, { userId: 1 }, { unique: true });
  
  console.log('  ✅ Settings indexes created');
}

// Check index status
async function checkIndexStatus() {
  console.log('\n📋 CHECKING INDEX STATUS...\n');
  
  const db = mongoose.connection.db;
  const collections = ['users', 'transactions', 'goals', 'budgets', 'categorybudgets', 'aiinsights', 'notifications'];
  
  for (const collectionName of collections) {
    try {
      const collection = db.collection(collectionName);
      const indexes = await collection.listIndexes().toArray();
      
      console.log(`${collectionName.toUpperCase()}:`);
      indexes.forEach(index => {
        const options = [];
        if (index.unique) options.push('unique');
        if (index.expireAfterSeconds !== undefined) options.push(`TTL: ${index.expireAfterSeconds}s`);
        if (index.background) options.push('background');
        if (index.partialFilterExpression) options.push('partial');
        
        const optionsStr = options.length ? ` (${options.join(', ')})` : '';
        console.log(`  - ${JSON.stringify(index.key)}${optionsStr}`);
      });
      console.log('');
    } catch (error) {
      console.log(`${collectionName.toUpperCase()}: Collection doesn't exist yet\n`);
    }
  }
}

// Run the script
if (require.main === module) {
  createOptimizedIndexes().then(() => {
    checkIndexStatus();
  });
}

export { createOptimizedIndexes, checkIndexStatus };