import { http } from './httpClient';

export interface ApiNotification {
  id: string;
  user_id: string;
  type: 'task' | 'form' | 'message' | 'alert' | 'system';
  title: string;
  body: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export const notificationService = {
  async getAll(): Promise<ApiNotification[]> {
    const response = await http.get<any>('/notifications');
    return response?.data?.notifications ?? response?.data?.data?.notifications ?? [];
  },

  async markAsRead(id: string): Promise<void> {
    await http.put(`/notifications/${id}`, { is_read: true });
  },

  async markAllAsRead(): Promise<void> {
    await http.put('/notifications/read-all', {});
  },

  transformForFrontend(notification: ApiNotification) {
    return {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      isRead: notification.is_read,
      actionUrl: notification.action_url,
      createdAt: notification.created_at,
    };
  },
};