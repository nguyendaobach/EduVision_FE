import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import apiSlice from './slices/apiSlice';
import notificationSlice from './slices/notificationSlice';
import registrationSlice from './slices/registrationSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    api: apiSlice,
    notification: notificationSlice,
    registration: registrationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
