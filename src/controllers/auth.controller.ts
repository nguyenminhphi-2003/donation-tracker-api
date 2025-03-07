import User from '../models/user.model';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import catchAsync from '../utilities/catchAsync';
import AppError from '../utilities/appError';
import { create } from 'domain';

const signToken = (id: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    path: '/',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup: any = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.create(req.body);
    createSendToken(user, 201, res);
  },
);

export const login: any = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    createSendToken(user, 200, res);
  },
);

export const logout: any = (req: Request, res: Response) => {
  res.cookie('jwt', 'loggedout', {
    path: '/',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.status(200).json({ status: 'success' });
};

export const protect: any = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError(
          'You are not logged in! Please log in to get access.',
          401,
        ),
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || '');

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401,
        ),
      );
    }

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  },
);

export const restrictTo =
  (...roles: any[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
