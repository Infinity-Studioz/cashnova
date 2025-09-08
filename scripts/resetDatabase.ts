/**
 * CashNova Database Reset Script
 * Safe reset with backup procedures for Nigerian market redesign
 */

import dotenv from 'dotenv';
import { join } from 'path';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: join(process.cwd(), '.env.local') });

// Configuration
const config = {
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  dbName: process.env.DB_NAME || 'cashnova',
  backupDir: './database-backups',
  resetConfirmation: process.argv.includes('--confirm'),
  skipBackup: process.argv.includes('--skip-backup')
};

class DatabaseReset {
  client: any = null;
  db: any = null;
  timestamp: string;

  constructor() {
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  }

  async connect() {
    console.log('🔌 Connecting to MongoDB...');
    this.client = new MongoClient(config.mongoUri);
    await this.client.connect();
    this.db = this.client.db(config.dbName);
    console.log('✅ Connected to database:', config.dbName);
  }

  async createBackupDirectory() {
    if (!fs.existsSync(config.backupDir)) {
      fs.mkdirSync(config.backupDir, { recursive: true });
    }
  }

  async backupCollections() {
    if (config.skipBackup) {
      console.log('⚠️  Skipping backup as requested');
      return;
    }

    console.log('💾 Creating backup...');
    await this.createBackupDirectory();

    const collections = await this.db.listCollections().toArray();
    const backupInfo = {
      timestamp: this.timestamp,
      database: config.dbName,
      collections: [],
      totalDocuments: 0
    };

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`  📄 Backing up collection: ${collectionName}`);
      
      const collection = this.db.collection(collectionName);
      const documents = await collection.find({}).toArray();
      
      if (documents.length > 0) {
        const backupPath = path.join(
          config.backupDir, 
          `${collectionName}_${this.timestamp}.json`
        );
        
        fs.writeFileSync(backupPath, JSON.stringify(documents, null, 2));
        
        (backupInfo.collections as any).push({
          name: collectionName,
          documentCount: documents.length,
          backupPath
        });
        backupInfo.totalDocuments += documents.length;
        
        console.log(`    ✅ ${documents.length} documents backed up`);
      } else {
        console.log(`    ⚪ Collection ${collectionName} is empty`);
      }
    }

    // Save backup metadata
    const metadataPath = path.join(config.backupDir, `backup_${this.timestamp}.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(backupInfo, null, 2));
    
    console.log(`✅ Backup completed: ${backupInfo.totalDocuments} total documents`);
    console.log(`📋 Backup metadata saved to: ${metadataPath}`);
  }

  async analyzeCurrentData() {
    console.log('\n📊 Current Database Analysis:');
    console.log('================================');
    
    const collections = await this.db.listCollections().toArray();
    let totalDocs = 0;
    
    for (const collectionInfo of collections) {
      const collection = this.db.collection(collectionInfo.name);
      const count = await collection.countDocuments();
      totalDocs += count;
      
      console.log(`  ${collectionInfo.name}: ${count} documents`);
      
      if (count > 0 && count <= 3) {
        // Show sample data for small collections
        const sample = await collection.findOne();
        console.log(`    Sample: ${JSON.stringify(sample, null, 2).substring(0, 100)}...`);
      }
    }
    
    console.log(`\n📈 Total: ${totalDocs} documents across ${collections.length} collections`);
    return { totalCollections: collections.length, totalDocs };
  }

  async confirmReset() {
    if (config.resetConfirmation) {
      return true;
    }

    console.log('\n⚠️  DATABASE RESET CONFIRMATION');
    console.log('================================');
    console.log('This will PERMANENTLY DELETE all data in the database.');
    console.log('Make sure you have reviewed the backup created above.');
    console.log('\nTo proceed, run this script with --confirm flag:');
    console.log(`npm run reset:database -- --confirm`);
    console.log('\nOr to skip backup and reset:');
    console.log(`npm run reset:database -- --confirm --skip-backup`);
    
    return false;
  }

  async dropAllCollections() {
    console.log('\n🗑️  Dropping all collections...');
    
    const collections = await this.db.listCollections().toArray();
    
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`  🗑️  Dropping: ${collectionName}`);
      await this.db.collection(collectionName).drop();
    }
    
    console.log('✅ All collections dropped successfully');
  }

  async createOptimizedIndexes() {
    console.log('\n🔍 Creating optimized indexes for Nigerian market...');
    
    // User indexes
    await this.db.collection('users').createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { createdAt: 1 } },
      { key: { currency: 1 } }
    ]);
    console.log('  ✅ User indexes created');

    // Transaction indexes - optimized for Nigerian usage patterns
    await this.db.collection('transactions').createIndexes([
      { key: { userId: 1, date: -1 } },  // Primary query pattern
      { key: { userId: 1, category: 1, date: -1 } },  // Category analysis
      { key: { userId: 1, type: 1, date: -1 } },  // Income vs expense
      { key: { date: -1 } },  // Recent transactions
      { key: { amount: -1 } },  // Large transactions
      { key: { description: "text" } }  // Text search
    ]);
    console.log('  ✅ Transaction indexes created');

    // Goal indexes
    await this.db.collection('goals').createIndexes([
      { key: { userId: 1, isActive: 1 } },
      { key: { userId: 1, targetDate: 1 } },
      { key: { userId: 1, category: 1 } }
    ]);
    console.log('  ✅ Goal indexes created');

    // AI Insights indexes
    await this.db.collection('aiinsights').createIndexes([
      { key: { userId: 1, type: 1, createdAt: -1 } },
      { key: { userId: 1, isRead: 1 } },
      { key: { createdAt: 1 }, expireAfterSeconds: 7776000 }  // 90 days TTL
    ]);
    console.log('  ✅ AI Insights indexes created');

    // Notifications indexes
    await this.db.collection('notifications').createIndexes([
      { key: { userId: 1, isRead: 1, createdAt: -1 } },
      { key: { userId: 1, type: 1 } },
      { key: { createdAt: 1 }, expireAfterSeconds: 2592000 }  // 30 days TTL
    ]);
    console.log('  ✅ Notification indexes created');

    console.log('🚀 All optimized indexes created successfully');
  }

  async verifyReset() {
    console.log('\n✅ Verifying reset...');
    
    const collections = await this.db.listCollections().toArray();
    const indexCollections = ['users', 'transactions', 'goals', 'aiinsights', 'notifications'];
    
    console.log(`📊 Collections after reset: ${collections.length}`);
    
    for (const collName of indexCollections) {
      if (collections.some(c => c.name === collName)) {
        const indexes = await this.db.collection(collName).listIndexes().toArray();
        console.log(`  ${collName}: ${indexes.length} indexes created`);
      }
    }
  }

  async generateReadinessReport() {
    const report = {
      timestamp: new Date().toISOString(),
      database: config.dbName,
      status: 'READY_FOR_PHASE_2',
      optimizations: [
        '✅ Nigerian market indexes created',
        '✅ TTL indexes for auto-cleanup',
        '✅ Performance indexes for salary cycles',
        '✅ Text search indexes for transactions'
      ],
      nextSteps: [
        '1. Test model connections',
        '2. Validate API endpoints',
        '3. Test Nigerian categorization',
        '4. Begin Phase 2 development'
      ],
      backupLocation: config.skipBackup ? 'SKIPPED' : config.backupDir
    };

    const reportPath = path.join(config.backupDir, `readiness_report_${this.timestamp}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📋 PHASE 2 READINESS REPORT');
    console.log('============================');
    console.log('✅ Database successfully reset for Nigerian market');
    console.log('✅ Optimized indexes created');
    console.log('✅ Ready for Phase 2 API development');
    console.log(`📄 Full report saved to: ${reportPath}`);
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      console.log('🔌 Disconnected from database');
    }
  }

  async execute() {
    try {
      await this.connect();
      
      const analysis = await this.analyzeCurrentData();
      
      if (analysis.totalDocs > 0) {
        await this.backupCollections();
      } else {
        console.log('📭 Database is empty, no backup needed');
      }
      
      const confirmed = await this.confirmReset();
      if (!confirmed) {
        console.log('❌ Reset cancelled');
        return;
      }
      
      await this.dropAllCollections();
      await this.createOptimizedIndexes();
      await this.verifyReset();
      await this.generateReadinessReport();
      
      console.log('\n🎉 Database reset completed successfully!');
      console.log('🚀 Ready to proceed with Phase 2 development');
      
    } catch (error) {
      console.error('❌ Error during database reset:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }
}

// Script execution
if (require.main === module) {
  const reset = new DatabaseReset();
  reset.execute().catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}

module.exports = DatabaseReset;