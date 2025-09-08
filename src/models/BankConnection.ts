// src/models/BankConnection.ts
import mongoose, { Schema } from 'mongoose';
import { IBankConnection, BankConnectionStatus } from '@/types';

const BankConnectionSchema: Schema = new Schema(
  {
    userId: { 
      type: String, // Changed from ObjectId to string for consistency
      required: true,
      index: true
    },
    bankName: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 100
    },
    accountNumber: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 20
    },
    accountType: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 50
    },
    linkedAt: { 
      type: Date, 
      default: Date.now,
      index: true
    },
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'error'], 
      default: 'active',
      index: true
    },
    lastSync: { 
      type: Date, 
      default: null,
      index: true
    }
  },
  { 
    timestamps: true,
    indexes: [
      { userId: 1, status: 1 },
      { userId: 1, bankName: 1 }
    ]
  }
);

export default mongoose.models.BankConnection ||
  mongoose.model<IBankConnection>('BankConnection', BankConnectionSchema);

