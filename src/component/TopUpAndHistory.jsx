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
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12s-1.536-.219-2.121-.659c-1.172-.879-1.172-2.303 0-3.182C10.464 7.781 11.232 7.56 12 7.56s1.536.219 2.121.659" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Nạp tiền</h2>
            <p className="text-gray-500">Nạp tiền vào tài khoản của bạn</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số tiền nạp (VNĐ) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={10000}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 text-lg font-semibold"
                  placeholder="10,000"
                />
                <div className="absolute left-4 top-3 text-gray-500 font-semibold">
                  ₫
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                💡 Số tiền tối thiểu: 10,000 VNĐ
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <button
                onClick={handleTopUp}
                disabled={loadingPayment}
                className={`px-8 py-4 text-white rounded-xl transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3 ${
                  loadingPayment
                    ? "bg-gray-400 cursor-not-allowed transform-none shadow-none"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                }`}
              >
                {loadingPayment ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nạp tiền ngay
                  </>
                )}
              </button>
              {amount && amount >= 10000 && (
                <p className="text-sm text-green-600 mt-2 font-medium">
                  Sẽ nạp: {Number(amount).toLocaleString()} VNĐ
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lịch sử nạp tiền */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Lịch sử nạp tiền</h2>
              <p className="text-gray-500">Theo dõi các giao dịch nạp tiền của bạn</p>
            </div>
          </div>
          
          {/* Nút phân trang */}
          {paymentHistory.length > PAYMENT_PER_PAGE && (
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
              <button
                className="w-8 h-8 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setPaymentPage((p) => Math.max(0, p - 1))}
                disabled={paymentPage === 0}
              >
                <FaChevronLeft className="text-gray-600" />
              </button>
              <span className="text-sm font-medium text-gray-600 px-2">
                {paymentPage + 1} / {Math.ceil(paymentHistory.length / PAYMENT_PER_PAGE)}
              </span>
              <button
                className="w-8 h-8 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
                <FaChevronRight className="text-gray-600" />
              </button>
            </div>
          )}
        </div>
        {loadingPayment ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
            </div>
            <p className="text-gray-600 mt-4 font-medium">Đang tải lịch sử thanh toán...</p>
          </div>
        ) : paymentError ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {paymentError.includes('404') || paymentError.toLowerCase().includes('not found')
                ? 'Chưa có giao dịch nào'
                : 'Có lỗi xảy ra'}
            </h3>
            <p className="text-gray-600 mb-6">
              {paymentError.includes('404') || paymentError.toLowerCase().includes('not found')
                ? 'Bạn chưa có giao dịch nạp tiền nào.'
                : `Lỗi tải dữ liệu: ${paymentError}`}
            </p>
            <button
              onClick={fetchPaymentHistory}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-semibold flex items-center gap-2 mx-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Thử lại
            </button>
          </div>
        ) : paymentHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Chưa có giao dịch nào</h3>
            <p className="text-gray-600 mb-6">Bạn chưa có giao dịch nạp tiền nào.</p>
            <button
              onClick={fetchPaymentHistory}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-semibold flex items-center gap-2 mx-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Thử tải lại
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Mã giao dịch
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Số tiền
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
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
                      <tr key={item.paymentId || item.id || idx} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {item.orderCode || item.paymentId || item.id || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-green-600">
                            {item.amount?.toLocaleString() || "-"} VND
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString('vi-VN')
                              : "-"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleTimeString('vi-VN')
                              : ""}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              item.status === "success" ||
                              item.status === "SUCCESS" ||
                              item.status === "PAID"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-red-100 text-red-800 border border-red-200"
                            }`}
                          >
                            {item.status === "success" ||
                            item.status === "SUCCESS" ||
                            item.status === "PAID" ? (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Thành công
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Đã hủy
                              </>
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TopUpAndHistory; 