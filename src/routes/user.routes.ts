import { Router, Request, Response } from 'express';
import * as userController from '../controllers/user.controller';

const router: Router = Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.route('/:id').get(userController.getUserById);

export const UserRoutes: Router = router;
