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
  const [slidePage, setSlidePage] = useState(0);
  const [videoPage, setVideoPage] = useState(0);
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
      notify.error(`Không thể tải lịch sử nạp tiền: ${errorMsg}`);
      setPaymentHistory([]);
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

  // Function to trigger expired payment check
  const triggerExpiredPaymentCheck = async () => {
    try {
      console.log("Dashboard: Triggering expired payment check");
      await dispatch(generalAPI.checkExpiredPayments());
      console.log(
        "Dashboard: Expired payment check completed, refreshing history"
      );
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

  // Lấy slides và videos khi mount
  useEffect(() => {
    const fetchSlides = async () => {
      setLoadingSlides(true);
      setErrorSlides(null);
      try {
        const res = await dispatch(generalAPI.getUserSlides());
        let arr = [];
        if (Array.isArray(res)) arr = res;
        else if (res?.result)
          arr = Array.isArray(res.result) ? res.result : res.result.data || [];
        else if (res?.data && Array.isArray(res.data)) arr = res.data;
        setSlides(arr);
      } catch (e) {
        setErrorSlides(e?.message || "Không thể tải slide");
        setSlides([]);
      } finally {
        setLoadingSlides(false);
      }
    };
    const fetchVideos = async () => {
      setLoadingVideos(true);
      setErrorVideos(null);
      try {
        const res = await dispatch(generalAPI.getUserVideos());
        let arr = [];
        if (Array.isArray(res)) arr = res;
        else if (res?.result)
          arr = Array.isArray(res.result) ? res.result : res.result.data || [];
        else if (res?.data && Array.isArray(res.data)) arr = res.data;
        setVideos(arr);
      } catch (e) {
        setErrorVideos(e?.message || "Không thể tải video");
        setVideos([]);
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchSlides();
    fetchVideos();
  }, [dispatch]);

  // Lấy thông tin user khi vào trang hoặc sau khi cập nhật thành công
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await dispatch(generalAPI.getCurrentUser());
        let data = res?.result || res?.data || res;
        setCurrentUser(data);
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
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Danh sách Slide của bạn
          </h2>
          {loadingSlides ? (
            <div>Đang tải slide...</div>
          ) : errorSlides ? (
            <div className="text-red-500">{errorSlides}</div>
          ) : slides.length === 0 ? (
            <div>Chưa có slide nào.</div>
          ) : (
            <div>
              <div className="flex items-center mb-2">
                <button
                  className="px-2 py-1 mr-2  rounded disabled:opacity-50"
                  onClick={() => setSlidePage((p) => Math.max(0, p - 1))}
                  disabled={slidePage === 0}
                >
                  ◀
                </button>
                <span className="text-sm text-gray-600">
                  Trang {slidePage + 1} /{" "}
                  {Math.ceil(slides.length / ITEMS_PER_PAGE)}
                </span>
                <button
                  className="px-2 py-1 ml-2  rounded disabled:opacity-50"
                  onClick={() =>
                    setSlidePage((p) =>
                      Math.min(
                        Math.ceil(slides.length / ITEMS_PER_PAGE) - 1,
                        p + 1
                      )
                    )
                  }
                  disabled={
                    slidePage >= Math.ceil(slides.length / ITEMS_PER_PAGE) - 1
                  }
                >
                  ▶
                </button>
              </div>
              <div className="flex overflow-x-auto space-x-4 pb-2">
                {slides
                  .slice(
                    slidePage * ITEMS_PER_PAGE,
                    (slidePage + 1) * ITEMS_PER_PAGE
                  )
                  .map((slide, idx) => {
                    const url = slide.slideUrl || slide.url || slide.link;
                    return (
                      <div
                        key={slide.id || idx}
                        className="min-w-[220px] max-w-xs bg-gray-50 border rounded p-3 flex-shrink-0 flex flex-col justify-between shadow hover:shadow-md transition"
                      >
                        {slide.thumbnailUrl && (
                          <img
                            src={slide.thumbnailUrl}
                            alt={slide.title || "Slide"}
                            className="w-full h-28 object-cover rounded mb-2"
                          />
                        )}
                        <div className="font-medium truncate mb-1">
                          {slide.title ||
                            slide.name ||
                            `Slide #${slidePage * ITEMS_PER_PAGE + idx + 1}`}
                        </div>
                        {slide.description && (
                          <div className="text-xs text-gray-500 mb-1 line-clamp-2">
                            {slide.description}
                          </div>
                        )}
                        {slide.createdAt && (
                          <div className="text-xs text-gray-400 mb-1">
                            {new Date(slide.createdAt).toLocaleString()}
                          </div>
                        )}
                        <button
                          className="mt-auto px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
                          onClick={() =>
                            url && setPreview({ type: "slide", url })
                          }
                          disabled={!url}
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    );
                  })}
              </div>
              {/* Xem chi tiết slide in trực tiếp */}
              {preview && preview.type === "slide" && (
                <div className="mt-8 p-6 bg-white rounded-lg border border-purple-200 shadow-md animate-in fade-in-50 duration-500">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-purple-700 flex items-center">
                      Slide bài giảng
                    </h3>
                    <button
                      className="text-gray-500 hover:text-red-500 text-2xl font-bold"
                      onClick={() => setPreview(null)}
                      aria-label="Đóng"
                    >
                      ×
                    </button>
                  </div>
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 mb-2">
                    <iframe
                      src={preview.url}
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      title="Slide bài giảng"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <a
                    href={preview.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="!no-underline inline-block mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                  >
                    Mở trong tab mới
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Danh sách Video */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Danh sách Video của bạn
          </h2>
          {loadingVideos ? (
            <div>Đang tải video...</div>
          ) : errorVideos ? (
            <div className="text-red-500">{errorVideos}</div>
          ) : videos.length === 0 ? (
            <div>Chưa có video nào.</div>
          ) : (
            <div>
              <div className="flex items-center mb-2">
                <button
                  className="px-2 py-1 mr-2  rounded disabled:opacity-50"
                  onClick={() => setVideoPage((p) => Math.max(0, p - 1))}
                  disabled={videoPage === 0}
                >
                  ◀
                </button>
                <span className="text-sm text-gray-600">
                  Trang {videoPage + 1} /{" "}
                  {Math.ceil(videos.length / ITEMS_PER_PAGE)}
                </span>
                <button
                  className="px-2 py-1 ml-2 rounded disabled:opacity-50"
                  onClick={() =>
                    setVideoPage((p) =>
                      Math.min(
                        Math.ceil(videos.length / ITEMS_PER_PAGE) - 1,
                        p + 1
                      )
                    )
                  }
                  disabled={
                    videoPage >= Math.ceil(videos.length / ITEMS_PER_PAGE) - 1
                  }
                >
                  ▶
                </button>
              </div>
              <div className="flex overflow-x-auto space-x-4 pb-2">
                {videos
                  .slice(
                    videoPage * ITEMS_PER_PAGE,
                    (videoPage + 1) * ITEMS_PER_PAGE
                  )
                  .map((video, idx) => {
                    const url = video.videoUrl || video.url || video.link;
                    return (
                      <div
                        key={video.id || idx}
                        className="min-w-[220px] max-w-xs bg-gray-50 border rounded p-3 flex-shrink-0 flex flex-col justify-between shadow hover:shadow-md transition"
                      >
                        {video.thumbnailUrl && (
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title || "Video"}
                            className="w-full h-28 object-cover rounded mb-2"
                          />
                        )}
                        <div className="font-medium truncate mb-1">
                          {video.title ||
                            video.name ||
                            `Video #${videoPage * ITEMS_PER_PAGE + idx + 1}`}
                        </div>
                        {video.description && (
                          <div className="text-xs text-gray-500 mb-1 line-clamp-2">
                            {video.description}
                          </div>
                        )}
                        {video.createdAt && (
                          <div className="text-xs text-gray-400 mb-1">
                            {new Date(video.createdAt).toLocaleString()}
                          </div>
                        )}
                        <button
                          className="mt-auto px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
                          onClick={() =>
                            url && setPreview({ type: "video", url })
                          }
                          disabled={!url}
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    );
                  })}
              </div>
              {/* Xem chi tiết video in trực tiếp */}
              {preview && preview.type === "video" && (
                <div className="mt-8 p-6 bg-white rounded-lg border border-purple-200 shadow-md animate-in fade-in-50 duration-500">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-purple-700 flex items-center">
                      Video bài giảng
                    </h3>
                    <button
                      className="text-gray-500 hover:text-red-500 text-2xl font-bold"
                      onClick={() => setPreview(null)}
                      aria-label="Đóng"
                    >
                      ×
                    </button>
                  </div>
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 mb-2">
                    <video
                      src={preview.url}
                      className="absolute inset-0 w-full h-full"
                      controls
                      title="Video bài giảng"
                    ></video>
                  </div>
                  <a
                    href={preview.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="!no-underline inline-block mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                  >
                    Mở trong tab mới
                  </a>
                </div>
              )}
            </div>
          )}
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
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {loadingPayment ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Đang xử lý...
                </>
              ) : (
                "Nạp tiền"
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
            {/* Nút phân trang */}
            {paymentHistory.length > PAYMENT_PER_PAGE && (
              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 rounded disabled:opacity-50"
                  onClick={() => setPaymentPage((p) => Math.max(0, p - 1))}
                  disabled={paymentPage === 0}
                >
                  ◀
                </button>
                <span className="text-sm text-gray-600">
                  Trang {paymentPage + 1} /{" "}
                  {Math.ceil(paymentHistory.length / PAYMENT_PER_PAGE)}
                </span>
                <button
                  className="px-2 py-1  rounded disabled:opacity-50"
                  onClick={() =>
                    setPaymentPage((p) =>
                      Math.min(
                        Math.ceil(paymentHistory.length / PAYMENT_PER_PAGE) - 1,
                        p + 1
                      )
                    )
                  }
                  disabled={
                    paymentPage >=
                    Math.ceil(paymentHistory.length / PAYMENT_PER_PAGE) - 1
                  }
                >
                  ▶
                </button>
              </div>
            )}
          </div>
          {loadingPayment ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-gray-500">
                Đang tải lịch sử thanh toán...
              </span>
            </div>
          ) : paymentError ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">
                <svg
                  className="w-12 h-12 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                Lỗi tải dữ liệu: {paymentError}
              </div>
              <button
                onClick={fetchPaymentHistory}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-sm"
              >
                Thử lại
              </button>
            </div>
          ) : paymentHistory.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                Chưa có giao dịch nạp tiền nào.
              </div>
              <button
                onClick={fetchPaymentHistory}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-sm"
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
                  {paymentHistory
                    .slice(
                      paymentPage * PAYMENT_PER_PAGE,
                      (paymentPage + 1) * PAYMENT_PER_PAGE
                    )
                    .map((item, idx) => (
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
