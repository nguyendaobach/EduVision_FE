import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import {
  Play,
  ChevronDown,
  Wand2,
  BookOpen,
  Users,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  GraduationCap,
  FileText,
  Presentation,
  AlertCircle,
  Loader,
  Sparkles,
  Brain,
  Zap,
  Award,
} from "lucide-react"
import api from "../services/api"
import { addNotification } from "../store/slices/notificationSlice"

const HomePage = () => {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("")
  const [selectedChapter, setSelectedChapter] = useState("")
  const [selectedMode, setSelectedMode] = useState("slides") // "slides" or "video"
  const [selectedTemplate, setSelectedTemplate] = useState(1)
  
  const [subjects, setSubjects] = useState([])
  const [grades, setGrades] = useState([12]) // Currently only grade 12 is supported
  const [chapters, setChapters] = useState([])
    const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState(null)
  const [generationProgress, setGenerationProgress] = useState(0)

  // Example videos for demonstration
  const exampleVideos = [
    {
      id: 1,
      title: "Đại số - Lớp 12 - Hàm số lượng giác",
      khoi: "Lớp 12",
      chuong: "Đại số",
      slideType: "Slide cơ bản",
      duration: "8:25",
      thumbnail: "https://via.placeholder.com/640x360/4F46E5/FFFFFF?text=Hàm+số+lượng+giác",
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
      thumbnail: "https://via.placeholder.com/640x360/A855F7/FFFFFF?text=Sóng+ánh+sáng",
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
      thumbnail: "https://via.placeholder.com/640x360/EC4899/FFFFFF?text=Polime",
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
      thumbnail: "https://via.placeholder.com/640x360/10B981/FFFFFF?text=Di+truyền+học",
      views: "2.1k",
      rating: "5.0",
    },
  ]

  // Fetch subjects when component mounts
  useEffect(() => {
    fetchSubjects()
  }, [])

  // Fetch chapters when subject and grade change
  useEffect(() => {
    if (selectedSubject && selectedGrade) {
      fetchChapters(selectedSubject, selectedGrade)
    }
  }, [selectedSubject, selectedGrade])

  // Fetch subjects from API
  const fetchSubjects = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/Education/subjects')
      if (response.data.code === 200) {
        setSubjects(response.data.result)
        if (response.data.result.length > 0) {
          setSelectedSubject(response.data.result[0])
        }
      }
    } catch (error) {
      console.error("Error fetching subjects:", error)
      dispatch(addNotification({
        type: 'error',
        message: 'Không thể tải danh sách môn học. Vui lòng thử lại sau.'
      }))
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch chapters from API
  const fetchChapters = async (subject, grade) => {
    try {
      setIsLoading(true)
      const response = await api.get(`/Education/chapters?subject=${subject}&grade=${grade}`)
      if (response.data.code === 200) {
        setChapters(response.data.result)
        setSelectedChapter("")
      }
    } catch (error) {
      console.error("Error fetching chapters:", error)
      dispatch(addNotification({
        type: 'error',
        message: 'Không thể tải danh sách bài học. Vui lòng thử lại sau.'
      }))
    } finally {
      setIsLoading(false)
    }
  }
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
  ]

  // Modes (slides or video)
  const modeOptions = [
    { value: "slides", label: "Chỉ tạo slide" },
    { value: "video", label: "Tạo slide và video" },
  ]

  // Test API function for debugging
  const testAPI = async () => {
    console.log('=== API DEBUG TEST ===');
    
    // Test 1: Simple fetch to check connectivity
    try {
      console.log('Testing basic API connectivity...');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/Education/subjects`);
      console.log('Basic fetch response:', response.status, response.statusText);
    } catch (error) {
      console.error('Basic fetch failed:', error);
    }

    // Test 2: Generate API call with detailed logging
    try {
      console.log('Testing generate API call...');
      const payload = {
        subject: "Toán",
        chapter: "Phép cộng",
        grade: 1,
        imageCategory: "Toán",
        template: 1,
        mode: "slides"
      };
      
      console.log('Test payload:', payload);
        // Try with raw fetch first
      const response = await fetch(`${import.meta.env.VITE_API_URL}/Education/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify(payload),
        // Set a very long timeout for AI generation
        signal: AbortSignal.timeout(300000) // 5 minutes
      });
      
      console.log('Raw fetch response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      const data = await response.json();
      console.log('Response data:', data);
      
    } catch (error) {
      console.error('Generate API test failed:', error);
    }
  };

  // Generate content
  const handleGenerate = async () => {
    if (!selectedSubject || !selectedGrade || !selectedChapter) {
      dispatch(addNotification({
        type: 'warning',
        message: 'Vui lòng chọn đầy đủ thông tin!'
      }))
      return
    }

    setIsGenerating(true)
    setGeneratedContent(null)
    setGenerationProgress(0)    // Simulate progress updates - slower and more realistic for AI generation
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        // Slower progress increments for more realistic AI generation time
        const increment = selectedMode === "video" ? Math.random() * 3 : Math.random() * 5;
        return Math.min(prev + increment, 95)
      })
    }, 2000); // Update every 2 seconds instead of 1 second

    try {
      // Debug: Log the request payload
      const requestPayload = {
        subject: selectedSubject,
        chapter: selectedChapter,
        grade: parseInt(selectedGrade),
        imageCategory: selectedSubject,
        template: 1, // Default template
        mode: selectedMode
      }
      
      console.log('API Request URL:', `${import.meta.env.VITE_API_URL}/Education/generate`)
      console.log('Request Payload:', requestPayload)
      console.log('Headers being sent:', {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : 'None'
      })

      const response = await api.post('/Education/generate', requestPayload);

      if (response.data.code === 200) {
        setGenerationProgress(100)
        setGeneratedContent(response.data.result)
        dispatch(addNotification({
          type: 'success',
          message: 'Tạo nội dung thành công!'
        }))
      } else {
        throw new Error(response.data.message || 'Không thể tạo nội dung')
      }    } catch (error) {
      console.error("Error generating content:", error)
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          headers: error.config?.headers
        }
      })
        let errorMessage = 'Không thể tạo nội dung. Vui lòng thử lại sau.'
      
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'Quá trình tạo nội dung mất nhiều thời gian hơn dự kiến. Vui lòng thử lại với nội dung đơn giản hơn hoặc thử lại sau.'
      } else if (error.response?.status === 500) {
        errorMessage = 'Lỗi server (500). Kiểm tra dữ liệu đầu vào hoặc liên hệ hỗ trợ.'
      } else if (error.response?.status === 400) {
        errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.'
      } else if (error.response?.status === 401) {
        errorMessage = 'Không có quyền truy cập. Vui lòng đăng nhập lại.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      dispatch(addNotification({
        type: 'error',
        message: errorMessage
      }))    } finally {
      clearInterval(progressInterval)
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }  // Các tính năng nổi bật
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI thông minh",
      description: "Sử dụng công nghệ AI tiên tiến để tạo nội dung phù hợp với từng bài học",
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Chương trình chuẩn",
      description: "Nội dung được thiết kế theo chương trình giáo dục của Bộ GD&ĐT",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Tạo siêu nhanh",
      description: "Chỉ cần vài phút để có bài giảng hoàn chỉnh với chất lượng cao",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Chất lượng cao",
      description: "Slide và video được tối ưu hóa cho việc giảng dạy hiệu quả",
    },
  ]// Các bước thực hiện
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
    },  ]
  
  // Removed duplicate testAPI function - keeping the first one only

  return (
    <main className="flex-grow">      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 text-white py-24 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-75"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-150"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Main heading with animated text */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
                <span className="block">Tạo bài giảng AI</span>
                <span className="block bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent animate-pulse">
                  thông minh & hiện đại
                </span>
              </h1>
              <div className="flex items-center justify-center space-x-2 mt-4">
                <Sparkles className="w-6 h-6 text-yellow-300 animate-bounce" />
                <span className="text-lg font-medium text-yellow-100">Được hỗ trợ bởi AI</span>
                <Sparkles className="w-6 h-6 text-yellow-300 animate-bounce delay-75" />
              </div>
            </div>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto leading-relaxed font-light">
              Chỉ cần chọn môn học và bài học - AI sẽ tự động tạo slide và video bài giảng 
              <span className="font-semibold text-yellow-200"> chuyên nghiệp trong vài phút</span>
            </p>
            
            {/* Features highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg py-3 px-4">
                <Brain className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium">AI Thông minh</span>
              </div>
              <div className="flex items-center justify-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg py-3 px-4">
                <Zap className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium">Tạo nhanh chóng</span>
              </div>
              <div className="flex items-center justify-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg py-3 px-4">
                <Award className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium">Chất lượng cao</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group relative bg-white text-purple-600 font-semibold py-4 px-8 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <span className="flex items-center justify-center">
                  <Wand2 className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Bắt đầu tạo ngay
                </span>
              </button>
              <button className="group border-2 border-white text-white font-semibold py-4 px-8 rounded-xl hover:bg-white hover:text-purple-600 transition-all duration-300 backdrop-blur-sm">
                <span className="flex items-center justify-center">
                  <Play className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  Xem demo
                </span>
              </button>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm opacity-80">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span>Miễn phí dùng thử</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span>Không cần cài đặt</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span>Tiết kiệm thời gian</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>      {/* Demo Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Dùng thử miễn phí</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Tạo bài giảng trong 
              <span className="text-purple-600"> 3 bước đơn giản</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Không cần kỹ năng thiết kế, không cần phần mềm phức tạp - chỉ cần vài cú click
            </p>          </div>

          {/* Debug Test Button - Remove after debugging */}
          <div className="text-center mb-8">
            <button 
              onClick={testAPI}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              🔧 Test API Debug
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">{/* Chọn môn */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  Chọn môn học
                </label>
                <div className="relative">
                  <select
                    value={selectedSubject}
                    onChange={(e) => {
                      setSelectedSubject(e.target.value)
                      setSelectedChapter("")
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
                  <GraduationCap className="w-4 h-4 inline mr-1" />
                  Chọn lớp
                </label>
                <div className="relative">
                  <select
                    value={selectedGrade}
                    onChange={(e) => {
                      setSelectedGrade(e.target.value)
                      setSelectedChapter("")
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
              </div>              {/* Chọn bài */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Chọn bài học
                </label>
                <div className="relative">
                  <select
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    disabled={!selectedSubject || !selectedGrade || isLoading || chapters.length === 0}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {isLoading ? "Đang tải bài học..." : 
                       !selectedSubject || !selectedGrade ? "Vui lòng chọn môn học và lớp trước" :
                       chapters.length === 0 ? "Không có bài học" : "Chọn bài học"}
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
              </div>            </div>

            {/* Chọn chế độ */}
            <div className="mb-8">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Chọn loại nội dung tạo</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {modeOptions.map((mode) => (
                  <div
                    key={mode.value}
                    onClick={() => setSelectedMode(mode.value)}
                    className={`border rounded-xl p-5 cursor-pointer transition-all duration-200 hover:scale-105 transform ${
                      selectedMode === mode.value
                        ? "border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-md"
                        : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 mr-3 rounded-full border-2 flex items-center justify-center ${
                            selectedMode === mode.value
                              ? "border-purple-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedMode === mode.value && (
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          )}
                        </div>
                        <span className={selectedMode === mode.value ? "text-purple-800 font-semibold" : "text-gray-700 font-medium"}>
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
            </div>            {/* Hiển thị thông tin đã chọn */}
            {(selectedSubject || selectedGrade || selectedChapter) && (
              <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 shadow-sm">
                <h4 className="font-semibold text-purple-900 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-purple-700" />
                  Thông tin bài giảng sẽ tạo:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedSubject && (
                    <div className="flex items-center text-sm text-purple-800 bg-white p-3 rounded-lg border border-purple-200 shadow-sm">
                      <BookOpen className="w-4 h-4 mr-2 text-purple-600" />
                      <span className="font-medium mr-1.5">Môn học:</span> 
                      <span className="font-semibold text-purple-900">{selectedSubject}</span>
                    </div>
                  )}
                  {selectedGrade && (
                    <div className="flex items-center text-sm text-purple-800 bg-white p-3 rounded-lg border border-purple-200 shadow-sm">
                      <GraduationCap className="w-4 h-4 mr-2 text-purple-600" />
                      <span className="font-medium mr-1.5">Lớp:</span> 
                      <span className="font-semibold text-purple-900">{selectedGrade}</span>
                    </div>
                  )}
                  {selectedChapter && (
                    <div className="flex items-center text-sm text-purple-800 bg-white p-3 rounded-lg border border-purple-200 shadow-sm">
                      <FileText className="w-4 h-4 mr-2 text-purple-600" />
                      <span className="font-medium mr-1.5">Bài học:</span> 
                      <span className="font-semibold text-purple-900">{selectedChapter}</span>
                    </div>
                  )}
                  {selectedMode && (
                    <div className="flex items-center text-sm text-purple-800 bg-white p-3 rounded-lg border border-purple-200 shadow-sm">
                      <Play className="w-4 h-4 mr-2 text-purple-600" />
                      <span className="font-medium mr-1.5">Loại:</span> 
                      <span className="font-semibold text-purple-900">{modeOptions.find(m => m.value === selectedMode)?.label}</span>
                    </div>
                  )}
                </div>
              </div>
            )}            {/* Nút tạo nội dung */}
            <div className="text-center">
              <button
                onClick={handleGenerate}
                disabled={!selectedSubject || !selectedGrade || !selectedChapter || isGenerating}
                className="group relative bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-5 px-12 rounded-xl hover:from-purple-600 hover:to-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none disabled:shadow-md"
              >
                {isGenerating ? (
                  <>
                    <Loader className="w-6 h-6 mr-3 animate-spin" />
                    <span className="text-lg">Đang tạo nội dung...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                    <span className="text-lg">Tạo {selectedMode === "slides" ? "slide" : "video"} bài giảng với AI</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>              <p className="text-sm text-gray-500 mt-3">
                ⚡ Thời gian tạo: {selectedMode === "slides" ? "1-3 phút" : "3-5 phút"} (tùy thuộc vào độ phức tạp)
              </p>
            </div>{/* Hiển thị kết quả */}
            {(generatedContent || isGenerating) && (
              <div className="mt-8 p-6 bg-white rounded-lg border border-purple-200 shadow-md animate-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-medium text-purple-800 mb-6 flex items-center">
                  {isGenerating ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin text-purple-600" />
                      Đang tạo nội dung...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 animate-pulse" />
                      Nội dung đã tạo thành công
                    </>
                  )}
                </h3>
                  {/* Hiển thị thông báo đang xử lý */}                {isGenerating && (
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Loader className="w-6 h-6 mr-3 animate-spin text-purple-600" />
                        <span className="text-gray-700 font-medium">
                          AI đang tạo {selectedMode === "slides" ? "slide" : "video"} chuyên nghiệp cho bạn...
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{Math.round(generationProgress)}%</span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${generationProgress}%` }}
                      ></div>
                    </div>
                    
                    <div className="text-xs text-gray-500 text-center mb-3">
                      {generationProgress < 20 && "Đang phân tích nội dung và chương trình học..."}
                      {generationProgress >= 20 && generationProgress < 40 && "Đang tạo outline và cấu trúc bài học..."}
                      {generationProgress >= 40 && generationProgress < 60 && "Đang tạo nội dung slide chi tiết..."}
                      {generationProgress >= 60 && generationProgress < 80 && selectedMode === "video" ? "Đang tạo script và audio cho video..." : "Đang tối ưu hóa slide..."}
                      {generationProgress >= 80 && generationProgress < 95 && selectedMode === "video" ? "Đang render video (có thể mất vài phút)..." : "Đang hoàn thiện slide..."}
                      {generationProgress >= 95 && "Đang hoàn tất và kiểm tra chất lượng..."}
                    </div>
                    
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-yellow-600 mr-2" />
                        <span className="text-sm text-yellow-800">
                          <strong>Lưu ý:</strong> Quá trình tạo nội dung AI có thể mất 
                          {selectedMode === "slides" ? " 1-3 phút" : " 3-5 phút"} 
                          tùy thuộc vào độ phức tạp. Vui lòng kiên nhẫn chờ đợi.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Hiển thị slide URL */}
                {!isGenerating && generatedContent && generatedContent.slideUrl && (
                  <div className="mb-8 animate-in fade-in-50 duration-700 delay-200">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-800 flex items-center">
                        <Presentation className="w-4 h-4 mr-2 text-purple-600" />
                        Slide bài giảng
                      </h4>
                      <a 
                        href={generatedContent.slideUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:text-purple-800 flex items-center hover:underline font-medium transition-colors duration-200"
                      >
                        Mở trong tab mới
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <iframe 
                        src={generatedContent.slideUrl}
                        className="absolute inset-0 w-full h-full"
                        frameBorder="0"
                        title="Slide bài giảng"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
                
                {/* Hiển thị video URL nếu có */}
                {!isGenerating && generatedContent && generatedContent.videoUrl && (
                  <div className="animate-in fade-in-50 duration-700 delay-300">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-800 flex items-center">
                        <Play className="w-4 h-4 mr-2 text-purple-600" />
                        Video bài giảng
                      </h4>
                      <a 
                        href={generatedContent.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:text-purple-800 flex items-center hover:underline font-medium transition-colors duration-200"
                      >
                        Mở trong tab mới
                        <ArrowRight className="w-4 h-4 ml-1" />
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
                {!isGenerating && generatedContent && (generatedContent.slideUrl || generatedContent.videoUrl) && (
                  <div className="mt-6 flex flex-wrap gap-3 animate-in fade-in-50 duration-700 delay-400">
                    {generatedContent.slideUrl && (
                      <a
                        href={generatedContent.slideUrl}
                        download
                        className="inline-flex items-center px-4 py-2 border border-purple-500 text-sm font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50 shadow-sm transition-colors duration-200 hover:scale-105 transform"
                      >
                        Tải slide
                      </a>
                    )}
                    {generatedContent.videoUrl && (
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
                        const urlToCopy = generatedContent.slideUrl || generatedContent.videoUrl;
                        navigator.clipboard.writeText(urlToCopy);
                        dispatch(addNotification({
                          type: 'success',
                          message: 'Đã sao chép liên kết vào clipboard!',
                          duration: 3000
                        }));
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
        </div>      </section>      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Brain className="w-4 h-4" />
              <span>Công nghệ AI thông minh</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Cách thức hoạt động
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Quy trình đơn giản và tự động với sức mạnh của trí tuệ nhân tạo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.step} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    {step.step}
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-10 -right-4 w-8 h-8 text-gray-300 group-hover:text-purple-500 transition-colors duration-300" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              <span>Tính năng nổi bật</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Tại sao chọn 
              <span className="text-purple-600"> EduVision AI?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Công nghệ AI tiên tiến kết hợp với chương trình giáo dục chuẩn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Videos */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nội dung mẫu đã tạo</h2>
            <p className="text-xl text-gray-600">Xem các slide và video bài giảng được tạo theo chương trình chuẩn</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {exampleVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200"
              >
                <div className="relative">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <button className="bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors duration-200">
                      <Play className="h-6 w-6 text-purple-600" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                  <div className="space-y-1 mb-3">
                    <p className="text-xs text-gray-500">Khối: {video.khoi}</p>
                    <p className="text-xs text-gray-500">{video.chuong}</p>
                    <p className="text-xs text-purple-600 font-medium">{video.slideType}</p>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{video.views} lượt xem</span>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 mr-1" />
                      <span>{video.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 text-white overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-75"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Sẵn sàng tạo bài giảng 
              <span className="block text-yellow-300">chỉ trong vài phút?</span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
              Tham gia cùng hàng nghìn giáo viên đã tin tưởng sử dụng EduVision AI
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <button className="group bg-white text-purple-600 font-semibold py-4 px-10 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <span className="flex items-center justify-center">
                <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Bắt đầu miễn phí ngay
              </span>
            </button>
            <button className="group border-2 border-white text-white font-semibold py-4 px-10 rounded-xl hover:bg-white hover:text-purple-600 transition-all duration-300 backdrop-blur-sm">
              <span className="flex items-center justify-center">
                <Play className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                Xem demo trực tiếp
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center justify-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg py-3 px-4">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>Không cần thẻ tín dụng</span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg py-3 px-4">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>Dùng thử miễn phí 7 ngày</span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg py-3 px-4">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
