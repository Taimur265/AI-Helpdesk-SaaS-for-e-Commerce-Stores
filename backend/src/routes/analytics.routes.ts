import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const analyticsController = new AnalyticsController();

router.use(authenticate);

router.get('/overview', analyticsController.getOverview);
router.get('/common-questions', analyticsController.getCommonQuestions);
router.get('/response-times', analyticsController.getResponseTimes);
router.get('/satisfaction', analyticsController.getSatisfactionScores);

export default router;
