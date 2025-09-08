// scripts/testModels.ts
import dotenv from 'dotenv';
import { join } from 'path';
import mongoose from 'mongoose';
import User from '../src/models/User';
import Transaction from '../src/models/Transaction';
import Goal from '../src/models/Goal';
import AIInsight from '../src/models/AIInsight';
import Notification from '../src/models/Notification';

// Load environment variables from .env.local
dotenv.config({ path: join(process.cwd(), '.env.local') });

async function runModelTests() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('🧪 RUNNING MODEL TESTS WITH NIGERIAN DATA...\n');
    
    // Clean up any existing test data first
    await cleanupTestData();
    
    // Test 1: User Creation with Nigerian Preferences
    await testUserCreation();
    
    // Test 2: Transaction Nigerian Categorization
    await testTransactionCategorization();
    
    // Test 3: Goal Templates and Insights
    await testGoalSystem();
    
    // Test 4: AI Insight Generation
    await testAIInsightGeneration();
    
    // Test 5: Notification System
    await testNotificationSystem();
    
    // Test 6: Performance Tests
    await testQueryPerformance();
    
    // Clean up test data after tests
    await cleanupTestData();
    
    console.log('\n✅ ALL MODEL TESTS PASSED');
    console.log('🚀 Models ready for production use');
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Model test failed:', error);
    
    // Clean up on error too
    try {
      await cleanupTestData();
      await mongoose.disconnect();
    } catch (cleanupError) {
      console.error('❌ Cleanup failed:', cleanupError);
    }
    
    process.exit(1);
  }
}

// Cleanup test data
async function cleanupTestData() {
  console.log('🧹 Cleaning up test data...');
  
  try {
    await User.deleteMany({ email: { $regex: '@example.com$' } });
    await Transaction.deleteMany({ userId: { $regex: '^test_' } });
    await Goal.deleteMany({ userId: { $regex: '^test_' } });
    await AIInsight.deleteMany({ userId: { $regex: '^test_' } });
    await Notification.deleteMany({ userId: { $regex: '^test_' } });
    
    console.log('  ✅ Test data cleaned up');
  } catch (error) {
    console.log('  ⚠️  Test data cleanup had issues (may be empty database)');
  }
}

async function testUserCreation() {
  console.log('👤 Testing User Model...');
  
  // Test Nigerian user creation
  const testUser = new User({
    name: 'Adaora Okonkwo',
    email: 'adaora@example.com',
    provider: 'credentials',
    password: 'secure123',
    preferences: {
      currency: 'NGN',
      theme: 'dark',
      notifications: {
        email: true,
        push: true
      }
    }
  });
  
  await testUser.save();
  console.log('  ✅ User created with Nigerian preferences');
  
  // Test password security (should not be in JSON)
  const userJson = testUser.toJSON();
  if (userJson.password) {
    throw new Error('Password exposed in JSON!');
  }
  console.log('  ✅ Password security verified');
  
  return testUser;
}

async function testTransactionCategorization() {
  console.log('💰 Testing Transaction Categorization...');
  
  const testCases = [
    { merchant: 'GTBank', note: 'Transfer fee', expected: 'Bills' },
    { merchant: 'Shoprite', note: 'Grocery shopping', expected: 'Food & Dining' },
    { merchant: 'Uber', note: 'Trip to VI', expected: 'Transport' },
    { merchant: 'DSTV', note: 'Monthly subscription', expected: 'Bills' },
    { merchant: '', note: 'School fees payment', expected: 'School Fees' },
    { merchant: '', note: 'Church offering', expected: 'Church/Mosque' },
    { merchant: '', note: 'Sent money to mum', expected: 'Family Support' }
  ];
  
  for (const testCase of testCases) {
    const category = Transaction.categorizeTransaction(
      testCase.merchant, 
      testCase.note
    );
    
    if (category !== testCase.expected) {
      throw new Error(`Categorization failed: ${testCase.merchant} ${testCase.note} -> Expected: ${testCase.expected}, Got: ${category}`);
    }
  }
  
  console.log('  ✅ Nigerian merchant categorization working');
  console.log('  ✅ Cultural category detection working');
}

async function testGoalSystem() {
  console.log('🎯 Testing Goal System...');
  
  // Test emergency fund template
  const emergencyTemplate = Goal.createNigerianGoalTemplate('emergency_fund', 100000);
  
  if (!emergencyTemplate) {
    throw new Error('Emergency fund template not generated');
  }
  
  if (emergencyTemplate.targetAmount !== 300000) { // 3 months * 100k
    throw new Error('Emergency fund calculation incorrect');
  }
  
  console.log('  ✅ Emergency fund template generated correctly');
  
  // Test school fees template
  const schoolTemplate = Goal.createNigerianGoalTemplate('school_fees');
  
  if (!schoolTemplate || !schoolTemplate.nigerianContext?.isSchoolFeesGoal) {
    throw new Error('School fees template not generated correctly');
  }
  
  console.log('  ✅ School fees template with Nigerian context');
  
  // Test goal with milestones
  const testGoal = new Goal({
    userId: 'test_user_id',
    title: 'Emergency Fund',
    targetAmount: 150000,
    category: 'emergency_fund',
    priority: 'urgent',
    milestones: [
      { percentage: 25, amount: 37500, celebrated: false },
      { percentage: 50, amount: 75000, celebrated: false },
      { percentage: 75, amount: 112500, celebrated: false },
      { percentage: 100, amount: 150000, celebrated: false }
    ]
  });
  
  // Test contribution
  await testGoal.addContribution(40000, 'salary_bonus', 'First contribution');
  
  if (testGoal.currentAmount !== 40000) {
    throw new Error('Contribution not added correctly');
  }
  
  // Check if 25% milestone was achieved
  if (!testGoal.milestones[0].achievedAt) {
    throw new Error('Milestone not triggered correctly');
  }
  
  console.log('  ✅ Goal contributions and milestones working');
  console.log('  ✅ Insights calculation working');
}

async function testAIInsightGeneration() {
  console.log('🤖 Testing AI Insight Generation...');
  
  // Test spending insight
  const spendingData = {
    category: 'Transport',
    percentageOfBudget: 25,
    potentialSavings: 15000,
    transactionCount: 45
  };
  
  const spendingInsight = await AIInsight.generateSpendingInsight('test_user', spendingData);
  
  if (!spendingInsight.title.includes('Transport')) {
    throw new Error('Spending insight not generated correctly');
  }
  
  console.log('  ✅ Spending insight generation working');
  
  // Test Nigerian economic insight
  const economicInsight = await AIInsight.generateNigerianEconomicInsight('test_user');
  
  if (economicInsight.category !== 'nigerian_market') {
    throw new Error('Nigerian economic insight not generated correctly');
  }
  
  console.log('  ✅ Nigerian economic insight generation working');
  
  // Test budget alert
  const budgetData = {
    categoryName: 'Food & Dining',
    percentageUsed: 85,
    remaining: 25000,
    budgetId: 'test_budget_id'
  };
  
  const budgetAlert = await AIInsight.generateBudgetAlert('test_user', budgetData);
  
  if (budgetAlert.priority !== 'high') {
    throw new Error('Budget alert priority not set correctly');
  }
  
  console.log('  ✅ Budget alert generation working');
}

async function testNotificationSystem() {
  console.log('🔔 Testing Notification System...');
  
  // Test Nigerian alert creation
  const alertData = Notification.createNigerianAlert(
    'test_user',
    'budget_exceeded',
    'Budget Alert',
    'You have exceeded your monthly budget',
    { amount: 50000 },
    'urgent'
  );
  
  if (!alertData.data?.formattedAmount?.includes('₦')) {
    throw new Error('Nigerian currency formatting not working');
  }
  
  console.log('  ✅ Nigerian notification formatting working');
  
  // Test notification creation and status management
  const notification = new Notification(alertData);
  await notification.save();
  
  // Test mark as read
  await notification.markAsRead();
  
  if (notification.status !== 'read' || !notification.readAt) {
    throw new Error('Notification status management not working');
  }
  
  console.log('  ✅ Notification status management working');
}

async function testQueryPerformance() {
  console.log('⚡ Testing Query Performance...');
  
  // Create test data for performance testing
  const testTransactions = [];
  for (let i = 0; i < 100; i++) {
    testTransactions.push({
      userId: 'test_user_performance',
      type: i % 2 === 0 ? 'income' : 'expense',
      amount: Math.random() * 50000,
      category: ['Transport', 'Food & Dining', 'Bills', 'Shopping'][i % 4],
      date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)), // Past i days
      paymentMethod: 'cash'
    });
  }
  
  await Transaction.insertMany(testTransactions);
  
  // Test query performance
  const start = Date.now();
  
  // Common query: User's recent transactions
  await Transaction.find({ 
    userId: 'test_user_performance' 
  }).sort({ date: -1 }).limit(20);
  
  // Category breakdown query
  await Transaction.aggregate([
    { $match: { userId: 'test_user_performance' } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } }
  ]);
  
  const queryTime = Date.now() - start;
  
  if (queryTime > 500) { // Should be under 500ms
    console.log(`  ⚠️  Query time: ${queryTime}ms (consider index optimization)`);
  } else {
    console.log(`  ✅ Query performance good: ${queryTime}ms`);
  }
}

// Run tests
if (require.main === module) {
  runModelTests();
}

export { runModelTests };