// src/lib/mongodb.ts
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error('Please define the MONGODB_URI environment variable');

// Native MongoDB Client (for your existing code)
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  let _mongooseConnection: typeof mongoose | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// Mongoose Connection (for Transaction model)
let cached = (global as typeof globalThis & { _mongooseConnection?: typeof mongoose })._mongooseConnection;

if (!cached) {
  cached = ((global as typeof globalThis & { _mongooseConnection?: typeof mongoose })._mongooseConnection = mongoose);
}

export async function connectToDatabase() {
  if (cached && cached.connection.readyState === 1) {
    return cached;
  }

  if (cached && cached.connection.readyState === 2) {
    // Connection is connecting, wait for it
    return cached;
  }

  try {
    if (!cached) {
      throw new Error('Mongoose connection is not initialized');
    }
    await cached.connect(uri, {
      bufferCommands: false,
    });
    
    console.log('Connected to MongoDB via Mongoose');
    return cached;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Export the native client promise for backward compatibility
export default clientPromise;