import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import AdminLayout from "../../../components/admin/AdminLayout";
import {
  Plus,
  Search,
  Code,
  Edit,
  Trash2,
  ExternalLink,
  Download,
  Upload,
  Filter,
  BookOpen,
  Target,
  Award,
  TrendingUp,
  FileText,
  Eye,
  Copy,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Clock,
  Zap,
  Building,
  Tag,
  Star,
  Link,
  MoreVertical,
  Calendar,
  Hash,
  Users,
  Globe,
} from "lucide-react";
import toast from "react-hot-toast";

interface ProblemSolution {
  id: string;
  language: string;
  code: string;
  approach: string;
  timeComplex?: string;
  spaceComplex?: string;
  explanation?: string;
  notes?: string;
  isOptimal: boolean;
}

interface ProblemResource {
  id: string;
  title: string;
  type: string;
  url?: string;
  filePath?: string;
  description?: string;
}

interface LeetcodeProblem {
  id: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  category: string;
  tags: string[];
  companies: string[];
  hints: string[];
  followUp?: string;
  leetcodeUrl?: string;
  problemNumber?: number;
  frequency?: string;
  acceptance?: number;
  isPremium: boolean;
  timeComplex?: string;
  spaceComplex?: string;
  solutions: ProblemSolution[];
  resources: ProblemResource[];
  topic?: { id: string; name: string };
  subTopic?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
  order?: number;
}

interface ProblemStats {
  total: number;
  EASY?: number;
  MEDIUM?: number;
  HARD?: number;
}

export default function LeetCodeProblems() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState<LeetcodeProblem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState<ProblemStats>({ total: 0 });
  const [showFilters, setShowFilters] = useState(false);

  const pageSize = 20;

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push("/admin/auth");
      return;
    }
    fetchProblems();
  }, [
    user,
    isLoaded,
    router,
    searchTerm,
    selectedDifficulty,
    selectedCategory,
    selectedLanguage,
    sortBy,
    sortOrder,
    currentPage,
  ]);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        search: searchTerm,
        difficulty: selectedDifficulty,
        category: selectedCategory,
        language: selectedLanguage,
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/admin/leetcode?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProblems(data.problems || []);
        setStats(data.stats || { total: 0 });
      }
    } catch (error) {
      console.error("Error fetching problems:", error);
      toast.error("Failed to load problems");
    } finally {
      setLoading(false);
    }
  };

  const moveProblem = async (problemId: string, direction: "up" | "down") => {
    const currentIndex = problems.findIndex((p) => p.id === problemId);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= problems.length) return;

    // Optimistic update
    const newProblems = [...problems];
    [newProblems[currentIndex], newProblems[newIndex]] = [
      newProblems[newIndex],
      newProblems[currentIndex],
    ];
    setProblems(newProblems);

    try {
      // Update order in backend
      await fetch(`/api/admin/leetcode/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId,
          direction,
          newOrder: newIndex,
        }),
      });
      toast.success("Problem order updated");
    } catch (error) {
      // Revert on error
      setProblems(problems);
      toast.error("Failed to update order");
    }
  };

  const deleteProblem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this problem?")) return;

    try {
      const response = await fetch(`/api/admin/leetcode/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProblems(problems.filter((p) => p.id !== id));
        toast.success("Problem deleted successfully");
      } else {
        toast.error("Failed to delete problem");
      }
    } catch (error) {
      console.error("Error deleting problem:", error);
      toast.error("Failed to delete problem");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "text-green-600 bg-green-100";
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-100";
      case "HARD":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (!isLoaded) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    router.push("/admin/auth");
    return null;
  }

  return (
    <AdminLayout>
      <div className="max-w-full mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                LeetCode Problems
              </h1>
              <p className="text-gray-600">
                Comprehensive resource management for software engineers
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={() => router.push("/admin/leetcode/bulk-import")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Upload className="w-4 h-4 mr-2" />
                Bulk Import
              </button>
              <button
                onClick={() =>
                  window.open("/api/admin/leetcode/export?format=csv", "_blank")
                }
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => router.push("/admin/leetcode/create")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Problem
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Target className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Problems
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.total || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Award className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Easy
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.EASY || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Medium
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.MEDIUM || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Target className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Hard
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.HARD || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search problems..."
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Difficulties</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Categories</option>
                  <option value="Array">Array</option>
                  <option value="String">String</option>
                  <option value="Math">Math</option>
                  <option value="DSA">DSA</option>
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : problems.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No problems
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new problem.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => router.push("/admin/leetcode/create")}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Problem
                </button>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {problems.map((problem, index) => (
                <li
                  key={problem.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="px-6 py-6 border-l-4 border-transparent hover:border-blue-500 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1 min-w-0">
                        {" "}
                        {/* Drag Handle & Order Controls */}
                        <div className="flex flex-col items-center mr-6 bg-gray-50 rounded-lg p-2">
                          <button
                            onClick={() => moveProblem(problem.id, "up")}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-white rounded transition-all duration-200"
                            title="Move up"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <GripVertical className="w-4 h-4 text-gray-400 my-1" />
                          <button
                            onClick={() => moveProblem(problem.id, "down")}
                            disabled={index === problems.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-white rounded transition-all duration-200"
                            title="Move down"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                        {/* Problem Info */}
                        <div className="flex-1 min-w-0">
                          {/* Title Row with Number and Premium */}
                          <div className="flex items-center mb-2">
                            {/* Problem Number - Bold and larger */}
                            {problem.problemNumber && (
                              <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold bg-slate-800 text-white mr-3 min-w-[60px] justify-center">
                                #{problem.problemNumber}
                              </span>
                            )}

                            {/* Title - Bold */}
                            <h3 className="text-xl font-bold text-gray-900 truncate flex-1">
                              {problem.title}
                            </h3>

                            {/* Premium Badge */}
                            {problem.isPremium && (
                              <div className="flex items-center ml-3 px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full">
                                <Star className="w-3 h-3 text-white mr-1" />
                                <span className="text-xs font-semibold text-white">
                                  Premium
                                </span>
                              </div>
                            )}

                            {/* Difficulty */}
                            <span
                              className={`ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(
                                problem.difficulty
                              )}`}
                            >
                              {problem.difficulty.toLowerCase()}
                            </span>
                          </div>
                          {/* Description - Italic */}
                          <p className="text-sm text-gray-600 italic leading-relaxed mb-3">
                            {truncateText(problem.description, 150)}
                          </p>
                          {/* Meta Information - Dark background */}
                          <div className="bg-slate-800 rounded-lg px-3 py-2 mb-2">
                            <div className="flex items-center text-xs text-gray-300 space-x-4 flex-wrap">
                              {/* Category */}
                              <div className="flex items-center">
                                <Code className="w-3 h-3 mr-1" />
                                <span className="font-medium">
                                  {problem.category}
                                </span>
                              </div>

                              {/* Solutions Count */}
                              <div className="flex items-center">
                                <FileText className="w-3 h-3 mr-1" />
                                <span>
                                  {problem.solutions?.length || 0} solutions
                                </span>
                              </div>

                              {/* Companies */}
                              {problem.companies?.length > 0 && (
                                <div className="flex items-center">
                                  <Building className="w-3 h-3 mr-1" />
                                  <span>
                                    {problem.companies.slice(0, 2).join(", ")}
                                    {problem.companies.length > 2 &&
                                      ` +${problem.companies.length - 2} more`}
                                  </span>
                                </div>
                              )}

                              {/* Acceptance Rate */}
                              {problem.acceptance && (
                                <div className="flex items-center">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  <span>{problem.acceptance}% accepted</span>
                                </div>
                              )}

                              {/* Created Date */}
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span>{formatDate(problem.createdAt)}</span>
                              </div>
                            </div>
                          </div>{" "}
                          {/* Tags */}
                          {problem.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {problem.tags.slice(0, 4).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                                >
                                  #{tag}
                                </span>
                              ))}
                              {problem.tags.length > 4 && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                                  +{problem.tags.length - 4} more tags
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>{" "}
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-1 ml-4">
                        {problem.leetcodeUrl && (
                          <button
                            onClick={() =>
                              window.open(problem.leetcodeUrl, "_blank")
                            }
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="Open LeetCode"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() =>
                            router.push(`/admin/leetcode/edit/${problem.id}`)
                          }
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => deleteProblem(problem.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pagination */}
        {problems.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={problems.length < pageSize}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, stats.total)}
                  </span>{" "}
                  of <span className="font-medium">{stats.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    Previous
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    Page {currentPage}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={problems.length < pageSize}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
