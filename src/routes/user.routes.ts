import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import {
  signup,
  login,
  logout,
  protect,
  restrictTo,
} from '../controllers/auth.controller';

const router: Router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

router
  .route('/')
  .get(protect, restrictTo('admin'), userController.getAllUsers)
  .post(userController.createUser);

router.use(protect, restrictTo('admin'));

router
  .route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
