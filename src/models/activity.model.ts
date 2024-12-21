import { Schema, model } from 'mongoose';
import IActivity from '../interfaces/activity.interface';

const activitySchema = new Schema<IActivity>({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  goalAmount: {
    type: Number,
    required: true,
  },
  totalDonations: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    required: true,
  },
  end_at: {
    type: Date,
    required: true,
  },
});

activitySchema.pre(/^find/, function (next) {
  (this as any).populate({
    path: 'creator',
    select: 'firstName lastName',
  });
  next();
});

const Activity = model<IActivity>('Activity', activitySchema);
export default Activity;
