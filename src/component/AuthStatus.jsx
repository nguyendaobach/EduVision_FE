import { useAuth, useAppDispatch } from "../hooks/redux";
import { authAPI } from "../services/apiService";
import { Link } from "react-router-dom";

const AuthStatus = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(authAPI.logout());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 font-medium text-sm">
              {user?.fullName?.charAt(0)?.toUpperCase() ||
                user?.username?.charAt(0)?.toUpperCase() ||
                "U"}
            </span>
          </div>
          <span className="text-gray-700 font-medium">
            {user?.fullName || user?.username}
          </span>
        </div>
        <Link
          to="/dashboard"
          className="hidden md:inline-flex items-center px-3 py-1.5 text-sm font-medium text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
        >
          Dashboard
        </Link>
        <button
          onClick={handleLogout}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Đăng xuất
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <Link to="/login">
        <div className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md">
          Đăng nhập
        </div>
      </Link>
      <Link to="/register">
        <div className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md">
          Đăng ký
        </div>
      </Link>
    </div>
  );
};

export default AuthStatus;
