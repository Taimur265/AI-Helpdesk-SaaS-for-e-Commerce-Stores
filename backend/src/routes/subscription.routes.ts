import { Router } from 'express';
import { SubscriptionController } from '../controllers/subscription.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const subscriptionController = new SubscriptionController();

router.use(authenticate);

router.get('/', subscriptionController.getSubscription);
router.post('/checkout', subscriptionController.createCheckoutSession);
router.post('/upgrade', subscriptionController.upgradePlan);
router.post('/cancel', subscriptionController.cancelSubscription);
router.post('/webhook', subscriptionController.handleWebhook); // Stripe webhook

export default router;
