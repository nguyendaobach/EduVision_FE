import { useEffect } from 'react';
import { useAppDispatch, useAuth, useNotify } from '../hooks/redux';
import { authAPI } from '../services/apiService';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const notify = useNotify();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        await dispatch(authAPI.getProfile());
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };

    if (isAuthenticated && !user?.fullName) {
      loadProfile();
    }
  }, [isAuthenticated, user?.fullName, dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(authAPI.logout());
      notify.success('Đăng xuất thành công');
    } catch (error) {
      console.error('Logout failed:', error);
      notify.error('Đăng xuất thất bại');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Vui lòng đăng nhập</h2>
          <p className="text-gray-600">Bạn cần đăng nhập để truy cập trang này.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600">
                Xin chào, {user?.fullName || user?.username || 'Người dùng'}!
              </p>
              {user?.role && (
                <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                  {user.role}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin tài khoản</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Tên đầy đủ</label>
                <p className="text-gray-900">{user?.fullName || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{user?.email || user?.username}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Tên đăng nhập</label>
                <p className="text-gray-900">{user?.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Vai trò</label>
                <span className="inline-block px-2 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded">
                  {user?.role || 'USER'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Khóa học của tôi</h3>
              <p className="text-gray-600 text-sm mb-3">Quản lý các khóa học bạn đã đăng ký</p>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
                Xem khóa học
              </button>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Tạo bài giảng</h3>
              <p className="text-gray-600 text-sm mb-3">Tạo slide bài giảng với AI</p>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                Tạo mới
              </button>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Cài đặt</h3>
              <p className="text-gray-600 text-sm mb-3">Cập nhật thông tin cá nhân</p>
              <button className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
                Cài đặt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
