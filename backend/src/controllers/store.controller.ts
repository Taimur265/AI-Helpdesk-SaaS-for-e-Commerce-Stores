import { Response, NextFunction } from 'express';
import { StoreService } from '../services/store.service';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const createStoreSchema = z.object({
  name: z.string().min(1),
  domain: z.string().optional(),
  platform: z.enum(['SHOPIFY', 'WOOCOMMERCE']),
  timezone: z.string().default('UTC'),
  currency: z.string().default('USD'),
});

export class StoreController {
  private storeService: StoreService;

  constructor() {
    this.storeService = new StoreService();
  }

  getStores = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const stores = await this.storeService.getStores(req.user!.id);
      res.json(stores);
    } catch (error) {
      next(error);
    }
  };

  createStore = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = createStoreSchema.parse(req.body);
      const store = await this.storeService.createStore(req.user!.id, data);
      res.status(201).json(store);
    } catch (error) {
      next(error);
    }
  };

  getStore = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const store = await this.storeService.getStore(id, req.user!.id);
      res.json(store);
    } catch (error) {
      next(error);
    }
  };

  updateStore = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const store = await this.storeService.updateStore(id, req.user!.id, req.body);
      res.json(store);
    } catch (error) {
      next(error);
    }
  };

  deleteStore = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.storeService.deleteStore(id, req.user!.id);
      res.json({ message: 'Store deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
