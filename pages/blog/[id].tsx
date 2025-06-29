import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ReadingProgress from "../../components/ReadingProgress";
import {
  Calendar,
  Clock,
  Tag,
  User,
  ArrowLeft,
  BookOpen,
  Code,
  FolderTree,
  FileText,
  Share2,
  Heart,
  Bookmark,
  Copy,
  Check,
  Settings,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Moon,
  Download,
  FileImage,
  Printer,
  Maximize,
  Minimize,
  Eye,
  Hash,
  FileDown,
  Image as ImageIcon,
  ChevronUp,
  Coffee,
  Star,
  ThumbsUp,
  Loader2,
} from "lucide-react";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  readTime: number;
  createdAt: string;
  coverImage?: string;
  author: {
    name: string;
  };
}

export default function BlogDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reading enhancement states
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isLightMode, setIsLightMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showReadingTools, setShowReadingTools] = useState(false); // Initially hidden for mobile-first approach
  const [copiedText, setCopiedText] = useState("");
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Social interaction states
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (id) {
      fetchBlog(id as string);
    }
  }, [id]);

  // Responsive reading tools visibility
  useEffect(() => {
    const handleResize = () => {
      const isLargeScreen = window.innerWidth >= 1024; // lg breakpoint
      if (isLargeScreen) {
        setShowReadingTools(true); // Auto-show on large screens
      } else {
        setShowReadingTools(false); // Hide on mobile by default
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "=":
          case "+":
            event.preventDefault();
            setZoomLevel((prev) => Math.min(prev + 10, 200));
            break;
          case "-":
            event.preventDefault();
            setZoomLevel((prev) => Math.max(prev - 10, 50));
            break;
          case "0":
            event.preventDefault();
            setZoomLevel(100);
            break;
          case "p":
            event.preventDefault();
            window.print();
            break;
        }
      }

      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
        setShowControls(true);
      }

      if (event.key === "F11") {
        event.preventDefault();
        setIsFullscreen(!isFullscreen);
        setShowControls(!isFullscreen);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Enhanced scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const windowHeight = window.innerHeight;

      setShowBackToTop(scrolled > windowHeight * 0.3);

      const totalHeight = document.documentElement.scrollHeight - windowHeight;
      const progress = Math.min((scrolled / totalHeight) * 100, 100);

      const readingSpeed = 200;
      const totalWords = blog?.content.split(" ").length || 0;
      const wordsRemaining = Math.max(0, totalWords * (1 - progress / 100));
      const timeRemaining = Math.ceil(wordsRemaining / readingSpeed);
      setReadingTime(timeRemaining);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [blog]);

  // Dark mode toggle
  useEffect(() => {
    if (!isLightMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isLightMode]);

  const fetchBlog = async (blogId: string) => {
    try {
      const response = await fetch(`/api/blogs/${blogId}`);
      if (!response.ok) {
        throw new Error("Blog not found");
      }
      const data = await response.json();
      setBlog(data);
    } catch (error) {
      console.error("Failed to fetch blog:", error);
      setError("Blog not found");
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    if (!articleRef.current || !blog) return;

    setIsGeneratingPDF(true);
    try {
      const canvas = await html2canvas(articleRef.current, {
        useCORS: true,
        backgroundColor: isLightMode ? "#ffffff" : "#111827",
        scale: 1,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${blog.title}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const exportToImage = async () => {
    if (!articleRef.current || !blog) return;

    setIsGeneratingImage(true);
    try {
      const canvas = await html2canvas(articleRef.current, {
        useCORS: true,
        backgroundColor: isLightMode ? "#ffffff" : "#111827",
        scale: 2,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `${blog.title}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error("Failed to export image:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setShowCopyAlert(true);
      setTimeout(() => setShowCopyAlert(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Blog Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Link
            href="/blogs"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            ← Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 reading-zoom-container ${
        isFullscreen ? "fixed inset-0 z-50" : "py-12"
      } ${
        isLightMode
          ? "bg-white text-gray-900"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
      } relative overflow-hidden`}
      style={{
        '--zoom-level': `${zoomLevel}%`,
      } as React.CSSProperties}
    >
      {/* Enhanced Reading Progress Bar */}
      <ReadingProgress position="top" />

      {/* Background Pattern */}
      {!isLightMode && (
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className="absolute inset-0 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
        />
      )}

      {/* Professional Floating Reading Controls */}
      {(showControls && showReadingTools) && (
        <div className="fixed right-4 lg:right-6 top-1/2 transform -translate-y-1/2 z-50 space-y-3">
          <div className="bg-white/98 dark:bg-gray-800/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-3 max-w-[60px] transition-all duration-300">
            {/* Zoom Controls */}
            <div className="flex flex-col items-center space-y-3 mb-4 pb-4 border-b border-gray-200/70 dark:border-gray-700/70">
              <button
                onClick={() => setZoomLevel((prev) => Math.min(prev + 10, 200))}
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-900/30 rounded-xl transition-all duration-200 group"
                title="Zoom in (Ctrl/Cmd + +)"
              >
                <ZoomIn className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2.5 py-1.5 bg-gray-100/80 dark:bg-gray-700/80 rounded-lg border border-gray-200/50 dark:border-gray-600/50">
                {zoomLevel}%
              </div>
              <button
                onClick={() => setZoomLevel((prev) => Math.max(prev - 10, 50))}
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-900/30 rounded-xl transition-all duration-200 group"
                title="Zoom out (Ctrl/Cmd + -)"
              >
                <ZoomOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-900/30 rounded-xl transition-all duration-200 group"
                title="Reset zoom (Ctrl/Cmd + 0)"
              >
                <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-300" />
              </button>
            </div>

            {/* Theme & Display Controls */}
            <div className="flex flex-col items-center space-y-3 mb-4 pb-4 border-b border-gray-200/70 dark:border-gray-700/70">
              <button
                onClick={() => setIsLightMode(!isLightMode)}
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50/80 dark:hover:bg-amber-900/30 rounded-xl transition-all duration-200 group"
                title="Toggle theme"
              >
                {isLightMode ? (
                  <Moon className="w-4 h-4 group-hover:-rotate-12 transition-transform duration-300" />
                ) : (
                  <Sun className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                )}
              </button>
              <button
                onClick={() => {
                  setIsFullscreen(!isFullscreen);
                  setShowControls(!isFullscreen);
                }}
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50/80 dark:hover:bg-green-900/30 rounded-xl transition-all duration-200 group"
                title="Toggle fullscreen (F11)"
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4 group-hover:scale-90 transition-transform" />
                ) : (
                  <Maximize className="w-4 h-4 group-hover:scale-110 transition-transform" />
                )}
              </button>
            </div>

            {/* Export & Actions */}
            <div className="flex flex-col items-center space-y-3">
              <button
                onClick={exportToPDF}
                disabled={isGeneratingPDF}
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200 disabled:opacity-50 group"
                title="Export as PDF (Ctrl/Cmd + P)"
              >
                {isGeneratingPDF ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                )}
              </button>
              <button
                onClick={exportToImage}
                disabled={isGeneratingImage}
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/80 dark:hover:bg-emerald-900/30 rounded-xl transition-all duration-200 disabled:opacity-50 group"
                title="Export as image"
              >
                {isGeneratingImage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ImageIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                )}
              </button>
              <button
                onClick={() => copyToClipboard(blog?.content || "")}
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/80 dark:hover:bg-purple-900/30 rounded-xl transition-all duration-200 group"
                title="Copy content"
              >
                <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => window.print()}
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/30 rounded-xl transition-all duration-200 group"
                title="Print"
              >
                <Printer className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-110"
          title="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Mobile Reading Tools Toggle - Floating Action Button */}
      <button
        onClick={() => setShowReadingTools(!showReadingTools)}
        className={`fixed bottom-6 right-20 z-50 lg:hidden p-3 rounded-full shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-110 ${
          showReadingTools
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-gray-600 hover:bg-gray-700 text-white"
        }`}
        title={showReadingTools ? "Hide reading tools" : "Show reading tools"}
      >
        <Settings 
          className={`w-5 h-5 transition-transform duration-200 ${
            showReadingTools ? "rotate-90" : ""
          }`} 
        />
      </button>

      {/* Reading Tools Hint for Mobile (when tools are hidden) */}
      {!showReadingTools && (
        <div className="fixed bottom-20 right-16 z-40 lg:hidden bg-black/80 text-white text-xs px-2 py-1 rounded-md opacity-60 pointer-events-none">
          Reading Tools
        </div>
      )}

      {/* Reading Time Indicator */}
      {blog && readingTime > 0 && (
        <div className="fixed bottom-6 left-6 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/60 dark:border-gray-700/60 px-4 py-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4" />
            <span>{readingTime} min left</span>
          </div>
        </div>
      )}

      {/* Copy Alert */}
      {showCopyAlert && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Content copied!</span>
          </div>
        </div>
      )}

      {/* Professional Header Navigation */}
      {!isFullscreen && (
        <header className="bg-white/98 dark:bg-gray-900/98 border-b border-gray-200/80 dark:border-gray-700/80 sticky top-0 z-40 backdrop-blur-xl transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link
                  href="/blogs"
                  className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 group"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">Back to Blogs</span>
                </Link>

                {/* Enhanced Breadcrumb */}
                {blog && (
                  <div className="hidden md:flex items-center space-x-2 text-sm">
                    <span className="text-gray-400">/</span>
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-200 rounded-full font-medium border border-blue-200/50 dark:border-blue-700/50 transition-all duration-300">
                      {blog.category}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-6">
                {/* Enhanced Reading Info */}
                {blog && (
                  <div className="hidden lg:flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">
                        {blog.readTime} min read
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isLiked
                        ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                        : "text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    }`}
                    title={isLiked ? "Unlike this post" : "Like this post"}
                  >
                    <Heart
                      className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                    />
                  </button>
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isSaved
                        ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    }`}
                    title={isSaved ? "Unsave this post" : "Save this post"}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
                    />
                  </button>
                  {/* Reading Tools Toggle Button */}
                  <button
                    onClick={() => setShowReadingTools(!showReadingTools)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      showReadingTools
                        ? "text-green-500 bg-green-50 dark:bg-green-900/20"
                        : "text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                    }`}
                    title={showReadingTools ? "Hide reading tools" : "Show reading tools"}
                  >
                    <Settings
                      className={`w-4 h-4 transition-transform duration-200 ${
                        showReadingTools ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Professional Main Content */}
      <main className="relative z-10">
        {/* Hero Section with Cover Image */}
        {blog.coverImage && (
          <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`${blog.coverImage ? "relative -mt-20" : "pt-8"}`}>
            <article
              ref={articleRef}
              className={`rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
                isLightMode
                  ? "bg-white"
                  : "bg-gray-800/90 backdrop-blur-sm border border-white/20"
              }`}
            >
              {/* Enhanced Article Header */}
              <div
                className={`p-8 border-b transition-colors ${
                  isLightMode ? "border-gray-200" : "border-gray-700"
                }`}
              >
                {/* Category Badge */}
                <div className="mb-6">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
                    <Tag className="w-4 h-4 mr-2" />
                    {blog.category}
                  </span>
                </div>

                {/* Enhanced Title */}
                <h1
                  className={`text-4xl font-bold mb-4 transition-colors ${
                    isLightMode ? "text-gray-900" : "text-white"
                  }`}
                >
                  {blog.title}
                </h1>

                {/* Enhanced Excerpt */}
                <p
                  className={`text-lg leading-relaxed mb-8 font-medium transition-colors ${
                    isLightMode ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  {blog.excerpt}
                </p>

                {/* Enhanced Meta Information */}
                <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-gray-600 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200/70 dark:border-gray-700/70">
                  <div className="flex items-center bg-white/90 dark:bg-gray-700/90 rounded-xl px-4 py-3 backdrop-blur-sm shadow-sm border border-gray-200/50 dark:border-gray-600/50 transition-all duration-300">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-lg">
                      {blog.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm lg:text-base">
                        {blog.author.name}
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                        Author
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center bg-white/90 dark:bg-gray-700/90 rounded-xl px-4 py-3 backdrop-blur-sm shadow-sm border border-gray-200/50 dark:border-gray-600/50 transition-all duration-300">
                    <Calendar className="w-4 h-4 lg:w-5 lg:h-5 mr-3 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm lg:text-base">
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                        Published
                      </p>
                    </div>
                  </div>

                  {blog.readTime && (
                    <div className="flex items-center bg-white/90 dark:bg-gray-700/90 rounded-xl px-4 py-3 backdrop-blur-sm shadow-sm border border-gray-200/50 dark:border-gray-600/50 transition-all duration-300">
                      <Clock className="w-4 h-4 lg:w-5 lg:h-5 mr-3 text-amber-600 dark:text-amber-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm lg:text-base">
                          {blog.readTime} min
                        </p>
                        <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                          Reading time
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 lg:gap-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-sm ${
                        isLiked
                          ? "text-white bg-gradient-to-r from-red-500 to-pink-600 shadow-lg"
                          : "text-gray-600 dark:text-gray-400 bg-white/80 dark:bg-gray-700/80 hover:bg-red-50 dark:hover:bg-red-900/30 border border-gray-200/70 dark:border-gray-600/70"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                      />
                      <span className="font-medium text-sm">Like</span>
                    </button>

                    <button
                      onClick={() => setIsSaved(!isSaved)}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-sm ${
                        isSaved
                          ? "text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg"
                          : "text-gray-600 dark:text-gray-400 bg-white/80 dark:bg-gray-700/80 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-gray-200/70 dark:border-gray-600/70"
                      }`}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
                      />
                      <span className="font-medium text-sm">Save</span>
                    </button>

                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: blog.title,
                            text: blog.excerpt,
                            url: window.location.href,
                          });
                        } else {
                          copyToClipboard(window.location.href);
                        }
                      }}
                      className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 bg-white/80 dark:bg-gray-700/80 hover:bg-green-50 dark:hover:bg-green-900/30 border border-gray-200/70 dark:border-gray-600/70 transition-all duration-300 transform hover:scale-105 shadow-sm"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="font-medium text-sm">Share</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Professional Article Content */}
              <div
                className="px-6 sm:px-8 lg:px-12 pb-8 lg:pb-12"
                ref={contentRef}
              >
                <div
                  className={`enhanced-prose max-w-none transition-all duration-300 zoom-${zoomLevel} ${
                    isLightMode ? "text-gray-900" : "text-gray-100"
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const codeString = String(children).replace(/\n$/, "");

                        return match ? (
                          <div className="relative group my-4">
                            <button
                              onClick={() => copyToClipboard(codeString)}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-all duration-200 z-10"
                              title="Copy code"
                            >
                              <Copy className="w-4 h-4 text-white" />
                            </button>
                            <SyntaxHighlighter
                              language={match[1]}
                              style={isLightMode ? vs : vscDarkPlus}
                              PreTag="div"
                              className="rounded-lg"
                              customStyle={{
                                margin: 0,
                                borderRadius: "0.5rem",
                                fontSize: "0.875em",
                              }}
                            >
                              {codeString}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code
                            className={`px-2 py-1 rounded text-sm ${
                              isLightMode
                                ? "bg-gray-100 text-gray-800"
                                : "bg-gray-800 text-gray-200"
                            }`}
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      blockquote({ children }) {
                        return (
                          <blockquote
                            className={`border-l-4 pl-6 py-2 my-6 italic ${
                              isLightMode
                                ? "border-blue-500 bg-blue-50 text-blue-900"
                                : "border-blue-400 bg-blue-900/20 text-blue-200"
                            }`}
                          >
                            {children}
                          </blockquote>
                        );
                      },
                      p({ children }) {
                        const textContent = children?.toString() || "";
                        return (
                          <p className="group relative mb-4 leading-relaxed">
                            {children}
                            {textContent.trim() && (
                              <button
                                onClick={() => copyToClipboard(textContent)}
                                className="opacity-0 group-hover:opacity-100 absolute top-0 right-0 p-1 bg-gray-700 hover:bg-gray-600 rounded transition-all duration-200"
                                title="Copy paragraph"
                              >
                                <Copy className="w-3 h-3 text-white" />
                              </button>
                            )}
                          </p>
                        );
                      },
                      table({ children }) {
                        return (
                          <div className="overflow-x-auto my-8">
                            <table
                              className={`min-w-full border-collapse rounded-lg overflow-hidden shadow-lg ${
                                isLightMode
                                  ? "border border-gray-300"
                                  : "border border-gray-600"
                              }`}
                            >
                              {children}
                            </table>
                          </div>
                        );
                      },
                      thead({ children }) {
                        return (
                          <thead
                            className={`${
                              isLightMode ? "bg-gray-50" : "bg-gray-700"
                            }`}
                          >
                            {children}
                          </thead>
                        );
                      },
                      tbody({ children }) {
                        return (
                          <tbody
                            className={`divide-y ${
                              isLightMode
                                ? "divide-gray-200 bg-white"
                                : "divide-gray-600 bg-gray-800"
                            }`}
                          >
                            {children}
                          </tbody>
                        );
                      },
                      tr({ children }) {
                        return (
                          <tr
                            className={`transition-colors hover:${
                              isLightMode ? "bg-gray-50" : "bg-gray-700"
                            }`}
                          >
                            {children}
                          </tr>
                        );
                      },
                      th({ children }) {
                        return (
                          <th
                            className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${
                              isLightMode
                                ? "text-gray-900 border-gray-300"
                                : "text-gray-100 border-gray-600"
                            }`}
                          >
                            {children}
                          </th>
                        );
                      },
                      td({ children }) {
                        return (
                          <td
                            className={`px-6 py-4 text-sm whitespace-nowrap ${
                              isLightMode
                                ? "text-gray-900 border-gray-300"
                                : "text-gray-100 border-gray-600"
                            }`}
                          >
                            {children}
                          </td>
                        );
                      },
                      h1: ({ children }) => (
                        <h1 className="flex items-center group">
                          <Hash className="w-6 h-6 mr-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="flex items-center group">
                          <Hash className="w-5 h-5 mr-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="flex items-center group">
                          <Hash className="w-4 h-4 mr-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {children}
                        </h3>
                      ),
                      img: ({ src, alt }) => (
                        <div className="my-8 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                          <img
                            src={src}
                            alt={alt}
                            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                          />
                          {alt && (
                            <div
                              className={`px-4 py-2 text-sm text-center ${
                                isLightMode
                                  ? "bg-gray-50 text-gray-600"
                                  : "bg-gray-800 text-gray-400"
                              }`}
                            >
                              {alt}
                            </div>
                          )}
                        </div>
                      ),
                    }}
                  >
                    {blog.content}
                  </ReactMarkdown>
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>

      {/* Professional Tags Section */}
      {blog.tags && blog.tags.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div
            className={`rounded-2xl shadow-xl p-6 lg:p-8 transition-colors ${
              isLightMode
                ? "bg-white border border-gray-200"
                : "bg-gray-800/90 backdrop-blur-sm border border-white/20"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-4 flex items-center transition-colors ${
                isLightMode ? "text-gray-900" : "text-white"
              }`}
            >
              <Tag className="w-5 h-5 mr-2 text-blue-500" />
              Related Topics
            </h3>
            <div className="flex flex-wrap gap-3">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-medium border border-blue-200/50 dark:border-blue-700/50 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Enhanced CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16">
        <div
          className={`rounded-3xl shadow-2xl p-8 lg:p-12 text-center transition-colors ${
            isLightMode
              ? "bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200/50"
              : "bg-gray-800 border border-gray-700/50"
          }`}
        >
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3
              className={`text-2xl lg:text-3xl font-bold mb-4 transition-colors ${
                isLightMode ? "text-gray-900" : "text-white"
              }`}
            >
              Enjoyed this article?
            </h3>
            <p
              className={`mb-8 leading-relaxed transition-colors ${
                isLightMode ? "text-gray-600" : "text-gray-300"
              }`}
            >
              Discover more insightful content on programming, development, and
              technology. Join our community of learners and stay updated with
              the latest trends.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blogs"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                More Articles
              </Link>
              <Link
                href="/topics"
                className={`inline-flex items-center px-6 py-3 font-semibold rounded-xl border shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
                  isLightMode
                    ? "bg-white text-gray-900 border-gray-200"
                    : "bg-gray-700 text-white border-gray-600"
                }`}
              >
                <FolderTree className="w-5 h-5 mr-2" />
                Browse Topics
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
