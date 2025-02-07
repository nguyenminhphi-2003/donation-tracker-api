import { NextFunction, Request, Response } from 'express';
import Donation from '../models/donation.model';
import Activity from '../models/activity.model';
import User from '../models/user.model';
import catchAsync from '../utilities/catchAsync';
import AppError from '../utilities/appError';
import mongoose, { ObjectId } from 'mongoose';
import { createPaymentUrl } from '../services/payment.service';

// Check if the activity and user exist
const checkRequest = async (
  activityId: ObjectId,
  userId: ObjectId,
  next: NextFunction,
): Promise<any> => {
  const activity = await Activity.findById(activityId);
  if (!activity) {
    return next(new AppError('No activity found with that ID', 404));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  return { activity, user };
};

export const createPaymentURL: any = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ipAddr = req.headers['x-forwarded-for'];

  const paymentUrl = createPaymentUrl(req.body.amount, '', ipAddr as string);
};

export const getAllDonations: any = catchAsync(
  async (req: Request, res: Response) => {
    const donations = await Donation.find();

    res.status(200).json({
      status: 'success',
      results: donations.length,
      data: {
        donations,
      },
    });
  },
);

export const createDonation: any = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { activity, user, amount } = req.body;
    const { activity: checkedActivity } = await checkRequest(
      activity,
      user,
      next,
    );

    if (activity.goalAmount === activity.totalDonations) {
      return next(new AppError('Activity has reached its goal', 400));
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const donation = await Donation.create([{ ...req.body }], { session });

      checkedActivity.totalDonations += amount;
      await checkedActivity.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        status: 'success',
        data: {
          donation,
        },
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError('Transaction failed', 500));
    }
  },
);

export const getDonationById: any = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return next(new AppError('No donation found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        donation,
      },
    });
  },
);
