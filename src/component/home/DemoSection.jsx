import React, { useState } from "react";
import {
  BookOpen,
  GraduationCap,
  FileText,
  ChevronDown,
  Loader,
  CheckCircle,
  AlertCircle,
  Play,
  Sparkles,
  ArrowRight,
  Presentation,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { generalAPI } from "../../services/apiService";
import { useEffect } from "react";
import { listenFcmMessage } from "../../utils/firebase";
import { useNotify } from "../../hooks/redux";
import { FaShapes } from "react-icons/fa";

const DemoSection = ({
  selectedSubject,
  setSelectedSubject,
  selectedGrade,
  setSelectedGrade,
  selectedChapter,
  setSelectedChapter,
  selectedMode,
  setSelectedMode,
  subjects,
  grades,
  chapters,
  isLoading,
}) => {
  const dispatch = useDispatch();
  // Sử dụng state nội bộ nếu không truyền từ props
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [template, setTemplate] = useState(1);
  const notify = useNotify();

  useEffect(() => {
    listenFcmMessage((payload) => {
      const { notification, data } = payload;
      if (data?.type === "slide_generated") {
        notify.success("Slide mới đã được tạo!");
        if (data.slideUrl) setGeneratedContent({ slideUrl: data.slideUrl }); // Only slide
      } else if (data?.type === "video_generated") {
        notify.success("Video mới đã được tạo!");
        if (data.videoUrl) setGeneratedContent({ videoUrl: data.videoUrl }); // Only video
      } else if (data?.type === "slide_and_video_generated") {
        if (selectedMode === "slides" && data.slideUrl) {
          setGeneratedContent({ slideUrl: data.slideUrl });
        } else if (selectedMode === "video" && data.videoUrl) {
          setGeneratedContent({ videoUrl: data.videoUrl });
        } else {
          setGeneratedContent(null);
        }
        notify.success("Nội dung đã được tạo!");
      } else {
        notify.info(notification?.title || "Thông báo mới", notification?.body);
      }
    });
  }, [notify, selectedMode]);

  // Hàm gọi đúng API tạo slide hoặc video
  const handleCreate = async () => {
    if (!selectedSubject || !selectedGrade || !selectedChapter) return;
    setIsGenerating(true);
    setGeneratedContent(null);
    setGenerationProgress(0);
    const payload = {
      subject: selectedSubject,
      chapter: selectedChapter,
      grade: Number(selectedGrade),
      imageCategory: selectedSubject,
      template: template,
      mode: selectedMode,
    };
    console.log("Payload gửi lên:", payload);
    try {
      let result;
      if (selectedMode === "slides") {
        result = await dispatch(generalAPI.createSlides(payload));
      } else {
        result = await dispatch(generalAPI.createVideo(payload));
      }
      const data = result?.payload || result;
      console.log("Kết quả trả về:", data);
      if (selectedMode === "slides" && data && data.slideUrl) {
        setGeneratedContent({ slideUrl: data.slideUrl });
      } else if (selectedMode === "video" && data && data.videoUrl) {
        setGeneratedContent({ videoUrl: data.videoUrl });
      } else {
        setGeneratedContent(null);
      }
      setGenerationProgress(100);
    } catch (error) {
      setGeneratedContent(null);
      console.error("Lỗi tạo nội dung:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Tạo bài giảng trong{" "}
          <span className="text-purple-600">3 bước đơn giản</span>
        </h2>
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Chọn môn */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 inline mr-1" /> Chọn môn học
              </label>
              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setSelectedChapter("");
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                  disabled={isLoading || subjects.length === 0}
                >
                  {subjects.length === 0 ? (
                    <option value="">Đang tải...</option>
                  ) : (
                    subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {/* Chọn lớp */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <GraduationCap className="w-4 h-4 inline mr-1" /> Chọn lớp
              </label>
              <div className="relative">
                <select
                  value={selectedGrade}
                  onChange={(e) => {
                    setSelectedGrade(e.target.value);
                    setSelectedChapter("");
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Chọn lớp</option>
                  {grades.map((grade) => (
                    <option key={grade} value={grade}>
                      Lớp {grade}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {/* Chọn bài */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" /> Chọn bài học
              </label>
              <div className="relative">
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  disabled={
                    !selectedSubject ||
                    !selectedGrade ||
                    isLoading ||
                    chapters.length === 0
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {isLoading
                      ? "Đang tải bài học..."
                      : !selectedSubject || !selectedGrade
                        ? "Vui lòng chọn môn học và lớp trước"
                        : chapters.length === 0
                          ? "Không có bài học"
                          : "Chọn bài học"}
                  </option>
                  {chapters.map((chapter) => (
                    <option key={chapter} value={chapter}>
                      {chapter}
                    </option>
                  ))}
                </select>
                {isLoading ? (
                  <Loader className="absolute right-3 top-3.5 h-5 w-5 text-purple-500 animate-spin pointer-events-none" />
                ) : (
                  <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                )}
              </div>
            </div>
          </div>
          {/* Chọn template */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaShapes className="w-4 h-4 inline mr-1" /> Chọn template
            </label>
            <div className="relative">
              <select
                value={template}
                onChange={(e) => setTemplate(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
              >
                {[1, 2, 3, 4].map((tpl) => (
                  <option key={tpl} value={tpl}>
                    Template {tpl}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          {/* Chọn chế độ */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-700 mb-4">
              Chọn loại nội dung tạo
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { value: "slides", label: "Tạo slides" },
                { value: "video", label: "Tạo video" },
              ].map((mode) => (
                <div
                  key={mode.value}
                  onClick={() => setSelectedMode(mode.value)}
                  className={`border rounded-xl p-5 cursor-pointer transition-all duration-200 hover:scale-105 transform ${selectedMode === mode.value
                    ? "border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-md"
                    : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 hover:shadow-sm"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 mr-3 rounded-full border-2 flex items-center justify-center ${selectedMode === mode.value
                          ? "border-purple-500"
                          : "border-gray-300"
                          }`}
                      >
                        {selectedMode === mode.value && (
                          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        )}
                      </div>
                      <span
                        className={
                          selectedMode === mode.value
                            ? "text-purple-800 font-semibold"
                            : "text-gray-700 font-medium"
                        }
                      >
                        {mode.label}
                      </span>
                    </div>
                    {selectedMode === mode.value && (
                      <CheckCircle className="w-5 h-5 text-purple-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Hiển thị thông tin đã chọn */}
          {(selectedSubject || selectedGrade || selectedChapter) && (
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 shadow-sm">
              <h4 className="font-semibold text-purple-900 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-purple-700" /> Thông
                tin bài giảng sẽ tạo:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedSubject && (
                  <div className="flex items-center text-sm text-purple-800 bg-white p-3 rounded-lg border border-purple-200 shadow-sm">
                    <BookOpen className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="font-medium mr-1.5">Môn học:</span>
                    <span className="font-semibold text-purple-900">
                      {selectedSubject}
                    </span>
                  </div>
                )}
                {selectedGrade && (
                  <div className="flex items-center text-sm text-purple-800 bg-white p-3 rounded-lg border border-purple-200 shadow-sm">
                    <GraduationCap className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="font-medium mr-1.5">Lớp:</span>
                    <span className="font-semibold text-purple-900">
                      {selectedGrade}
                    </span>
                  </div>
                )}
                {selectedChapter && (
                  <div className="flex items-center text-sm text-purple-800 bg-white p-3 rounded-lg border border-purple-200 shadow-sm">
                    <FileText className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="font-medium mr-1.5">Bài học:</span>
                    <span className="font-semibold text-purple-900">
                      {selectedChapter}
                    </span>
                  </div>
                )}
                {selectedMode && (
                  <div className="flex items-center text-sm text-purple-800 bg-white p-3 rounded-lg border border-purple-200 shadow-sm">
                    <Play className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="font-medium mr-1.5">Loại:</span>
                    <span className="font-semibold text-purple-900">
                      {selectedMode === "slides" ? "Tạo slides" : "Tạo video"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Nút tạo nội dung */}
          <div className="text-center">
            <button
              onClick={handleCreate}
              disabled={
                !selectedSubject ||
                !selectedGrade ||
                !selectedChapter ||
                isGenerating
              }
              className="group relative bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-5 px-12 rounded hover:from-purple-600 hover:to-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none disabled:shadow-md"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-6 h-6 mr-3 animate-spin" />
                  <span className="text-lg">Đang tạo nội dung...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                  <span className="text-lg">
                    Tạo {selectedMode === "slides" ? "slides" : "video"} bài
                    giảng với AI
                  </span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 mt-3">
              ⚡ Thời gian tạo:{" "}
              {selectedMode === "slides" ? "1-3 phút" : "3-5 phút"} (tùy thuộc
              vào độ phức tạp)
            </p>
          </div>
          {/* Hiển thị tiến trình và kết quả */}
          {(generatedContent || isGenerating) && (
            <div className="relative mt-8 p-6 bg-white rounded-lg border border-purple-200 shadow-md animate-in slide-in-from-bottom-4 duration-500">
              {/* Overlay loading khi đang tạo */}
              {isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 z-20 rounded-lg">
                  <Loader className="w-12 h-12 text-purple-600 animate-spin mb-2" />
                  <span className="text-lg font-semibold text-purple-700">Đang tạo nội dung...</span>
                </div>
              )}
              <h3 className="text-xl font-medium text-purple-800 mb-6 flex items-center">
                {isGenerating ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin text-purple-600" />{" "}
                    Đang tạo nội dung...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500 animate-pulse" />{" "}
                    Nội dung đã tạo thành công
                  </>
                )}
              </h3>
              {/* NỔI BẬT LINK SLIDE SAU KHI TẠO */}

              {isGenerating && (
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Loader className="w-6 h-6 mr-3 animate-spin text-purple-600" />
                      <span className="text-gray-700 font-medium">
                        AI đang tạo{" "}
                        {selectedMode === "slides" ? "slides" : "video"} chuyên
                        nghiệp cho bạn...
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {Math.round(generationProgress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 text-center mb-3">
                    {generationProgress < 20 &&
                      "Đang phân tích nội dung và chương trình học..."}
                    {generationProgress >= 20 &&
                      generationProgress < 40 &&
                      "Đang tạo outline và cấu trúc bài học..."}
                    {generationProgress >= 40 &&
                      generationProgress < 60 &&
                      "Đang tạo nội dung slides chi tiết..."}
                    {generationProgress >= 60 &&
                      generationProgress < 80 &&
                      (selectedMode === "video"
                        ? "Đang tạo script và audio cho video..."
                        : "Đang tối ưu hóa slides...")}
                    {generationProgress >= 80 &&
                      generationProgress < 95 &&
                      (selectedMode === "video"
                        ? "Đang render video (có thể mất vài phút)..."
                        : "Đang hoàn thiện slides...")}
                    {generationProgress >= 95 &&
                      "Đang hoàn tất và kiểm tra chất lượng..."}
                  </div>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                    <div className="flex items-center">
                      <span className="text-sm text-yellow-800">
                        <strong>Lưu ý:</strong> Quá trình tạo nội dung AI có thể
                        mất{" "}
                        {selectedMode === "slides" ? " 1-3 phút" : " 3-5 phút"}{" "}
                        tùy thuộc vào độ phức tạp. Vui lòng kiên nhẫn chờ đợi.
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {/* Hiển thị slide URL */}
              {!isGenerating &&
                generatedContent &&
                generatedContent.slideUrl &&
                selectedMode === "slides" && (
                  <div className="mb-8 animate-in fade-in-50 duration-700 delay-200">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-800 flex items-center">
                        <Presentation className="w-4 h-4 mr-2 text-purple-600" />{" "}
                        Slides bài giảng
                      </h4>
                      <a
                        href={generatedContent.slideUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:text-purple-800 flex items-center hover:underline font-medium transition-colors duration-200"
                      >
                        Mở trong tab mới <ArrowRight className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <iframe
                        src={generatedContent.slideUrl}
                        className="absolute inset-0 w-full h-full"
                        frameBorder="0"
                        title="Slides bài giảng"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
              {/* Hiển thị video URL nếu có */}
              {!isGenerating &&
                generatedContent &&
                generatedContent.videoUrl &&
                selectedMode === "video" && (
                  <div className="animate-in fade-in-50 duration-700 delay-300">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-800 flex items-center">
                        <Play className="w-4 h-4 mr-2 text-purple-600" /> Video
                        bài giảng
                      </h4>
                      <a
                        href={generatedContent.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:text-purple-800 flex items-center hover:underline font-medium transition-colors duration-200"
                      >
                        Mở trong tab mới <ArrowRight className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <video
                        src={generatedContent.videoUrl}
                        className="absolute inset-0 w-full h-full"
                        controls
                        title="Video bài giảng"
                      ></video>
                    </div>
                  </div>
                )}
              {/* Nút tải xuống hoặc chia sẻ */}
              {!isGenerating &&
                generatedContent &&
                ((generatedContent.slideUrl && selectedMode === "slides") ||
                  (generatedContent.videoUrl && selectedMode === "video")) && (
                  <div className="mt-6 flex flex-wrap gap-3 animate-in fade-in-50 duration-700 delay-400">
                    {generatedContent.slideUrl && selectedMode === "slides" && (
                      <a
                        href={generatedContent.slideUrl}
                        download
                        className="inline-flex items-center px-4 py-2 border border-purple-500 text-sm font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50 shadow-sm transition-colors duration-200 hover:scale-105 transform"
                      >
                        Tải slide
                      </a>
                    )}
                    {generatedContent.videoUrl && selectedMode === "video" && (
                      <a
                        href={generatedContent.videoUrl}
                        download
                        className="inline-flex items-center px-4 py-2 border border-purple-500 text-sm font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50 shadow-sm transition-colors duration-200 hover:scale-105 transform"
                      >
                        Tải video
                      </a>
                    )}
                    <button
                      onClick={() => {
                        const urlToCopy =
                          (selectedMode === "slides"
                            ? generatedContent.slideUrl
                            : generatedContent.videoUrl) || "";
                        if (urlToCopy) navigator.clipboard.writeText(urlToCopy);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors duration-200 hover:scale-105 transform"
                    >
                      Sao chép liên kết
                    </button>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
