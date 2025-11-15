import { Response, NextFunction } from 'express';
import { ChatService } from '../services/chat.service';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const sendMessageSchema = z.object({
  conversationId: z.string().optional(),
  storeId: z.string(),
  message: z.string().min(1),
  channel: z.enum(['WEBSITE', 'WHATSAPP', 'EMAIL', 'SMS']),
  customerEmail: z.string().email().optional(),
  customerName: z.string().optional(),
});

export class ChatController {
  private chatService: ChatService;

  constructor() {
    this.chatService = new ChatService();
  }

  sendMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = sendMessageSchema.parse(req.body);
      const result = await this.chatService.sendMessage(data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getConversations = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { storeId, status, channel, page = '1', limit = '20' } = req.query;

      const conversations = await this.chatService.getConversations({
        storeId: storeId as string,
        status: status as any,
        channel: channel as any,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });

      res.json(conversations);
    } catch (error) {
      next(error);
    }
  };

  getConversation = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const conversation = await this.chatService.getConversation(id);
      res.json(conversation);
    } catch (error) {
      next(error);
    }
  };

  closeConversation = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const conversation = await this.chatService.closeConversation(id);
      res.json(conversation);
    } catch (error) {
      next(error);
    }
  };

  assignConversation = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      const conversation = await this.chatService.assignConversation(id, userId);
      res.json(conversation);
    } catch (error) {
      next(error);
    }
  };
}
