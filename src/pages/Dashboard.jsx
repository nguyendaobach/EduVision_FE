import { useEffect, useState } from "react";
import { useAppDispatch, useAuth, useNotify } from "../hooks/redux";
import { authAPI, generalAPI } from "../services/apiService";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const notify = useNotify();
  const { user, isAuthenticated } = useAuth();
  const [amount, setAmount] = useState(10000);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingPayment, setLoadingPayment] = useState(false);

  // Lấy lịch sử nạp tiền chỉ 1 lần khi vào dashboard
  useEffect(() => {
    if (!user?.userId) return;
    let cancelled = false;
    const fetchPaymentHistory = async () => {
      setLoadingPayment(true);
      try {
        const res = await dispatch(generalAPI.paymentHistory(user.userId));
        console.log("Payment history response:", res);
        let historyArr = [];
        if (Array.isArray(res?.result?.payments)) {
          historyArr = res.result.payments;
        } else if (Array.isArray(res?.result)) {
          historyArr = res.result;
        } else if (Array.isArray(res?.result?.data)) {
          historyArr = res.result.data;
        } else if (res?.result && typeof res.result === "object") {
          if (Array.isArray(res.result.history)) {
            historyArr = res.result.history;
          }
        }
        if (!cancelled)
          setPaymentHistory(Array.isArray(historyArr) ? historyArr : []);
      } catch {
        if (!cancelled) notify.error("Không thể tải lịch sử nạp tiền");
      } finally {
        if (!cancelled) setLoadingPayment(false);
      }
    };
    fetchPaymentHistory();
    return () => {
      cancelled = true;
    };
  }, []); // chỉ chạy 1 lần khi mount

  const handleLogout = async () => {
    try {
      await dispatch(authAPI.logout());
      notify.success("Đăng xuất thành công");
    } catch (error) {
      console.error("Logout failed:", error);
      notify.error("Đăng xuất thất bại");
    }
  };

  // Xử lý nạp tiền
  const handleTopUp = async () => {
    if (!amount || amount < 10000) {
      notify.error("Số tiền tối thiểu là 10.000đ");
      return;
    }
    // Kiểm tra userId
    if (!user?.userId) {
      notify.error(
        "Không tìm thấy userId hợp lệ. Vui lòng đăng nhập lại hoặc liên hệ hỗ trợ."
      );
      return;
    }
    try {
      const returnUrl = "http://localhost:5500";
      const res = await dispatch(
        generalAPI.createPaymentLink({
          userId: Number(user.userId),
          amount: Number(amount),
          returnUrl,
          cancelUrl: "",
        })
      );
      if (res?.checkoutUrl) {
        window.location.assign(res.checkoutUrl);
      } else if (res?.paymentUrl) {
        window.open(res.paymentUrl, "_blank");
      } else {
        notify.error("Không tạo được link thanh toán");
      }
    } catch {
      notify.error("Nạp tiền thất bại");
    }
  };

  // Khi redirect về dashboard, nếu có orderCode thì check trạng thái thanh toán
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderCode = params.get("orderCode");
    if (orderCode) {
      // Gọi API checkPaymentStatus
      (async () => {
        try {
          const result = await dispatch(
            generalAPI.checkPaymentStatus({ orderCode })
          );
          const status = result?.payload?.status || result?.status;
          if (status === "SUCCESS") {
            notify.success("Nạp tiền thành công!");
          } else {
            notify.error("Thanh toán chưa thành công hoặc bị huỷ.");
          }
        } catch {
          notify.error("Không kiểm tra được trạng thái thanh toán.");
        } finally {
          // Xoá orderCode khỏi URL để không hiện lại khi F5
          params.delete("orderCode");
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }
      })();
    }
  }, [dispatch, notify]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Vui lòng đăng nhập
          </h2>
          <p className="text-gray-600">
            Bạn cần đăng nhập để truy cập trang này.
          </p>
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
                Xin chào, {user?.fullName || user?.username || "Người dùng"}!
              </p>
              {user?.role && (
                <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                  {user.role}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Thông tin tài khoản
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Tên đầy đủ
                </label>
                <p className="text-gray-900">
                  {user?.fullName || "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="text-gray-900">{user?.email || user?.username}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Tên đăng nhập
                </label>
                <p className="text-gray-900">{user?.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Vai trò
                </label>
                <span className="inline-block px-2 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded">
                  {user?.role || "USER"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Thao tác nhanh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Khóa học của tôi
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Quản lý các khóa học bạn đã đăng ký
              </p>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
                Xem khóa học
              </button>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Tạo bài giảng
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Tạo slide bài giảng với AI
              </p>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                Tạo mới
              </button>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Cài đặt
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Cập nhật thông tin cá nhân
              </p>
              <button className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
                Cài đặt
              </button>
            </div>
          </div>
        </div>

        {/* Nạp tiền */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Nạp tiền vào tài khoản
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="number"
              min={10000}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 w-40 text-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Nhập số tiền (VNĐ)"
            />
            <button
              onClick={handleTopUp}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-lg font-semibold"
            >
              Nạp tiền
            </button>
          </div>
        </div>

        {/* Lịch sử nạp tiền */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Lịch sử nạp tiền
          </h2>
          {loadingPayment ? (
            <div className="text-gray-500">Đang tải...</div>
          ) : paymentHistory.length === 0 ? (
            <div className="text-gray-500">Chưa có giao dịch nạp tiền nào.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Mã giao dịch
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Số tiền
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Thời gian
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentHistory.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {item.orderCode || item.id}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {item.amount?.toLocaleString() || "-"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString()
                          : "-"}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            item.status === "SUCCESS"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.status || "Đang xử lý"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
