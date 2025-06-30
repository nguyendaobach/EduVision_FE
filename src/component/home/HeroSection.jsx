import React from "react";

const HeroSection = () => (
  <section className="relative bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 text-white py-24 overflow-hidden">
    {/* ...Hero content, heading, subtitle, features, CTA buttons... */}
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
        <span className="block">Tạo bài giảng AI</span>
        <span className="block bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent animate-pulse">
          thông minh & hiện đại
        </span>
      </h1>
      <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto leading-relaxed font-light">
        Chỉ cần chọn môn học và bài học - AI sẽ tự động tạo slide và video bài
        giảng
        <span className="font-semibold text-yellow-200">
          {" "}
          chuyên nghiệp trong vài phút
        </span>
      </p>
      {/* ...other hero content... */}
    </div>
  </section>
);

export default HeroSection;
