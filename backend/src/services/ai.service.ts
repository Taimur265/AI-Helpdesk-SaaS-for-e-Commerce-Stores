import Anthropic from '@anthropic-ai/sdk';
import prisma from '../config/database';
import { logger } from '../utils/logger';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ChatContext {
  conversationHistory: Array<{ role: string; content: string }>;
  knowledgeBase: string[];
  orderContext?: any;
  customerContext?: any;
}

export class AIService {
  /**
   * Generate AI response for customer query
   */
  async generateResponse(
    message: string,
    storeId: string,
    conversationId?: string
  ): Promise<string> {
    try {
      // Build context
      const context = await this.buildContext(storeId, conversationId);

      // Prepare system prompt
      const systemPrompt = this.buildSystemPrompt(context);

      // Get conversation history
      const messages = conversationId
        ? await this.getConversationHistory(conversationId)
        : [];

      // Add current message
      messages.push({
        role: 'user',
        content: message,
      });

      // Call Claude API
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages as any,
      });

      const aiResponse = response.content[0].type === 'text'
        ? response.content[0].text
        : '';

      return aiResponse;
    } catch (error) {
      logger.error('AI response generation failed:', error);
      throw error;
    }
  }

  /**
   * Build context from knowledge base and store data
   */
  private async buildContext(
    storeId: string,
    conversationId?: string
  ): Promise<ChatContext> {
    const context: ChatContext = {
      conversationHistory: [],
      knowledgeBase: [],
    };

    // Get knowledge base entries
    const knowledgeEntries = await prisma.knowledgeBase.findMany({
      where: {
        storeId,
        isActive: true,
      },
      orderBy: {
        priority: 'desc',
      },
      take: 10,
    });

    context.knowledgeBase = knowledgeEntries.map(
      (entry) => `${entry.title}: ${entry.content}`
    );

    // Get conversation history if exists
    if (conversationId) {
      context.conversationHistory = await this.getConversationHistory(
        conversationId
      );
    }

    return context;
  }

  /**
   * Build system prompt with context
   */
  private buildSystemPrompt(context: ChatContext): string {
    let prompt = `You are a helpful AI customer support assistant for an e-commerce store.

Your role is to:
1. Answer customer questions accurately and professionally
2. Help with order status, returns, refunds, and shipping inquiries
3. Provide product information and recommendations
4. Resolve common customer issues

Important guidelines:
- Be friendly, concise, and professional
- Use the knowledge base information provided below to answer questions
- If you don't know something, admit it and offer to escalate to a human agent
- Never make up information about orders, products, or policies
- Always prioritize customer satisfaction

`;

    if (context.knowledgeBase.length > 0) {
      prompt += `\n\nKNOWLEDGE BASE:\n${context.knowledgeBase.join('\n\n')}\n`;
    }

    if (context.orderContext) {
      prompt += `\n\nORDER CONTEXT:\n${JSON.stringify(context.orderContext, null, 2)}\n`;
    }

    return prompt;
  }

  /**
   * Get conversation history
   */
  private async getConversationHistory(
    conversationId: string
  ): Promise<Array<{ role: string; content: string }>> {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: 20, // Last 20 messages
    });

    return messages.map((msg) => ({
      role: msg.sender === 'CUSTOMER' ? 'user' : 'assistant',
      content: msg.content,
    }));
  }

  /**
   * Extract order number from message
   */
  extractOrderNumber(message: string): string | null {
    const orderPattern = /#(\d+)|order\s+(\d+)|order\s+number\s+(\d+)/i;
    const match = message.match(orderPattern);
    return match ? match[1] || match[2] || match[3] : null;
  }

  /**
   * Determine if query requires human escalation
   */
  async shouldEscalateToHuman(message: string, aiResponse: string): Promise<boolean> {
    const escalationKeywords = [
      'speak to human',
      'talk to person',
      'human agent',
      'representative',
      'manager',
      'supervisor',
    ];

    const messageLower = message.toLowerCase();
    const responseContainsApology = aiResponse.toLowerCase().includes("i don't know") ||
      aiResponse.toLowerCase().includes("i'm not sure") ||
      aiResponse.toLowerCase().includes("escalate");

    return (
      escalationKeywords.some((keyword) => messageLower.includes(keyword)) ||
      responseContainsApology
    );
  }

  /**
   * Analyze sentiment of message
   */
  async analyzeSentiment(message: string): Promise<'positive' | 'neutral' | 'negative'> {
    const negativeKeywords = ['angry', 'frustrated', 'terrible', 'awful', 'hate', 'worst'];
    const positiveKeywords = ['thanks', 'thank you', 'great', 'awesome', 'love', 'perfect'];

    const messageLower = message.toLowerCase();

    if (negativeKeywords.some((keyword) => messageLower.includes(keyword))) {
      return 'negative';
    }

    if (positiveKeywords.some((keyword) => messageLower.includes(keyword))) {
      return 'positive';
    }

    return 'neutral';
  }

  /**
   * Generate auto-response templates
   */
  async generateAutoResponse(type: 'return' | 'refund' | 'shipping'): Promise<string> {
    const templates = {
      return: `To initiate a return, please follow these steps:
1. Log into your account
2. Go to Order History
3. Select the order you wish to return
4. Click "Request Return"
5. Follow the instructions to print your return label

Our return policy allows returns within 30 days of delivery. Items must be unused and in original packaging.`,

      refund: `Refunds are processed within 5-7 business days after we receive your returned item.
The refund will be issued to your original payment method.

If you have any questions about the status of your refund, please provide your order number and I'll check for you.`,

      shipping: `We offer several shipping options:
- Standard Shipping (5-7 business days): FREE on orders over $50
- Express Shipping (2-3 business days): $9.99
- Overnight Shipping (1 business day): $19.99

All orders are processed within 24 hours. You'll receive a tracking number via email once your order ships.`,
    };

    return templates[type];
  }
}
