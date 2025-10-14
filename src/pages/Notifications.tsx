import { useEffect, useState } from 'react';
import { FiBell, FiCheck, FiTrash2, FiSettings } from 'react-icons/fi';
import Header from '../components/Navbar';
import './Notifications.css';
import type { Notification } from '@/types/notifications'; // Ensure this matches the source of the Notification type used in applicationService

import { applicationService } from '@/application';

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = (await applicationService.getUserNotifications()) as Notification[];
        console.log('Fetched notifications from DB:', data);
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notifications-page">
      <Header />
      <div className="notifications-background">
        <div className="notifications-gradient-orb notifications-orb-1"></div>
        <div className="notifications-gradient-orb notifications-orb-2"></div>
        <div className="notifications-gradient-orb notifications-orb-3"></div>
      </div>

      <section className="notifications-hero">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-8">
              <div className="notifications-container">
                <div className="notifications-header">
                  <div className="notifications-title-wrapper">
                    <FiBell size={32} className="notifications-icon" />
                    <div>
                      <h1 className="notifications-title">Notifications</h1>
                      <p className="notifications-subtitle">
                        {unreadCount > 0
                          ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                          : 'All caught up!'}
                      </p>
                    </div>
                  </div>
                  <div className="notifications-actions">
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="btn-mark-all">
                        <FiCheck size={18} />
                        Mark all as read
                      </button>
                    )}
                    <button className="btn-settings">
                      <FiSettings size={20} />
                    </button>
                  </div>
                </div>

                <div className="notifications-list">
                  {notifications.length === 0 ? (
                    <div className="notifications-empty">
                      <FiBell size={64} />
                      <h3>No notifications</h3>
                      <p>You're all caught up!</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      >
                        <div
                          className="notification-content"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className={`notification-type-badge ${notification.type}`}>
                            <FiBell size={16} />
                          </div>
                          <div className="notification-text">
                            <h4>{notification.title}</h4>
                            <p>{notification.message}</p>
                            <span className="notification-time">{notification.time}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="btn-delete-notification"
                          title="Delete notification"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Notifications;
