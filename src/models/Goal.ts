import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  image?: string;
  isCompleted: boolean;
}

const GoalSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    deadline: { type: Date, required: true },
    image: { type: String },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Goal ||
  mongoose.model<IGoal>('Goal', GoalSchema);
