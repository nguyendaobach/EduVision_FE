import { useState, useEffect } from 'react';
import { useAppDispatch, useRegistration, useNotify } from '../hooks/redux';
import { authAPI } from '../services/apiService';
import { 
  setOTPToken, 
  setResendCooldown, 
  decrementCooldown, 
  backToStep1, 
  resetRegistration 
} from '../store/slices/registrationSlice';
import OTPInput from './OTPInput';

const OTPVerification = () => {
  const dispatch = useAppDispatch();
  const notify = useNotify();
  const { email, fullName, password, resendCooldown, isLoading } = useRegistration();
  const [otpValue, setOtpValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        dispatch(decrementCooldown());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown, dispatch]);

  const handleOTPComplete = async (otp) => {
    setOtpValue(otp);
    dispatch(setOTPToken(otp));
    
    // Auto verify when OTP is complete
    await handleVerifyOTP(otp);
  };

  const handleVerifyOTP = async (otp = otpValue) => {
    if (!otp || otp.length < 6) {
      notify.error('Vui lòng nhập đầy đủ mã OTP');
      return;
    }

    setIsVerifying(true);
    try {
      const registrationData = {
        email,
        fullName,
        password,
        otpToken: otp
      };

      await dispatch(authAPI.completeRegistration(registrationData));
      notify.success('Đăng ký thành công! Chào mừng bạn đến với EduVision!');
      dispatch(resetRegistration());
    } catch (error) {
      console.error('OTP verification failed:', error);
      
      let errorMessage = 'Xác thực OTP thất bại. ';
      if (error.response?.status === 400) {
        errorMessage += 'Mã OTP không đúng hoặc đã hết hạn.';
      } else if (error.response?.status === 429) {
        errorMessage += 'Quá nhiều lần thử. Vui lòng thử lại sau.';
      } else {
        errorMessage += 'Vui lòng thử lại.';
      }
      
      notify.error(errorMessage, 10000);
      setOtpValue('');
    }
    setIsVerifying(false);
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    try {
      await dispatch(authAPI.resendOTP(email));
      notify.success('Mã OTP mới đã được gửi đến email của bạn');
      dispatch(setResendCooldown(60)); // 60 seconds cooldown
      setOtpValue('');
    } catch (error) {
      console.error('Resend OTP failed:', error);
      notify.error('Không thể gửi lại mã OTP. Vui lòng thử lại sau.');
    }
  };

  const handleGoBack = () => {
    dispatch(backToStep1());
    setOtpValue('');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Xác thực OTP
          </h2>
          <p className="text-gray-600">
            Chúng tôi đã gửi mã xác thực đến
          </p>
          <p className="text-purple-600 font-medium">{email}</p>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <OTPInput
            length={6}
            onComplete={handleOTPComplete}
            disabled={isVerifying || isLoading}
            value={otpValue}
          />
        </div>

        {/* Verify Button */}
        <button
          onClick={() => handleVerifyOTP()}
          disabled={isVerifying || isLoading || otpValue.length < 6}
          className="w-full py-3 font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md mb-4"
        >
          {isVerifying ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Đang xác thực...
            </div>
          ) : (
            'Xác thực'
          )}
        </button>

        {/* Resend OTP */}
        <div className="text-center mb-6">
          {resendCooldown > 0 ? (
            <p className="text-sm text-gray-500">
              Gửi lại mã sau <span className="font-medium text-purple-600">{formatTime(resendCooldown)}</span>
            </p>
          ) : (
            <button
              onClick={handleResendOTP}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors"
            >
              Gửi lại mã OTP
            </button>
          )}
        </div>

        {/* Go Back */}
        <div className="text-center">
          <button
            onClick={handleGoBack}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Quay lại thay đổi thông tin
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Hướng dẫn:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Nhập 6 chữ số mã OTP từ email</li>
            <li>• Mã có hiệu lực trong 5 phút</li>
            <li>• Kiểm tra thư mục spam nếu không thấy email</li>
            <li>• Có thể dán mã từ clipboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
