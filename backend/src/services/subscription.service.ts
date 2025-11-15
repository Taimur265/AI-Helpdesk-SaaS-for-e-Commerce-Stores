import Stripe from 'stripe';
import prisma from '../config/database';
import { SubscriptionPlan } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

export class SubscriptionService {
  async getSubscription(storeId: string) {
    return prisma.subscription.findUnique({
      where: { storeId },
    });
  }

  async createCheckoutSession(data: {
    storeId: string;
    plan: SubscriptionPlan;
    successUrl: string;
    cancelUrl: string;
  }) {
    const priceId = this.getPriceId(data.plan);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      metadata: {
        storeId: data.storeId,
      },
    });

    return { sessionId: session.id, url: session.url };
  }

  async upgradePlan(data: { storeId: string; plan: SubscriptionPlan }) {
    const subscription = await prisma.subscription.findUnique({
      where: { storeId: data.storeId },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    return prisma.subscription.update({
      where: { storeId: data.storeId },
      data: { plan: data.plan },
    });
  }

  async cancelSubscription(storeId: string) {
    return prisma.subscription.update({
      where: { storeId },
      data: {
        cancelAtPeriodEnd: true,
      },
    });
  }

  async handleWebhook(event: any) {
    // Handle Stripe webhooks
    // Implementation depends on webhook events
  }

  private getPriceId(plan: SubscriptionPlan): string {
    const prices = {
      BASIC: process.env.STRIPE_BASIC_PRICE_ID || '',
      PRO: process.env.STRIPE_PRO_PRICE_ID || '',
      ENTERPRISE: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
    };

    return prices[plan];
  }
}
