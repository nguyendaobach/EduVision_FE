import api from "./api";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
} from "../store/slices/authSlice";
import { apiStart, apiSuccess, apiFailure } from "../store/slices/apiSlice";

// Auth API calls
export const authAPI = {
  // Login
  login: (credentials) => async (dispatch) => {
    try {
      dispatch(loginStart());
      const response = await api.post("/authentication/login", {
        username: credentials.email,
        password: credentials.password,
      });

      if (response.data.code === 200) {
        dispatch(loginSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  },

  // Google Login
  googleLogin: (idToken) => async (dispatch) => {
    try {
      dispatch(loginStart());
      const response = await api.post("/authentication/google-session", {
        idToken: idToken,
      });

      if (response.data.code === 200) {
        dispatch(loginSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(response.data.message || "Google login failed");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Google login failed";
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  },

  // Complete registration
  completeRegistration: (registrationData) => async (dispatch) => {
    try {
      dispatch(loginStart());
      const response = await api.post(
        "/authentication/registrations/complete",
        {
          email: registrationData.email,
          otpToken: registrationData.otpToken,
          password: registrationData.password,
          fullName: registrationData.fullName,
        }
      );

      if (response.data.code === 200) {
        dispatch(loginSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(
          response.data.message || "Registration completion failed"
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Registration completion failed";
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  },

  // Initiate registration
  initiateRegistration: (email) => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.post("/authentication/registrations", {
        email: email,
      });

      if (response.data.code === 200) {
        dispatch(apiSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(
          response.data.message || "Registration initiation failed"
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Registration initiation failed";
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
      const response = await api.get("/Auth/profile");

      if (response.data.code === 200) {
        dispatch(apiSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(response.data.message || "Failed to fetch profile");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch profile";
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
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logoutAction());
      return false;
    }

    try {
      // Try to get profile to verify token
      const response = await api.get("/Auth/profile");
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

  // Resend OTP
  resendOTP: (email) => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.post("/Auth/resend-otp", {
        email: email,
      });

      if (response.data.code === 200) {
        dispatch(apiSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(response.data.message || "Resend OTP failed");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Resend OTP failed";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },
  // forgot password
  forgotPassword: (email) => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.post("/authentication/forgot-password", {
        email: email,
      });

      if (response.data.code === 200) {
        dispatch(apiSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(response.data.message || "Forgot password failed");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Forgot password failed";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  resetPassword: (resetData) => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.post(
        "/authentication/reset-password",
        resetData
      );

      if (response.data.code === 200) {
        dispatch(apiSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(response.data.message || "Reset password failed");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Reset password failed";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  fcmToken: (fcmToken) => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.post("/authentication/fcm-token", {
        fcmToken,
      });
      if (response.data.code === 200) {
        dispatch(apiSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(response.data.message || "FCM token update failed");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "FCM token update failed";
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
      const response = await api.get("/courses");
      dispatch(apiSuccess(response.data));
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch courses";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  // Example: Create course
  createCourse: (courseData) => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.post("/courses", courseData);
      dispatch(apiSuccess(response.data));
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create course";
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
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update course";
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
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete course";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  // Lấy danh sách môn học
  getSubjects: () => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.get("/Education/subjects");
      if (response.data.code === 200) {
        dispatch(apiSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(
          response.data.message || "Không thể tải danh sách môn học"
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể tải danh sách môn học";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  // Lấy danh sách chương/bài học
  getChapters: (subject, grade) => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.get(
        `/Education/chapters?subject=${subject}&grade=${grade}`
      );
      if (response.data.code === 200) {
        dispatch(apiSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(
          response.data.message || "Không thể tải danh sách bài học"
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể tải danh sách bài học";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  // Tạo slide cho bài học
  createSlides: (payload) => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.post("/education/slides", payload);
      if (response.data.code === 200) {
        dispatch(apiSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(response.data.message || "Tạo slide thất bại");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Tạo slide thất bại";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  // Tạo video bài giảng
  createVideo: (payload) => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.post("/education/videos", payload);
      if (response.data.code === 200) {
        dispatch(apiSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(response.data.message || "Tạo video thất bại");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Tạo video thất bại";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  // Kiểm tra quota còn lại cho user (GET)
  checkQuotaAvailability:
    ({ userId, quotaType }) =>
    async (dispatch) => {
      try {
        dispatch(apiStart());
        const response = await api.get("/quotas/availability", {
          params: { userId, quotaType },
        });
        dispatch(apiSuccess(response.data));
        return response.data;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Không thể kiểm tra quota";
        dispatch(apiFailure(errorMessage));
        throw error;
      }
    },

  // Tiêu hao quota (POST)
  useQuota:
    ({ userId, quotaType }) =>
    async (dispatch) => {
      try {
        dispatch(apiStart());
        const response = await api.post("/quotas/usage", { userId, quotaType });
        dispatch(apiSuccess(response.data));
        return response.data;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Không thể tiêu hao quota";
        dispatch(apiFailure(errorMessage));
        throw error;
      }
    },

  // Lấy lịch sử quota (GET)
  getQuotaHistory: (userId) => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.get("/quotas/history", {
        params: { userId },
      });
      dispatch(apiSuccess(response.data));
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể lấy lịch sử quota";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  // Kiểm tra trạng thái thanh toán (GET)
  checkPaymentStatus: (params) => async (dispatch) => {
    // params: { orderCode: string }
    try {
      dispatch(apiStart());
      const response = await api.get("/payments/status", { params });
      dispatch(apiSuccess(response.data.result));
      return response.data.result;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể kiểm tra trạng thái thanh toán";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  // Lấy lịch sử thanh toán (GET)
  paymentHistory: (userId) => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.get("/payments/history", {
        params: { userId },
      });
      dispatch(apiSuccess(response.data));
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể kiểm tra trạng thái thanh toán";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  // Tạo link thanh toán quota (POST)
  createPaymentLink: (payload) => async (dispatch) => {
    // payload: { userId: number, amount: number, returnUrl: string, cancelUrl: string }
    try {
      dispatch(apiStart());
      const response = await api.post("/orders/payment-links", payload);
      dispatch(apiSuccess(response.data.result));
      return response.data.result;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể tạo link thanh toán";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },
};
