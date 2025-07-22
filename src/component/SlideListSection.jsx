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
              {slides.map((slide, idx) => {
                const url = slide.slideUrl || slide.url || slide.link;
                return (
                  <div
                    key={slide.id || idx}
                    className="min-w-[300px] max-w-sm bg-white border rounded-lg p-4 flex-shrink-0 shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    {/* Slide Preview */}
                    {url && (
                      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mb-3">
                        <iframe
                          src={url}
                          className="absolute inset-0 w-full h-full"
                          title={slide.title || `Slide #${(slidePage - 1) * ITEMS_PER_PAGE + idx + 1}`}
                          frameBorder="0"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                    
                    {/* Slide Info */}
                    <div className="space-y-2">
                      <div className="font-semibold text-gray-800 truncate">
                        {slide.title ||
                          slide.name ||
                          `Slide #${(slidePage - 1) * ITEMS_PER_PAGE + idx + 1}`}
                      </div>
                      {slide.description && (
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {slide.description}
                        </div>
                      )}
                      {slide.createdAt && (
                        <div className="text-xs text-gray-400">
                          📅 {new Date(slide.createdAt).toLocaleDateString('vi-VN')}
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
    </div>
  );
};

export default SlideListSection; 