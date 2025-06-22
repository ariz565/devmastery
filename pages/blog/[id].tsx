import { useRouter } from "next/router";
import { useState, useEffect } from "react";
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
} from "lucide-react";

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

  useEffect(() => {
    if (id) {
      fetchBlog(id as string);
    }
  }, [id]);

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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Reading Progress Bar */}
      <ReadingProgress position="top" />

      {/* Header Navigation */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/blogs"
                className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blogs
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/topics"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <FolderTree className="w-5 h-5" />
              </Link>
              <Link href="/blogs" className="text-blue-600 dark:text-blue-400">
                <BookOpen className="w-5 h-5" />
              </Link>
              <Link
                href="/notes"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <FileText className="w-5 h-5" />
              </Link>
              <Link
                href="/leetcode"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Code className="w-5 h-5" />
              </Link>
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
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`${blog.coverImage ? "relative -mt-32" : "pt-16"}`}>
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
              {/* Article Header */}
              <div className="px-8 py-12 lg:px-12">
                {/* Category */}
                <div className="mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                    {blog.category}
                  </span>
                </div>
                {/* Title */}
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                  {blog.title}
                </h1>
                {/* Excerpt */}
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                  {blog.excerpt}
                </p>
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {blog.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {blog.author.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Author
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  {blog.readTime && (
                    <div className="flex items-center">
                      <Coffee className="w-4 h-4 mr-2" />
                      {blog.readTime} min read
                    </div>
                  )}
                </div>{" "}
                {/* Action Buttons */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleLike}
                      className={`flex items-center space-x-2 transition-colors ${
                        isLiked
                          ? "text-red-500 dark:text-red-400"
                          : "text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                      />
                      <span>Like</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className={`flex items-center space-x-2 transition-colors ${
                        isSaved
                          ? "text-blue-500 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                      }`}
                    >
                      <Bookmark
                        className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`}
                      />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Tags */}
                  {blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Article Content */}
              <div className="px-8 pb-12 lg:px-12">
                <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-gray-900 dark:prose-code:text-gray-100 prose-pre:bg-gray-50 dark:prose-pre:bg-gray-800">
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
      </div>

      {/* Footer Actions */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Enjoyed this article?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Explore more of our technical content and stay updated with the
            latest in programming.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blogs"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Read More Articles
            </Link>
            <Link
              href="/topics"
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Browse by Topics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
