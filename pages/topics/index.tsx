import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderTree,
  FileText,
  StickyNote,
  Code,
  Users,
  ChevronRight,
  Search,
  Filter,
  TrendingUp,
  Database,
} from "lucide-react";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import Breadcrumb from "@/components/Breadcrumb";

interface Topic {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  _count: {
    blogs: number;
    notes: number;
    leetcodeProblems: number;
  };
  subTopics: SubTopic[];
}

interface SubTopic {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  _count: {
    blogs: number;
    notes: number;
    leetcodeProblems: number;
  };
}

export default function TopicsIndexPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    filterTopics();
  }, [topics, searchTerm, selectedCategory]);

  const filterTopics = () => {
    let filtered = topics;

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (topic) =>
          topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          topic.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          topic.subTopics.some(
            (subTopic) =>
              subTopic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              subTopic.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
          )
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((topic) => {
        switch (selectedCategory) {
          case "programming":
            return ["Java", "JavaScript", "Python", "C++", "C#"].includes(
              topic.name
            );
          case "system-design":
            return (
              topic.name.toLowerCase().includes("system") ||
              topic.name.toLowerCase().includes("design")
            );
          case "algorithms":
            return (
              topic.name.toLowerCase().includes("algorithm") ||
              topic.name.toLowerCase().includes("data structure")
            );
          case "databases":
            return (
              topic.name.toLowerCase().includes("database") ||
              topic.name.toLowerCase().includes("sql")
            );
          default:
            return true;
        }
      });
    }

    setFilteredTopics(filtered);
  };

  const fetchTopics = async () => {
    try {
      const response = await fetch("/api/topics");
      const data = await response.json();
      setTopics(data.topics || []);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className="absolute inset-0 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24">
          <div className="animate-pulse">
            <div className="h-12 bg-white/20 rounded-2xl w-1/4 mb-12 backdrop-blur-lg"></div>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="mb-8 p-8 bg-white/10 rounded-2xl shadow-xl backdrop-blur-lg border border-white/20"
              >
                <div className="h-8 bg-white/20 rounded-xl w-3/4 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, j) => (
                    <div
                      key={j}
                      className="h-24 bg-white/10 rounded-xl border border-white/10"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatsData = () => {
    const totalTopics = topics.length;
    const totalSubTopics = topics.reduce(
      (sum, topic) => sum + topic.subTopics.length,
      0
    );
    const totalBlogs = topics.reduce(
      (sum, topic) => sum + topic._count.blogs,
      0
    );
    const totalNotes = topics.reduce(
      (sum, topic) => sum + topic._count.notes,
      0
    );

    return { totalTopics, totalSubTopics, totalBlogs, totalNotes };
  };

  const { totalTopics, totalSubTopics, totalBlogs, totalNotes } =
    getStatsData();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Animated Background Pattern */}
      <DotPattern
        className="absolute inset-0 opacity-20"
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
      />
      {/* Professional Header Section */}
      <div className="bg-gradient-to-r from-gray-900/95 via-black/95 to-gray-800/95 relative z-10 pt-24">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              Learning Topics
            </h1>
            <p className="text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed mb-8">
              Comprehensive study materials organized by programming languages,
              system design, and technical concepts
            </p>
          </div>

          {/* Search Section - Enhanced */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search topics, subtopics, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-4 w-full text-base border-0 rounded-2xl focus:ring-4 focus:ring-blue-500/30 focus:outline-none transition-all shadow-2xl bg-white/95 backdrop-blur-md text-gray-900 placeholder-gray-500"
                />
              </div>

              {/* Filters Button */}
              <button
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="flex items-center gap-3 px-8 py-4 text-base font-semibold text-white bg-white/20 hover:bg-white/30 border border-white/30 rounded-2xl transition-all whitespace-nowrap backdrop-blur-md shadow-2xl hover:shadow-blue-500/25"
              >
                <Filter className="w-5 h-5" />
                Advanced Filters
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Advanced Search Panel */}
      {showAdvancedSearch && (
        <div className="bg-gray-900/95 backdrop-blur-md border-b border-white/20 shadow-2xl relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold text-white">
                Advanced Search
              </h3>
              <button
                onClick={() => setShowAdvancedSearch(false)}
                className="text-gray-400 hover:text-white text-2xl font-light transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-3 focus:ring-blue-500/50 focus:border-blue-500 text-sm bg-gray-800/50 backdrop-blur-sm text-white shadow-lg"
                  aria-label="Filter by category"
                >
                  <option value="all">All Categories</option>
                  <option value="programming">Programming Languages</option>
                  <option value="system-design">System Design</option>
                  <option value="algorithms">
                    Algorithms & Data Structures
                  </option>
                  <option value="databases">Databases</option>
                </select>
              </div>

              {/* Search Input (duplicated for mobile) */}
              <div className="lg:hidden">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full text-sm border border-white/20 rounded-xl focus:ring-3 focus:ring-blue-500/50 focus:border-blue-500 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 shadow-lg"
                  />
                </div>
              </div>
            </div>
            {/* Search Results Summary */}
            <div className="flex items-center gap-4 text-sm text-gray-300 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <span className="font-medium">
                Showing {filteredTopics.length} of {topics.length} topics
              </span>
              {searchTerm && (
                <span className="flex items-center gap-2">
                  for "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Clear
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}{" "}
      {/* Enhanced Stats Section - Dark Theme */}
      <div className="bg-gray-900/90 backdrop-blur-xl border-b border-white/10 relative z-10">
        {/* Subtle dot pattern for stats background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz4KPC9zdmc+')] opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 border border-white/10 hover:border-blue-400/30 group">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-indigo-300 transition-all duration-300">
                {totalTopics}
              </div>
              <div className="text-sm font-medium text-gray-300 mt-2 group-hover:text-white transition-colors">
                Learning Topics
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 border border-white/10 hover:border-purple-400/30 group">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                {totalSubTopics}
              </div>
              <div className="text-sm font-medium text-gray-300 mt-2 group-hover:text-white transition-colors">
                Specialized Areas
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-2xl hover:shadow-green-500/20 transition-all duration-300 border border-white/10 hover:border-green-400/30 group">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-green-300 transition-all duration-300">
                {totalBlogs}
              </div>
              <div className="text-sm font-medium text-gray-300 mt-2 group-hover:text-white transition-colors">
                Study Articles
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 border border-white/10 hover:border-orange-400/30 group">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent group-hover:from-orange-300 group-hover:to-amber-300 transition-all duration-300">
                {totalNotes}
              </div>
              <div className="text-sm font-medium text-gray-300 mt-2 group-hover:text-white transition-colors">
                Reference Notes
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <Breadcrumb items={[{ label: "Topics" }]} />

        {/* Topics Grid */}
        <div className="mt-8 space-y-8">
          {filteredTopics.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-800/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20 max-w-md mx-auto">
                <Search className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-3">
                  No topics found
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {searchTerm
                    ? `No topics match "${searchTerm}"`
                    : "No topics available"}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          ) : (
            filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className="bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden border border-white/20 hover:border-white/30"
              >
                {/* Topic Header */}
                <div className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 px-8 py-6 border-b border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-5">
                      <div className="text-4xl filter drop-shadow-lg">
                        {topic.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                          {topic.name}
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-6 text-sm text-gray-300">
                        <Link
                          href={`/blogs?topicSlug=${topic.slug}`}
                          className="flex items-center space-x-2 bg-blue-500/20 px-3 py-2 rounded-lg backdrop-blur-sm hover:bg-blue-500/30 transition-colors cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span className="font-medium">
                            {topic._count.blogs} blogs
                          </span>
                        </Link>
                        <Link
                          href={`/notes?topicSlug=${topic.slug}`}
                          className="flex items-center space-x-2 bg-purple-500/20 px-3 py-2 rounded-lg backdrop-blur-sm hover:bg-purple-500/30 transition-colors cursor-pointer"
                        >
                          <StickyNote className="w-4 h-4 text-purple-400" />
                          <span className="font-medium">
                            {topic._count.notes} notes
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtopics Grid */}
                <div className="p-8">
                  {topic.subTopics.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {topic.subTopics
                        .sort((a, b) => a.order - b.order)
                        .map((subTopic) => (
                          <Link
                            key={subTopic.id}
                            href={`/topics/${topic.slug}/${subTopic.slug}`}
                            className="group block p-6 bg-gradient-to-br from-gray-700/50 to-gray-600/50 rounded-xl hover:from-blue-600/30 hover:to-indigo-600/30 transition-all duration-300 border border-white/20 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10 backdrop-blur-sm"
                          >
                            <div className="flex items-start space-x-4">
                              <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                {subTopic.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                                  {subTopic.name}
                                </h3>
                                <p className="text-sm text-gray-300 mt-2 line-clamp-2 leading-relaxed">
                                  {subTopic.description}
                                </p>
                                <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
                                  <div className="flex items-center space-x-4">
                                    <Link
                                      href={`/blogs?topicSlug=${topic.slug}&subTopicSlug=${subTopic.slug}`}
                                      className="flex items-center space-x-1 bg-white/10 px-2 py-1 rounded-md backdrop-blur-sm hover:bg-blue-500/20 transition-colors"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <FileText className="w-3 h-3" />
                                      <span className="font-medium">
                                        {subTopic._count.blogs}
                                      </span>
                                    </Link>
                                    <Link
                                      href={`/notes?topicSlug=${topic.slug}&subTopicSlug=${subTopic.slug}`}
                                      className="flex items-center space-x-1 bg-white/10 px-2 py-1 rounded-md backdrop-blur-sm hover:bg-purple-500/20 transition-colors"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <StickyNote className="w-3 h-3" />
                                      <span className="font-medium">
                                        {subTopic._count.notes}
                                      </span>
                                    </Link>
                                  </div>
                                  <ChevronRight className="w-5 h-5 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gradient-to-br from-gray-700/30 to-gray-600/30 rounded-xl border border-white/20 backdrop-blur-sm">
                      <Code className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-300 text-lg">
                        No subtopics available yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>{" "}
    </div>
  );
}
