import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Tag,
  User,
  BookOpen,
  Code,
  FolderTree,
  FileText,
} from "lucide-react";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { ProfessionalBlogList } from "@/components/ProfessionalBlogList";

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  readTime: number;
  createdAt: string;
  coverImage?: string;
  published: boolean;
  author: {
    name: string;
  };
}

// Interface for Blog8 component
interface BlogPost {
  id: string;
  title: string;
  summary: string;
  label: string;
  author: string;
  published: string;
  url: string;
  image: string;
  tags?: string[];
}

export default function BlogsListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);
  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs");
      const data = await response.json();
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };
  const filteredBlogs = blogs
    .filter((blog) => blog.published)
    .filter(
      (blog) => selectedCategory === "all" || blog.category === selectedCategory
    )
    .filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

  const categories = [
    "all",
    ...Array.from(new Set(blogs.map((blog) => blog.category))),
  ];

  // Convert blogs to Blog8 format
  const convertToBlogPosts = (blogs: Blog[]): BlogPost[] => {
    return blogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      summary: blog.excerpt,
      label: blog.category,
      author: blog.author.name,
      published: new Date(blog.createdAt).toLocaleDateString(),
      url: `/blog/${blog.id}`,
      image: blog.coverImage || "/images/blog-placeholder.jpg",
      tags: blog.tags.slice(0, 2), // Limit to 2 tags for clean display
    }));
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow"
              >
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 relative overflow-hidden">
      <AnimatedGridPattern
        numSquares={40}
        maxOpacity={0.08}
        duration={4}
        repeatDelay={1.5}
        className="absolute inset-0 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/topics"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <FolderTree className="w-4 h-4 mr-2" />
              Topics
            </Link>
            <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm">
              <BookOpen className="w-4 h-4 mr-2" />
              Blogs
            </div>
            <Link
              href="/notes"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4 mr-2" />
              Notes
            </Link>
            <Link
              href="/leetcode"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <Code className="w-4 h-4 mr-2" />
              LeetCode
            </Link>
          </div>
        </div>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            DevMastery Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our collection of technical articles, tutorials, and
            insights on programming, data structures, web development, and more.
          </p>
        </div>{" "}
        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            title="Filter by category"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>{" "}
        {/* Blog Content */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No blogs found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="relative">
            <ProfessionalBlogList posts={convertToBlogPosts(filteredBlogs)} />
          </div>
        )}
      </div>
    </div>
  );
}
