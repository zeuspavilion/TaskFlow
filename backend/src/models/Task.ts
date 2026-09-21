import mongoose, { Document, Schema } from 'mongoose';

export type PriorityLevel = 'low' | 'medium' | 'high';

export interface ITask extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  dateTime: Date;
  deadline: Date;
  priority: PriorityLevel;
  category: string;
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    dateTime: {
      type: Date,
      required: [true, 'Task scheduled date/time is required'],
      default: Date.now,
    },
    deadline: {
      type: Date,
      required: [true, 'Task deadline is required'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
      index: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
      index: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user task querying and filtering
TaskSchema.index({ user: 1, isCompleted: 1, deadline: 1, priority: 1 });

export default mongoose.model<ITask>('Task', TaskSchema);
