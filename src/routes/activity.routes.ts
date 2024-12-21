import { Router } from 'express';
import * as activityController from '../controllers/activity.controller';

const router: Router = Router();

router
  .route('/')
  .get(activityController.getAllActivities)
  .post(activityController.createActivity);

router
  .route('/:id')
  .get(activityController.getActivityById)
  .patch(activityController.updateActivity)
  .delete(activityController.deleteActivity);

export default router;
