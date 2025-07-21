import { useAuth, useAppDispatch } from "../hooks/redux";
import { authAPI } from "../services/apiService";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBell, FaRegBell } from "react-icons/fa";
import { generalAPI } from "../services/apiService";

const AuthStatus = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const dispatch = useAppDispatch();

  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Fetch notifications
  const fetchNotifications = async (page = 1, pageSize = 10) => {
    setLoadingNotifications(true);
    try {
      const res = await dispatch(generalAPI.getNotifications({ page, pageSize }));
      let arr = [];
      if (Array.isArray(res?.result?.data)) arr = res.result.data;
      else if (Array.isArray(res?.data)) arr = res.data;
      else if (Array.isArray(res)) arr = res;
      setNotifications(arr);
    } catch (e) {
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  };

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
        {/* Bell notification */}
        <div className="relative">
          <button
            className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none"
            onClick={async () => {
              setShowNotifications((s) => !s);
              if (!showNotifications) {
                await fetchNotifications(1, 10);
              }
            }}
          >
            <FaBell className="w-6 h-6 text-yellow-700" />
            {/* Badge số lượng thông báo chưa đọc */}
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center border border-white shadow">
                {notifications.length > 99 ? "99+" : notifications.length}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-in fade-in-50 duration-200">
              <div className="p-4 border-b font-semibold text-gray-700 flex items-center justify-between">
                <span>Thông báo</span>
                {/* Đã bỏ nút Đánh dấu đã đọc */}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {loadingNotifications ? (
                  <div className="p-4 text-gray-500 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500 mx-auto mb-2"></div>
                    Đang tải...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-gray-500 text-center flex flex-col items-center gap-2">
                    <FaRegBell className="w-8 h-8 mb-1 text-gray-300" />
                    Không có thông báo nào.
                  </div>
                ) : (
                  notifications.map((n, idx) => (
                    <div
                      key={n.notificationId || idx}
                      className="p-4 border-b last:border-b-0 text-gray-800 text-sm flex items-start gap-2 hover:bg-gray-50 transition relative"
                    >
                      <span className="mt-1 text-yellow-500">
                        <FaBell />
                      </span>
                      <div className="flex-1">
                        <div>{n.message}</div>
                        {n.createdAt && (
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(n.createdAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                      <button
                        className="ml-2 text-red-500 hover:text-red-700 text-lg font-bold px-2 py-1 rounded focus:outline-none"
                        title="Xóa thông báo"
                        onClick={async () => {
                          try {
                            await dispatch(generalAPI.deleteNotification(n.notificationId));
                            setNotifications((prev) => prev.filter((item) => item.notificationId !== n.notificationId));
                          } catch (e) {
                            // Optionally: show error notification
                          }
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
              {/* Đã bỏ nút Xem tất cả */}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Link to="/dashboard" className="!no-underline">
            <div className="h-9.5 hidden md:inline-flex items-center px-3 py-1.5 text-sm font-medium text-purple-600 border border-purple-600 rounded hover:bg-purple-50 transition-colors">
              Setting
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
