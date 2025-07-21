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
                    className="min-w-[220px] max-w-xs bg-gray-50 border rounded p-3 flex-shrink-0 flex flex-col justify-between shadow hover:shadow-md transition"
                  >
                    {video.thumbnailUrl && (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title || "Video"}
                        className="w-full h-28 object-cover rounded mb-2"
                      />
                    )}
                    <div className="font-medium truncate mb-1">
                      {video.title ||
                        video.name ||
                        `Video #${(videoPage - 1) * ITEMS_PER_PAGE + idx + 1}`}
                    </div>
                    {video.description && (
                      <div className="text-xs text-gray-500 mb-1 line-clamp-2">
                        {video.description}
                      </div>
                    )}
                    {video.createdAt && (
                      <div className="text-xs text-gray-400 mb-1">
                        {new Date(video.createdAt).toLocaleString()}
                      </div>
                    )}
                    <button
                      className="mt-auto px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
                      onClick={() =>
                        url && setPreview({ type: "video", url })
                      }
                      disabled={!url}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                );
              })}
          </div>
          {/* Xem chi tiết video in trực tiếp */}
          {preview && preview.type === "video" && (
            <div className="mt-8 p-6 bg-white rounded-lg border border-purple-200 shadow-md animate-in fade-in-50 duration-500">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-purple-700 flex items-center">
                  Video bài giảng
                </h3>
                <button
                  className="text-gray-500 hover:text-red-500 text-2xl font-bold"
                  onClick={() => setPreview(null)}
                  aria-label="Đóng"
                >
                  ×
                </button>
              </div>
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 mb-2">
                <video
                  src={preview.url}
                  className="absolute inset-0 w-full h-full"
                  controls
                  title="Video bài giảng"
                ></video>
              </div>
              <a
                href={preview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="!no-underline inline-block mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              >
                Mở trong tab mới
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoListSection; 