import { Router, Request, Response, NextFunction } from 'express';
import * as userController from '../controllers/user.controller';
import * as authController from '../controllers/auth.controller';

const router: Router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
