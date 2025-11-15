import { Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { AuthRequest } from '../middleware/auth';

export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  getOverview = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { storeId, startDate, endDate } = req.query;
      const overview = await this.analyticsService.getOverview(
        storeId as string,
        startDate as string,
        endDate as string
      );
      res.json(overview);
    } catch (error) {
      next(error);
    }
  };

  getCommonQuestions = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { storeId, limit = '10' } = req.query;
      const questions = await this.analyticsService.getCommonQuestions(
        storeId as string,
        parseInt(limit as string)
      );
      res.json(questions);
    } catch (error) {
      next(error);
    }
  };

  getResponseTimes = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { storeId, startDate, endDate } = req.query;
      const responseTimes = await this.analyticsService.getResponseTimes(
        storeId as string,
        startDate as string,
        endDate as string
      );
      res.json(responseTimes);
    } catch (error) {
      next(error);
    }
  };

  getSatisfactionScores = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { storeId, startDate, endDate } = req.query;
      const scores = await this.analyticsService.getSatisfactionScores(
        storeId as string,
        startDate as string,
        endDate as string
      );
      res.json(scores);
    } catch (error) {
      next(error);
    }
  };
}
