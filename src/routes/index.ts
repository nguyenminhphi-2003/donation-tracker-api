import { Router } from 'express';
import UserRoutes from './user.routes';
import ActivityRoutes from './activity.routes';

const router: Router = Router();

router.use('/users', UserRoutes);
router.use('/activities', ActivityRoutes);

export default router;
