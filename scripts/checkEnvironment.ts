// scripts/checkEnvironment.ts
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { join } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: join(process.cwd(), '.env.local') });

async function checkEnvironmentSetup() {
  console.log('⚙️ CHECKING ENVIRONMENT CONFIGURATION...\n');
  
  // Check required environment variables
  const requiredEnvVars = [
    'MONGODB_URI',
    'NEXTAUTH_SECRET', 
    'NEXTAUTH_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ];
  
  const optionalEnvVars = [
    'RESEND_API_KEY',
    'EMAIL_FROM',
    'OPENAI_API_KEY', // For future AI features
    'MONO_API_KEY',   // For future bank integration
    'OKRA_API_KEY'    // For future bank integration
  ];
  
  console.log('📋 REQUIRED ENVIRONMENT VARIABLES:');
  let missingRequired = 0;
  
  requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`  ✅ ${envVar}: Set`);
    } else {
      console.log(`  ❌ ${envVar}: Missing`);
      missingRequired++;
    }
  });
  
  console.log('\n📋 OPTIONAL ENVIRONMENT VARIABLES:');
  optionalEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`  ✅ ${envVar}: Set`);
    } else {
      console.log(`  ⚠️  ${envVar}: Not set (optional)`);
    }
  });
  
  if (missingRequired > 0) {
    console.log(`\n❌ ${missingRequired} required environment variables missing!`);
    console.log('Please check your .env.local file.');
    return false;
  }
  
  // Test MongoDB connection
  console.log('\n🔗 TESTING DATABASE CONNECTION...');
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('  ✅ MongoDB connection successful');
    
    // Test database permissions
    const db = mongoose.connection.db;
    
    // Check if we can create collections
    try {
      await db.createCollection('test_permissions');
      await db.dropCollection('test_permissions');
      console.log('  ✅ Database write permissions confirmed');
    } catch (error) {
      console.log('  ⚠️  Limited database permissions - check if this affects production');
    }
    
    // Check MongoDB version
    const admin = db.admin();
    const serverStatus = await admin.serverStatus();
    console.log(`  ℹ️  MongoDB version: ${serverStatus.version}`);
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.log('  ❌ MongoDB connection failed:', error);
    return false;
  }
  
  // Check Next.js configuration
  console.log('\n⚛️ CHECKING NEXT.JS CONFIGURATION...');
  
  if (process.env.NODE_ENV === 'production' && !process.env.NEXTAUTH_URL) {
    console.log('  ⚠️  NEXTAUTH_URL should be set for production');
  } else {
    console.log('  ✅ Next.js configuration looks good');
  }
  
  // Security checks
  console.log('\n🔒 SECURITY CHECKS...');
  
  if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET.length < 32) {
    console.log('  ⚠️  NEXTAUTH_SECRET should be at least 32 characters long');
  } else {
    console.log('  ✅ NEXTAUTH_SECRET properly configured');
  }
  
  if (process.env.NODE_ENV === 'production') {
    console.log('  ℹ️  Production mode - ensure all secrets are secure');
  }
  
  console.log('\n✅ ENVIRONMENT CHECK COMPLETE');
  return true;
}

// Performance recommendations
function checkPerformanceConfig() {
  console.log('\n🚀 PERFORMANCE RECOMMENDATIONS...');
  
  // MongoDB recommendations
  console.log('DATABASE OPTIMIZATION:');
  console.log('  - Ensure MongoDB Atlas M10+ cluster for production');
  console.log('  - Enable connection pooling (default in Mongoose)');
  console.log('  - Consider read replicas for analytics queries');
  
  // Nigerian-specific recommendations
  console.log('\nNIGERIAN MARKET OPTIMIZATION:');
  console.log('  - Use MongoDB Atlas Lagos region for lowest latency');
  console.log('  - Consider CDN for static assets (Lagos/African edge)');
  console.log('  - Set up monitoring for Nigerian business hours (8AM-6PM WAT)');
  
  // Next.js recommendations
  console.log('\nNEXT.JS OPTIMIZATION:');
  console.log('  - Enable ISR for transaction analytics pages');
  console.log('  - Use dynamic imports for AI components');
  console.log('  - Configure edge functions for authentication');
}

// Create environment template
function generateEnvTemplate() {
  console.log('\n📄 ENVIRONMENT TEMPLATE (.env.local):');
  console.log('');
  console.log('# Database');
  console.log('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cashnova');
  console.log('');
  console.log('# Authentication');
  console.log('NEXTAUTH_SECRET=your-32-character-secret-key-here');
  console.log('NEXTAUTH_URL=http://localhost:3000');
  console.log('');
  console.log('# Google OAuth');
  console.log('GOOGLE_CLIENT_ID=your-google-client-id');
  console.log('GOOGLE_CLIENT_SECRET=your-google-client-secret');
  console.log('');
  console.log('# Email Service (Optional)');
  console.log('RESEND_API_KEY=your-resend-api-key');
  console.log('EMAIL_FROM=noreply@cashnova.com');
  console.log('');
  console.log('# Future AI Integration (Optional)');
  console.log('OPENAI_API_KEY=your-openai-api-key');
  console.log('');
  console.log('# Future Bank Integration (Optional)');
  console.log('MONO_API_KEY=your-mono-api-key');
  console.log('OKRA_API_KEY=your-okra-api-key');
}

// Run environment check
if (require.main === module) {
  checkEnvironmentSetup().then(success => {
    if (success) {
      checkPerformanceConfig();
      generateEnvTemplate();
    } else {
      console.log('\n❌ Environment setup incomplete - please fix issues before proceeding');
      process.exit(1);
    }
  });
}

export { checkEnvironmentSetup, checkPerformanceConfig, generateEnvTemplate };