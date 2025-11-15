import { Response, NextFunction } from 'express';
import { SubscriptionService } from '../services/subscription.service';
import { AuthRequest } from '../middleware/auth';

export class SubscriptionController {
  private subscriptionService: SubscriptionService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
  }

  getSubscription = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { storeId } = req.query;
      const subscription = await this.subscriptionService.getSubscription(storeId as string);
      res.json(subscription);
    } catch (error) {
      next(error);
    }
  };

  createCheckoutSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const session = await this.subscriptionService.createCheckoutSession(req.body);
      res.json(session);
    } catch (error) {
      next(error);
    }
  };

  upgradePlan = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const subscription = await this.subscriptionService.upgradePlan(req.body);
      res.json(subscription);
    } catch (error) {
      next(error);
    }
  };

  cancelSubscription = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { storeId } = req.body;
      const subscription = await this.subscriptionService.cancelSubscription(storeId);
      res.json(subscription);
    } catch (error) {
      next(error);
    }
  };

  handleWebhook = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.subscriptionService.handleWebhook(req.body);
      res.json({ received: true });
    } catch (error) {
      next(error);
    }
  };
}
