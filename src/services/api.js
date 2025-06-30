import axios from "axios";
import { store } from "../store/store";
import { logout } from "../store/slices/authSlice";

// Create axios instance
const api = axios.create({
  baseURL: "https://localhost:7258/api",
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Debug: Log all requests
    console.log("API Request:", {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      headers: config.headers,
      data: config.data,
    });

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      message: error.message,
    });

    if (error.response?.status === 401) {
      // Token expired or invalid
      store.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
