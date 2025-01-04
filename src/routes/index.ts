import { Router } from 'express';
import UserRoutes from './user.routes';
import ActivityRoutes from './activity.routes';
import DonationRoutes from './donation.routes';

const router: Router = Router();

router.use('/users', UserRoutes);
router.use('/activities', ActivityRoutes);
router.use('/donations', DonationRoutes);

export default router;
