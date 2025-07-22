import React from "react";

const CTASection = () => (
  <section className="relative py-12 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 text-white overflow-hidden">
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
        Tham gia cùng{" "}
        <span className="font-semibold text-yellow-200">
          hàng nghìn giáo viên
        </span>{" "}
        đã tin tưởng sử dụng EduVision AI để tạo nội dung giảng dạy chuyên
        nghiệp
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

      {/* Trust indicators */}
      <div className="mt-12 pt-8 border-t border-white/20">
        <p className="text-sm text-white/70 mb-4">
          Được tin tưởng bởi các trường hàng đầu
        </p>
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
