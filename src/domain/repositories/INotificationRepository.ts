/**
 * Project Repository Interface
 * Defines the contract for project data access
 */

import { Notification } from '@/types/notifications';
export class INotificationRepository {
  async GetAllNotifications(_filters = {}): Promise<Notification[]> {
    throw new Error('Method not implemented');
  }
}
