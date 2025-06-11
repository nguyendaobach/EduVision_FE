import React from "react";

const teamFeatures = [
  "Truy cập vào hơn 13.000 khóa học hàng đầu",
  "Luyện thi chứng chỉ",
  "Các đề xuất tập trung vào mục tiêu",
  "Bài tập coding được AI hỗ trợ",
  "Số liệu phân tích và báo cáo tỷ lệ chấp nhận",
];

const businessFeatures = [
  "Truy cập vào hơn 30.000 khóa học hàng đầu",
  "Luyện thi chứng chỉ",
  "Các đề xuất tập trung vào mục tiêu",
  "Bài tập coding được AI hỗ trợ",
  "Số liệu phân tích và thông tin chi tiết nâng cao",
  "Đội ngũ chăm sóc khách hàng riêng",
  "Tuyển tập khóa học quốc tế gồm 15 ngôn ngữ",
  "Nội dung có thể tùy chỉnh",
  "Đào tạo công nghệ thực hành có tiện ích bổ sung",
  "Dịch vụ triển khai chiến lược có tiện ích bổ sung",
];

const PricingPage = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
    <div className="flex flex-col md:flex-row gap-8">
      {/* Team Plan */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-[500px] flex flex-col">
        <h2 className="text-3xl font-bold mb-2">Gói Đội nhóm</h2>
        <p className="text-gray-500 mb-4">Dành cho đội nhóm</p>
        <div className="flex items-center text-lg mb-4">
          <span className="mr-2">👥</span>
          2 đến 20 người
        </div>
        <div className="text-xl font-bold mb-1">750.000 ₫ một tháng cho mỗi người dùng</div>
        <div className="text-gray-500 text-sm mb-4">Thanh toán hàng năm. Hủy bất cứ lúc nào.</div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md py-3 w-full mb-6 transition">
          Dùng thử miễn phí →
        </button>
        <ul className="space-y-2">
          {teamFeatures.map((feature, idx) => (
            <li key={idx} className="flex items-center text-base">
              <span className="text-green-500 mr-2">✔</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      {/* Business Plan */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-[500px] flex flex-col">
        <h2 className="text-3xl font-bold mb-2">Gói Doanh nghiệp</h2>
        <p className="text-gray-500 mb-4">Dành cho toàn bộ tổ chức</p>
        <div className="flex items-center text-lg mb-4">
          <span className="mr-2">👥</span>
          Từ 21 người trở lên
        </div>
        <div className="text-xl font-bold mb-1 text-gray-800">Liên hệ đội ngũ bán hàng để biết giá</div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md py-3 w-full mb-6 transition">
          Yêu cầu nhận bản demo →
        </button>
        <ul className="space-y-2">
          {businessFeatures.map((feature, idx) => (
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