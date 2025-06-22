import { useState, useEffect } from "react";
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
              subTopic.description.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((topic) => {
        switch (selectedCategory) {
          case "programming":
            return ["Java", "JavaScript", "Python", "C++", "C#"].includes(topic.name);
          case "system-design":
            return topic.name.toLowerCase().includes("system") || 
                   topic.name.toLowerCase().includes("design");
          case "algorithms":
            return topic.name.toLowerCase().includes("algorithm") || 
                   topic.name.toLowerCase().includes("data structure");
          case "databases":
            return topic.name.toLowerCase().includes("database") || 
                   topic.name.toLowerCase().includes("sql");
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
    );  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Brand and main nav */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Home className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Onyx</span>
              </Link>
                <div className="hidden md:flex items-center space-x-1">
                <Link
                  href="/"
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/topics"
                  className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md"
                >
                  Topics
                </Link>
                <Link
                  href="/blogs"
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Blogs
                </Link>
                <Link
                  href="/notes"
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Notes
                </Link>
              </div>
            </div>

            {/* Right side - Search and Auth */}
            <div className="flex items-center space-x-4">
              {/* Quick Search */}
              <div className="hidden lg:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Advanced Search Toggle */}              <button
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                title="Open search options"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <AuthNavbar />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            <Link
              href="/"
              className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              Home
            </Link>
            <Link
              href="/topics"
              className="block px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md"
            >
              Topics
            </Link>
            <Link
              href="/blogs"
              className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              Blogs
            </Link>
            <Link
              href="/notes"
              className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              Notes
            </Link>
            <Link
              href="/leetcode"
              className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              LeetCode
            </Link>
          </div>
        </div>
      </nav>

      {/* Advanced Search Panel */}
      {showAdvancedSearch && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Advanced Search</h3>              <button
                onClick={() => setShowAdvancedSearch(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="Close advanced search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Terms
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search topics, subtopics, descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Filter
                </label>                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  title="Filter by category"
                >
                  <option value="all">All Categories</option>
                  <option value="programming">Programming Languages</option>
                  <option value="system-design">System Design</option>
                  <option value="algorithms">Algorithms & Data Structures</option>
                  <option value="databases">Databases</option>
                </select>
              </div>
            </div>

            {/* Search Results Info */}
            {(searchTerm || selectedCategory !== "all") && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  {filteredTopics.length === 0 ? "No topics found" : 
                   `Found ${filteredTopics.length} topic${filteredTopics.length === 1 ? '' : 's'}`}
                  {searchTerm && ` matching "${searchTerm}"`}
                  {selectedCategory !== "all" && ` in ${selectedCategory} category`}
                </p>
                {(searchTerm || selectedCategory !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="py-12 relative">
        <DotPattern
          className="absolute inset-0 opacity-20"
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
        />        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb items={[{ label: "Topics" }]} />
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📚 Learning Topics
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our organized collection of programming tutorials, notes,
              and resources across different technologies and domains.
            </p>
            
            {/* Stats Summary */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredTopics.length}
                </div>
                <div className="text-sm text-gray-600">Topics</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-green-600">
                  {filteredTopics.reduce((sum, topic) => sum + topic._count.blogs, 0)}
                </div>
                <div className="text-sm text-gray-600">Blogs</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-purple-600">
                  {filteredTopics.reduce((sum, topic) => sum + topic._count.notes, 0)}
                </div>
                <div className="text-sm text-gray-600">Notes</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-orange-600">
                  {filteredTopics.reduce((sum, topic) => sum + topic._count.leetcodeProblems, 0)}
                </div>
                <div className="text-sm text-gray-600">Problems</div>
              </div>
            </div>
            
            {/* Quick Search for smaller screens */}
            <div className="lg:hidden mt-6">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="mt-3 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Advanced Search
              </button>
            </div>
          </div>

          {/* Topics Grid */}
          <div className="space-y-8">
            {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              {/* Topic Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{topic.icon}</div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {topic.name}
                      </h2>
                      <p className="text-blue-100 mt-1">{topic.description}</p>
                    </div>
                  </div>
                  <div className="text-right text-white">
                    <div className="text-2xl font-bold">
                      {topic._count.blogs +
                        topic._count.notes +
                        topic._count.leetcodeProblems}
                    </div>
                    <div className="text-sm text-blue-100">Total Resources</div>
                  </div>
                </div>
              </div>

              {/* Topic Stats */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {topic._count.blogs} Blogs
                  </div>
                  <div className="flex items-center">
                    <StickyNote className="w-4 h-4 mr-1" />
                    {topic._count.notes} Notes
                  </div>
                  <div className="flex items-center">
                    <Code className="w-4 h-4 mr-1" />
                    {topic._count.leetcodeProblems} LeetCode Problems
                  </div>
                  <div className="flex items-center">
                    <FolderTree className="w-4 h-4 mr-1" />
                    {topic.subTopics.length} Subtopics
                  </div>
                </div>
              </div>

              {/* Subtopics Grid */}
              {topic.subTopics.length > 0 && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Subtopics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {topic.subTopics.map((subTopic) => (
                      <Link
                        key={subTopic.id}
                        href={`/topics/${topic.slug}/${subTopic.slug}`}
                        className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl">{subTopic.icon}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {subTopic.name}
                            </h4>
                            {subTopic.description && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {subTopic.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-3">
                              <div className="text-xs text-gray-400">
                                {subTopic._count.blogs +
                                  subTopic._count.notes +
                                  subTopic._count.leetcodeProblems}{" "}
                                resources
                              </div>
                              <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* View All Link */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <Link
                  href={`/topics/${topic.slug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all {topic.name} content
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>            ))}
          </div>

          {/* No Results Message */}
          {filteredTopics.length === 0 && (searchTerm || selectedCategory !== "all") && (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <FolderTree className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No topics found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or category filter to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Looking for something specific?
              </h2>
              <p className="text-gray-600 mb-6">
                Use our advanced search to find blogs, notes, and coding problems
                across all topics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/blogs"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Browse All Blogs
                </Link>
                <Link
                  href="/notes"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <StickyNote className="w-5 h-5 mr-2" />
                  View Study Notes
                </Link>
                <Link
                  href="/leetcode"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Code className="w-5 h-5 mr-2" />
                  Practice LeetCode
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
