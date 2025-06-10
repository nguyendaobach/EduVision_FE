import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Registration flow state
  step: 1, // 1: form input, 2: OTP verification
  email: '',
  fullName: '',
  password: '',
  isLoading: false,
  error: null,
  
  // OTP state
  otpSent: false,
  otpToken: '',
  resendCooldown: 0,
};

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    // Step 1: Save registration data
    setRegistrationData: (state, action) => {
      state.email = action.payload.email;
      state.fullName = action.payload.fullName;
      state.password = action.payload.password;
      state.step = 1;
      state.error = null;
    },
    
    // Step 2: Move to OTP verification
    moveToOTPStep: (state) => {
      state.step = 2;
      state.otpSent = true;
      state.error = null;
    },
    
    // Loading states
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Error handling
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    // OTP actions
    setOTPToken: (state, action) => {
      state.otpToken = action.payload;
    },
    
    // Resend cooldown
    setResendCooldown: (state, action) => {
      state.resendCooldown = action.payload;
    },
    
    decrementCooldown: (state) => {
      if (state.resendCooldown > 0) {
        state.resendCooldown -= 1;
      }
    },
    
    // Reset registration flow
    resetRegistration: (state) => {
      return initialState;
    },
    
    // Go back to step 1
    backToStep1: (state) => {
      state.step = 1;
      state.otpSent = false;
      state.otpToken = '';
      state.error = null;
    },
  },
});

export const {
  setRegistrationData,
  moveToOTPStep,
  setLoading,
  setError,
  setOTPToken,
  setResendCooldown,
  decrementCooldown,
  resetRegistration,
  backToStep1,
} = registrationSlice.actions;

export default registrationSlice.reducer;
