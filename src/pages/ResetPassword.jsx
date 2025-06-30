import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useNotify } from "../hooks/redux";
import { authAPI } from "../services/apiService";

const ResetPassword = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otpToken, setOtpToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notify = useNotify();

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      notify.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    try {
      await dispatch(
        authAPI.resetPassword({
          email,
          otpToken,
          newPassword,
        })
      );
      notify.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (error) {
      let errorMessage = "Đặt lại mật khẩu thất bại. ";
      if (error.response?.status === 400) {
        errorMessage += "OTP không hợp lệ hoặc đã hết hạn.";
      } else {
        errorMessage += "Vui lòng thử lại sau.";
      }
      notify.error(errorMessage, 8000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Đặt lại mật khẩu</h2>
          <p className="text-gray-600 mt-2">
            Nhập email, mã OTP và mật khẩu mới để đặt lại mật khẩu
          </p>
        </div>
        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Mã OTP
            </label>
            <input
              type="text"
              value={otpToken}
              onChange={(e) => setOtpToken(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Nhập mã OTP"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Đặt lại mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
