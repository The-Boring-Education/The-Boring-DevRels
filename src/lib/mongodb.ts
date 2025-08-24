import mongoose from 'mongoose';
import { ENV_CONFIG } from '@/constants';

declare global {
  var mongoose: any;
}

const MONGODB_URI = ENV_CONFIG.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('🚀 Connected to MongoDB for DevRel Platform');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Helper function to handle database connection errors
export const withDB = async <T>(
  operation: () => Promise<T>
): Promise<T> => {
  try {
    await connectDB();
    return await operation();
  } catch (error) {
    console.error('Database operation failed:', error);
    throw error;
  }
};