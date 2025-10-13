import apiClient from './ApiClient';
import { ApiSuccessResponse } from '@/types/api';

/**
 * Chatbot API Client
 * Handles HTTP communication with the chatbot backend
 */
export const chatbotAPI = {
    /**
     * Send a message to the chatbot
     * @param message - The user's message
     * @returns Promise resolving to API response
     */
    ask: async (message: string): Promise<ApiSuccessResponse<{ response: string }>> => {
        const response = await apiClient.post('/api/chatbot/ask', {
            query_message: message, // Backend expects 'query_message' field
        });
        return response.data;
    },

    /**
     * Get chat history for a user
     * @param userId - The user's ID
     * @returns Promise resolving to chat history
     */
    getHistory: async (userId: string): Promise<ApiSuccessResponse<Array<{
        id: string;
        message: string;
        response: string;
        timestamp: string;
    }>>> => {
        const response = await apiClient.get(`/api/chatbot/history/${userId}`);
        return response.data;
    },

    /**
     * Get quick action suggestions
     * @returns Promise resolving to suggestions
     */
    getSuggestions: async (): Promise<ApiSuccessResponse<Array<{ label: string; message: string }>>> => {
        const response = await apiClient.get('/api/chatbot/suggestions');
        return response.data;
    }
};

export default chatbotAPI;