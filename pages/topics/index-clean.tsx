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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="mb-8 p-6 bg-white rounded-lg shadow">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, j) => (
                    <div key={j} className="h-20 bg-gray-200 rounded"></div>
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
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />

      {/* Page Header with Search */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Learning Topics
              </h1>
              <p className="mt-2 text-gray-600">
                Explore programming languages, system design, and technical
                concepts
              </p>
            </div>

            {/* Search Section */}
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
              {/* Quick Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full lg:w-64 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Advanced Search Toggle */}
              <button
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Search Panel */}
      {showAdvancedSearch && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Advanced Search
              </h3>
              <button
                onClick={() => setShowAdvancedSearch(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Search Results Summary */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                Showing {filteredTopics.length} of {topics.length} topics
              </span>
              {searchTerm && (
                <span className="flex items-center gap-1">
                  for "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Clear
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <FolderTree className="w-8 h-8" />
              </div>
              <div className="text-2xl font-bold">{totalTopics}</div>
              <div className="text-blue-100">Topics</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Code className="w-8 h-8" />
              </div>
              <div className="text-2xl font-bold">{totalSubTopics}</div>
              <div className="text-blue-100">Subtopics</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <FileText className="w-8 h-8" />
              </div>
              <div className="text-2xl font-bold">{totalBlogs}</div>
              <div className="text-blue-100">Blogs</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <StickyNote className="w-8 h-8" />
              </div>
              <div className="text-2xl font-bold">{totalNotes}</div>
              <div className="text-blue-100">Notes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb
          items={[
            { title: "Home", href: "/" },
            { title: "Topics", href: "/topics" },
          ]}
        />

        {/* Topics Grid */}
        <div className="mt-8 space-y-8">
          {filteredTopics.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No topics found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? `No topics match "${searchTerm}"`
                  : "No topics available"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Topic Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{topic.icon}</div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {topic.name}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>{topic._count.blogs} blogs</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <StickyNote className="w-4 h-4" />
                          <span>{topic._count.notes} notes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtopics Grid */}
                <div className="p-6">
                  {topic.subTopics.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {topic.subTopics
                        .sort((a, b) => a.order - b.order)
                        .map((subTopic) => (
                          <Link
                            key={subTopic.id}
                            href={`/topics/${topic.slug}/${subTopic.slug}`}
                            className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="text-xl flex-shrink-0">
                                {subTopic.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 truncate">
                                  {subTopic.name}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {subTopic.description}
                                </p>
                                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                                  <div className="flex items-center space-x-3">
                                    <span className="flex items-center space-x-1">
                                      <FileText className="w-3 h-3" />
                                      <span>{subTopic._count.blogs}</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                      <StickyNote className="w-3 h-3" />
                                      <span>{subTopic._count.notes}</span>
                                    </span>
                                  </div>
                                  <ChevronRight className="w-4 h-4" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Code className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No subtopics available yet</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Background Pattern */}
      <DotPattern
        className="fixed inset-0 -z-10 opacity-20"
        width={20}
        height={20}
        x={0}
        y={0}
        cr={1}
      />
    </div>
  );
}
