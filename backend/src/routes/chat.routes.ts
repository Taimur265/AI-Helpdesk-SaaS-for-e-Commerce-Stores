import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const chatController = new ChatController();

router.use(authenticate);

router.post('/message', chatController.sendMessage);
router.get('/conversations', chatController.getConversations);
router.get('/conversations/:id', chatController.getConversation);
router.post('/conversations/:id/close', chatController.closeConversation);
router.post('/conversations/:id/assign', chatController.assignConversation);

export default router;
