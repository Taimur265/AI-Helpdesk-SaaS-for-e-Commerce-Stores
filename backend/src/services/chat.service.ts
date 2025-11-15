import prisma from '../config/database';
import { AIService } from './ai.service';
import { AppError } from '../middleware/errorHandler';
import { io } from '../app';
import { logger } from '../utils/logger';

interface SendMessageData {
  conversationId?: string;
  storeId: string;
  message: string;
  channel: 'WEBSITE' | 'WHATSAPP' | 'EMAIL' | 'SMS';
  customerEmail?: string;
  customerName?: string;
}

export class ChatService {
  private aiService: AIService;

  constructor() {
    this.aiService = new AIService();
  }

  async sendMessage(data: SendMessageData) {
    let conversation;

    // Create or get conversation
    if (data.conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: data.conversationId },
      });

      if (!conversation) {
        throw new AppError('Conversation not found', 404);
      }
    } else {
      // Create new conversation
      conversation = await prisma.conversation.create({
        data: {
          storeId: data.storeId,
          channel: data.channel,
          customerEmail: data.customerEmail,
          customerName: data.customerName,
          status: 'OPEN',
        },
      });
    }

    // Save customer message
    const customerMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        content: data.message,
        sender: 'CUSTOMER',
        senderName: data.customerName,
      },
    });

    // Emit message via WebSocket
    io.to(`conversation:${conversation.id}`).emit('new_message', customerMessage);

    // Analyze sentiment
    const sentiment = await this.aiService.analyzeSentiment(data.message);

    // Update conversation sentiment
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { sentiment },
    });

    // Generate AI response
    const aiResponse = await this.aiService.generateResponse(
      data.message,
      data.storeId,
      conversation.id
    );

    // Check if should escalate to human
    const shouldEscalate = await this.aiService.shouldEscalateToHuman(
      data.message,
      aiResponse
    );

    // Save AI message
    const aiMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        content: aiResponse,
        sender: 'AI',
        isAiGenerated: true,
        aiModel: 'claude-3-5-sonnet-20241022',
      },
    });

    // Emit AI response via WebSocket
    io.to(`conversation:${conversation.id}`).emit('new_message', aiMessage);

    // Update conversation status if escalation needed
    if (shouldEscalate) {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { status: 'PENDING', priority: 'HIGH' },
      });
    }

    // Track analytics
    await this.trackAnalytics(conversation.id, data.storeId, 'message_sent');

    return {
      conversation,
      customerMessage,
      aiMessage,
      shouldEscalate,
    };
  }

  async getConversations(filters: {
    storeId: string;
    status?: string;
    channel?: string;
    page: number;
    limit: number;
  }) {
    const skip = (filters.page - 1) * filters.limit;

    const where: any = {
      storeId: filters.storeId,
    };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.channel) {
      where.channel = filters.channel;
    }

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: filters.limit,
      }),
      prisma.conversation.count({ where }),
    ]);

    return {
      conversations,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }

  async getConversation(id: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
            platform: true,
          },
        },
      },
    });

    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    return conversation;
  }

  async closeConversation(id: string) {
    const conversation = await prisma.conversation.update({
      where: { id },
      data: {
        status: 'CLOSED',
        closedAt: new Date(),
      },
    });

    // Track analytics
    await this.trackAnalytics(id, conversation.storeId, 'conversation_closed');

    return conversation;
  }

  async assignConversation(conversationId: string, userId: string) {
    const conversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        assignedToUserId: userId,
        status: 'PENDING',
      },
    });

    return conversation;
  }

  private async trackAnalytics(
    conversationId: string,
    storeId: string,
    eventType: string
  ) {
    try {
      await prisma.analyticsEvent.create({
        data: {
          storeId,
          eventType,
          conversationId,
          eventData: {},
        },
      });
    } catch (error) {
      logger.error('Failed to track analytics:', error);
    }
  }
}
