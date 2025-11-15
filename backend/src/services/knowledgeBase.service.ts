import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class KnowledgeBaseService {
  async getKnowledgeBase(storeId: string) {
    return prisma.knowledgeBase.findMany({
      where: { storeId },
      orderBy: { priority: 'desc' },
    });
  }

  async createEntry(data: any) {
    return prisma.knowledgeBase.create({
      data,
    });
  }

  async getEntry(id: string) {
    const entry = await prisma.knowledgeBase.findUnique({
      where: { id },
    });

    if (!entry) {
      throw new AppError('Knowledge base entry not found', 404);
    }

    return entry;
  }

  async updateEntry(id: string, data: any) {
    return prisma.knowledgeBase.update({
      where: { id },
      data,
    });
  }

  async deleteEntry(id: string) {
    await prisma.knowledgeBase.delete({
      where: { id },
    });
  }
}
