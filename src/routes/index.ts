import { Router } from 'express';
import { UserRoutes } from './user.routes';

const router: Router = Router();

router.use('/users', UserRoutes);

export const MainRouter: Router = router;
