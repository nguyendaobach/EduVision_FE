import { createSlice } from "@reduxjs/toolkit";

// Lấy user từ localStorage nếu có
const savedUser = localStorage.getItem("user");

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = {
        userId: action.payload.userId,
        username: action.payload.username,
        fullName: action.payload.fullName,
        email: action.payload.email,
        role: action.payload.role,
      };
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.tokenExpiresAt = action.payload.tokenExpiresAt;
      state.refreshTokenExpiresAt = action.payload.refreshTokenExpiresAt;
      state.error = null;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      localStorage.setItem("tokenExpiresAt", action.payload.tokenExpiresAt);
      localStorage.setItem(
        "refreshTokenExpiresAt",
        action.payload.refreshTokenExpiresAt
      );
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } =
  authSlice.actions;

export default authSlice.reducer;
