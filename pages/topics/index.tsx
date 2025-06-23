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
import AuthNavbar from "@/components/AuthNavbar";
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 relative overflow-hidden">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className="absolute inset-0 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="animate-pulse">
            <div className="h-12 bg-white/60 rounded-2xl w-1/4 mb-12 backdrop-blur-lg"></div>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="mb-8 p-8 bg-white/60 rounded-2xl shadow-xl backdrop-blur-lg"
              >
                <div className="h-8 bg-gray-200/60 rounded-xl w-3/4 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, j) => (
                    <div
                      key={j}
                      className="h-24 bg-gray-200/60 rounded-xl"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className="absolute inset-0 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
      />
      {/* Top Navigation Bar */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Empty for spacing */}
            <div></div>

            {/* Right side - Navigation */}
            <AuthNavbar />
          </div>
        </div>
      </div>{" "}
      {/* Professional Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 relative z-10">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Learning Topics
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Comprehensive study materials organized by programming languages,
              system design, and technical concepts
            </p>
          </div>

          {/* Search Section - Enhanced */}
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search topics, subtopics, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-4 w-full text-base border-0 rounded-xl focus:ring-4 focus:ring-white/30 focus:outline-none transition-all shadow-lg bg-white/95 backdrop-blur-sm"
                />
              </div>

              {/* Filters Button */}
              <button
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="flex items-center gap-3 px-6 py-4 text-base font-medium text-white bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl transition-all whitespace-nowrap backdrop-blur-sm shadow-lg hover:shadow-xl"
              >
                <Filter className="w-5 h-5" />
                Advanced Filters
              </button>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Advanced Search Panel */}
      {showAdvancedSearch && (
        <div className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-xl relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Advanced Search
              </h3>
              <button
                onClick={() => setShowAdvancedSearch(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-light"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 text-sm bg-white shadow-sm"
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
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full text-sm border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 bg-white shadow-sm"
                  />
                </div>
              </div>
            </div>
            {/* Search Results Summary */}
            <div className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50/80 rounded-lg p-4">
              <span className="font-medium">
                Showing {filteredTopics.length} of {topics.length} topics
              </span>
              {searchTerm && (
                <span className="flex items-center gap-2">
                  for "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}{" "}
      {/* Enhanced Stats Section */}
      <div className="bg-white/60 backdrop-blur-lg border-b border-gray-200/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200/50">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {totalTopics}
              </div>
              <div className="text-sm font-medium text-gray-600 mt-2">
                Learning Topics
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-200/50">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {totalSubTopics}
              </div>
              <div className="text-sm font-medium text-gray-600 mt-2">
                Specialized Areas
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-200/50">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                {totalBlogs}
              </div>
              <div className="text-sm font-medium text-gray-600 mt-2">
                Study Articles
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-200/50">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                {totalNotes}
              </div>
              <div className="text-sm font-medium text-gray-600 mt-2">
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
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-gray-200/50 max-w-md mx-auto">
                <Search className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  No topics found
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {searchTerm
                    ? `No topics match "${searchTerm}"`
                    : "No topics available"}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
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
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200/50 hover:border-gray-300/50"
              >
                {/* Topic Header */}
                <div className="bg-gradient-to-r from-gray-50/90 to-gray-100/90 px-8 py-6 border-b border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-5">
                      <div className="text-4xl filter drop-shadow-lg">
                        {topic.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                          {topic.name}
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">
                            {topic._count.blogs} blogs
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-lg">
                          <StickyNote className="w-4 h-4 text-purple-600" />
                          <span className="font-medium">
                            {topic._count.notes} notes
                          </span>
                        </div>
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
                            className="group block p-6 bg-gradient-to-br from-gray-50/80 to-white/80 rounded-xl hover:from-blue-50/80 hover:to-indigo-50/80 transition-all duration-300 border border-gray-200/50 hover:border-blue-300/50 hover:shadow-lg backdrop-blur-sm"
                          >
                            <div className="flex items-start space-x-4">
                              <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                {subTopic.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                                  {subTopic.name}
                                </h3>
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                                  {subTopic.description}
                                </p>
                                <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                                  <div className="flex items-center space-x-4">
                                    <span className="flex items-center space-x-1 bg-white/60 px-2 py-1 rounded-md">
                                      <FileText className="w-3 h-3" />
                                      <span className="font-medium">
                                        {subTopic._count.blogs}
                                      </span>
                                    </span>
                                    <span className="flex items-center space-x-1 bg-white/60 px-2 py-1 rounded-md">
                                      <StickyNote className="w-3 h-3" />
                                      <span className="font-medium">
                                        {subTopic._count.notes}
                                      </span>
                                    </span>
                                  </div>
                                  <ChevronRight className="w-5 h-5 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gradient-to-br from-gray-50/50 to-white/50 rounded-xl border border-gray-200/30">
                      <Code className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 text-lg">
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
