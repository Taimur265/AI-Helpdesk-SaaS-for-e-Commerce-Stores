import { Router } from 'express';
import { StoreController } from '../controllers/store.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const storeController = new StoreController();

router.use(authenticate);

router.get('/', storeController.getStores);
router.post('/', storeController.createStore);
router.get('/:id', storeController.getStore);
router.put('/:id', storeController.updateStore);
router.delete('/:id', storeController.deleteStore);

export default router;
