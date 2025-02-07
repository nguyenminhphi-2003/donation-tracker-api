import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { signup, login, protect } from '../controllers/auth.controller';

const router: Router = Router();

router.post('/signup', signup);
router.post('/login', login);


router
.route('/')
.get(protect, userController.getAllUsers)
.post(userController.createUser);

router.use(protect);

router
  .route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
