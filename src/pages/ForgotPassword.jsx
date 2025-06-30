import React, { useState } from "react";
import { useAppDispatch, useNotify } from "../hooks/redux";
import { authAPI } from "../services/apiService";
import EmailInputForm from "../component/EmailInputForm";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notify = useNotify();

  const handleEmailSubmit = async (email) => {
    setLoading(true);
    setApiError("");
    try {
      await dispatch(authAPI.forgotPassword(email));
      notify.success(
        "Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi!"
      );
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      let errorMessage = "Không thể gửi yêu cầu. ";
      if (error.response?.status === 404) {
        errorMessage += "Email này chưa được đăng ký.";
      } else if (error.response?.status === 400) {
        errorMessage += "Email không hợp lệ.";
      } else {
        errorMessage += "Vui lòng thử lại sau.";
      }
      setApiError(errorMessage);
      notify.error(errorMessage, 8000);
    }
    setLoading(false);
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
          <h2 className="text-3xl font-bold text-gray-800">Quên mật khẩu</h2>
          <p className="text-gray-600 mt-2">
            Nhập email để nhận OTP đặt lại mật khẩu
          </p>
        </div>
        <EmailInputForm
          onSubmit={handleEmailSubmit}
          loading={loading}
          error={apiError}
          buttonText="Gửi yêu cầu"
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
