import { NextFunction, Request, Response } from 'express';
import User from '../models/user.model';
import catchAsync from '../utilities/catchAsync';
import AppError from '../utilities/appError';

export const getAllUsers: any = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

export const getUserById: any = catchAsync(
  async (req: Request, res: Response, next: any) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  },
);

export const createUser: any = catchAsync(async (req: Request, res: Response) => {
  const user = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});
