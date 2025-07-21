import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const SlideListSection = ({
  slides,
  loadingSlides,
  errorSlides,
  slidePage,
  setSlidePage,
  slideTotal,
  ITEMS_PER_PAGE,
  preview,
  setPreview
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Danh sách Slide của bạn
      </h2>
      <div>
        <div className="flex items-center mb-2">
          <button
            className="px-2 py-1 mr-2 rounded disabled:opacity-50"
            onClick={() => setSlidePage((p) => Math.max(1, p - 1))}
            disabled={slidePage === 1}
          >
            <FaChevronLeft />
          </button>
          <span className="text-sm text-gray-600">
            Trang {slidePage} / {Math.ceil(slideTotal / ITEMS_PER_PAGE) || 1}
          </span>
          <button
            className="px-2 py-1 ml-2 rounded disabled:opacity-50"
            onClick={() => setSlidePage((p) => Math.min(Math.ceil(slideTotal / ITEMS_PER_PAGE), p + 1))}
            disabled={slidePage >= Math.ceil(slideTotal / ITEMS_PER_PAGE)}
          >
            <FaChevronRight />
          </button>
        </div>
        {loadingSlides ? (
          <div>Đang tải slide...</div>
        ) : errorSlides ? (
          <div className="text-red-500">{errorSlides}</div>
        ) : slides.length === 0 ? (
          <div>Chưa có slide nào.</div>
        ) : (
          <div>
            <div className="flex overflow-x-auto space-x-4 pb-2">
              {slides
                .slice(
                  (slidePage - 1) * ITEMS_PER_PAGE,
                  slidePage * ITEMS_PER_PAGE
                )
                .map((slide, idx) => {
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
                          `Slide #${(slidePage - 1) * ITEMS_PER_PAGE + idx + 1}`}
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
                        onClick={() =>
                          url && setPreview({ type: "slide", url })
                        }
                        disabled={!url}
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  );
                })}
            </div>
            {/* Xem chi tiết slide in trực tiếp */}
            {preview && preview.type === "slide" && (
              <div className="mt-8 p-6 bg-white rounded-lg border border-purple-200 shadow-md animate-in fade-in-50 duration-500">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-purple-700 flex items-center">
                    Slide bài giảng
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
                  <iframe
                    src={preview.url}
                    className="absolute inset-0 w-full h-full"
                    title="Slide bài giảng"
                    frameBorder="0"
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
        )}
      </div>
    </div>
  );
};

export default SlideListSection; 