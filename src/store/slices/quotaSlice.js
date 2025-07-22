import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
  data: null,
};

const quotaSlice = createSlice({
  name: 'quota',
  initialState,
  reducers: {
    getQuotaStart: (state) => {
      state.loading = true;
      state.error = null;
      state.data = null; // Clear previous data when starting a new fetch
    },
    getQuotaSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    getQuotaFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.data = null;
    },
    clearQuotaData: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  getQuotaStart,
  getQuotaSuccess,
  getQuotaFailure,
  clearQuotaData,
} = quotaSlice.actions;

export default quotaSlice.reducer; 