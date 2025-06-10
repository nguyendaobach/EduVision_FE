import { useEffect } from 'react';
import { useAppDispatch, useAuth } from '../hooks/redux';
import { authAPI } from '../services/apiService';

const AuthInitializer = ({ children }) => {
  const dispatch = useAppDispatch();
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    // Only verify token if we have one but user is not marked as authenticated
    if (token && !isAuthenticated) {
      dispatch(authAPI.verifyToken());
    }
  }, [token, isAuthenticated, dispatch]);

  return children;
};

export default AuthInitializer;
