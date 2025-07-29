import mongoose, { Schema, Document } from 'mongoose';

export interface IBankConnection extends Document {
  userId: mongoose.Types.ObjectId;
  bankName: string;
  accountNumber: string;
  accountType: string;
  linkedAt: Date;
  status: 'active' | 'inactive' | 'error';
  lastSync: Date;
  // add any token or metadata as needed (keep sensitive info secure)
}

const BankConnectionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  accountType: { type: String, required: true },
  linkedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive', 'error'], default: 'active' },
  lastSync: { type: Date, default: null },
});

export default mongoose.models.BankConnection ||
  mongoose.model<IBankConnection>('BankConnection', BankConnectionSchema);
