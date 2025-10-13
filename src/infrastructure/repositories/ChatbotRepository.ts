import { IChatbotRepository } from '@/domain/repositories/IChatbotRepository';
import { chatbotAPI } from '../api/chatbot';

/**
 * Chatbot Repository Implementation
 * Implements the chatbot repository interface using the API client
 */
export class ChatbotRepository implements IChatbotRepository {
  async ask(message: string): Promise<{ response: string }> {
    try {
      const result = await chatbotAPI.ask(message);
      return result.data;
    } catch (error) {
      console.error('Error in chatbot ask:', error);
      throw new Error('Failed to get chatbot response');
    }
  }

  async getHistory(userId: string): Promise<Array<{
    id: string;
    message: string;
    response: string;
    timestamp: Date;
  }>> {
    try {
      const result = await chatbotAPI.getHistory(userId);
      return result.data.map(item => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  }

  getQuickActions(): Array<{ label: string; message: string }> {
    // Return static quick actions (could be made dynamic via API later)
    return [
      { label: 'Events', message: 'Tell me about upcoming events' },
      { label: 'Challenges', message: 'What challenges are available?' },
      { label: 'Resources', message: 'Show me learning resources' },
      { label: 'How to join?', message: 'How can I join ESDC?' },
      { label: 'Leaderboard', message: 'How does the leaderboard work?' },
      { label: 'Contact', message: 'How can I contact ESDC?' },
    ];
  }
}

// Export singleton instance
const chatbotRepository = new ChatbotRepository();
export default chatbotRepository;