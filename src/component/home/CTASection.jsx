import React from "react";

const CTASection = () => (
  <section className="relative py-20 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 text-white overflow-hidden">
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
        Sẵn sàng tạo bài giảng
        <span className="block text-yellow-300">chỉ trong vài phút?</span>
      </h2>
      <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
        Tham gia cùng hàng nghìn giáo viên đã tin tưởng sử dụng EduVision AI
      </p>
      {/* ...CTA buttons... */}
    </div>
  </section>
);

export default CTASection;
