/**
 * Chatbot Repository Interface
 * Defines the contract for chatbot data access operations
 */
export interface IChatbotRepository {
  /**
   * Send a message to the chatbot and get a response
   * @param message - The user's message
   * @returns Promise resolving to chatbot response
   */
  ask(message: string): Promise<{ response: string }>;

  /**
   * Get chat history for a user
   * @param userId - The user's ID
   * @returns Promise resolving to chat history
   */
  getHistory(userId: string): Promise<Array<{
    id: string;
    message: string;
    response: string;
    timestamp: Date;
  }>>;

  /**
   * Get quick action suggestions
   * @returns Array of quick action suggestions
   */
  getQuickActions(): Array<{ label: string; message: string }>;
}