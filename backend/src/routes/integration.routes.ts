import { Router } from 'express';
import { IntegrationController } from '../controllers/integration.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const integrationController = new IntegrationController();

router.use(authenticate);

router.get('/:storeId', integrationController.getIntegrations);
router.post('/shopify/connect', integrationController.connectShopify);
router.post('/woocommerce/connect', integrationController.connectWooCommerce);
router.post('/whatsapp/connect', integrationController.connectWhatsApp);
router.delete('/:id', integrationController.deleteIntegration);

export default router;
