import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../store/slices/notificationSlice';

// Custom hooks for better type safety and convenience
export const useAppDispatch = () => useDispatch();
export const useAppSelector = (selector) => useSelector(selector);

// Auth selectors
export const useAuth = () => {
  return useAppSelector((state) => state.auth);
};

// API selectors
export const useAPI = () => {
  return useAppSelector((state) => state.api);
};

// Notification selectors
export const useNotifications = () => {
  return useAppSelector((state) => state.notification.notifications);
};

// Registration selectors
export const useRegistration = () => {
  return useAppSelector((state) => state.registration);
};

// Notification helper hook
export const useNotify = () => {
  const dispatch = useAppDispatch();
    return {
    success: (message, duration = 4000) => {
      dispatch(addNotification({ type: 'success', message, duration }));
    },
    error: (message, duration = 8000) => {
      dispatch(addNotification({ type: 'error', message, duration }));
    },
    warning: (message, duration = 6000) => {
      dispatch(addNotification({ type: 'warning', message, duration }));
    },
    info: (message, duration = 5000) => {
      dispatch(addNotification({ type: 'info', message, duration }));
    },
  };
};
