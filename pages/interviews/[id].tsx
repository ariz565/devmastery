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
  Star,
  Loader2,
  Crown,
  ExternalLink,
  Video,
  File,
  Globe,
  Lock,
  Monitor,
  Book,
} from "lucide-react";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CommentSection from "../../components/CommentSection";
import YouTubeEmbed from "../../components/YouTubeEmbed";

interface InterviewResource {
  id: string;
  title: string;
  description: string;
  type:
    | "coding-question"
    | "study-guide"
    | "link"
    | "document"
    | "video"
    | "excel"
    | "image";
  category: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  url?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  content?: string;
  views: number;
  downloads: number;
  rating: number;
  isPremium: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
}

export default function InterviewResourceDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [resource, setResource] = useState<InterviewResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reading enhancement states
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isLightMode, setIsLightMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [copiedText, setCopiedText] = useState("");
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Social interaction states
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (id) {
      fetchResource();
    }
  }, [id]);

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
      const totalWords = resource?.content?.split(" ").length || 0;
      const wordsRemaining = Math.max(0, totalWords * (1 - progress / 100));
      const timeRemaining = Math.ceil(wordsRemaining / readingSpeed);
      setReadingTime(timeRemaining);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [resource]);

  // Light/Dark mode toggle
  useEffect(() => {
    if (!isLightMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isLightMode]);

  const fetchResource = async () => {
    try {
      const response = await fetch(`/api/interviews/${id}`);
      if (response.ok) {
        const data = await response.json();
        setResource(data);
      } else {
        setError("Resource not found");
      }
    } catch (error) {
      console.error("Failed to fetch resource:", error);
      setError("Failed to fetch resource");
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    if (!articleRef.current || !resource) return;

    setIsGeneratingPDF(true);
    try {
      const canvas = await html2canvas(articleRef.current, {
        useCORS: true,
        backgroundColor: isLightMode ? "#ffffff" : "#111827",
        scale: 1,
        logging: false,
      } as any);

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

      pdf.save(`${resource.title}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const exportToImage = async () => {
    if (!articleRef.current || !resource) return;

    setIsGeneratingImage(true);
    try {
      const canvas = await html2canvas(articleRef.current, {
        useCORS: true,
        backgroundColor: isLightMode ? "#ffffff" : "#111827",
        scale: 2,
        logging: false,
      } as any);

      const link = document.createElement("a");
      link.download = `${resource.title}.png`;
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

  const handleDownload = async () => {
    if (!resource) return;

    try {
      await fetch(`/api/interviews/${resource.id}/download`, {
        method: "POST",
      });

      if (resource.fileUrl) {
        const link = document.createElement("a");
        link.href = resource.fileUrl;
        link.download = resource.fileName || resource.title;
        link.click();
      }
    } catch (error) {
      console.error("Download failed:", error);
    }
  };



  const getTypeIcon = (type: string) => {
    switch (type) {
      case "coding-question":
        return Code;
      case "study-guide":
        return Book;
      case "link":
        return ExternalLink;
      case "document":
        return FileText;
      case "video":
        return Video;
      case "excel":
        return File;
      case "image":
        return Image;
      default:
        return FileText;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const formatContent = (content: string) => {
    if (!content) return "";

    // Enhanced markdown-like formatting
    return (
      content
        // Headers
        .replace(
          /^### (.*$)/gm,
          '<h3 class="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">$1</h3>'
        )
        .replace(
          /^## (.*$)/gm,
          '<h2 class="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">$1</h2>'
        )
        .replace(
          /^# (.*$)/gm,
          '<h1 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">$1</h1>'
        )

        // Code blocks with syntax highlighting
        .replace(
          /```(\w+)?\n([\s\S]*?)```/g,
          '<div class="my-4"><div class="bg-gray-800 text-gray-100 px-3 py-1 text-xs font-mono rounded-t-lg">$1</div><pre class="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto"><code>$2</code></pre></div>'
        )

        // Inline code
        .replace(
          /`([^`]+)`/g,
          '<code class="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-2 py-1 rounded text-sm font-mono">$1</code>'
        )

        // Bold and italic
        .replace(
          /\*\*\*(.*?)\*\*\*/g,
          '<strong class="font-bold"><em class="italic">$1</em></strong>'
        )
        .replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="font-bold text-gray-900 dark:text-white">$1</strong>'
        )
        .replace(
          /\*(.*?)\*/g,
          '<em class="italic text-gray-700 dark:text-gray-300">$1</em>'
        )
        // Lists
        .replace(/^\s*[-*+]\s+(.*$)/gm, '<li class="ml-4 mb-1">$1</li>')
        .replace(
          /(<li.*<\/li>)/g,
          '<ul class="list-disc list-inside space-y-1 my-3">$1</ul>'
        )

        // Numbered lists
        .replace(/^\s*\d+\.\s+(.*$)/gm, '<li class="ml-4 mb-1">$1</li>')

        // Links
        .replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
        )

        // Line breaks
        .replace(
          /\n\n/g,
          '</p><p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">'
        )
        .replace(/\n/g, "<br>")
    );
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

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Resource Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {error || "The interview resource you're looking for doesn't exist."}
          </p>
          <Link
            href="/interviews"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            ← Back to Interviews
          </Link>
        </div>
      </div>
    );
  }

  const TypeIcon = getTypeIcon(resource.type);

  return (
    <div
      className={`min-h-screen transition-all duration-300 zoom-container ${
        isFullscreen ? "fixed inset-0 z-50" : "py-12"
      } ${
        isLightMode
          ? "bg-white text-gray-900"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
      } relative overflow-hidden`}
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
      {showControls && (
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
                onClick={() => copyToClipboard(resource?.content || "")}
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

      {/* Reading Time Indicator */}
      {resource.content && readingTime > 0 && (
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
                  href="/interviews"
                  className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 group"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">Back to Interviews</span>
                </Link>

                {/* Enhanced Breadcrumb */}
                {resource && (
                  <div className="hidden md:flex items-center space-x-2 text-sm">
                    <span className="text-gray-400">/</span>
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-200 rounded-full font-medium border border-blue-200/50 dark:border-blue-700/50 transition-all duration-300">
                      {resource.category}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-6">
                {/* Enhanced Reading Info */}
                {resource && (
                  <div className="hidden lg:flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                      <TypeIcon className="w-4 h-4" />
                      <span className="font-medium capitalize">
                        {resource.type.replace("-", " ")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(resource.createdAt).toLocaleDateString()}
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
                    aria-label={isLiked ? "Unlike this resource" : "Like this resource"}
                    title={isLiked ? "Unlike this resource" : "Like this resource"}
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
                    aria-label={isSaved ? "Remove from saved" : "Save this resource"}
                    title={isSaved ? "Remove from saved" : "Save this resource"}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-8">
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
                {/* Type and Difficulty Badges */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <TypeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                      {resource.type.replace("-", " ")}
                    </span>
                  </div>
                  
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getDifficultyColor(
                      resource.difficulty
                    )}`}
                  >
                    {resource.difficulty}
                  </span>
                  
                  {resource.isPremium && (
                    <span className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </span>
                  )}
                </div>

                {/* Enhanced Title */}
                <h1
                  className={`text-4xl font-bold mb-4 transition-colors ${
                    isLightMode ? "text-gray-900" : "text-white"
                  }`}
                >
                  {resource.title}
                </h1>

                {/* Enhanced Description */}
                <p
                  className={`text-lg leading-relaxed mb-8 font-medium transition-colors ${
                    isLightMode ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  {resource.description}
                </p>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-gray-200/70 dark:border-gray-700/70">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl transition-colors">
                    <div className="flex items-center justify-center mb-2">
                      <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {resource.views}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Views
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl transition-colors">
                    <div className="flex items-center justify-center mb-2">
                      <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {resource.downloads}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Downloads
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl transition-colors">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {resource.rating.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Rating
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl transition-colors">
                    <div className="flex items-center justify-center mb-2">
                      <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Created
                    </div>
                  </div>
                </div>

                {/* Enhanced Tags */}
                {resource.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className={`text-sm font-medium mb-3 flex items-center transition-colors ${
                      isLightMode ? "text-gray-900" : "text-white"
                    }`}>
                      <Tag className="w-4 h-4 mr-2 text-blue-500" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900/30 dark:text-blue-200 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Info */}
                <div className={`flex items-center space-x-3 text-sm transition-colors ${
                  isLightMode ? "text-gray-600" : "text-gray-400"
                }`}>
                  <User className="w-4 h-4" />
                  <span>
                    Created by{" "}
                    <strong className={isLightMode ? "text-gray-900" : "text-white"}>
                      {resource.author.name}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Professional Article Content */}
              <div className="p-8" ref={contentRef}>
                {resource.content && (
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
                            <div className="overflow-x-auto my-6">
                              <table
                                className={`min-w-full border border-collapse ${
                                  isLightMode ? "border-gray-300" : "border-gray-600"
                                }`}
                              >
                                {children}
                              </table>
                            </div>
                          );
                        },
                        th({ children }) {
                          return (
                            <th
                              className={`border p-3 font-semibold text-left ${
                                isLightMode
                                  ? "border-gray-300 bg-gray-100 text-gray-900"
                                  : "border-gray-600 bg-gray-700 text-gray-100"
                              }`}
                            >
                              {children}
                            </th>
                          );
                        },
                        td({ children }) {
                          return (
                            <td
                              className={`border p-3 ${
                                isLightMode ? "border-gray-300" : "border-gray-600"
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
                      {resource.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </article>
          </div>
        </div>
      </main>

      {/* Action Buttons Section */}
      {(resource.url || resource.fileUrl) && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div
            className={`rounded-2xl shadow-xl p-6 lg:p-8 transition-colors ${
              isLightMode 
                ? "bg-white border border-gray-200" 
                : "bg-gray-800/90 backdrop-blur-sm border border-white/20"
            }`}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* YouTube Video */}
              {resource.url && resource.url.includes("youtube") && (
                <div className="w-full">
                  <h3 className={`text-lg font-semibold mb-4 transition-colors ${
                    isLightMode ? "text-gray-900" : "text-white"
                  }`}>
                    Video Tutorial
                  </h3>
                  <YouTubeEmbed
                    url={resource.url}
                    title={resource.title}
                    className="mb-4"
                  />
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Watch on YouTube
                  </a>
                </div>
              )}

              {/* External Link */}
              {resource.url && !resource.url.includes("youtube") && (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Visit External Resource
                </a>
              )}

              {/* File Download */}
              {resource.fileUrl && (
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download {resource.fileName || "File"}
                  {resource.fileSize && (
                    <span className="ml-2 text-sm opacity-80">
                      ({(resource.fileSize / 1024 / 1024).toFixed(1)} MB)
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Comments Section */}
      {!isFullscreen && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16">
          <CommentSection resourceId={resource.id} />
        </section>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        .zoom-container {
          font-size: ${zoomLevel}%;
        }
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .dark\\:bg-gray-800,
          .dark\\:bg-gray-900 {
            background: white !important;
          }
          .dark\\:text-white,
          .dark\\:text-gray-300 {
            color: black !important;
          }
        }
      `}</style>
    </div>
  );
}
