import { ChatbotService } from '../../domain/services/ChatbotService';

/**
 * Ask Chatbot Use Case
 * Application use case for sending messages to the chatbot
 */
export class AskChatbotUseCase {
  constructor(private chatbotService: ChatbotService) {}

  /**
   * Execute the ask chatbot use case
   * @param message - The user's message
   * @param userId - Optional user ID for personalization
   * @returns Promise resolving to chatbot response
   */
  async execute(message: string, userId?: string): Promise<{ response: string; confidence?: number }> {
    try {
      return await this.chatbotService.processMessage(message, userId);
    } catch (error) {
      console.error('Error in AskChatbotUseCase:', error);
      throw error;
    }
  }
}