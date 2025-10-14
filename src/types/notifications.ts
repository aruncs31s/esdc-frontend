export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'challenge' | 'project' | 'comment' | 'achievement';
}
