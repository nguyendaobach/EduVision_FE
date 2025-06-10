import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAPI, useNotify, useRegistration } from "../hooks/redux";
import { authAPI } from "../services/apiService";
import { setRegistrationData, moveToOTPStep } from "../store/slices/registrationSlice";
import GoogleLoginButton from "../component/GoogleLoginButton";
import OTPVerification from "../component/OTPVerification";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notify = useNotify();
  const { loading, error } = useAPI();
  const { step } = useRegistration();

  // If step is 2, show OTP verification
  if (step === 2) {
    return <OTPVerification />;
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      notify.error("Mật khẩu xác nhận không khớp");
      return;
    }

    if (password.length < 6) {
      notify.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      // Step 1: Save registration data to Redux
      dispatch(setRegistrationData({
        email,
        fullName: name,
        password
      }));

      // Step 2: Initiate registration (send OTP)
      await dispatch(authAPI.initiateRegistration(email));
      
      // Step 3: Move to OTP verification step
      dispatch(moveToOTPStep());
      notify.success("Mã OTP đã được gửi đến email của bạn!");
      
    } catch (error) {
      console.error("Registration initiation failed:", error);
      
      let errorMessage = "Không thể gửi mã OTP. ";
      if (error.response?.status === 409) {
        errorMessage += "Email này đã được đăng ký.";
      } else if (error.response?.status === 400) {
        errorMessage += "Email không hợp lệ.";
      } else {
        errorMessage += "Vui lòng thử lại sau.";
      }
      
      notify.error(errorMessage, 8000);
    }
  };

  const handleGoogleSuccess = (result) => {
    notify.success("Đăng nhập Google thành công!");
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            Đăng ký tài khoản
          </h2>
          <p className="text-gray-600 mt-2">Tạo tài khoản để bắt đầu học tập</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6 flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-purple-600">Thông tin</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Xác thực OTP</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {error && (
            <div className="p-3 text-red-700 bg-red-100 border border-red-300 rounded">
              {error}
            </div>
          )}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Họ tên
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2  rounded-lg focus:ring-2 border border-gray-300 focus:outline-none focus:ring-purple-400"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none rounded-lg focus:ring-2 focus:ring-purple-400"
              placeholder="********"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none rounded-lg focus:ring-2 focus:ring-purple-400"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">hoặc</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Login */}
        <GoogleLoginButton 
          onSuccess={handleGoogleSuccess}
          disabled={loading}
        />

        <p className="text-sm text-center text-gray-500">
          Bạn đã có tài khoản? <Link to="/login" className="text-purple-600 hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
