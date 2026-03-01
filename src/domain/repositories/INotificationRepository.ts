/**
 * Notification Repository Interface
 * Defines the contract for notification data access
 */

import { Notification } from '@/types/notifications';

export interface INotificationRepository {
  getNotifications(filters?: Record<string, unknown>): Promise<Notification[]>;
}
