import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { removeNotification } from '../store/slices/notificationSlice';

const NotificationCenter = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notification.notifications);
  const timersRef = useRef({});

  useEffect(() => {
    notifications.forEach((notification) => {
      // Clear existing timer if any
      if (timersRef.current[notification.id]) {
        clearTimeout(timersRef.current[notification.id]);
      }

      if (notification.duration > 0) {
        timersRef.current[notification.id] = setTimeout(() => {
          dispatch(removeNotification(notification.id));
          delete timersRef.current[notification.id];
        }, notification.duration);
      }
    });

    // Cleanup timers for removed notifications
    const currentIds = notifications.map(n => n.id);
    Object.keys(timersRef.current).forEach(id => {
      if (!currentIds.includes(id)) {
        clearTimeout(timersRef.current[id]);
        delete timersRef.current[id];
      }
    });

    // Cleanup on unmount
    return () => {
      Object.values(timersRef.current).forEach(timer => clearTimeout(timer));
      timersRef.current = {};
    };
  }, [notifications, dispatch]);
  const handleClose = (id) => {
    // Clear timer when manually closing
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    dispatch(removeNotification(id));
  };

  const handleMouseEnter = (id) => {
    // Pause timer on hover
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  };

  const handleMouseLeave = (notification) => {
    // Resume timer on mouse leave
    if (notification.duration > 0) {
      timersRef.current[notification.id] = setTimeout(() => {
        dispatch(removeNotification(notification.id));
        delete timersRef.current[notification.id];
      }, 2000); // Give 2 more seconds after mouse leave
    }
  };  const getNotificationStyles = (type) => {
    const baseStyles = "relative flex items-center justify-between p-4 rounded-lg shadow-lg backdrop-blur-sm border min-w-[300px] max-w-[500px] transition-all duration-300 ease-in-out overflow-hidden";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50/90 border-l-4 border-green-500 text-green-700`;
      case 'error':
        return `${baseStyles} bg-red-50/90 border-l-4 border-red-500 text-red-700`;
      case 'warning':
        return `${baseStyles} bg-yellow-50/90 border-l-4 border-yellow-500 text-yellow-700`;
      default:
        return `${baseStyles} bg-blue-50/90 border-l-4 border-blue-500 text-blue-700`;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  if (notifications.length === 0) {
    return null;
  }  return (
    <div className="fixed top-20 right-4 z-[70] space-y-2">      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getNotificationStyles(notification.type)} animate-slide-in-right`}
          onMouseEnter={() => handleMouseEnter(notification.id)}
          onMouseLeave={() => handleMouseLeave(notification)}
        >
          <div className="flex items-center relative z-10">
            <span className="text-xl mr-3">{getIcon(notification.type)}</span>
            <span className="font-medium">{notification.message}</span>
          </div>
          <button
            onClick={() => handleClose(notification.id)}
            className="ml-4 text-xl hover:opacity-75 focus:outline-none transition-opacity relative z-10"
          >
            ×
          </button>
          
          {/* Progress bar */}
          {notification.duration > 0 && (
            <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 w-full">
              <div 
                className="h-full bg-current opacity-40 transition-all ease-linear"
                style={{
                  width: '100%',
                  animation: `shrink ${notification.duration}ms linear forwards`
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter;
