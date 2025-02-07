import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import Activity from '../models/activity.model';
import catchAsync from '../utilities/catchAsync';
import AppError from '../utilities/appError';
import { ObjectId } from 'mongoose';

const checkUserExists = async (user_id: ObjectId): Promise<boolean> => {
  const user = await User.findById(user_id);
  if (!user) {
    return false;
  }
  return true;
};

export const getAllActivities: any = catchAsync(
  async (req: Request, res: Response) => {
    const activities = await Activity.find();
    res.status(200).json({
      status: 'success',
      results: activities.length,
      data: {
        activities,
      },
    });
  },
);

export const getActivityById: any = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return next(new AppError('No activity found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        activity,
      },
    });
  },
);

export const createActivity: any = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userCheck = await checkUserExists(req.user);
    if (!userCheck) {
      return next(new AppError('User not found', 404));
    }

    const activity = await Activity.create({
      ...req.body,
      creator: req.user,
    });

    res.status(201).json({
      status: 'success',
      data: {
        activity,
      },
    });
  },
);

export const updateActivity: any = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!activity) {
      return next(new AppError('No activity found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        activity,
      },
    });
  },
);

export const deleteActivity: any = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const activity = await Activity.findByIdAndDelete(req.params.id);

    if (!activity) {
      return next(new AppError('No activity found with that ID', 404));
    }

    res.status(204).send();
  },
);
