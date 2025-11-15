import prisma from '../config/database';

export class AnalyticsService {
  async getOverview(storeId: string, startDate: string, endDate: string) {
    const start = new Date(startDate || Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = new Date(endDate || Date.now());

    const [totalConversations, openConversations, resolvedConversations, totalMessages] =
      await Promise.all([
        prisma.conversation.count({
          where: {
            storeId,
            createdAt: { gte: start, lte: end },
          },
        }),
        prisma.conversation.count({
          where: {
            storeId,
            status: 'OPEN',
          },
        }),
        prisma.conversation.count({
          where: {
            storeId,
            status: 'RESOLVED',
            createdAt: { gte: start, lte: end },
          },
        }),
        prisma.message.count({
          where: {
            conversation: {
              storeId,
            },
            createdAt: { gte: start, lte: end },
          },
        }),
      ]);

    return {
      totalConversations,
      openConversations,
      resolvedConversations,
      totalMessages,
      averageMessagesPerConversation:
        totalConversations > 0 ? totalMessages / totalConversations : 0,
    };
  }

  async getCommonQuestions(storeId: string, limit: number) {
    // This would typically analyze message content
    // For now, returning placeholder data
    return [];
  }

  async getResponseTimes(storeId: string, startDate: string, endDate: string) {
    const start = new Date(startDate || Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = new Date(endDate || Date.now());

    const conversations = await prisma.conversation.findMany({
      where: {
        storeId,
        createdAt: { gte: start, lte: end },
      },
      include: {
        messages: {
          take: 2,
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    const responseTimes = conversations.map((conv) => {
      if (conv.messages.length < 2) return 0;
      const firstMessage = conv.messages[0];
      const secondMessage = conv.messages[1];
      return (
        (new Date(secondMessage.createdAt).getTime() -
          new Date(firstMessage.createdAt).getTime()) /
        1000
      );
    });

    const avgResponseTime =
      responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0;

    return {
      averageResponseTime: avgResponseTime,
      responseTimes,
    };
  }

  async getSatisfactionScores(storeId: string, startDate: string, endDate: string) {
    const start = new Date(startDate || Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = new Date(endDate || Date.now());

    const conversations = await prisma.conversation.findMany({
      where: {
        storeId,
        createdAt: { gte: start, lte: end },
      },
      select: {
        sentiment: true,
      },
    });

    const sentimentCounts = conversations.reduce(
      (acc, conv) => {
        if (conv.sentiment) {
          acc[conv.sentiment] = (acc[conv.sentiment] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      positive: sentimentCounts['positive'] || 0,
      neutral: sentimentCounts['neutral'] || 0,
      negative: sentimentCounts['negative'] || 0,
      total: conversations.length,
    };
  }
}
