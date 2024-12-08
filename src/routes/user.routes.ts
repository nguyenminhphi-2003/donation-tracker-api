import { Router, Request, Response } from 'express';
import userController from '../controllers/user.controller';

const router: Router = Router();

router.route('/').get(userController.getAllUsers);

export const UserRoutes: Router = router;