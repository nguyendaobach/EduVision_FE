import React from "react";

const CTASection = () => (
  <section className="relative py-24 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 text-white overflow-hidden">
    {/* Background decorations */}
    <div className="absolute inset-0">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-yellow-300/20 rounded-full blur-lg animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/5 rounded-full blur-md animate-bounce"></div>
    </div>

    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      {/* Main heading */}
      <div className="mb-8">
        <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Sẵn sàng tạo bài giảng
          <span className="block bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent animate-pulse">
            chỉ trong vài phút?
          </span>
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-yellow-300 to-yellow-400 mx-auto rounded-full mb-6"></div>
      </div>

      {/* Subtitle */}
      <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed opacity-90 font-light">
        Tham gia cùng <span className="font-semibold text-yellow-200">hàng nghìn giáo viên</span> đã tin tưởng sử dụng EduVision AI để tạo nội dung giảng dạy chuyên nghiệp
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-300 mb-2">10,000+</div>
          <div className="text-white/80">Bài giảng đã tạo</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-300 mb-2">5,000+</div>
          <div className="text-white/80">Giáo viên tin tưởng</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-300 mb-2">98%</div>
          <div className="text-white/80">Hài lòng</div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-900 rounded-2xl font-bold text-lg transition-all duration-300 hover:from-yellow-300 hover:to-yellow-400 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/25 min-w-[200px]">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Bắt đầu ngay
          </div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-300 to-yellow-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>
        
        <button className="group px-8 py-4 border-2 border-white/30 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:border-white hover:bg-white/10 hover:scale-105 min-w-[200px] backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
            Xem demo
          </div>
        </button>
      </div>

      {/* Trust indicators */}
      <div className="mt-12 pt-8 border-t border-white/20">
        <p className="text-sm text-white/70 mb-4">Được tin tưởng bởi các trường hàng đầu</p>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
            <span className="text-white font-semibold">FPT University</span>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
            <span className="text-white font-semibold">NEU</span>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
            <span className="text-white font-semibold">UIT</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;
