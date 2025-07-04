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
  const [paymentError, setPaymentError] = useState(null);
  const [lastPaymentOrderCode, setLastPaymentOrderCode] = useState(null);

  // Function to fetch payment history
  const fetchPaymentHistory = async () => {
    if (!user?.userId) return;
    setLoadingPayment(true);
    setPaymentError(null);
    try {
      console.log("Fetching payment history for userId:", user.userId);
      const res = await dispatch(generalAPI.paymentHistory(user.userId));
      console.log("Payment history response:", res);
      
      let historyArr = [];
      
      // Check different possible response structures
      if (Array.isArray(res)) {
        // Direct array response
        historyArr = res;
      } else if (res?.result) {
        if (Array.isArray(res.result.payments)) {
          historyArr = res.result.payments;
        } else if (Array.isArray(res.result)) {
          historyArr = res.result;
        } else if (Array.isArray(res.result.data)) {
          historyArr = res.result.data;
        } else if (Array.isArray(res.result.history)) {
          historyArr = res.result.history;
        }
      } else if (res?.data && Array.isArray(res.data)) {
        // Data in data field
        historyArr = res.data;
      }
      
      setPaymentHistory(Array.isArray(historyArr) ? historyArr : []);
      console.log("Payment history set:", historyArr);
      console.log("First payment item structure:", historyArr[0]);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      const errorMsg = error?.response?.data?.Message || error?.message || 'Lỗi không xác định';
      setPaymentError(errorMsg);
      notify.error(`Không thể tải lịch sử nạp tiền: ${errorMsg}`);
      setPaymentHistory([]); // Set empty array on error
    } finally {
      setLoadingPayment(false);
    }
  };

  // Function to check specific payment status
  const checkSpecificPaymentStatus = async (orderCode) => {
    try {
      console.log("Checking status for specific orderCode:", orderCode);
      const result = await dispatch(
        generalAPI.checkPaymentStatus({ orderCode })
      );
      console.log("Status check result:", result);
      
      // Update payment history with new status
      setPaymentHistory(prev => prev.map(payment => 
        (payment.orderCode === orderCode || payment.paymentId === orderCode) 
          ? { ...payment, status: result?.status || result?.payload?.status }
          : payment
      ));
      
      return result;
    } catch (error) {
      console.error("Error checking specific payment status:", error);
      return null;
    }
  };

  // Function to trigger expired payment check
  const triggerExpiredPaymentCheck = async () => {
    try {
      console.log("Dashboard: Triggering expired payment check");
      await dispatch(generalAPI.checkExpiredPayments());
      console.log("Dashboard: Expired payment check completed, refreshing history");
      // Sau khi check expired, refresh payment history
      await fetchPaymentHistory();
    } catch (error) {
      console.error("Dashboard: Error checking expired payments:", error);
    }
  };

  // Lấy lịch sử nạp tiền khi component mount hoặc userId thay đổi
  useEffect(() => {
    if (user?.userId) {
      fetchPaymentHistory();
    }
  }, [user?.userId]); // Reload when user changes

  // Listen cho payment updates từ PaymentSuccess page
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'lastUpdatedPayment') {
        console.log("Dashboard: Detected payment update from PaymentSuccess");
        // Refresh payment history để hiển thị status mới
        fetchPaymentHistory();
      }
    };

    const handlePaymentUpdate = (e) => {
      console.log("Dashboard: Received payment update event");
      fetchPaymentHistory();
    };

    // Listen cho storage events từ PaymentSuccess
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('paymentUpdate', handlePaymentUpdate);

    // Check xem có payment update trong localStorage không
    const lastUpdatedPayment = localStorage.getItem('lastUpdatedPayment');
    if (lastUpdatedPayment) {
      try {
        const payment = JSON.parse(lastUpdatedPayment);
        // Nếu payment được update trong vòng 30 giây thì refresh
        if (Date.now() - payment.timestamp < 30000) {
          console.log("Dashboard: Found recent payment update, refreshing history");
          fetchPaymentHistory();
          localStorage.removeItem('lastUpdatedPayment'); // Clear sau khi xử lý
        }
      } catch (error) {
        console.error("Error parsing lastUpdatedPayment:", error);
      }
    }

    // Check refreshDashboard flag từ PaymentSuccess
    const shouldRefresh = localStorage.getItem('refreshDashboard');
    if (shouldRefresh === 'true') {
      console.log("Dashboard: refreshDashboard flag detected, refreshing history");
      localStorage.removeItem('refreshDashboard');
      if (user?.userId) {
        fetchPaymentHistory();
      }
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('paymentUpdate', handlePaymentUpdate);
    };
  }, []);

  // Listen for focus event to refresh data when user returns from payment
  useEffect(() => {
    const handleFocus = async () => {
      if (user?.userId) {
        console.log("Dashboard: Window focused, checking for expired payments");
        
        // Check for expired payments first
        try {
          await dispatch(generalAPI.checkExpiredPayments());
          console.log("Dashboard: Expired payment check completed");
        } catch (error) {
          console.error("Dashboard: Error checking expired payments:", error);
        }
        
        // Then refresh payment history
        await fetchPaymentHistory();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [user?.userId]);

  // Check status khi có payment mới hoặc khi user quay lại từ payment
  useEffect(() => {
    if (lastPaymentOrderCode) {
      // Delay 2 giây rồi check status của payment vừa tạo
      const timeoutId = setTimeout(() => {
        checkSpecificPaymentStatus(lastPaymentOrderCode);
        setLastPaymentOrderCode(null);
      }, 2000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [lastPaymentOrderCode]);

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
      setLoadingPayment(true);
      const returnUrl = `${window.location.origin}/payment-success`;
      const cancelUrl = `${window.location.origin}/dashboard?cancelled=true`;
      const res = await dispatch(
        generalAPI.createPaymentLink({
          userId: Number(user.userId),
          amount: Number(amount),
          returnUrl,
          cancelUrl,
        })
      );
      if (res?.checkoutUrl) {
        // Lưu orderCode để check status sau khi thanh toán
        const urlParams = new URLSearchParams(res.checkoutUrl.split('?')[1]);
        const orderCode = urlParams.get('orderCode');
        if (orderCode) {
          setLastPaymentOrderCode(orderCode);
        }
        window.location.assign(res.checkoutUrl);
      } else if (res?.paymentUrl) {
        window.open(res.paymentUrl, "_blank");
      } else {
        notify.error("Không tạo được link thanh toán");
      }
    } catch (error) {
      console.error("Payment creation error:", error);
      notify.error("Nạp tiền thất bại: " + (error.message || "Lỗi không xác định"));
    } finally {
      setLoadingPayment(false);
    }
  };

  // Xử lý khi có cancelled parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cancelled = params.get("cancelled");

    if (cancelled === "true") {
      notify.error("Thanh toán đã bị hủy.");
      // Xoá params khỏi URL
      params.delete("cancelled");
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }
  }, [notify]);

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
              disabled={loadingPayment}
              className={`px-6 py-2 text-white rounded transition text-lg font-semibold flex items-center gap-2 ${
                loadingPayment 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loadingPayment ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Đang xử lý...
                </>
              ) : (
                'Nạp tiền'
              )}
            </button>
          </div>
        </div>

        {/* Lịch sử nạp tiền */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Lịch sử nạp tiền
              </h2>
              <div className="mt-1 space-y-1">
                <p className="text-sm text-gray-500">
                  💡 Lịch sử giao dịch nạp tiền của bạn
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={triggerExpiredPaymentCheck}
                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition text-sm font-medium flex items-center gap-2"
                disabled={loadingPayment}
              >
                {loadingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang kiểm tra...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Kiểm tra hết hạn
                  </>
                )}
              </button>
              <button
                onClick={fetchPaymentHistory}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2"
                disabled={loadingPayment}
              >
                {loadingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang tải...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Làm mới
                  </>
                )}
              </button>
            </div>
          </div>
          {loadingPayment ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-gray-500">Đang tải lịch sử thanh toán...</span>
            </div>
          ) : paymentError ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Lỗi tải dữ liệu: {paymentError}
              </div>
              <button
                onClick={fetchPaymentHistory}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
              >
                Thử lại
              </button>
            </div>
          ) : paymentHistory.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">Chưa có giao dịch nạp tiền nào.</div>
              <button
                onClick={fetchPaymentHistory}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
              >
                Thử tải lại
              </button>
            </div>
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
                    <tr key={item.paymentId || item.id || idx}>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {item.orderCode || item.paymentId || item.id || "-"}
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
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === "success" || 
                            item.status === "SUCCESS" || 
                            item.status === "PAID"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status === "success" || 
                           item.status === "SUCCESS" || 
                           item.status === "PAID"
                            ? "✅ Thành công"
                            : "🚫 Đã hủy"}
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
