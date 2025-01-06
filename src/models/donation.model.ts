import { Schema, model } from 'mongoose';
import IDonation from '../interfaces/donation.interface';
import path from 'path';

const donationSchema = new Schema<IDonation>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  activity: {
    type: Schema.Types.ObjectId,
    ref: 'Activity',
    required: [true, 'Activity is required'],
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
  },
});

donationSchema.pre(/^find/, function (next) {
  (this as any)
    .populate({
      path: 'user',
      select: 'firstName lastName',
    })
    .populate({
      path: 'activity',
      select: 'name',
    });

  next();
});

const Donation = model<IDonation>('Donation', donationSchema);
export default Donation;
