import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
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
  Coffee,
  Download,
  Image as ImageIcon,
  FileDown,
  Copy,
  Eye,
  Sun,
  Moon,
  Type,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Settings,
  MessageCircle,
  ThumbsUp,
  Star,
  ChevronUp,
  Menu,
  X,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Dynamic import for markdown preview
const MarkdownPreview = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  { ssr: false }
);

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
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Enhanced reading experience states
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [showFloatingActions, setShowFloatingActions] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [showTableOfContents, setShowTableOfContents] = useState(false);

  // Refs for content capture
  const articleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (id) {
      fetchBlog(id as string);
    }
  }, [id]);

  // Enhanced scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const windowHeight = window.innerHeight;

      // Show back to top button
      setShowBackToTop(scrolled > windowHeight * 0.3);

      // Calculate reading progress
      const totalHeight = document.documentElement.scrollHeight - windowHeight;
      const progress = Math.min((scrolled / totalHeight) * 100, 100);

      // Estimate reading time remaining
      const readingSpeed = 200; // words per minute
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
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Update font size in CSS custom property
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--reading-font-size",
      `${fontSize}px`
    );
  }, [fontSize]);

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

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Here you could also send a request to your API to save the like
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // Here you could also send a request to your API to save the bookmark
  };
  const handleShare = async () => {
    if (!blog) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.log("Error copying to clipboard:", error);
      }
    }
  };

  // Enhanced save as PDF with better formatting
  const handleSaveAsPDF = async () => {
    if (!blog || !articleRef.current) return;

    setIsGeneratingPDF(true);
    try {
      const canvas = await html2canvas(articleRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        height: articleRef.current.scrollHeight,
        width: articleRef.current.scrollWidth,
      } as any);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save(`${blog.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Save as high-quality image
  const handleSaveAsImage = async () => {
    if (!blog || !articleRef.current) return;

    setIsGeneratingImage(true);
    try {
      const canvas = await html2canvas(articleRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: isDarkMode ? "#111827" : "#ffffff",
        height: articleRef.current.scrollHeight,
        width: articleRef.current.scrollWidth,
      } as any);

      // Create download link
      const link = document.createElement("a");
      link.download = `${blog.title
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Error generating image. Please try again.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Copy content to clipboard
  const handleCopyContent = async () => {
    if (!blog) return;

    try {
      const textContent = `${blog.title}\n\n${blog.content}`;
      await navigator.clipboard.writeText(textContent);
      alert("Content copied to clipboard!");
    } catch (error) {
      console.error("Error copying content:", error);
      alert("Error copying content. Please try again.");
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Font size controls
  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 12));
  };

  const resetFontSize = () => {
    setFontSize(16);
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
          </Link>{" "}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "dark bg-gray-900" : "bg-white"
      }`}
    >
      {/* Enhanced Reading Progress Bar */}
      <ReadingProgress position="top" />
      {/* Floating Reading Controls */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 space-y-3">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-2">
          {/* Font Size Controls */}
          <div className="flex flex-col items-center space-y-2 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={increaseFontSize}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Increase font size"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {fontSize}px
            </span>
            <button
              onClick={decreaseFontSize}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Decrease font size"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetFontSize}
              className="p-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Reset font size"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex flex-col items-center space-y-2 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
              title="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Save Options */}
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={handleSaveAsPDF}
              disabled={isGeneratingPDF}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
              title="Save as PDF"
            >
              {isGeneratingPDF ? (
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FileDown className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleSaveAsImage}
              disabled={isGeneratingImage}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors disabled:opacity-50"
              title="Save as Image"
            >
              {isGeneratingImage ? (
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleCopyContent}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              title="Copy content"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-110"
          title="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
      {/* Reading Time Indicator */}
      {blog && readingTime > 0 && (
        <div className="fixed bottom-6 left-6 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 px-4 py-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4" />
            <span>{readingTime} min left</span>
          </div>
        </div>
      )}{" "}
      {/* Enhanced Header Navigation */}
      <header className="bg-white/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/blogs"
                className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Blogs
              </Link>

              {/* Breadcrumb */}
              {blog && (
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>/</span>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-md">
                    {blog.category}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-6">
              {/* Reading Progress */}
              {blog && (
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <Eye className="w-4 h-4" />
                  <span>{blog.readTime} min read</span>
                </div>
              )}

              {/* Navigation Icons */}
              <div className="flex items-center space-x-4">
                <Link
                  href="/topics"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="Topics"
                >
                  <FolderTree className="w-5 h-5" />
                </Link>
                <Link
                  href="/blogs"
                  className="text-blue-600 dark:text-blue-400"
                  title="Blogs"
                >
                  <BookOpen className="w-5 h-5" />
                </Link>
                <Link
                  href="/notes"
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  title="Notes"
                >
                  <FileText className="w-5 h-5" />
                </Link>
                <Link
                  href="/leetcode"
                  className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  title="LeetCode"
                >
                  <Code className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <div className="relative">
        {blog.coverImage && (
          <div className="aspect-[2/1] max-h-96 overflow-hidden">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        )}{" "}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`${blog.coverImage ? "relative -mt-32" : "pt-16"}`}>
            <article
              ref={articleRef}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
            >
              {/* Enhanced Article Header */}
              <div className="px-8 py-12 lg:px-12 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-gray-800/50 dark:to-gray-900/50">
                {/* Category with enhanced styling */}
                <div className="mb-6">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
                    <Tag className="w-4 h-4 mr-2" />
                    {blog.category}
                  </span>
                </div>
                {/* Enhanced Title */}
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                  {blog.title}
                </h1>
                {/* Enhanced Excerpt */}
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 font-medium">
                  {blog.excerpt}
                </p>
                {/* Enhanced Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center bg-white/60 dark:bg-gray-700/60 rounded-xl px-4 py-3 backdrop-blur-sm">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-lg">
                      {blog.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {blog.author.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Author
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center bg-white/60 dark:bg-gray-700/60 rounded-xl px-4 py-3 backdrop-blur-sm">
                    <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Published
                      </p>
                    </div>
                  </div>

                  {blog.readTime && (
                    <div className="flex items-center bg-white/60 dark:bg-gray-700/60 rounded-xl px-4 py-3 backdrop-blur-sm">
                      <Coffee className="w-5 h-5 mr-3 text-amber-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {blog.readTime} min
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Reading time
                        </p>
                      </div>
                    </div>
                  )}
                </div>{" "}
                {/* Enhanced Action Buttons */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={handleLike}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        isLiked
                          ? "text-white bg-gradient-to-r from-red-500 to-pink-600 shadow-lg"
                          : "text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-gray-700/60 hover:bg-red-50 dark:hover:bg-red-900/30 border border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                      />
                      <span className="font-medium">Like</span>
                    </button>

                    <button
                      onClick={handleSave}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        isSaved
                          ? "text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg"
                          : "text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-gray-700/60 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      <Bookmark
                        className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`}
                      />
                      <span className="font-medium">Save</span>
                    </button>

                    <button
                      onClick={handleShare}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/60 dark:bg-gray-700/60 text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/30 border border-gray-200 dark:border-gray-600 transition-all duration-300 transform hover:scale-105"
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="font-medium">Share</span>
                    </button>

                    {/* Quick Save Options */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSaveAsPDF}
                        disabled={isGeneratingPDF}
                        className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/60 dark:bg-gray-700/60 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 border border-gray-200 dark:border-gray-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                        title="Save as PDF"
                      >
                        {isGeneratingPDF ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FileDown className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline font-medium">
                          PDF
                        </span>
                      </button>

                      <button
                        onClick={handleSaveAsImage}
                        disabled={isGeneratingImage}
                        className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/60 dark:bg-gray-700/60 text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/30 border border-gray-200 dark:border-gray-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                        title="Save as Image"
                      >
                        {isGeneratingImage ? (
                          <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <ImageIcon className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline font-medium">
                          IMG
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Tags */}
                  {blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800 dark:hover:to-blue-700 transition-all duration-300 cursor-pointer"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>{" "}
              {/* Enhanced Article Content */}{" "}
              <div className="px-8 pb-12 lg:px-12" ref={contentRef}>
                <div className="blog-content prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:!text-slate-800 dark:prose-code:!text-gray-100 prose-pre:!bg-gray-900 dark:prose-pre:!bg-gray-900 prose-pre:border prose-pre:!border-gray-700 dark:prose-pre:!border-gray-700 prose-pre:rounded-lg prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-blockquote:px-4">
                  <MarkdownPreview
                    source={blog.content}
                    style={{
                      backgroundColor: "transparent",
                      color: "inherit",
                    }}
                  />
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>{" "}
      {/* Enhanced Footer Actions */}
      <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-20 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
            <Star className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Enjoyed this article?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Explore more of our technical content and stay updated with the
              latest in programming and technology.
            </p>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/blogs"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Read More Articles
              </Link>
              <Link
                href="/topics"
                className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FolderTree className="w-5 h-5 mr-2" />
                Browse by Topics
              </Link>
            </div>

            {/* Social Actions */}
            <div className="flex items-center justify-center space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLike}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">Give feedback</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Share article</span>
              </button>
              <button
                onClick={handleCopyContent}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span className="text-sm">Copy content</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
