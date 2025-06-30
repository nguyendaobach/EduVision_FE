import React from "react";

const ExampleVideosSection = ({ exampleVideos }) => (
  <section className="py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Nội dung mẫu đã tạo
      </h2>
      <p className="text-xl text-gray-600">
        Xem các slide và video bài giảng được tạo theo chương trình chuẩn
      </p>
      {/* ...videos grid... */}
    </div>
  </section>
);

export default ExampleVideosSection;
