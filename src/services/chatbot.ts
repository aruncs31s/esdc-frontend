// Chatbot Service - Handle AI API calls

import { ApiSuccessResponse } from "@/types";
// This file can be extended to integrate with actual AI services like OpenAI, Google AI, etc.

/**
 * Send a message to the AI chatbot
 * @param {string} message - User's message
 * @returns {Promise<ApiSuccessResponse<ChatbotResponse>>} - AI response
 */

import { ChatbotResponse } from "@/components/Chatbot";
import chatbotAPI from "@/infrastructure/api/chatbot";

export const askChatBot = async (message: string): Promise<ApiSuccessResponse<ChatbotResponse>> => {
  const response = await chatbotAPI.ask(message);
  return response;
};

/**
 * Get quick action suggestions based on context
 */
export const getQuickActions = () => {
  return [
    { label: 'Events', message: 'Tell me about upcoming events' },
    { label: 'Challenges', message: 'What challenges are available?' },
    { label: 'Resources', message: 'Show me learning resources' },
    { label: 'How to join?', message: 'How can I join ESDC?' },
    { label: 'Leaderboard', message: 'How does the leaderboard work?' },
    { label: 'Contact', message: 'How can I contact ESDC?' },
  ];
};

/**
 * Save chat history to local storage
 */
export const saveChatHistory = (messages: Array<{ id: number; text: string; sender: string; timestamp: Date }>) => {
  try {
    localStorage.setItem('chatbot_history', JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

/**
 * Load chat history from local storage
 */
export const loadChatHistory = () => {
  try {
    const history = localStorage.getItem('chatbot_history');
    return history ? JSON.parse(history) : null;
  } catch (error) {
    console.error('Error loading chat history:', error);
    return null;
  }
};

/**
 * Clear chat history
 */
export const clearChatHistory = () => {
  try {
    localStorage.removeItem('chatbot_history');
  } catch (error) {
    console.error('Error clearing chat history:', error);
  }
};

export default {
  getQuickActions,
  saveChatHistory,
  loadChatHistory,
  clearChatHistory,
};
