import { Router, Request, Response, NextFunction } from 'express';
import * as userController from '../controllers/user.controller';

const filterRole = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.role) {
    delete req.body.role;
  }
  next();
};

const router: Router = Router();

router.use(filterRole);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export const UserRoutes: Router = router;
