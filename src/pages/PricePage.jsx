import React from "react";

const basicFeatures = [
  "Tạo tối đa 20 video",
  "Tạo tối đa 30 slide",
];

const PricingPage = () => (
  <div className="h-150 bg-gray-50 flex items-center justify-center py-10">
    <div className="flex flex-col items-center gap-8">
      {/* Basic Plan */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-[400px] flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-2">Gói Basic</h2>
        <p className="text-gray-500 mb-4">Dành cho cá nhân</p>
        <div className="text-xl font-bold mb-1">100.000 ₫ một tháng</div>
        <div className="text-gray-500 text-sm mb-4">Thanh toán hàng tháng. Hủy bất cứ lúc nào.</div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md py-3 w-full mb-6 transition">
          Đăng ký ngay →
        </button>
        <ul className="space-y-2 w-full">
          {basicFeatures.map((feature, idx) => (
            <li key={idx} className="flex items-center text-base">
              <span className="text-green-500 mr-2">✔</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default PricingPage;