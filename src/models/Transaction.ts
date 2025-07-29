import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  note?: string;
  paymentMethod?: string;
  date: Date;
  recurring?: boolean;
}

const TransactionSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    note: { type: String },
    paymentMethod: { type: String },
    date: { type: Date, required: true },
    recurring: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>('Transaction', TransactionSchema);
