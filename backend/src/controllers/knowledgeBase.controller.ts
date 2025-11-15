import { Response, NextFunction } from 'express';
import { KnowledgeBaseService } from '../services/knowledgeBase.service';
import { AuthRequest } from '../middleware/auth';

export class KnowledgeBaseController {
  private knowledgeBaseService: KnowledgeBaseService;

  constructor() {
    this.knowledgeBaseService = new KnowledgeBaseService();
  }

  getKnowledgeBase = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { storeId } = req.query;
      const entries = await this.knowledgeBaseService.getKnowledgeBase(storeId as string);
      res.json(entries);
    } catch (error) {
      next(error);
    }
  };

  createKnowledgeBaseEntry = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const entry = await this.knowledgeBaseService.createEntry(req.body);
      res.status(201).json(entry);
    } catch (error) {
      next(error);
    }
  };

  getKnowledgeBaseEntry = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const entry = await this.knowledgeBaseService.getEntry(id);
      res.json(entry);
    } catch (error) {
      next(error);
    }
  };

  updateKnowledgeBaseEntry = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const entry = await this.knowledgeBaseService.updateEntry(id, req.body);
      res.json(entry);
    } catch (error) {
      next(error);
    }
  };

  deleteKnowledgeBaseEntry = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.knowledgeBaseService.deleteEntry(id);
      res.json({ message: 'Knowledge base entry deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
