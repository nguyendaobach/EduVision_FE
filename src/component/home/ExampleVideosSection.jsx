import React, { useState } from "react";

const ExampleVideosSection = ({ exampleVideos = [] }) => {
  const [activeTab, setActiveTab] = useState("slides");

  // Sample data for demonstration
  const sampleContent = {
    slides: [
      {
        id: 1,
        title: "Phương trình bậc hai - Toán 9",
        subject: "Toán học",
        grade: "Lớp 9",
        thumbnail:
          "https://via.placeholder.com/300x200/6366f1/ffffff?text=Slide+Demo",
        duration: "15 slides",
        views: "1.2k",
        rating: 4.8,
      },
      {
        id: 2,
        title: "Quang hợp - Sinh học 10",
        subject: "Sinh học",
        grade: "Lớp 10",
        thumbnail:
          "https://via.placeholder.com/300x200/10b981/ffffff?text=Slide+Demo",
        duration: "20 slides",
        views: "890",
        rating: 4.9,
      },
      {
        id: 3,
        title: "Chiến tranh Việt Nam - Lịch sử 12",
        subject: "Lịch sử",
        grade: "Lớp 12",
        thumbnail:
          "https://via.placeholder.com/300x200/f59e0b/ffffff?text=Slide+Demo",
        duration: "25 slides",
        views: "2.1k",
        rating: 4.7,
      },
    ],
    videos: [
      {
        id: 1,
        title: "Định luật Newton - Vật lý 10",
        subject: "Vật lý",
        grade: "Lớp 10",
        thumbnail:
          "https://via.placeholder.com/300x200/ef4444/ffffff?text=Video+Demo",
        duration: "12:30",
        views: "3.4k",
        rating: 4.9,
      },
      {
        id: 2,
        title: "Liên kết hóa học - Hóa học 10",
        subject: "Hóa học",
        grade: "Lớp 10",
        thumbnail:
          "https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Video+Demo",
        duration: "18:45",
        views: "2.8k",
        rating: 4.8,
      },
      {
        id: 3,
        title: "Văn xuôi hiện đại - Ngữ văn 11",
        subject: "Ngữ văn",
        grade: "Lớp 11",
        thumbnail:
          "https://via.placeholder.com/300x200/06b6d4/ffffff?text=Video+Demo",
        duration: "22:15",
        views: "1.9k",
        rating: 4.6,
      },
    ],
  };

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full mb-6">
            <svg
              className="w-4 h-4 text-emerald-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
            <span className="text-sm font-medium text-emerald-700">
              Nội dung mẫu
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Nội dung mẫu đã tạo
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Xem các slide và video bài giảng được tạo theo chương trình chuẩn.
            <span className="font-semibold text-emerald-600">
              {" "}
              Chất lượng chuyên nghiệp, sẵn sàng sử dụng
            </span>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("slides")}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  activeTab === "slides"
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Slide bài giảng
                </div>
              </button>
              <button
                onClick={() => setActiveTab("videos")}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  activeTab === "videos"
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  Video bài giảng
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {sampleContent[activeTab].map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="relative overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                {/* Play button for videos */}
                {activeTab === "videos" && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-8 h-8 text-gray-900 ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Duration badge */}
                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  {item.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Subject badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {item.subject}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {item.grade}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300 line-clamp-2">
                  {item.title}
                </h3>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{item.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{item.rating}</span>
                    </div>
                  </div>

                  <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                    <span>Xem</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
              10,000+
            </div>
            <div className="text-gray-600">Slide đã tạo</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
              5,000+
            </div>
            <div className="text-gray-600">Video bài giảng</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
              15+
            </div>
            <div className="text-gray-600">Môn học</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
              98%
            </div>
            <div className="text-gray-600">Hài lòng</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExampleVideosSection;
