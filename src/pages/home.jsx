import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generalAPI } from "../services/apiService";
import { addNotification } from "../store/slices/notificationSlice";
import HeroSection from "../component/home/HeroSection";
import DemoSection from "../component/home/DemoSection";
import HowItWorksSection from "../component/home/HowItWorksSection";
import FeaturesSection from "../component/home/FeaturesSection";
import ExampleVideosSection from "../component/home/ExampleVideosSection";
import CTASection from "../component/home/CTASection";
import {
  FileText,
  Users,
  Play,
  Presentation,
  Brain,
  GraduationCap,
  Zap,
  Award,
} from "lucide-react";

const HomePage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedMode, setSelectedMode] = useState("slides");
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [subjects, setSubjects] = useState([]);
  const [grades] = useState([12]);
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Fetch subjects when component mounts
  useEffect(() => {
    fetchSubjects();
  }, []);

  // Fetch chapters when subject and grade change
  useEffect(() => {
    if (selectedSubject && selectedGrade) {
      fetchChapters(selectedSubject, selectedGrade);
    }
  }, [selectedSubject, selectedGrade]);

  // Fetch subjects from API
  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      const result = await dispatch(generalAPI.getSubjects());
      setSubjects(result);
      if (result.length > 0) {
        setSelectedSubject(result[0]);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      dispatch(
        addNotification({
          type: "error",
          message: "Không thể tải danh sách môn học. Vui lòng thử lại sau.",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch chapters from API
  const fetchChapters = async (subject, grade) => {
    try {
      setIsLoading(true);
      const result = await dispatch(generalAPI.getChapters(subject, grade));
      setChapters(result);
      setSelectedChapter("");
    } catch (error) {
      console.error("Error fetching chapters:", error);
      dispatch(
        addNotification({
          type: "error",
          message: "Không thể tải danh sách bài học. Vui lòng thử lại sau.",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };
  // Templates (slide types)
  const slideTypes = [
    {
      value: 1,
      label: "Slide cơ bản",
      description: "Văn bản + hình ảnh đơn giản",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      value: 2,
      label: "Slide tương tác",
      description: "Có câu hỏi và bài tập",
      icon: <Users className="w-6 h-6" />,
    },
    {
      value: 3,
      label: "Slide hoạt hình",
      description: "Có animation và hiệu ứng",
      icon: <Play className="w-6 h-6" />,
    },
    {
      value: 4,
      label: "Slide thực hành",
      description: "Bài tập và ví dụ minh họa",
      icon: <Presentation className="w-6 h-6" />,
    },
  ];

  // Modes (slides or video)
  const modeOptions = [
    { value: "slides", label: "Chỉ tạo slide" },
    { value: "video", label: "Tạo slide và video" },
  ];

  // Generate content
  const handleGenerate = async () => {
    if (!selectedSubject || !selectedGrade || !selectedChapter) {
      dispatch(
        addNotification({
          type: "warning",
          message: "Vui lòng chọn đầy đủ thông tin!",
        })
      );
      return;
    }

    setIsGenerating(true);
    setGeneratedContent(null);
    setGenerationProgress(0); // Simulate progress updates - slower and more realistic for AI generation
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        // Slower progress increments for more realistic AI generation time
        const increment =
          selectedMode === "video" ? Math.random() * 3 : Math.random() * 5;
        return Math.min(prev + increment, 95);
      });
    }, 2000); // Update every 2 seconds instead of 1 second

    try {
      // Debug: Log the request payload
      const requestPayload = {
        subject: selectedSubject,
        chapter: selectedChapter,
        grade: parseInt(selectedGrade),
        imageCategory: selectedSubject,
        template: 1, // Default template
        mode: selectedMode,
      };

      const result = await dispatch(generalAPI.generateContent(requestPayload));

      if (result.code === 200) {
        setGenerationProgress(100);
        setGeneratedContent(result);
        dispatch(
          addNotification({
            type: "success",
            message: "Tạo nội dung thành công!",
          })
        );
      } else {
        throw new Error(result.message || "Không thể tạo nội dung");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          headers: error.config?.headers,
        },
      });
      let errorMessage = "Không thể tạo nội dung. Vui lòng thử lại sau.";

      if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        errorMessage =
          "Quá trình tạo nội dung mất nhiều thời gian hơn dự kiến. Vui lòng thử lại với nội dung đơn giản hơn hoặc thử lại sau.";
      } else if (error.response?.status === 500) {
        errorMessage =
          "Lỗi server (500). Kiểm tra dữ liệu đầu vào hoặc liên hệ hỗ trợ.";
      } else if (error.response?.status === 400) {
        errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
      } else if (error.response?.status === 401) {
        errorMessage = "Không có quyền truy cập. Vui lòng đăng nhập lại.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      dispatch(
        addNotification({
          type: "error",
          message: errorMessage,
        })
      );
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  }; // Các tính năng nổi bật
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI thông minh",
      description:
        "Sử dụng công nghệ AI tiên tiến để tạo nội dung phù hợp với từng bài học",
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Chương trình chuẩn",
      description:
        "Nội dung được thiết kế theo chương trình giáo dục của Bộ GD&ĐT",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Tạo siêu nhanh",
      description:
        "Chỉ cần vài phút để có bài giảng hoàn chỉnh với chất lượng cao",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Chất lượng cao",
      description: "Slide và video được tối ưu hóa cho việc giảng dạy hiệu quả",
    },
  ]; // Các bước thực hiện
  const steps = [
    {
      step: 1,
      title: "Chọn môn học",
      description: "Chọn môn học bạn muốn tạo nội dung từ danh sách có sẵn",
    },
    {
      step: 2,
      title: "Chọn lớp và bài học",
      description: "Chọn lớp và bài học cụ thể từ chương trình giáo dục",
    },
    {
      step: 3,
      title: "Chọn loại nội dung",
      description: "Chọn tạo slide hoặc slide kèm video tùy nhu cầu",
    },
    {
      step: 4,
      title: "AI tạo nội dung",
      description: "AI sẽ tự động phân tích và tạo nội dung chất lượng cao",
    },
  ];

  // Example videos (có thể chuyển sang file riêng nếu muốn)
  const exampleVideos = [
    {
      id: 1,
      title: "Đại số - Lớp 12 - Hàm số lượng giác",
      khoi: "Lớp 12",
      chuong: "Đại số",
      slideType: "Slide cơ bản",
      duration: "8:25",
      thumbnail:
        "https://via.placeholder.com/640x360/4F46E5/FFFFFF?text=Hàm+số+lượng+giác",
      views: "1.2k",
      rating: "4.8",
    },
    {
      id: 2,
      title: "Vật lý - Lớp 12 - Sóng ánh sáng",
      khoi: "Lớp 12",
      chuong: "Vật lý",
      slideType: "Slide tương tác",
      duration: "12:15",
      thumbnail:
        "https://via.placeholder.com/640x360/A855F7/FFFFFF?text=Sóng+ánh+sáng",
      views: "870",
      rating: "4.7",
    },
    {
      id: 3,
      title: "Hóa học - Lớp 12 - Polime và vật liệu polime",
      khoi: "Lớp 12",
      chuong: "Hóa học",
      slideType: "Slide hoạt hình",
      duration: "14:30",
      thumbnail:
        "https://via.placeholder.com/640x360/EC4899/FFFFFF?text=Polime",
      views: "1.5k",
      rating: "4.9",
    },
    {
      id: 4,
      title: "Sinh học - Lớp 12 - Di truyền học",
      khoi: "Lớp 12",
      chuong: "Sinh học",
      slideType: "Slide thực hành",
      duration: "16:45",
      thumbnail:
        "https://via.placeholder.com/640x360/10B981/FFFFFF?text=Di+truyền+học",
      views: "2.1k",
      rating: "5.0",
    },
  ];

  // Các props chung
  const commonProps = {
    selectedSubject,
    setSelectedSubject,
    selectedGrade,
    setSelectedGrade,
    selectedChapter,
    setSelectedChapter,
    selectedMode,
    setSelectedMode,
    selectedTemplate,
    setSelectedTemplate,
    subjects,
    grades,
    chapters,
    isLoading,
    isGenerating,
    generatedContent,
    generationProgress,
    handleGenerate,
    exampleVideos,
  };

  return (
    <main className="flex-grow">
      <HeroSection />
      <DemoSection {...commonProps} />
      <HowItWorksSection />
      <FeaturesSection />
      <ExampleVideosSection exampleVideos={exampleVideos} />
      <CTASection />
    </main>
  );
};

export default HomePage;
