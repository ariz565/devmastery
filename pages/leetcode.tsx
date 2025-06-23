import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Code,
  Tag,
  User,
  Calendar,
  BookOpen,
  FileText,
  FolderTree,
  Star,
  TrendingUp,
  Building,
  ExternalLink,
  Play,
  Copy,
  Check,
  Search,
  Filter,
  BarChart3,
  Lightbulb,
  Target,
  Award,
  ChevronRight,
  Eye,
  Heart,
  Bookmark,
  Share2,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  Monitor,
  Timer,
  Zap,
  GitBranch,
  Terminal,
  Trophy,
  Users,
  FileCode,
  MessageSquare,
  ThumbsUp,
  Activity,
  Layers,
  Grid3X3,
  Hash,
  Crown,
} from "lucide-react";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
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
  description?: string;
}

interface LeetCodeProblem {
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
  solutions?: ProblemSolution[];
  resources?: ProblemResource[];
  createdAt: string;
  author: {
    name: string;
  };
}

export default function LeetCodePage() {
  const [problems, setProblems] = useState<LeetCodeProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedProblems, setExpandedProblems] = useState<Set<string>>(
    new Set()
  );
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [copiedSolution, setCopiedSolution] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  useEffect(() => {
    fetchProblems();
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("leetcode-favorites");
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await fetch("/api/leetcode");
      const data = await response.json();
      setProblems(data.problems || []);
    } catch (error) {
      console.error("Failed to fetch problems:", error);
      toast.error("Failed to load problems");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (problemId: string) => {
    const newExpanded = new Set(expandedProblems);
    if (newExpanded.has(problemId)) {
      newExpanded.delete(problemId);
    } else {
      newExpanded.add(problemId);
    }
    setExpandedProblems(newExpanded);
  };

  const toggleFavorite = (problemId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(problemId)) {
      newFavorites.delete(problemId);
      toast.success("Removed from favorites");
    } else {
      newFavorites.add(problemId);
      toast.success("Added to favorites");
    }
    setFavorites(newFavorites);
    localStorage.setItem(
      "leetcode-favorites",
      JSON.stringify(Array.from(newFavorites))
    );
  };

  const copySolution = async (code: string, solutionId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedSolution(solutionId);
      toast.success("Solution copied to clipboard!");
      setTimeout(() => setCopiedSolution(null), 2000);
    } catch (error) {
      toast.error("Failed to copy solution");
    }
  };

  const shareProblem = async (problem: LeetCodeProblem) => {
    const shareData = {
      title: `LeetCode: ${problem.title}`,
      text: `Check out this ${
        problem.difficulty
      } problem: ${problem.description.substring(0, 100)}...`,
      url: problem.leetcodeUrl || window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback to copying URL
      await navigator.clipboard.writeText(shareData.url);
      toast.success("Problem URL copied to clipboard!");
    }
  };

  const categories = Array.from(
    new Set(problems.map((p) => p.category))
  ).filter(Boolean);

  const filteredProblems = problems
    .filter(
      (problem) =>
        selectedDifficulty === "all" ||
        problem.difficulty === selectedDifficulty
    )
    .filter(
      (problem) =>
        selectedCategory === "all" || problem.category === selectedCategory
    )
    .filter(
      (problem) =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (problem.tags || []).some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

  const stats = {
    total: problems.length,
    easy: problems.filter((p) => p.difficulty === "EASY").length,
    medium: problems.filter((p) => p.difficulty === "MEDIUM").length,
    hard: problems.filter((p) => p.difficulty === "HARD").length,
    premium: problems.filter((p) => p.isPremium).length,
    favorites: favorites.size,
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "text-emerald-700 bg-emerald-100 border-emerald-200";
      case "MEDIUM":
        return "text-amber-700 bg-amber-100 border-amber-200";
      case "HARD":
        return "text-red-700 bg-red-100 border-red-200";
      default:
        return "text-gray-700 bg-gray-100 border-gray-200";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return <Target className="w-3 h-3" />;
      case "MEDIUM":
        return <Zap className="w-3 h-3" />;
      case "HARD":
        return <Trophy className="w-3 h-3" />;
      default:
        return <Code className="w-3 h-3" />;
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-1/3 mb-8"></div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"
                >
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>

            {/* Problems skeleton */}
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 relative">
      <AnimatedGridPattern
        className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]"
        width={40}
        height={40}
        numSquares={30}
        maxOpacity={0.3}
        duration={3}
        repeatDelay={1}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/topics"
              className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FolderTree className="w-4 h-4 mr-2" />
              Topics
            </Link>
            <Link
              href="/blogs"
              className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Blogs
            </Link>
            <Link
              href="/notes"
              className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FileText className="w-4 h-4 mr-2" />
              Notes
            </Link>
            <div className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl shadow-sm">
              <Code className="w-4 h-4 mr-2" />
              LeetCode
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <Terminal className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
            LeetCode Solutions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Master coding interviews with detailed solutions, multiple
            approaches, and comprehensive explanations for LeetCode problems.
          </p>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Problems
                </p>
              </div>
              <Grid3X3 className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-emerald-600">
                  {stats.easy}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Easy</p>
              </div>
              <Target className="w-8 h-8 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-amber-600">
                  {stats.medium}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Medium
                </p>
              </div>
              <Zap className="w-8 h-8 text-amber-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.hard}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Hard</p>
              </div>
              <Trophy className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.premium}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Premium
                </p>
              </div>
              <Crown className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-pink-600">
                  {stats.favorites}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Favorites
                </p>
              </div>
              <Heart className="w-8 h-8 text-pink-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search problems, tags, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex gap-3">
              {" "}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                title="Filter by difficulty"
                aria-label="Filter by difficulty"
                className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white min-w-[140px] transition-all duration-200"
              >
                <option value="all">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                title="Filter by category"
                aria-label="Filter by category"
                className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white min-w-[140px] transition-all duration-200"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="flex rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-1">
                <button
                  onClick={() => setViewMode("list")}
                  title="List view"
                  aria-label="Switch to list view"
                  className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                  aria-label="Switch to grid view"
                  className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Problems List */}
        {filteredProblems.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">
              No problems found matching your criteria.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
                : "space-y-6"
            }
          >
            {filteredProblems.map((problem) => (
              <div
                key={problem.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        {problem.problemNumber && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <Hash className="w-3 h-3 mr-1" />
                            {problem.problemNumber}
                          </span>
                        )}
                        {problem.isPremium && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-bold text-purple-700 bg-purple-100 border border-purple-200 rounded-lg">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </span>
                        )}
                      </div>{" "}
                      <Link href={`/leetcode/${problem.id}`}>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                          {problem.problemNumber &&
                            `${problem.problemNumber}. `}
                          {problem.title}
                        </h2>
                      </Link>
                      <div className="flex items-center gap-4 mb-4">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-lg border ${getDifficultyColor(
                            problem.difficulty
                          )}`}
                        >
                          {getDifficultyIcon(problem.difficulty)}
                          <span className="ml-1.5">{problem.difficulty}</span>
                        </span>

                        {problem.category && (
                          <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-100 border border-indigo-200 rounded-lg">
                            <FolderTree className="w-3 h-3 mr-1.5" />
                            {problem.category}
                          </span>
                        )}

                        {problem.frequency && (
                          <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-orange-700 bg-orange-100 border border-orange-200 rounded-lg">
                            <TrendingUp className="w-3 h-3 mr-1.5" />
                            {problem.frequency}
                          </span>
                        )}

                        {problem.acceptance && (
                          <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 border border-green-200 rounded-lg">
                            <BarChart3 className="w-3 h-3 mr-1.5" />
                            {problem.acceptance}%
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => toggleFavorite(problem.id)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          favorites.has(problem.id)
                            ? "text-pink-600 bg-pink-100 hover:bg-pink-200"
                            : "text-gray-400 hover:text-pink-600 hover:bg-pink-50"
                        }`}
                        title={
                          favorites.has(problem.id)
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favorites.has(problem.id) ? "fill-current" : ""
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => shareProblem(problem)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Share problem"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>

                      {problem.leetcodeUrl && (
                        <a
                          href={problem.leetcodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                          title="View on LeetCode"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}

                      <button
                        onClick={() => toggleExpanded(problem.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                        title={
                          expandedProblems.has(problem.id)
                            ? "Collapse"
                            : "Expand"
                        }
                      >
                        {expandedProblems.has(problem.id) ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  {/* Description */}
                  <div className="mb-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {expandedProblems.has(problem.id)
                        ? problem.description
                        : `${problem.description.substring(0, 200)}${
                            problem.description.length > 200 ? "..." : ""
                          }`}
                    </p>
                  </div>{" "}
                  {/* Tags */}
                  {(problem.tags?.length || 0) > 0 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {(expandedProblems.has(problem.id)
                          ? problem.tags || []
                          : (problem.tags || []).slice(0, 5)
                        ).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-200 rounded-md hover:bg-blue-200 transition-colors cursor-pointer"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                        {!expandedProblems.has(problem.id) &&
                          (problem.tags?.length || 0) > 5 && (
                            <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md">
                              +{(problem.tags?.length || 0) - 5} more
                            </span>
                          )}
                      </div>
                    </div>
                  )}
                  {/* Companies */}
                  {expandedProblems.has(problem.id) &&
                    (problem.companies?.length || 0) > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          <Building className="w-4 h-4 inline mr-1" />
                          Asked by Companies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {problem.companies?.map((company) => (
                            <span
                              key={company}
                              className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-md"
                            >
                              {company}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  {/* Expanded Content */}
                  {expandedProblems.has(problem.id) && (
                    <div className="space-y-6">
                      {" "}
                      {/* Solutions */}
                      {(problem.solutions?.length || 0) > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <FileCode className="w-5 h-5 mr-2" />
                            Solutions ({problem.solutions?.length || 0})
                          </h3>
                          <div className="space-y-4">
                            {problem.solutions?.map((solution, index) => (
                              <div
                                key={solution.id}
                                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold text-gray-700 bg-gray-200 rounded-md">
                                      {solution.language}
                                    </span>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                      {solution.approach}
                                    </span>
                                    {solution.isOptimal && (
                                      <span className="inline-flex items-center px-2 py-1 text-xs font-bold text-green-700 bg-green-100 border border-green-200 rounded-md">
                                        <Trophy className="w-3 h-3 mr-1" />
                                        Optimal
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() =>
                                      copySolution(solution.code, solution.id)
                                    }
                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-all duration-200"
                                    title="Copy solution"
                                  >
                                    {copiedSolution === solution.id ? (
                                      <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>

                                {(solution.timeComplex ||
                                  solution.spaceComplex) && (
                                  <div className="flex gap-4 mb-3 text-sm">
                                    {solution.timeComplex && (
                                      <span className="text-gray-600 dark:text-gray-400">
                                        <Clock className="w-4 h-4 inline mr-1" />
                                        Time: {solution.timeComplex}
                                      </span>
                                    )}
                                    {solution.spaceComplex && (
                                      <span className="text-gray-600 dark:text-gray-400">
                                        <Monitor className="w-4 h-4 inline mr-1" />
                                        Space: {solution.spaceComplex}
                                      </span>
                                    )}
                                  </div>
                                )}

                                <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
                                  <pre className="text-gray-100 text-sm">
                                    <code>{solution.code}</code>
                                  </pre>
                                </div>

                                {solution.explanation && (
                                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                                      Explanation
                                    </h5>
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                      {solution.explanation}
                                    </p>
                                  </div>
                                )}

                                {solution.notes && (
                                  <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                    <h5 className="text-sm font-semibold text-yellow-900 dark:text-yellow-300 mb-1">
                                      Notes
                                    </h5>
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                      {solution.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}{" "}
                      {/* Resources */}
                      {(problem.resources?.length || 0) > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <BookOpen className="w-5 h-5 mr-2" />
                            Resources ({problem.resources?.length || 0})
                          </h3>
                          <div className="grid gap-3">
                            {problem.resources?.map((resource) => (
                              <div
                                key={resource.id}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                              >
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {resource.title}
                                  </h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {resource.type}
                                  </p>
                                  {resource.description && (
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                      {resource.description}
                                    </p>
                                  )}
                                </div>{" "}
                                {resource.url && (
                                  <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={`Open ${resource.title}`}
                                    className="ml-3 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-200"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}{" "}
                      {/* Hints */}
                      {(problem.hints?.length || 0) > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <Lightbulb className="w-5 h-5 mr-2" />
                            Hints ({problem.hints?.length || 0})
                          </h3>
                          <div className="space-y-2">
                            {problem.hints?.map((hint, index) => (
                              <div
                                key={index}
                                className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                              >
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                  <strong>Hint {index + 1}:</strong> {hint}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Follow Up */}
                      {problem.followUp && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                            <ChevronRight className="w-5 h-5 mr-2" />
                            Follow Up
                          </h3>
                          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                            <p className="text-purple-800 dark:text-purple-200">
                              {problem.followUp}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {problem.author.name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(problem.createdAt).toLocaleDateString()}
                      </div>
                    </div>{" "}
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {problem.solutions?.length || 0} solution
                        {(problem.solutions?.length || 0) !== 1 ? "s" : ""}
                      </span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {problem.resources?.length || 0} resource
                        {(problem.resources?.length || 0) !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
