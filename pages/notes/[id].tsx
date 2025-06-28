import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ReadingProgress from "../../components/ReadingProgress";
import {
  Calendar,
  Tag,
  User,
  FileText,
  BookOpen,
  Code,
  FolderTree,
  ArrowLeft,
  Hash,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Moon,
  Download,
  FileImage,
  Printer,
  Copy,
  Check,
  Settings,
  Maximize,
  Minimize,
  Eye,
} from "lucide-react";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/cjs/styles/prism";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
  };
  topic?: {
    name: string;
    slug: string;
    icon: string;
  };
  subTopic?: {
    name: string;
    slug: string;
    icon: string;
  };
}

export default function NoteDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  // Reading enhancement states
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isLightMode, setIsLightMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [copiedText, setCopiedText] = useState("");
  const [showCopyAlert, setShowCopyAlert] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (id) {
      fetchNote();
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
            handleZoomIn();
            break;
          case "-":
            event.preventDefault();
            handleZoomOut();
            break;
          case "0":
            event.preventDefault();
            resetZoom();
            break;
          case "p":
            event.preventDefault();
            printPage();
            break;
        }
      }

      // ESC to exit fullscreen
      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
        setShowControls(true);
      }

      // F11 for fullscreen
      if (event.key === "F11") {
        event.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const fetchNote = async () => {
    try {
      const response = await fetch(`/api/notes/${id}`);
      if (response.ok) {
        const data = await response.json();
        setNote(data.note);
      } else {
        router.push("/notes");
      }
    } catch (error) {
      console.error("Failed to fetch note:", error);
      router.push("/notes");
    } finally {
      setLoading(false);
    }
  };

  // Reading enhancement functions
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50));
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

  const toggleLightMode = () => {
    setIsLightMode(!isLightMode);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setShowControls(!isFullscreen);
  };

  const exportToPDF = () => {
    window.print();
  };

  const exportToImage = async () => {
    if (!articleRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(articleRef.current, {
        useCORS: true,
        background: isLightMode ? "#ffffff" : "#1f2937",
      });

      const link = document.createElement("a");
      link.download = `${note?.title || "note"}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error("Failed to export image:", error);
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

  const printPage = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
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

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Note not found
          </h1>
          <Link
            href="/notes"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Notes
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-50" : "py-12"
      } ${
        isLightMode
          ? "bg-white text-gray-900"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
      } relative overflow-hidden`}
    >
      {/* Copy Alert */}
      {showCopyAlert && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300">
          <Check className="w-4 h-4" />
          Text copied to clipboard!
        </div>
      )}

      {/* Reading Progress Bar */}
      <ReadingProgress position="top" />

      {/* Enhanced Controls Panel */}
      {showControls && (
        <div className="fixed top-20 right-4 z-40 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl space-y-3 transition-all duration-300">
          <div className="text-xs font-medium text-gray-300 mb-2 text-center">
            Reading Tools
          </div>

          {/* Zoom Controls */}
          <div className="flex flex-col gap-2">
            <div className="text-xs text-gray-400 text-center">
              {zoomLevel}%
            </div>
            <div className="flex gap-1">
              <button
                onClick={handleZoomOut}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={resetZoom}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomIn}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          <hr className="border-white/20" />

          {/* Theme Toggle */}
          <button
            onClick={toggleLightMode}
            className="w-full p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center gap-2"
            title="Toggle Light/Dark Mode"
          >
            {isLightMode ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
            <span className="text-xs">{isLightMode ? "Dark" : "Light"}</span>
          </button>

          <hr className="border-white/20" />

          {/* Export Controls */}
          <div className="flex flex-col gap-1">
            <button
              onClick={exportToPDF}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center gap-2"
              title="Export as PDF"
            >
              <Download className="w-4 h-4" />
              <span className="text-xs">PDF</span>
            </button>
            <button
              onClick={exportToImage}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center gap-2"
              title="Export as Image"
            >
              <FileImage className="w-4 h-4" />
              <span className="text-xs">IMG</span>
            </button>
            <button
              onClick={printPage}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center gap-2"
              title="Print"
            >
              <Printer className="w-4 h-4" />
              <span className="text-xs">Print</span>
            </button>
          </div>

          <hr className="border-white/20" />

          {/* View Controls */}
          <button
            onClick={toggleFullscreen}
            className="w-full p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center gap-2"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
            <span className="text-xs">{isFullscreen ? "Exit" : "Full"}</span>
          </button>

          <button
            onClick={() => setShowControls(false)}
            className="w-full p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center gap-2"
            title="Hide Controls"
          >
            <Eye className="w-4 h-4" />
            <span className="text-xs">Hide</span>
          </button>
        </div>
      )}

      {/* Show Controls Button (when hidden) */}
      {!showControls && (
        <button
          onClick={() => setShowControls(true)}
          className="fixed top-20 right-4 z-40 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl hover:bg-white/20 transition-all duration-300"
          title="Show Reading Tools"
        >
          <Settings className="w-5 h-5" />
        </button>
      )}

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

      <div
        ref={contentRef}
        className={`${
          isFullscreen ? "p-8" : "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        } relative z-10 zoom-${zoomLevel}`}
      >
        {/* Navigation */}
        {!isFullscreen && (
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Link
                href="/topics"
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm ${
                  isLightMode
                    ? "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
                    : "text-gray-200 bg-gray-800 border border-gray-700 hover:bg-gray-700"
                }`}
              >
                <FolderTree className="w-4 h-4 mr-2" />
                Topics
              </Link>
              <Link
                href="/blogs"
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm ${
                  isLightMode
                    ? "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
                    : "text-gray-200 bg-gray-800 border border-gray-700 hover:bg-gray-700"
                }`}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Blogs
              </Link>
              <Link
                href="/leetcode"
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm ${
                  isLightMode
                    ? "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
                    : "text-gray-200 bg-gray-800 border border-gray-700 hover:bg-gray-700"
                }`}
              >
                <Code className="w-4 h-4 mr-2" />
                LeetCode
              </Link>
              <Link
                href="/notes"
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm ${
                  isLightMode
                    ? "text-blue-600 bg-blue-50 border border-blue-200"
                    : "text-blue-400 bg-blue-900/20 border border-blue-800"
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Notes
              </Link>
            </div>

            <Link
              href="/notes"
              className={`inline-flex items-center font-medium transition-colors ${
                isLightMode
                  ? "text-blue-600 hover:text-blue-800"
                  : "text-blue-400 hover:text-blue-300"
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notes
            </Link>
          </div>
        )}

        {/* Enhanced Note Content */}
        <article
          ref={articleRef}
          className={`rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
            isLightMode
              ? "bg-white"
              : "bg-gray-800/90 backdrop-blur-sm border border-white/20"
          }`}
        >
          {/* Enhanced Header */}
          <div
            className={`p-8 border-b transition-colors ${
              isLightMode ? "border-gray-200" : "border-gray-700"
            }`}
          >
            {/* Topic and Category */}
            <div className="flex items-center gap-3 mb-4">
              {note.topic && (
                <Link
                  href={`/topics/${note.topic.slug}`}
                  className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                    isLightMode
                      ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                      : "text-blue-400 bg-blue-900/20 hover:bg-blue-900/30"
                  }`}
                >
                  <Hash className="w-3 h-3 mr-1" />
                  {note.topic.name}
                </Link>
              )}
              {note.subTopic && (
                <Link
                  href={`/topics/${note.topic?.slug}/${note.subTopic.slug}`}
                  className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                    isLightMode
                      ? "text-purple-600 bg-purple-50 hover:bg-purple-100"
                      : "text-purple-400 bg-purple-900/20 hover:bg-purple-900/30"
                  }`}
                >
                  {note.subTopic.name}
                </Link>
              )}
              <span
                className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                  isLightMode
                    ? "text-green-600 bg-green-50"
                    : "text-green-400 bg-green-900/20"
                }`}
              >
                {note.category}
              </span>
            </div>

            {/* Enhanced Title with Copy Function */}
            <div className="group relative">
              <h1
                className={`text-4xl font-bold mb-4 transition-colors ${
                  isLightMode ? "text-gray-900" : "text-white"
                }`}
              >
                {note.title}
              </h1>
              <button
                onClick={() => copyToClipboard(note.title)}
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105"
                title="Copy title"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {/* Meta Information */}
            <div
              className={`flex flex-wrap items-center gap-6 text-sm transition-colors ${
                isLightMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {note.author.name}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Created {new Date(note.createdAt).toLocaleDateString()}
              </div>
              {note.updatedAt !== note.createdAt && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Updated {new Date(note.updatedAt).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Enhanced Tags */}
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                      isLightMode
                        ? "text-gray-600 bg-gray-100"
                        : "text-gray-300 bg-gray-700"
                    }`}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Content */}
          <div className="p-8">
            <div
              className={`enhanced-prose max-w-none transition-all duration-300 ${
                isLightMode ? "text-gray-900" : "text-gray-100"
              }`}
            >
              <ReactMarkdown
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
                }}
              >
                {note.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
