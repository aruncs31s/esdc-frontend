import { IChatbotRepository } from '../repositories/IChatbotRepository';

/**
 * Chatbot Domain Service
 * Contains business logic related to chatbot interactions
 */
export class ChatbotService {
  constructor(private chatbotRepository: IChatbotRepository) {}

  /**
   * Process a chatbot message with business logic
   * @param message - The user's message
   * @param userId - Optional user ID for personalization
   * @returns Promise resolving to processed response
   */
  async processMessage(message: string, userId?: string): Promise<{ response: string; confidence?: number }> {
    // Validate message
    if (!message || message.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    if (message.length > 1000) {
      throw new Error('Message is too long (max 1000 characters)');
    }

    // Get response from repository
    const result = await this.chatbotRepository.ask(message);

    // Apply business rules (could add filtering, moderation, etc.)
    const processedResponse = this.applyBusinessRules(result.response, userId);

    return {
      response: processedResponse,
      confidence: this.calculateConfidence(message, processedResponse)
    };
  }

  /**
   * Get chat history for a user
   * @param userId - The user's ID
   * @returns Promise resolving to chat history
   */
  async getUserHistory(userId: string) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    return await this.chatbotRepository.getHistory(userId);
  }

  /**
   * Get available quick actions
   * @returns Array of quick actions
   */
  getQuickActions() {
    return this.chatbotRepository.getQuickActions();
  }

  /**
   * Apply business rules to chatbot response
   * @param response - Raw response from chatbot
   * @param userId - Optional user ID for personalization
   * @returns Processed response
   */
  private applyBusinessRules(response: string, userId?: string): string {
    // Example business rules:
    // - Filter inappropriate content
    // - Add disclaimers
    // - Format responses
    // - Add branding

    let processed = response;

    // Add ESDC branding if not present
    if (!processed.includes('ESDC') && !processed.includes('Empowerment')) {
      processed += '\n\n*This is an AI assistant for ESDC - Student Empowerment & Development Club*';
    }

    // Add user-specific personalization if userId is provided
    if (userId) {
      // Could add user-specific logic here in the future
      // For now, just acknowledge the userId parameter is available
    }

    return processed;
  }

  /**
   * Calculate confidence score for the response
   * @param message - Original message
   * @param response - Generated response
   * @returns Confidence score (0-1)
   */
  private calculateConfidence(message: string, response: string): number {
    // Simple confidence calculation based on response length and relevance
    // In a real implementation, this would use ML models or API confidence scores
    const messageLength = message.length;
    const responseLength = response.length;

    // Basic heuristic: longer responses for longer questions tend to be more confident
    const lengthRatio = Math.min(responseLength / messageLength, 2) / 2;

    // Ensure response is not too short
    const minLengthScore = Math.min(responseLength / 50, 1);

    return Math.min(lengthRatio * minLengthScore, 1);
  }
}