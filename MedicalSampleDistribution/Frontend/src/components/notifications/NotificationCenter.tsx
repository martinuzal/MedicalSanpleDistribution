import { useState } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll, removeNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'notifications';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `Hace ${days}d`;
    if (hours > 0) return `Hace ${hours}h`;
    if (minutes > 0) return `Hace ${minutes}m`;
    return 'Ahora';
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  return (
    <>
      <div className="notification-bell" onClick={() => setIsOpen(!isOpen)}>
        <span className="material-icons">notifications</span>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </div>

      {isOpen && (
        <>
          <div className="notification-overlay" onClick={() => setIsOpen(false)} />
          <div className="notification-panel">
            <div className="notification-header">
              <h3>Notificaciones</h3>
              <div className="notification-actions">
                {notifications.length > 0 && (
                  <>
                    <button onClick={markAllAsRead} title="Marcar todas como leídas">
                      <span className="material-icons">done_all</span>
                    </button>
                    <button onClick={clearAll} title="Limpiar todas">
                      <span className="material-icons">delete_sweep</span>
                    </button>
                  </>
                )}
                <button onClick={() => setIsOpen(false)} title="Cerrar">
                  <span className="material-icons">close</span>
                </button>
              </div>
            </div>

            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="notification-empty">
                  <span className="material-icons">notifications_none</span>
                  <p>No hay notificaciones</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${notification.type} ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="notification-icon">
                      <span className="material-icons">{getIcon(notification.type)}</span>
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-meta">
                        <span className="notification-category">{notification.category}</span>
                        <span className="notification-time">{formatTime(notification.timestamp)}</span>
                      </div>
                    </div>
                    <button
                      className="notification-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      title="Eliminar"
                    >
                      <span className="material-icons">close</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NotificationCenter;
