import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const TopUpAndHistory = ({
  user,
  notify,
  generalAPI,
  dispatch,
  loadingPayment,
  setLoadingPayment,
  amount,
  setAmount,
  paymentHistory,
  setPaymentHistory,
  paymentError,
  setPaymentError,
  lastPaymentOrderCode,
  setLastPaymentOrderCode,
  paymentPage,
  setPaymentPage,
  PAYMENT_PER_PAGE
}) => {
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
    } finally {
      setLoadingPayment(false);
    }
  };

  // Xử lý nạp tiền
  const handleTopUp = async () => {
    if (!amount || amount < 10000) {
      notify.error("Số tiền tối thiểu là 10.000đ");
      return;
    }
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
      notify.error(
        "Nạp tiền thất bại: " + (error.message || "Lỗi không xác định")
      );
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <>
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
                <FaChevronLeft />
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
                <FaChevronRight />
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
            <div className="text-gray-500 mb-4">
              {paymentError.includes('404') || paymentError.toLowerCase().includes('not found')
                ? 'Chưa có giao dịch nạp tiền nào.'
                : `Lỗi tải dữ liệu: ${paymentError}`}
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
    </>
  );
};

export default TopUpAndHistory; 