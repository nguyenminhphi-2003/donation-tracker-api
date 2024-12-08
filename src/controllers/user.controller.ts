import { Request, Response } from 'express';
import User from '../models/user.model';

const userController = {
  getAllUsers: async (req: Request, res: Response) => {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      data: {
        users,
      },
    });
  },
};

export default userController;
