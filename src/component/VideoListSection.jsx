import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const VideoListSection = ({
  videos,
  loadingVideos,
  errorVideos,
  videoPage,
  setVideoPage,
  videoTotal,
  ITEMS_PER_PAGE,
  preview,
  setPreview
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Danh sách Video của bạn
      </h2>
      {loadingVideos ? (
        <div>Đang tải video...</div>
      ) : errorVideos ? (
        <div className="text-red-500">{errorVideos}</div>
      ) : videos.length === 0 ? (
        <div>Chưa có video nào.</div>
      ) : (
        <div>
          <div className="flex items-center mb-2">
            <button
              className="px-2 py-1 mr-2 rounded disabled:opacity-50"
              onClick={() => setVideoPage((p) => Math.max(1, p - 1))}
              disabled={videoPage === 1}
            >
              <FaChevronLeft />
            </button>
            <span className="text-sm text-gray-600">
              Trang {videoPage} / {Math.ceil(videoTotal / ITEMS_PER_PAGE) || 1}
            </span>
            <button
              className="px-2 py-1 ml-2 rounded disabled:opacity-50"
              onClick={() => setVideoPage((p) => Math.min(Math.ceil(videoTotal / ITEMS_PER_PAGE), p + 1))}
              disabled={videoPage >= Math.ceil(videoTotal / ITEMS_PER_PAGE)}
            >
              <FaChevronRight />
            </button>
          </div>
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {videos
              .slice(
                (videoPage - 1) * ITEMS_PER_PAGE,
                videoPage * ITEMS_PER_PAGE
              )
              .map((video, idx) => {
                const url = video.videoUrl || video.url || video.link;
                return (
                  <div
                    key={video.id || idx}
                    className="min-w-[300px] max-w-sm bg-white border rounded-lg p-4 flex-shrink-0 shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    {/* Video Preview */}
                    {url && (
                      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mb-3">
                        <video
                          src={url}
                          className="absolute inset-0 w-full h-full object-cover"
                          controls
                          title={video.title || `Video #${(videoPage - 1) * ITEMS_PER_PAGE + idx + 1}`}
                          preload="metadata"
                        ></video>
                      </div>
                    )}
                    
                    {/* Video Info */}
                    <div className="space-y-2">
                      <div className="font-semibold text-gray-800 truncate">
                        {video.title ||
                          video.name ||
                          `Video #${(videoPage - 1) * ITEMS_PER_PAGE + idx + 1}`}
                      </div>
                      {video.description && (
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {video.description}
                        </div>
                      )}
                      {video.createdAt && (
                        <div className="text-xs text-gray-400">
                          📅 {new Date(video.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      )}
                      
                      {/* Action Button */}
                      {url && (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors duration-200 no-underline"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Mở toàn màn hình
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoListSection; 