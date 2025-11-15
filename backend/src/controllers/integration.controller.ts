import { Response, NextFunction } from 'express';
import { IntegrationService } from '../services/integration.service';
import { AuthRequest } from '../middleware/auth';

export class IntegrationController {
  private integrationService: IntegrationService;

  constructor() {
    this.integrationService = new IntegrationService();
  }

  getIntegrations = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { storeId } = req.params;
      const integrations = await this.integrationService.getIntegrations(storeId);
      res.json(integrations);
    } catch (error) {
      next(error);
    }
  };

  connectShopify = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const integration = await this.integrationService.connectShopify(req.body);
      res.status(201).json(integration);
    } catch (error) {
      next(error);
    }
  };

  connectWooCommerce = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const integration = await this.integrationService.connectWooCommerce(req.body);
      res.status(201).json(integration);
    } catch (error) {
      next(error);
    }
  };

  connectWhatsApp = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const integration = await this.integrationService.connectWhatsApp(req.body);
      res.status(201).json(integration);
    } catch (error) {
      next(error);
    }
  };

  deleteIntegration = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.integrationService.deleteIntegration(id);
      res.json({ message: 'Integration deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
