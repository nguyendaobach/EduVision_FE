
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { generalAPI } from "../services/apiService";
import { useAppSelector } from "../hooks/redux";

const QuotaDisplay = () => {
  const dispatch = useDispatch();
  const { data: quotaData, loading, error } = useAppSelector(
    (state) => state.quota
  );

  useEffect(() => {
    dispatch(generalAPI.getQuotas());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white bg-opacity-90 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-12"></div>
                <div className="w-full bg-gray-200 rounded-full h-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-white bg-opacity-90 rounded-xl p-6 backdrop-blur-sm border border-red-200 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Không thể tải thông tin hạn mức</h3>
          <p className="text-red-600 mb-4">
            {error || "Vui lòng thử lại sau."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const quotaResult = quotaData?.result || {};

  const getRemainingQuota = (limit, used) => {
    if (limit === null || limit === undefined) {
      return "Không giới hạn";
    } else {
      return limit - used;
    }
  };

  const getProgressPercentage = (used, limit) => {
    if (limit === null || limit === undefined) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Video Quota Card */}
        <div className="bg-white bg-opacity-90 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Video</h3>
              <p className="text-sm text-gray-600">Hạn mức sử dụng</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-800">
                {quotaResult.videoQuotaUsed || 0}
              </span>
              <span className="text-sm text-gray-500">
                {quotaResult.videoQuotaLimit !== undefined && quotaResult.videoQuotaLimit !== null
                  ? `/ ${quotaResult.videoQuotaLimit}`
                  : "Không giới hạn"}
              </span>
            </div>
            
            {quotaResult.videoQuotaLimit && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                    getProgressPercentage(quotaResult.videoQuotaUsed, quotaResult.videoQuotaLimit)
                  )}`}
                  style={{
                    width: `${getProgressPercentage(quotaResult.videoQuotaUsed, quotaResult.videoQuotaLimit)}%`,
                  }}
                ></div>
              </div>
            )}
            
            <p className="text-xs text-gray-600">
              Còn lại: {getRemainingQuota(quotaResult.videoQuotaLimit, quotaResult.videoQuotaUsed)}
            </p>
          </div>
        </div>

        {/* Slide Quota Card */}
        <div className="bg-white bg-opacity-90 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Slide</h3>
              <p className="text-sm text-gray-600">Hạn mức sử dụng</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-800">
                {quotaResult.slideQuotaUsed || 0}
              </span>
              <span className="text-sm text-gray-500">
                {quotaResult.slideQuotaLimit !== undefined && quotaResult.slideQuotaLimit !== null
                  ? `/ ${quotaResult.slideQuotaLimit}`
                  : "Không giới hạn"}
              </span>
            </div>
            
            {quotaResult.slideQuotaLimit && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                    getProgressPercentage(quotaResult.slideQuotaUsed, quotaResult.slideQuotaLimit)
                  )}`}
                  style={{
                    width: `${getProgressPercentage(quotaResult.slideQuotaUsed, quotaResult.slideQuotaLimit)}%`,
                  }}
                ></div>
              </div>
            )}
            
            <p className="text-xs text-gray-600">
              Còn lại: {getRemainingQuota(quotaResult.slideQuotaLimit, quotaResult.slideQuotaUsed)}
            </p>
          </div>
        </div>

        {/* Period Info Card */}
        <div className="bg-white bg-opacity-90 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Thời hạn</h3>
              <p className="text-sm text-gray-600">Hiệu lực quota</p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Từ:</span>
              <p className="font-medium text-gray-800">
                {quotaResult.periodStart
                  ? new Date(quotaResult.periodStart).toLocaleDateString('vi-VN')
                  : "N/A"}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Đến:</span>
              <p className="font-medium text-gray-800">
                {quotaResult.periodEnd
                  ? new Date(quotaResult.periodEnd).toLocaleDateString('vi-VN')
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotaDisplay; 