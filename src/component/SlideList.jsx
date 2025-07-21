import React from "react";

const SlideSkeleton = ({ count = 10 }) => (
  <div className="flex space-x-4 pb-2">
    {[...Array(count)].map((_, idx) => (
      <div
        key={idx}
        className="min-w-[220px] max-w-xs bg-gray-100 border rounded p-3 flex-shrink-0 animate-pulse"
        style={{ height: 180 }}
      >
        <div className="w-full h-28 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-1 w-2/3"></div>
        <div className="h-3 bg-gray-200 rounded mb-1 w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    ))}
  </div>
);

const SlideList = ({
  slides = [],
  loading = false,
  error = null,
  page = 1,
  total = 0,
  onPageChange = () => {},
  ITEMS_PER_PAGE = 10,
  onPreview = () => {},
  preview = null,
}) => {
  return (
    <div>
      <div className="flex items-center mb-2">
        <button
          className="px-2 py-1 mr-2 rounded disabled:opacity-50"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          ◀
        </button>
        <span className="text-sm text-gray-600">
          Trang {page} / {Math.ceil(total / ITEMS_PER_PAGE) || 1}
        </span>
        <button
          className="px-2 py-1 ml-2 rounded disabled:opacity-50"
          onClick={() => onPageChange(Math.min(Math.ceil(total / ITEMS_PER_PAGE), page + 1))}
          disabled={page >= Math.ceil(total / ITEMS_PER_PAGE)}
        >
          ▶
        </button>
      </div>
      {loading ? (
        <SlideSkeleton count={ITEMS_PER_PAGE} />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : slides.length === 0 ? (
        <div>Chưa có slide nào.</div>
      ) : (
        <div className="flex overflow-x-auto space-x-4 pb-2">
          {slides.map((slide, idx) => {
            const url = slide.slideUrl || slide.url || slide.link;
            return (
              <div
                key={slide.id || idx}
                className="min-w-[220px] max-w-xs bg-gray-50 border rounded p-3 flex-shrink-0 flex flex-col justify-between shadow hover:shadow-md transition"
              >
                {slide.thumbnailUrl && (
                  <img
                    src={slide.thumbnailUrl}
                    alt={slide.title || "Slide"}
                    className="w-full h-28 object-cover rounded mb-2"
                  />
                )}
                <div className="font-medium truncate mb-1">
                  {slide.title ||
                    slide.name ||
                    `Slide #${(page - 1) * ITEMS_PER_PAGE + idx + 1}`}
                </div>
                {slide.description && (
                  <div className="text-xs text-gray-500 mb-1 line-clamp-2">
                    {slide.description}
                  </div>
                )}
                {slide.createdAt && (
                  <div className="text-xs text-gray-400 mb-1">
                    {new Date(slide.createdAt).toLocaleString()}
                  </div>
                )}
                <button
                  className="mt-auto px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
                  onClick={() => url && onPreview({ type: "slide", url })}
                  disabled={!url}
                >
                  Xem chi tiết
                </button>
              </div>
            );
          })}
        </div>
      )}
      {/* Xem chi tiết slide in trực tiếp */}
      {preview && preview.type === "slide" && (
        <div className="mt-8 p-6 bg-white rounded-lg border border-purple-200 shadow-md animate-in fade-in-50 duration-500">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-purple-700 flex items-center">
              Slide bài giảng
            </h3>
            <button
              className="text-gray-500 hover:text-red-500 text-2xl font-bold"
              onClick={() => onPreview(null)}
              aria-label="Đóng"
            >
              ×
            </button>
          </div>
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 mb-2">
            <iframe
              src={preview.url}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              title="Slide bài giảng"
              allowFullScreen
            ></iframe>
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
  );
};

export default SlideList; 