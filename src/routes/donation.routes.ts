import { Router } from 'express';
import * as donationController from '../controllers/donation.controller';
import { protect } from '../controllers/auth.controller';

const router: Router = Router();

router
  .route('/')
  .get(donationController.getAllDonations)
  .post(protect, donationController.createDonation);

router.route('/:id').get(donationController.getDonationById);

export default router;
