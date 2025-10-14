import { INotificationRepository } from '@/domain/repositories/INotificationRepository';

import apiClient from '../api/ApiClient';

import { Notification } from '@/types/notifications';
import { ApiSuccessResponse } from '@/types';

export class NotificationRepository extends INotificationRepository {
  private api: typeof apiClient;

  constructor(client = apiClient) {
    super();
    this.api = client;
  }

  getNotifications = async (): Promise<Notification[]> => {
    try {
      const response = await this.api.get<ApiSuccessResponse<Notification[]>>('/api/notifications');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  };
}
// Singleton instance
const notificationRepository = new NotificationRepository();

export default notificationRepository;
