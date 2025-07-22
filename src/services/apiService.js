import api from "./api";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
} from "../store/slices/authSlice";
import { apiStart, apiSuccess, apiFailure } from "../store/slices/apiSlice";
import { getQuotaStart, getQuotaSuccess, getQuotaFailure } from "../store/slices/quotaSlice";

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
      const response = await api.post("/authentication/google-sessions", {
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
      const response = await api.get("/curriculum/subjects");
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
        `/curriculum/chapters?subject=${subject}&grade=${grade}`
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
      const response = await api.post("/slides", payload);
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
      const response = await api.post("/videos", payload);
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

  // Lấy trạng thái thanh toán hiện tại (GET)
  checkPaymentStatus: (params) => async (dispatch) => {
    // params: { orderCode: string }
    try {
      dispatch(apiStart());
      console.log("Getting payment status for:", params.orderCode);

      // Sử dụng GET với orderCode trong URL path
      const response = await api.get(
        `/orders/payment-status/${params.orderCode}`
      );
      console.log("Payment status response:", response.data);

      if (response.data.code === 200) {
        dispatch(apiSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(
          response.data.message || "Lấy trạng thái thanh toán thất bại"
        );
      }
    } catch (error) {
      console.error("Payment status check error:", error);
      const errorMessage =
        error.response?.data?.Message ||
        error.response?.data?.message ||
        error.message ||
        "Không thể lấy trạng thái thanh toán";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  // Kích hoạt kiểm tra payment hết hạn (POST)
  checkExpiredPayments: () => async (dispatch) => {
    try {
      dispatch(apiStart());
      console.log("Triggering expired payments check");

      const response = await api.post("/orders/check-expired-payments");
      console.log("Expired payments check response:", response.data);

      if (response.data.code === 200) {
        dispatch(apiSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(
          response.data.message || "Kiểm tra payment hết hạn thất bại"
        );
      }
    } catch (error) {
      console.error("Check expired payments error:", error);
      const errorMessage =
        error.response?.data?.Message ||
        error.response?.data?.message ||
        error.message ||
        "Không thể kiểm tra payment hết hạn";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  // Lấy lịch sử thanh toán (GET)
  paymentHistory: (userId) => async (dispatch) => {
    try {
      dispatch(apiStart());
      console.log("Calling payment history API for userId:", userId);
      const response = await api.get("/payments/history", {
        params: { userId },
      });
      console.log("Payment history API response:", response.data);

      if (response.data.code === 200) {
        dispatch(apiSuccess(response.data));
        return response.data;
      } else {
        throw new Error(
          response.data.message || "Lấy lịch sử thanh toán thất bại"
        );
      }
    } catch (error) {
      console.error("Payment history API error:", error);
      const errorMessage =
        error.response?.data?.Message ||
        error.response?.data?.message ||
        error.message ||
        "Không thể tải lịch sử thanh toán";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  // Xử lý callback thanh toán (GET)
  handlePaymentCallback: (params) => async (dispatch) => {
    // params: { orderCode: string, status: string, etc. }
    try {
      dispatch(apiStart());
      const response = await api.get("/orders/payment-callback", { params });
      dispatch(apiSuccess(response.data.result));
      return response.data.result;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể xử lý callback thanh toán";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  createPaymentLink: (payload) => async (dispatch) => {
    // payload: { userId: number, amount: number, returnUrl: string, cancelUrl: string }
    try {
      dispatch(apiStart());
      console.log(
        "🆕 CREATE PAYMENT: Creating NEW payment with payload:",
        payload
      );
      console.log("🆕 This WILL create a new payment in database");

      const response = await api.post("/orders/payment-links", payload);
      console.log(
        "✅ CREATE PAYMENT: New payment created successfully:",
        response.data
      );

      dispatch(apiSuccess(response.data.result));
      return response.data.result;
    } catch (error) {
      console.error("❌ CREATE PAYMENT: Failed to create new payment:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể tạo link thanh toán";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  // Lấy lại checkout URL của payment cũ (POST) - KHÔNG tạo payment mới
  retryPayment: (orderCode) => async (dispatch) => {
    try {
      dispatch(apiStart());
      console.log(
        "⚠️ RETRY PAYMENT: Getting existing checkout URL for orderCode:",
        orderCode
      );
      console.log(
        "⚠️ This should NOT create a new payment, only return existing checkout URL"
      );

      // Validate orderCode
      if (!orderCode || orderCode.toString().trim() === "") {
        throw new Error("OrderCode không hợp lệ");
      }

      // API này chỉ lấy lại checkout URL của payment đã tồn tại
      // KHÔNG được tạo payment mới trong database
      console.log(
        "🔄 Using POST method for retry API: /orders/" + orderCode + "/retry"
      );

      const requestBody = {
        returnUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/dashboard?cancelled=true`,
      };

      console.log("🔄 Request body:", requestBody);
      console.log("🔄 Full URL:", `/orders/${orderCode}/retry`);

      const response = await api.post(
        `/orders/${orderCode}/retry`,
        requestBody
      );
      console.log("✅ RETRY PAYMENT: Checkout URL response:", response.data);

      if (response.data.code === 200) {
        console.log("✅ RETRY PAYMENT: Successfully got existing checkout URL");
        dispatch(apiSuccess(response.data.result));
        return response.data.result;
      } else {
        throw new Error(
          response.data.message || "Không thể lấy lại link thanh toán"
        );
      }
    } catch (error) {
      console.error("❌ RETRY PAYMENT: Get checkout URL error:", error);
      console.error(
        "❌ RETRY PAYMENT: Error response data:",
        error.response?.data
      );
      console.error("❌ RETRY PAYMENT: Error status:", error.response?.status);
      console.error("❌ RETRY PAYMENT: Error config:", error.config);

      // Log chi tiết response để debug
      if (error.response?.data) {
        console.error(
          "❌ RETRY PAYMENT: Detailed error response:",
          JSON.stringify(error.response.data, null, 2)
        );
      }

      const errorMessage =
        error.response?.data?.Message ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.title ||
        error.message ||
        "Không thể lấy lại link thanh toán";

      // Handle specific error cases
      if (
        error.response?.data?.message ===
        "Payment is still pending and not expired yet"
      ) {
        throw new Error(
          "Thanh toán vẫn còn hiệu lực. Vui lòng chờ hết hạn để retry."
        );
      }

      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  // GET /api/notifications?page=1&pageSize=10
  getNotifications:
    ({ page = 1, pageSize = 10 } = {}) =>
    async (dispatch) => {
      try {
        dispatch(apiStart());
        const response = await api.get("/notifications", {
          params: { page, pageSize },
        });
        dispatch(apiSuccess(response.data));
        return response.data;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Không thể lấy lịch sử thông báo";
        dispatch(apiFailure(errorMessage));
        throw error;
      }
    },

  deleteNotification: (notificationId) => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.delete(`/notifications/${notificationId}`);
      dispatch(apiSuccess(response.data));
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể xóa thông báo";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  // GET /api/users/me
  getCurrentUser: () => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.get("/users/me");
      dispatch(apiSuccess(response.data));
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể lấy thông tin người dùng";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  // PUT /api/users/me
  updateCurrentUser: (payload) => async (dispatch) => {
    try {
      dispatch(apiStart());
      console.log("Updating current user with payload:", payload);
      const response = await api.put("/users/me", payload);
      dispatch(apiSuccess(response.data));
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể cập nhật thông tin người dùng";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  // GET /api/slides
  getUserSlides:
    ({ page = 1, pageSize = 10, status = "" } = {}) =>
    async (dispatch) => {
      try {
        dispatch(apiStart());
        const response = await api.get("/slides", {
          params: { page, pageSize, status },
        });
        dispatch(apiSuccess(response.data));
        return response.data;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Không thể lấy danh sách slide";
        dispatch(apiFailure(errorMessage));
        throw error;
      }
    },

  // GET /api/videos
  getUserVideos:
    ({ page = 1, pageSize = 10, status = "" } = {}) =>
    async (dispatch) => {
      try {
        dispatch(apiStart());
        const response = await api.get("/videos", {
          params: { page, pageSize, status },
        });
        dispatch(apiSuccess(response.data));
        return response.data;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Không thể lấy danh sách video";
        dispatch(apiFailure(errorMessage));
        throw error;
      }
    },

  // POST /api/images/image - Upload an image and save metadata
  uploadImage: (formData) => async (dispatch) => {
    try {
      dispatch(apiStart());
      // formData là FormData object chứa file và các trường metadata
      const response = await api.post("/images/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(apiSuccess(response.data));
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể upload ảnh";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  // GET /api/images/image - Get images with filter (category, grade, chapter, pageSize)
  getImages:
    ({ category, grade, chapter, pageSize = 20 } = {}) =>
    async (dispatch) => {
      try {
        dispatch(apiStart());
        const response = await api.get("/images/images", {
          params: { category, grade, chapter, pageSize },
        });
        dispatch(apiSuccess(response.data));
        return response.data;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Không thể lấy danh sách ảnh";
        dispatch(apiFailure(errorMessage));
        throw error;
      }
    },
  getQuotas: () => async (dispatch) => {
    try {
      dispatch(getQuotaStart());
      const response = await api.get("/quotas/summary");
      dispatch(getQuotaSuccess(response.data));
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể lấy Quotas";
      dispatch(getQuotaFailure(errorMessage));
      throw error;
    }
  },
};

export const adminAPI = {
  getUsers:
    ({ page = 1, pageSize = 10, search = "", role = "" } = {}) =>
    async (dispatch) => {
      try {
        dispatch(apiStart());
        const response = await api.get("/admin/users", {
          params: { page, pageSize, search, role },
        });
        console.log("Fetched users:", response.data);
        dispatch(apiSuccess(response.data));
        return response.data.result; // Trả về result thay vì toàn bộ data
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Không thể lấy danh sách người dùng";
        dispatch(apiFailure(errorMessage));
        throw error;
      }
    },

  UpdateUser: (userId, payload) => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.put(`/admin/users/${userId}`, payload);
      dispatch(apiSuccess(response.data));
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể cập nhật người dùng";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  DeleteUser: (userId) => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.delete(`/admin/users/${userId}`);
      dispatch(apiSuccess(response.data));
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể xóa người dùng";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  ReactivateUser: (userId) => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.post(`/admin/users/${userId}/reactivate`);
      dispatch(apiSuccess(response.data));
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể kích hoạt lại người dùng";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  DashboardUser: () => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.get("/admin/dashboard/users");
      dispatch(apiSuccess(response.data));
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể lấy được thông tin";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },

  DashboardContent: () => async (dispatch) => {
    try {
      dispatch(apiStart());
      const response = await api.get("/admin/dashboard/content-generation");
      dispatch(apiSuccess(response.data));
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể lấy được thông tin";
      dispatch(apiFailure(errorMessage));
      throw error;
    }
  },
};
