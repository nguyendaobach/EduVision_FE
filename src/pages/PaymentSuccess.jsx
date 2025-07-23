import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useNotify } from "../hooks/redux";
import { generalAPI } from "../services/apiService";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const notify = useNotify();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const orderCode = searchParams.get("orderCode");
    const status = searchParams.get("status");

    if (!orderCode) {
      notify.error("Không tìm thấy thông tin giao dịch");
      navigate("/dashboard");
      return;
    }

    const checkPayment = async () => {
      try {
        console.log(
          "PaymentSuccess: Getting payment status for orderCode:",
          orderCode
        );

        // Đầu tiên, lấy status hiện tại từ database
        const result = await dispatch(
          generalAPI.checkPaymentStatus({ orderCode })
        );
        console.log("PaymentSuccess: Payment status result:", result);

        const paymentStatus =
          result?.status || result?.payload?.status || status;

        setPaymentDetails({
          orderCode,
          status: paymentStatus,
          amount: result?.payload?.amount || result?.amount,
          createdAt:
            result?.payload?.createdAt ||
            result?.createdAt ||
            new Date().toISOString(),
        });

        // Nếu status vẫn là pending, trigger check expired payments
        if (
          paymentStatus === "pending" ||
          !paymentStatus ||
          (paymentStatus !== "success" &&
            paymentStatus !== "failed" &&
            paymentStatus !== "cancelled")
        ) {
          console.log(
            "PaymentSuccess: Status is pending, triggering expired payment check"
          );
          try {
            await dispatch(generalAPI.checkExpiredPayments());
            console.log("PaymentSuccess: Expired payment check completed");

            // Sau khi check expired, lấy lại status
            const updatedResult = await dispatch(
              generalAPI.checkPaymentStatus({ orderCode })
            );
            const updatedStatus =
              updatedResult?.status || updatedResult?.payload?.status;

            if (updatedStatus && updatedStatus !== paymentStatus) {
              setPaymentDetails((prev) => ({
                ...prev,
                status: updatedStatus,
              }));
              console.log("PaymentSuccess: Status updated to:", updatedStatus);
            }
          } catch (expiredCheckError) {
            console.error(
              "PaymentSuccess: Error checking expired payments:",
              expiredCheckError
            );
          }
        }

        // Notify Dashboard về payment được cập nhật
        localStorage.setItem(
          "lastUpdatedPayment",
          JSON.stringify({
            orderCode,
            status: paymentStatus,
            timestamp: Date.now(),
          })
        );

        // Trigger storage event để Dashboard có thể listen
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "lastUpdatedPayment",
            newValue: JSON.stringify({
              orderCode,
              status: paymentStatus,
              timestamp: Date.now(),
            }),
          })
        );

        // Hiển thị thông báo dựa trên status
        if (paymentStatus === "success") {
          notify.success("Nạp tiền thành công! Quota đã được cập nhật.");
        } else if (paymentStatus === "failed") {
          notify.error("Thanh toán thất bại.");
        } else if (paymentStatus === "cancelled") {
          notify.error("Thanh toán đã bị hủy.");
        } else {
          notify.info("Trạng thái thanh toán: " + paymentStatus);
        }
      } catch (error) {
        console.error("PaymentSuccess: Error checking payment status:", error);

        // Thông báo chi tiết về lỗi
        if (error.response?.status === 500) {
          notify.error(
            "Lỗi server khi kiểm tra trạng thái thanh toán. Vui lòng thử lại sau."
          );
        } else if (error.response?.status === 404) {
          notify.error("Không tìm thấy giao dịch với mã này.");
        } else {
          notify.error(
            "Không kiểm tra được trạng thái thanh toán: " +
              (error.message || "Lỗi không xác định")
          );
        }

        // Vẫn set payment details với thông tin cơ bản
        setPaymentDetails({
          orderCode,
          status: status || "UNKNOWN",
          amount: null,
          createdAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    checkPayment();
  }, []);

  const handleBackToDashboard = () => {
    // Đảm bảo Dashboard sẽ refresh khi user quay lại
    localStorage.setItem("refreshDashboard", "true");
    
    // Kiểm tra nếu đang chạy trên production (vercel) thì redirect về vercel dashboard
    // Nếu local thì dùng navigate như cũ
    if (window.location.hostname.includes('vercel.app') || window.location.hostname.includes('edu-vision-fe.vercel.app')) {
      window.location.href = "https://edu-vision-fe.vercel.app/dashboard";
    } else {
      navigate("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Đang kiểm tra trạng thái thanh toán...
          </p>
        </div>
      </div>
    );
  }

  const isSuccess =
    paymentDetails?.status === "success" ||
    paymentDetails?.status === "SUCCESS" ||
    paymentDetails?.status === "PAID";
  const isFailed =
    paymentDetails?.status === "failed" || paymentDetails?.status === "FAILED";
  const isCancelled =
    paymentDetails?.status === "cancelled" ||
    paymentDetails?.status === "CANCELLED";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {isSuccess ? (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Thanh toán thành công!
            </h1>
            <p className="text-gray-600 mb-6">
              Quota đã được nạp vào tài khoản của bạn
            </p>
          </>
        ) : isFailed ? (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Thanh toán thất bại
            </h1>
            <p className="text-gray-600 mb-6">
              Giao dịch không thành công. Vui lòng thử lại.
            </p>
          </>
        ) : isCancelled ? (
          <>
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Thanh toán đã hủy
            </h1>
            <p className="text-gray-600 mb-6">
              Giao dịch đã bị hủy do hết thời gian chờ hoặc người dùng hủy.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Đang xử lý thanh toán
            </h1>
            <p className="text-gray-600 mb-6">
              Giao dịch đang được xử lý. Vui lòng chờ trong giây lát.
            </p>
          </>
        )}

        {paymentDetails && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-2">
              Chi tiết giao dịch:
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Mã giao dịch:</span>
                <span className="text-gray-800">
                  {paymentDetails.orderCode}
                </span>
              </div>
              {paymentDetails.amount && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Số tiền:</span>
                  <span className="text-gray-800">
                    {paymentDetails.amount.toLocaleString()} VNĐ
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Trạng thái:</span>
                <span
                  className={`font-medium ${
                    isSuccess
                      ? "text-green-600"
                      : isFailed
                      ? "text-red-600"
                      : isCancelled
                      ? "text-orange-600"
                      : "text-yellow-600"
                  }`}
                >
                  {isSuccess
                    ? "Thành công"
                    : paymentDetails.status === "failed"
                    ? "Thất bại"
                    : paymentDetails.status === "cancelled"
                    ? "Đã hủy"
                    : "Đang xử lý"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Thời gian:</span>
                <span className="text-gray-800">
                  {new Date(paymentDetails.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleBackToDashboard}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Về Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
