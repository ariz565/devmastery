import { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
  const router = useRouter();
  const { topicSlug, subTopicSlug } = router.query;

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterInfo, setFilterInfo] = useState<{
    topicName?: string;
    subTopicName?: string;
  }>({});

  useEffect(() => {
    fetchBlogs();
  }, [topicSlug, subTopicSlug]);
  const fetchBlogs = async () => {
    try {
      const params = new URLSearchParams();
      if (topicSlug) params.append("topicSlug", topicSlug as string);
      if (subTopicSlug) params.append("subTopicSlug", subTopicSlug as string);

      const response = await fetch(`/api/blogs?${params.toString()}`);
      const data = await response.json();
      setBlogs(data.blogs || []);

      // Set filter info for display
      if (data.blogs?.length > 0) {
        const firstBlog = data.blogs[0];
        setFilterInfo({
          topicName: firstBlog.topic?.name,
          subTopicName: firstBlog.subTopic?.name,
        });
      }
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 relative overflow-hidden">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className="absolute inset-0 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="mb-8 p-6 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow border border-gray-700"
              >
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-12 relative overflow-hidden">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className="absolute inset-0 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/topics"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg hover:bg-gray-700 hover:border-gray-600 transition-all duration-200 shadow-sm"
            >
              <FolderTree className="w-4 h-4 mr-2" />
              Topics
            </Link>
            <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-400 bg-blue-900/20 border border-blue-800 rounded-lg shadow-sm">
              <BookOpen className="w-4 h-4 mr-2" />
              Blogs
            </div>
            <Link
              href="/notes"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg hover:bg-gray-700 hover:border-gray-600 transition-all duration-200 shadow-sm"
            >
              <FileText className="w-4 h-4 mr-2" />
              Notes
            </Link>
            <Link
              href="/leetcode"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg hover:bg-gray-700 hover:border-gray-600 transition-all duration-200 shadow-sm"
            >
              <Code className="w-4 h-4 mr-2" />
              LeetCode
            </Link>
          </div>
        </div>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {filterInfo.subTopicName
              ? `${filterInfo.subTopicName} Blogs`
              : filterInfo.topicName
              ? `${filterInfo.topicName} Blogs`
              : "DevMastery Blog"}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {filterInfo.subTopicName || filterInfo.topicName
              ? `Explore articles and tutorials about ${
                  filterInfo.subTopicName || filterInfo.topicName
                }`
              : "Explore our collection of technical articles, tutorials, and insights on programming, data structures, web development, and more."}
          </p>
          {(filterInfo.topicName || filterInfo.subTopicName) && (
            <div className="mt-4">
              <Link
                href="/blogs"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                ← View all blogs
              </Link>
            </div>
          )}
        </div>
        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800/90 backdrop-blur-sm text-white placeholder-gray-400"
            />
          </div>
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            title="Filter by category"
            className="px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800/90 backdrop-blur-sm text-white"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>
        {/* Blog Content */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
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
