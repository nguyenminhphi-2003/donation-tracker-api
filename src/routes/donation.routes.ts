import { Router } from 'express';
import * as donationController from '../controllers/donation.controller';
import { protect, restrictTo } from '../controllers/auth.controller';

const router: Router = Router();

router
  .route('/')
  .get(protect, restrictTo('admin') ,donationController.getAllDonations)
  .post(protect, donationController.createDonation);

router.route('/:id').get(donationController.getDonationById);

export default router;
