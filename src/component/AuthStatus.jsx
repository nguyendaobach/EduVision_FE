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
        </div>
        <div className="flex items-center space-x-2">
          <Link to="/dashboard" className="!no-underline">
            <div className="h-9.5 hidden md:inline-flex items-center px-3 py-1.5 text-sm font-medium text-purple-600 border border-purple-600 rounded hover:bg-purple-50 transition-colors">
              Dashboard
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="hidden w-100 md:inline-flex items-center px-3 py-1.5 text-[10px] font-medium text-purple-600 border border-purple-600 rounded hover:bg-purple-50 transition-colors"
          >
            Đăng xuất
          </button>
        </div>
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
      <Link to="/initiate-register">
        <div className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md">
          Đăng ký
        </div>
      </Link>
    </div>
  );
};

export default AuthStatus;
