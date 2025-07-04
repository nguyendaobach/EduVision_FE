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
