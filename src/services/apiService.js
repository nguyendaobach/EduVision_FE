import api from './api';
import { 
  loginStart, 
  loginSuccess, 
  loginFailure,
  logout as logoutAction
} from '../store/slices/authSlice';
import {
  apiStart,
  apiSuccess,
  apiFailure
} from '../store/slices/apiSlice';

// Auth API calls
export const authAPI = {  // Login
  login: (credentials) => async (dispatch) => {
    try {
      dispatch(loginStart());
      const response = await api.post('/Auth/login', {
        username: credentials.email,
        password: credentials.password
      });
      
      if (response.data.code === 200) {
        dispatch(loginSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  },

  // Google Login
  googleLogin: (idToken) => async (dispatch) => {
    try {
      dispatch(loginStart());
      const response = await api.post('/Auth/google-login', {
        idToken: idToken
      });
      
      if (response.data.code === 200) {
        dispatch(loginSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(response.data.message || 'Google login failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Google login failed';
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  },
  // Register
  register: (userData) => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.post('/Auth/register', {
        username: userData.email,
        email: userData.email,
        password: userData.password,
        fullName: userData.name
      });
      
      if (response.data.code === 200) {
        dispatch(apiSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },
  // Logout
  logout: () => async (dispatch) => {
    try {
      // Just clear local state since backend might not have logout endpoint
      dispatch(logoutAction());
    } catch (error) {
      // Even if logout fails on server, clear local state
      dispatch(logoutAction());
    }
  },
  // Get user profile
  getProfile: () => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.get('/Auth/profile');
      
      if (response.data.code === 200) {
        dispatch(apiSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(response.data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch profile';
      dispatch(apiFailure(errorMessage));
      // If profile fetch fails, likely token is invalid, so logout
      if (error.response?.status === 401) {
        dispatch(logoutAction());
      }
      throw error;
    }
  },

  // Verify token validity
  verifyToken: () => async (dispatch) => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logoutAction());
      return false;
    }

    try {
      // Try to get profile to verify token
      const response = await api.get('/Auth/profile');
      if (response.data.code === 200) {
        dispatch(loginSuccess(response.data.result));
        return true;
      } else {
        dispatch(logoutAction());
        return false;
      }
    } catch (error) {
      dispatch(logoutAction());
      return false;
    }
  },

  // Two-step registration
  initiateRegistration: (email) => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.post('/Auth/register', {
        email: email
      });
      
      if (response.data.code === 200) {
        dispatch(apiSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(response.data.message || 'Registration initiation failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration initiation failed';
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  completeRegistration: (registrationData) => async (dispatch) => {
    try {
      dispatch(loginStart());
      const response = await api.post('/Auth/complete-registration', {
        email: registrationData.email,
        otpToken: registrationData.otpToken,
        password: registrationData.password,
        fullName: registrationData.fullName
      });
      
      if (response.data.code === 200) {
        dispatch(loginSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(response.data.message || 'Registration completion failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration completion failed';
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  },

  // Resend OTP
  resendOTP: (email) => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.post('/Auth/resend-otp', {
        email: email
      });
      
      if (response.data.code === 200) {
        dispatch(apiSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(response.data.message || 'Resend OTP failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Resend OTP failed';
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },
};

// General API calls
export const generalAPI = {
  // Example: Get courses
  getCourses: () => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.get('/courses');
      dispatch(apiSuccess(response.data));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch courses';
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  // Example: Create course
  createCourse: (courseData) => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.post('/courses', courseData);
      dispatch(apiSuccess(response.data));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create course';
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  // Example: Update course
  updateCourse: (id, courseData) => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.put(`/courses/${id}`, courseData);
      dispatch(apiSuccess(response.data));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update course';
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  // Example: Delete course
  deleteCourse: (id) => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.delete(`/courses/${id}`);
      dispatch(apiSuccess(response.data));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete course';
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },
};
