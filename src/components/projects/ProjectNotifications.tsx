import { useEffect, useState } from 'react';
import { FiBell, FiHeart, FiMessageCircle, FiUserPlus, FiAward, FiX } from 'react-icons/fi';
import { projectAdvancedApi } from '@/infrastructure/api/projectAdvancedApi';
import type { ProjectNotification } from '@/types/project-advanced';

const iconMap = {
  like: FiHeart,
  comment: FiMessageCircle,
  follow: FiUserPlus,
  milestone: FiAward,
};

export const ProjectNotifications = () => {
  const [notifications, setNotifications] = useState<ProjectNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    projectAdvancedApi
      .getNotifications()
      .then(setNotifications)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleMarkAsRead = async (id: number) => {
    await projectAdvancedApi.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const handleDelete = async (id: number) => {
    await projectAdvancedApi.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllAsRead = async () => {
    await projectAdvancedApi.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  if (loading) return <div className="text-center py-8">Loading notifications...</div>;

  return (
    <div className="project-notifications">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FiBell className="text-2xl text-primary" />
          <h2 className="text-2xl font-bold">Notifications</h2>
        </div>
        {notifications.some((n) => !n.is_read) && (
          <button onClick={handleMarkAllAsRead} className="btn btn-sm btn-secondary">
            Mark All Read
          </button>
        )}
      </div>
      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon = iconMap[notification.type];
          return (
            <div
              key={notification.id}
              className={`glass-card p-4 flex items-start gap-3 ${!notification.is_read ? 'border-l-4 border-primary' : ''}`}
            >
              <Icon className="text-xl text-primary mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold">{notification.title}</h3>
                <p className="text-sm text-muted">{notification.message}</p>
                <span className="text-xs text-muted">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </div>
              <div className="flex gap-2">
                {!notification.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="text-primary hover:text-primary-dark"
                  >
                    Mark Read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="text-danger hover:text-danger-dark"
                >
                  <FiX />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
