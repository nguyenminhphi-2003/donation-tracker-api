import { Router } from 'express';
import * as donationController from '../controllers/donation.controller';

const router: Router = Router();

router
  .route('/')
  .get(donationController.getAllDonations)
  .post(donationController.createDonation);

router.route('/:id').get(donationController.getDonationById);

export default router;
