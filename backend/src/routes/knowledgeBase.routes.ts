import { Router } from 'express';
import { KnowledgeBaseController } from '../controllers/knowledgeBase.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const knowledgeBaseController = new KnowledgeBaseController();

router.use(authenticate);

router.get('/', knowledgeBaseController.getKnowledgeBase);
router.post('/', knowledgeBaseController.createKnowledgeBaseEntry);
router.get('/:id', knowledgeBaseController.getKnowledgeBaseEntry);
router.put('/:id', knowledgeBaseController.updateKnowledgeBaseEntry);
router.delete('/:id', knowledgeBaseController.deleteKnowledgeBaseEntry);

export default router;
