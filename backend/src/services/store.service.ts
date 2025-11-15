import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { Platform } from '@prisma/client';

interface CreateStoreData {
  name: string;
  domain?: string;
  platform: Platform;
  timezone?: string;
  currency?: string;
}

export class StoreService {
  async getStores(userId: string) {
    const stores = await prisma.store.findMany({
      where: { ownerId: userId },
      include: {
        subscription: true,
        _count: {
          select: {
            conversations: true,
            knowledgeBase: true,
          },
        },
      },
    });

    return stores;
  }

  async createStore(userId: string, data: CreateStoreData) {
    const store = await prisma.store.create({
      data: {
        ...data,
        ownerId: userId,
      },
    });

    // Create a trial subscription
    await prisma.subscription.create({
      data: {
        storeId: store.id,
        plan: 'BASIC',
        status: 'TRIAL',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
      },
    });

    return store;
  }

  async getStore(storeId: string, userId: string) {
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        ownerId: userId,
      },
      include: {
        subscription: true,
        integrations: true,
      },
    });

    if (!store) {
      throw new AppError('Store not found', 404);
    }

    return store;
  }

  async updateStore(storeId: string, userId: string, data: Partial<CreateStoreData>) {
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        ownerId: userId,
      },
    });

    if (!store) {
      throw new AppError('Store not found', 404);
    }

    return prisma.store.update({
      where: { id: storeId },
      data,
    });
  }

  async deleteStore(storeId: string, userId: string) {
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        ownerId: userId,
      },
    });

    if (!store) {
      throw new AppError('Store not found', 404);
    }

    await prisma.store.delete({
      where: { id: storeId },
    });
  }
}
