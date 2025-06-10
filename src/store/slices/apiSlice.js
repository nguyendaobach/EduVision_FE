import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
  data: null,
};

const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    apiStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    apiSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    apiFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearApiData: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  apiStart,
  apiSuccess,
  apiFailure,
  clearApiData,
} = apiSlice.actions;

export default apiSlice.reducer;
