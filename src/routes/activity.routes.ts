import { Router } from 'express';
import * as activityController from '../controllers/activity.controller';
import { protect } from '../controllers/auth.controller';

const router: Router = Router();

router
  .route('/')
  .get(activityController.getAllActivities)
  .post(protect, activityController.createActivity);

router
  .route('/:id')
  .get(activityController.getActivityById)
  .patch(protect, activityController.updateActivity)
  .delete(protect, activityController.deleteActivity);

export default router;
