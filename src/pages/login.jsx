import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAuth, useNotify } from "../hooks/redux";
import { authAPI } from "../services/apiService";
import GoogleLoginButton from "../component/GoogleLoginButton";
import { getFcmToken, listenFcmMessage } from "../utils/firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const notify = useNotify();
  const { loading, error, isAuthenticated } = useAuth();

  // Get the redirect path from location state
  const from = location.state?.from?.pathname || "/dashboard";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginResult = await dispatch(authAPI.login({ email, password }));
      // Kiểm tra kết quả trả về từ Redux thunk
      const loginData = loginResult?.payload || loginResult;
      console.log("Login Result:", loginData);
      if (loginData !== null || loginData.code === 200) {
        notify.success("Đăng nhập thành công!");
      }
      // Gửi FCM token nếu có
      const fcmToken = await getFcmToken();
      console.log("FCM Token:", fcmToken);
      if (fcmToken) {
        const fcmResult = await dispatch(authAPI.fcmToken(fcmToken));
        const fcmData = fcmResult?.payload || fcmResult;
        if (fcmData && fcmData.code !== 200) {
          notify.error(
            "Đăng nhập thành công nhưng gửi FCM token thất bại!",
            10000
          );
        }
        localStorage.setItem("fcmToken", fcmToken);
      }
    } catch (error) {
      let errorMessage = "Đăng nhập thất bại. ";
      if (error.response?.status === 401) {
        errorMessage += "Email hoặc mật khẩu không đúng.";
      } else if (error.response?.status === 404) {
        errorMessage += "Tài khoản không tồn tại.";
      } else if (error.response?.status >= 500) {
        errorMessage += "Lỗi server. Vui lòng thử lại sau.";
      } else if (error.message?.includes("Network")) {
        errorMessage += "Không thể kết nối. Kiểm tra mạng của bạn.";
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += "Vui lòng kiểm tra lại thông tin và thử lại.";
      }
      notify.error(errorMessage, 10000);
    }
  };

  const handleGoogleSuccess = async (googleResponse) => {
    try {
      // Lấy idToken từ Google response
      const idToken =
        googleResponse?.credential ||
        googleResponse?.tokenId ||
        googleResponse?.idToken;
      if (!idToken) {
        notify.error("Không lấy được Google ID Token.");
        return;
      }
      console.log("Google ID Token:", idToken);
      // Gọi API đăng nhập Google
      const loginResult = await dispatch(authAPI.googleLogin(idToken));
      const loginData = loginResult?.payload || loginResult;
      if (loginData !== null || loginData.code === 200) {
        notify.success("Đăng nhập Google thành công!");
      }
      // Gửi FCM token nếu có
      const fcmToken = await getFcmToken();
      if (fcmToken) {
        const fcmResult = await dispatch(authAPI.fcmToken(fcmToken));
        const fcmData = fcmResult?.payload || fcmResult;
        if (fcmData && fcmData.code !== 200) {
          notify.error(
            "Đăng nhập Google thành công nhưng gửi FCM token thất bại!",
            10000
          );
        }
        localStorage.setItem("fcmToken", fcmToken);
      }
      // Navigation sẽ được handle bởi useEffect khi isAuthenticated thay đổi
    } catch (error) {
      let errorMessage = "Đăng nhập Google thất bại. ";
      if (error.response?.status === 401) {
        errorMessage += "Tài khoản Google không hợp lệ.";
      } else if (error.response?.status >= 500) {
        errorMessage += "Lỗi server. Vui lòng thử lại sau.";
      } else if (error.message?.includes("Network")) {
        errorMessage += "Không thể kết nối. Kiểm tra mạng của bạn.";
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += "Vui lòng thử lại.";
      }
      notify.error(errorMessage, 10000);
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
          <h2 className="text-3xl font-bold text-gray-800">Đăng nhập</h2>
          <p className="text-gray-600 mt-2">Chào mừng bạn quay trở lại</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-3 text-red-700 bg-red-100 border border-red-300 rounded">
              {error}
            </div>
          )}
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
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="********"
            />
          </div>
          <div>
            <Link
              to="/forgot-password"
              className="text-purple-600 hover:underline text-sm font-semibold ml-65"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
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
          className="rounded"
          onSuccess={handleGoogleSuccess}
          disabled={loading}
        />

        <p className="text-sm text-center text-gray-500">
          Bạn chưa có tài khoản?{" "}
          <Link
            to="/initiate-register"
            className="text-purple-600 hover:underline"
          >
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Login;
