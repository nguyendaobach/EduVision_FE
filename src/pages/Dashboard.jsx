import { useEffect, useState } from "react";
import { useAppDispatch, useAuth, useNotify } from "../hooks/redux";
import { authAPI, generalAPI } from "../services/apiService";
import TopUpAndHistory from "../component/TopUpAndHistory";
import SlideListSection from "../component/SlideListSection";
import VideoListSection from "../component/VideoListSection";
import ImageManager from "../component/ImageManager";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const notify = useNotify();
  const { user, isAuthenticated } = useAuth();
  const [amount, setAmount] = useState(10000);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [lastPaymentOrderCode, setLastPaymentOrderCode] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // State cho form chỉnh sửa thông tin tài khoản
  const [editUser, setEditUser] = useState({
    fullName: "",
    phoneNumber: "",
    avatarUrl: "",
    address: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState(null);
  const [editError, setEditError] = useState(null);

  // State cho slides và videos
  const [slides, setSlides] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loadingSlides, setLoadingSlides] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [errorSlides, setErrorSlides] = useState(null);
  const [errorVideos, setErrorVideos] = useState(null);

  // State cho phân trang slide/video
  const [slidePage, setSlidePage] = useState(1); // page bắt đầu từ 1
  const [videoPage, setVideoPage] = useState(1);
  const [slideTotal, setSlideTotal] = useState(0);
  const [videoTotal, setVideoTotal] = useState(0);
  const ITEMS_PER_PAGE = 10;

  // State cho modal xem chi tiết
  const [preview, setPreview] = useState(null); // {type: 'slide'|'video', url: string}

  // State cho lịch sử nạp tiền
  const [paymentPage, setPaymentPage] = useState(0);
  const PAYMENT_PER_PAGE = 10;

  // Function to fetch payment history
  const fetchPaymentHistory = async () => {
    if (!user?.userId) return;
    setLoadingPayment(true);
    setPaymentError(null);
    try {
      const res = await dispatch(generalAPI.paymentHistory(user.userId));
      let historyArr = [];
      if (Array.isArray(res)) historyArr = res;
      else if (res?.result) {
        if (Array.isArray(res.result.payments))
          historyArr = res.result.payments;
        else if (Array.isArray(res.result)) historyArr = res.result;
        else if (Array.isArray(res.result.data)) historyArr = res.result.data;
        else if (Array.isArray(res.result.history))
          historyArr = res.result.history;
      } else if (res?.data && Array.isArray(res.data)) {
        historyArr = res.data;
      }
      setPaymentHistory(Array.isArray(historyArr) ? historyArr : []);
      setPaymentPage(0); // reset về trang đầu khi load mới
    } catch (error) {
      const errorMsg =
        error?.response?.data?.Message ||
        error?.message ||
        "Lỗi không xác định";
      setPaymentError(errorMsg);
      setPaymentHistory([]);
      // Chỉ notify nếu thực sự là lỗi, không phải chỉ là không có giao dịch
      // Không gọi notify.error nếu chỉ là không có giao dịch
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
      setPaymentHistory((prev) =>
        prev.map((payment) =>
          payment.orderCode === orderCode || payment.paymentId === orderCode
            ? { ...payment, status: result?.status || result?.payload?.status }
            : payment
        )
      );

      return result;
    } catch (error) {
      console.error("Error checking specific payment status:", error);
      return null;
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
      if (e.key === "lastUpdatedPayment") {
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
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("paymentUpdate", handlePaymentUpdate);

    // Check xem có payment update trong localStorage không
    const lastUpdatedPayment = localStorage.getItem("lastUpdatedPayment");
    if (lastUpdatedPayment) {
      try {
        const payment = JSON.parse(lastUpdatedPayment);
        // Nếu payment được update trong vòng 30 giây thì refresh
        if (Date.now() - payment.timestamp < 30000) {
          console.log(
            "Dashboard: Found recent payment update, refreshing history"
          );
          fetchPaymentHistory();
          localStorage.removeItem("lastUpdatedPayment"); // Clear sau khi xử lý
        }
      } catch (error) {
        console.error("Error parsing lastUpdatedPayment:", error);
      }
    }

    // Check refreshDashboard flag từ PaymentSuccess
    const shouldRefresh = localStorage.getItem("refreshDashboard");
    if (shouldRefresh === "true") {
      console.log(
        "Dashboard: refreshDashboard flag detected, refreshing history"
      );
      localStorage.removeItem("refreshDashboard");
      if (user?.userId) {
        fetchPaymentHistory();
      }
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("paymentUpdate", handlePaymentUpdate);
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

  // Lấy slides và videos khi mount hoặc khi đổi trang
  useEffect(() => {
    const fetchSlides = async () => {
      setLoadingSlides(true);
      setErrorSlides(null);
      try {
        const res = await dispatch(
          generalAPI.getUserSlides({
            page: slidePage,
            pageSize: ITEMS_PER_PAGE,
          })
        );
        let arr = [];
        let total = 0;
        if (res?.result) {
          arr = Array.isArray(res.result.data) ? res.result.data : [];
          total = res.result.totalCount || 0;
        }
        setSlides(arr);
        setSlideTotal(total);
      } catch (e) {
        setErrorSlides(e?.message || "Không thể tải slide");
        setSlides([]);
        setSlideTotal(0);
      } finally {
        setLoadingSlides(false);
      }
    };
    const fetchVideos = async () => {
      setLoadingVideos(true);
      setErrorVideos(null);
      try {
        const res = await dispatch(
          generalAPI.getUserVideos({
            page: videoPage,
            pageSize: ITEMS_PER_PAGE,
          })
        );
        let arr = [];
        let total = 0;
        if (res?.result) {
          arr = Array.isArray(res.result.data) ? res.result.data : [];
          total = res.result.totalCount || 0;
        }
        setVideos(arr);
        setVideoTotal(total);
      } catch (e) {
        setErrorVideos(e?.message || "Không thể tải video");
        setVideos([]);
        setVideoTotal(0);
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchSlides();
    fetchVideos();
  }, [dispatch, slidePage, videoPage]);

  // Lấy thông tin user khi vào trang hoặc sau khi cập nhật thành công
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await dispatch(generalAPI.getCurrentUser());
        setCurrentUser(res.data);
        let data = res?.result || res?.data || res;
        setEditUser({
          fullName: data?.fullName || "",
          phoneNumber: data?.phoneNumber || "",
          avatarUrl: data?.avatarUrl || "",
          address: data?.address || "",
        });
      } catch (e) {
        // Có thể show lỗi nếu muốn
      }
    };
    fetchCurrentUser();
  }, [dispatch]);

  // Xử lý lưu thông tin tài khoản
  const handleEditUser = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    setEditSuccess(null);
    try {
      const payload = { ...editUser };
      await dispatch(generalAPI.updateCurrentUser(payload));
      setEditSuccess("Cập nhật thành công!");
      notify.success("Cập nhật thông tin thành công!");
      // Lấy lại thông tin mới nhất
      const res = await dispatch(generalAPI.getCurrentUser());
      let data = res?.result || res?.data || res;
      setCurrentUser(data);
      setEditUser({
        fullName: data?.fullName || "",
        phoneNumber: data?.phoneNumber || "",
        avatarUrl: data?.avatarUrl || "",
        address: data?.address || "",
      });
    } catch (error) {
      setEditError(error?.message || "Cập nhật thất bại");
      notify.error("Cập nhật thất bại: " + (error?.message || ""));
    } finally {
      setEditLoading(false);
    }
  };

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
        const urlParams = new URLSearchParams(res.checkoutUrl.split("?")[1]);
        const orderCode = urlParams.get("orderCode");
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
      notify.error(
        "Nạp tiền thất bại: " + (error.message || "Lỗi không xác định")
      );
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
      window.history.replaceState({}, document.title, window.location.pathname);
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
              <h1 className="text-3xl font-bold text-gray-800">Setting</h1>
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
          <form
            onSubmit={handleEditUser}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  value={editUser.fullName}
                  onChange={(e) =>
                    setEditUser((u) => ({ ...u, fullName: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  value={editUser.phoneNumber}
                  onChange={(e) =>
                    setEditUser((u) => ({ ...u, phoneNumber: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Avatar URL
                </label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  value={editUser.avatarUrl}
                  onChange={(e) =>
                    setEditUser((u) => ({ ...u, avatarUrl: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  value={editUser.address}
                  onChange={(e) =>
                    setEditUser((u) => ({ ...u, address: e.target.value }))
                  }
                />
              </div>
              <div className="pt-10 ml-110">
                <button
                  type="submit"
                  disabled={editLoading}
                  className={`px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition ${
                    editLoading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {editLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
                {editError && (
                  <div className="text-red-500 text-sm mt-2">{editError}</div>
                )}
                {editSuccess && (
                  <div className="text-green-600 text-sm mt-2">
                    {editSuccess}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Danh sách Slide */}
        <SlideListSection
          slides={slides}
          loadingSlides={loadingSlides}
          errorSlides={errorSlides}
          slidePage={slidePage}
          setSlidePage={setSlidePage}
          slideTotal={slideTotal}
          ITEMS_PER_PAGE={ITEMS_PER_PAGE}
          preview={preview}
          setPreview={setPreview}
        />

        {/* Danh sách Video */}
        <VideoListSection
          videos={videos}
          loadingVideos={loadingVideos}
          errorVideos={errorVideos}
          videoPage={videoPage}
          setVideoPage={setVideoPage}
          videoTotal={videoTotal}
          ITEMS_PER_PAGE={ITEMS_PER_PAGE}
          preview={preview}
          setPreview={setPreview}
        />

        {/* Quản lý ảnh - chỉ User mới thấy */}
        {currentUser?.role !== "user" && <ImageManager />}

        {/* Nạp tiền & Lịch sử nạp tiền */}
        {currentUser?.role !== "admin" && (
          <TopUpAndHistory
            user={user}
            notify={notify}
            generalAPI={generalAPI}
            dispatch={dispatch}
            loadingPayment={loadingPayment}
            setLoadingPayment={setLoadingPayment}
            amount={amount}
            setAmount={setAmount}
            paymentHistory={paymentHistory}
            setPaymentHistory={setPaymentHistory}
            paymentError={paymentError}
            setPaymentError={setPaymentError}
            lastPaymentOrderCode={lastPaymentOrderCode}
            setLastPaymentOrderCode={setLastPaymentOrderCode}
            paymentPage={paymentPage}
            setPaymentPage={setPaymentPage}
            PAYMENT_PER_PAGE={PAYMENT_PER_PAGE}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
