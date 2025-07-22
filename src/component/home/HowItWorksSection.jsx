import React from "react";

const HowItWorksSection = () => (
  <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full mb-6">
          <svg className="w-4 h-4 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-indigo-700">Quy trình làm việc</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Cách thức hoạt động
        </h2>
        <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Quy trình đơn giản và tự động với sức mạnh của trí tuệ nhân tạo.
          <span className="font-semibold text-indigo-600"> Chỉ 3 bước đơn giản để có bài giảng hoàn chỉnh</span>
        </p>
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Connection Line */}
        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-purple-200 via-indigo-200 to-purple-200 transform -translate-y-1/2 z-0"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
          {/* Step 1 */}
          <div className="group text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500 group-hover:scale-110">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-purple-900 font-bold text-sm shadow-lg">
                1
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
              Chọn môn học & bài học
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Lựa chọn môn học và bài học cụ thể từ danh sách chương trình giáo dục chính thức. 
              Hệ thống hỗ trợ đầy đủ các môn từ Tiểu học đến THPT.
            </p>
            
            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
              <div className="flex items-center justify-center mb-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </div>
              </div>
              <p className="text-sm text-purple-700 font-medium">
                📚 Toán • Lý • Hóa • Sinh • Văn • Sử • Địa • Anh...
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="group text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl group-hover:shadow-indigo-500/25 transition-all duration-500 group-hover:scale-110">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-indigo-900 font-bold text-sm shadow-lg">
                2
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
              AI xử lý & tạo nội dung
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Trí tuệ nhân tạo phân tích yêu cầu và tự động tạo ra slide bài giảng với nội dung chính xác, 
              layout chuyên nghiệp và hình ảnh minh họa phù hợp.
            </p>
            
            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
              <div className="flex items-center justify-center mb-3">
                <div className="relative">
                  <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="text-sm text-indigo-700 font-medium">
                🤖 AI đang xử lý và tạo nội dung...
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="group text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl group-hover:shadow-emerald-500/25 transition-all duration-500 group-hover:scale-110">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-emerald-900 font-bold text-sm shadow-lg">
                3
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
              Nhận slide & video hoàn chỉnh
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Nhận ngay slide PowerPoint chuyên nghiệp và video bài giảng với giọng nói tự nhiên. 
              Sẵn sàng sử dụng cho lớp học hoặc học online.
            </p>
            
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <div className="w-6 h-4 bg-emerald-400 rounded opacity-80"></div>
                <div className="w-6 h-4 bg-emerald-500 rounded"></div>
                <div className="w-6 h-4 bg-emerald-600 rounded opacity-80"></div>
              </div>
              <p className="text-sm text-emerald-700 font-medium">
                ✨ Slide + Video đã hoàn thành!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Time indicators */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center space-x-8 bg-white rounded-2xl px-8 py-4 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Tổng thời gian: <span className="font-bold text-purple-600">3-5 phút</span></span>
          </div>
          <div className="w-px h-6 bg-gray-200"></div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Chất lượng: <span className="font-bold text-emerald-600">Chuyên nghiệp</span></span>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16">
        <button className="group px-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold text-xl transition-all duration-300 hover:from-purple-700 hover:to-indigo-700 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
          <div className="flex items-center justify-center gap-3">
            <svg className="w-6 h-6 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Thử ngay quy trình 3 bước
          </div>
        </button>
        <p className="text-gray-500 mt-4 text-sm">💝 Miễn phí 3 bài giảng đầu tiên</p>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
