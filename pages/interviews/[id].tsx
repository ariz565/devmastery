"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Star,
  Eye,
  FileText,
  Image,
  Video,
  ExternalLink,
  Code,
  Book,
  File,
  Calendar,
  User,
  Tag,
  Share2,
  Bookmark,
  Globe,
  Lock,
  Crown,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
  FileImage,
  FileDown,
  Copy,
  Check,
  Printer,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";
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
  const contentRef = useRef<HTMLDivElement>(null);

  const [resource, setResource] = useState<InterviewResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(100);
  const [darkMode, setDarkMode] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchResource();
    }
  }, [id]);

  useEffect(() => {
    // Check system theme preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark);
  }, []);

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
      setError("Failed to fetch resource");
    } finally {
      setLoading(false);
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: resource?.title,
          text: resource?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      handleCopyUrl();
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  const handleSaveAsImage = async () => {
    if (!contentRef.current) return;

    try {
      // Import html2canvas dynamically
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(contentRef.current, {
        background: darkMode ? "#1f2937" : "#ffffff",
        logging: false,
        useCORS: true,
      } as any);

      const link = document.createElement("a");
      link.download = `${resource?.title || "interview-resource"}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error("Save as image failed:", error);
    }
  };

  const handleSaveAsPDF = async () => {
    if (!contentRef.current) return;

    try {
      // Import jsPDF and html2canvas dynamically
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);
      const canvas = await html2canvas(contentRef.current, {
        background: darkMode ? "#1f2937" : "#ffffff",
        logging: false,
        useCORS: true,
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

      pdf.save(`${resource?.title || "interview-resource"}.pdf`);
    } catch (error) {
      console.error("Save as PDF failed:", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Resource Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Link
            href="/interviews"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Interviews
          </Link>
        </div>
      </div>
    );
  }

  const TypeIcon = getTypeIcon(resource.type);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      } ${fullscreen ? "fixed inset-0 z-50 overflow-auto" : ""}`}
    >
      {/* Toolbar */}
      <div
        className={`sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm ${
          fullscreen ? "px-6 py-3" : ""
        }`}
      >
        <div
          className={`${
            fullscreen ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          } py-3`}
        >
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              {!fullscreen && (
                <Link
                  href="/interviews"
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              )}

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[3rem] text-center">
                  {zoom}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Toggle Theme"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={fullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                <Monitor className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrint}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Print"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                onClick={handleSaveAsImage}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Save as Image"
              >
                <FileImage className="w-4 h-4" />
              </button>

              <button
                onClick={handleSaveAsPDF}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Save as PDF"
              >
                <FileDown className="w-4 h-4" />
              </button>

              <button
                onClick={copied ? handleCopyUrl : handleShare}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={copied ? "Copied!" : "Share"}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked
                    ? "text-yellow-600 bg-yellow-100 dark:bg-yellow-900"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
              >
                <Bookmark
                  className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Content */}
      <div
        ref={contentRef}
        className={`${
          fullscreen
            ? "px-6 py-8"
            : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        }`}
      >
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <TypeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
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
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {resource.type
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {resource.category}
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {resource.title}
          </h1>

          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            {resource.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {resource.views}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Views
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {resource.downloads}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Downloads
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Star className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {resource.rating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Rating
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date(resource.createdAt).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Created
              </div>
            </div>
          </div>

          {/* Tags */}
          {resource.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author */}
          <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
            <User className="w-4 h-4" />
            <span>
              Created by{" "}
              <strong className="text-gray-900 dark:text-white">
                {resource.author.name}
              </strong>
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {resource.content && (
            <div className="p-8">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div
                  className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: `<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">${formatContent(
                      resource.content
                    )}</p>`,
                  }}
                />
              </div>
            </div>
          )}{" "}
          {/* External Link */}
          {resource.url && !resource.url.includes("youtube") && (
            <div className="p-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit External Resource
              </a>
            </div>
          )}{" "}
          {/* YouTube Video */}
          {resource.url && resource.url.includes("youtube") && (
            <div className="p-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Video Tutorial
              </h3>
              <YouTubeEmbed
                url={resource.url}
                title={resource.title}
                className="mb-4"
              />
              <div className="mt-4">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Watch on YouTube
                </a>
              </div>
            </div>
          )}
          {/* File Download */}
          {resource.fileUrl && (
            <div className="p-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download {resource.fileName || "File"}
                {resource.fileSize && (
                  <span className="ml-2 text-sm opacity-80">
                    ({(resource.fileSize / 1024 / 1024).toFixed(1)} MB)
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Comments Section */}
        {!fullscreen && (
          <div className="mt-8">
            <CommentSection resourceId={resource.id} />
          </div>
        )}
      </div>
      {/* Print Styles */}
      <style jsx global>{`
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
