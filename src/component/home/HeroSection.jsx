import React from "react";

const HeroSection = () => (
  <section className="relative bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 text-white py-16 overflow-hidden flex items-center">
    {/* Background decorative elements */}
    <div className="absolute inset-0">
      <div className="absolute top-20 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
    </div>

    {/* Floating elements */}
    <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-300 rounded-full animate-bounce delay-300"></div>
    <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-white rounded-full animate-bounce delay-700"></div>
    <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-yellow-200 rounded-full animate-bounce delay-1000"></div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
      {/* Badge */}
      <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20">
        <svg
          className="w-4 h-4 text-yellow-300 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-sm font-medium">
          Công nghệ AI tiên tiến nhất 2025
        </span>
      </div>

      {/* Main heading */}
      <h1 className="text-5xl md:text-8xl font-bold mb-8 leading-tight">
        <span className="block mb-2">Tạo bài giảng AI</span>
        <span className="block bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent animate-pulse drop-shadow-lg">
          thông minh & hiện đại
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-xl md:text-3xl mb-12 max-w-5xl mx-auto leading-relaxed font-light">
        Chỉ cần chọn môn học và bài học - AI sẽ tự động tạo slide và video bài
        giảng
        <span className="font-semibold text-yellow-200 block mt-2">
          chuyên nghiệp trong vài phút ⚡
        </span>
      </p>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
          <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <svg
              className="w-6 h-6 text-purple-900"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-2">Slide tự động</h3>
          <p className="text-white/80 text-sm">
            AI tạo slide chuyên nghiệp theo chương trình chuẩn
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
          <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <svg
              className="w-6 h-6 text-purple-900"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-2">Video bài giảng</h3>
          <p className="text-white/80 text-sm">
            Tạo video giảng dạy với giọng nói tự nhiên
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
          <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <svg
              className="w-6 h-6 text-purple-900"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-2">Siêu nhanh</h3>
          <p className="text-white/80 text-sm">
            Hoàn thành trong 3-5 phút, không cần thiết kế
          </p>
        </div>
      </div>

      {/* Trust indicators */}
      <div className="text-white/70 text-sm">
        ⭐ <span className="font-semibold">4.9/5</span> từ 5,000+ giáo viên •
        <span className="font-semibold text-yellow-200">
          {" "}
          Miễn phí 3 bài giảng đầu tiên
        </span>
      </div>
    </div>

    {/* Scroll indicator */}
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <svg
        className="w-6 h-6 text-white/50"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </div>
  </section>
);

export default HeroSection;
