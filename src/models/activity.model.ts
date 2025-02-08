import { Schema, model } from 'mongoose';
import IActivity from '../interfaces/activity.interface';

const activitySchema = new Schema<IActivity>({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required'],
    immutable: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  image: {
    type: String,
    required: [true, 'Image is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  goalAmount: {
    type: Number,
    required: [true, 'Goal amount is required'],
  },
  totalDonations: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    required: [true, 'Status is required'],
  },
  end_at: {
    type: Date,
    required: [true, 'End date is required'],
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
