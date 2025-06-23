import { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
  ArrowLeft,
  Download,
  Maximize2,
  Minimize2,
  Settings,
  Palette,
} from "lucide-react";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

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
  tags?: string[];
  companies?: string[];
  hints?: string[];
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

export default function ProblemPage() {
  const router = useRouter();
  const { id } = router.query;

  const [problem, setProblem] = useState<LeetCodeProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSolution, setSelectedSolution] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showHints, setShowHints] = useState<boolean[]>([]);

  useEffect(() => {
    if (id) {
      fetchProblem(id as string);
      // Check if problem is in favorites
      const favorites = JSON.parse(
        localStorage.getItem("leetcode-favorites") || "[]"
      );
      setIsFavorite(favorites.includes(id));
    }
  }, [id]);

  const fetchProblem = async (problemId: string) => {
    try {
      const response = await fetch(`/api/leetcode/${problemId}`);
      if (response.ok) {
        const data = await response.json();
        setProblem(data.problem);
        if (data.problem?.hints) {
          setShowHints(new Array(data.problem.hints.length).fill(false));
        }
      } else {
        toast.error("Problem not found");
        router.push("/leetcode");
      }
    } catch (error) {
      console.error("Failed to fetch problem:", error);
      toast.error("Failed to load problem");
      router.push("/leetcode");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async (code: string, solutionId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(solutionId);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  const downloadCode = (code: string, language: string, title: string) => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, "_")}.${getFileExtension(
      language
    )}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Code downloaded!");
  };

  const getFileExtension = (language: string) => {
    const extensions: { [key: string]: string } = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
      csharp: "cs",
      go: "go",
      rust: "rs",
      kotlin: "kt",
      swift: "swift",
    };
    return extensions[language.toLowerCase()] || "txt";
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(
      localStorage.getItem("leetcode-favorites") || "[]"
    );
    if (isFavorite) {
      const newFavorites = favorites.filter((fav: string) => fav !== id);
      localStorage.setItem("leetcode-favorites", JSON.stringify(newFavorites));
      setIsFavorite(false);
      toast.success("Removed from favorites");
    } else {
      favorites.push(id);
      localStorage.setItem("leetcode-favorites", JSON.stringify(favorites));
      setIsFavorite(true);
      toast.success("Added to favorites");
    }
  };

  const shareProblem = async () => {
    if (!problem) return;

    const shareData = {
      title: `LeetCode: ${problem.title}`,
      text: `Check out this ${
        problem.difficulty
      } problem: ${problem.description.substring(0, 100)}...`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Problem URL copied to clipboard!");
    }
  };

  const toggleHint = (index: number) => {
    const newShowHints = [...showHints];
    newShowHints[index] = !newShowHints[index];
    setShowHints(newShowHints);
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
        return <Target className="w-4 h-4" />;
      case "MEDIUM":
        return <Zap className="w-4 h-4" />;
      case "HARD":
        return <Trophy className="w-4 h-4" />;
      default:
        return <Code className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <Search className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Problem Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The problem you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/leetcode"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Problems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 relative">
      <AnimatedGridPattern
        className="absolute inset-0 opacity-15 [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]"
        width={35}
        height={35}
        numSquares={25}
        maxOpacity={0.25}
        duration={4}
        repeatDelay={0.8}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/leetcode"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Problems
          </Link>
        </div>

        {/* Problem Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {problem.problemNumber && (
                  <span className="inline-flex items-center px-3 py-1.5 text-sm font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Hash className="w-4 h-4 mr-1" />
                    {problem.problemNumber}
                  </span>
                )}
                <span
                  className={`inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-lg border ${getDifficultyColor(
                    problem.difficulty
                  )}`}
                >
                  {getDifficultyIcon(problem.difficulty)}
                  <span className="ml-1.5">{problem.difficulty}</span>
                </span>
                {problem.isPremium && (
                  <span className="inline-flex items-center px-3 py-1.5 text-sm font-bold text-purple-700 bg-purple-100 border border-purple-200 rounded-lg">
                    <Crown className="w-4 h-4 mr-1" />
                    Premium
                  </span>
                )}
                {problem.acceptance && (
                  <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 border border-green-200 rounded-lg">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    {problem.acceptance}% Acceptance
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {problem.title}
              </h1>

              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {problem.author.name}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(problem.createdAt).toLocaleDateString()}
                </div>
                {problem.category && (
                  <div className="flex items-center">
                    <FolderTree className="w-4 h-4 mr-1" />
                    {problem.category}
                  </div>
                )}
                {problem.frequency && (
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {problem.frequency} Frequency
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 ml-6">
              <button
                onClick={toggleFavorite}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  isFavorite
                    ? "text-pink-600 bg-pink-100 hover:bg-pink-200"
                    : "text-gray-400 hover:text-pink-600 hover:bg-pink-50"
                }`}
                title={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Heart
                  className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`}
                />
              </button>

              <button
                onClick={shareProblem}
                className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                title="Share problem"
              >
                <Share2 className="w-6 h-6" />
              </button>

              {problem.leetcodeUrl && (
                <a
                  href={problem.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200"
                  title="View on LeetCode"
                >
                  <ExternalLink className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>

          {/* Tags */}
          {(problem.tags?.length || 0) > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {problem.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-200 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Companies */}
          {(problem.companies?.length || 0) > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Asked by Companies
              </h3>
              <div className="flex flex-wrap gap-2">
                {problem.companies?.map((company) => (
                  <span
                    key={company}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-lg"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Problem Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Problem Description
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {problem.description}
                </p>
              </div>
            </div>

            {/* Solutions */}
            {(problem.solutions?.length || 0) > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                      <FileCode className="w-5 h-5 mr-2" />
                      Solutions ({problem.solutions?.length || 0})
                    </h2>
                    <div className="flex items-center gap-3">
                      {" "}
                      <select
                        value={editorTheme}
                        onChange={(e) => setEditorTheme(e.target.value)}
                        title="Select editor theme"
                        aria-label="Select editor theme"
                        className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="vs-dark">Dark Theme</option>
                        <option value="light">Light Theme</option>
                        <option value="hc-black">High Contrast</option>
                      </select>
                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                      >
                        {isFullscreen ? (
                          <Minimize2 className="w-4 h-4" />
                        ) : (
                          <Maximize2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {(problem.solutions?.length || 0) > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto">
                      {problem.solutions?.map((solution, index) => (
                        <button
                          key={solution.id}
                          onClick={() => setSelectedSolution(index)}
                          className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            selectedSolution === index
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                        >
                          {solution.language} - {solution.approach}
                          {solution.isOptimal && (
                            <Trophy className="w-3 h-3 ml-1 inline" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {problem.solutions && problem.solutions[selectedSolution] && (
                  <div
                    className={
                      isFullscreen
                        ? "fixed inset-0 z-50 bg-white dark:bg-gray-900"
                        : ""
                    }
                  >
                    {isFullscreen && (
                      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {problem.solutions[selectedSolution].language} -{" "}
                          {problem.solutions[selectedSolution].approach}
                        </h3>{" "}
                        <button
                          onClick={() => setIsFullscreen(false)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          title="Exit fullscreen"
                          aria-label="Exit fullscreen"
                        >
                          <Minimize2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <span className="inline-flex items-center px-3 py-1.5 text-sm font-bold text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-lg">
                            {problem.solutions[selectedSolution].language}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {problem.solutions[selectedSolution].approach}
                          </span>
                          {problem.solutions[selectedSolution].isOptimal && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-bold text-green-700 bg-green-100 border border-green-200 rounded-lg">
                              <Trophy className="w-3 h-3 mr-1" />
                              Optimal
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              downloadCode(
                                problem.solutions![selectedSolution].code,
                                problem.solutions![selectedSolution].language,
                                problem.title
                              )
                            }
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                            title="Download code"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              copyCode(
                                problem.solutions![selectedSolution].code,
                                problem.solutions![selectedSolution].id
                              )
                            }
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                            title="Copy code"
                          >
                            {copiedCode ===
                            problem.solutions![selectedSolution].id ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {(problem.solutions[selectedSolution].timeComplex ||
                        problem.solutions[selectedSolution].spaceComplex) && (
                        <div className="flex gap-6 mb-4 text-sm">
                          {problem.solutions[selectedSolution].timeComplex && (
                            <div className="flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                              <Clock className="w-4 h-4 mr-2 text-blue-600" />
                              <span className="text-blue-800 dark:text-blue-300">
                                Time:{" "}
                                {
                                  problem.solutions[selectedSolution]
                                    .timeComplex
                                }
                              </span>
                            </div>
                          )}
                          {problem.solutions[selectedSolution].spaceComplex && (
                            <div className="flex items-center px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                              <Monitor className="w-4 h-4 mr-2 text-purple-600" />
                              <span className="text-purple-800 dark:text-purple-300">
                                Space:{" "}
                                {
                                  problem.solutions[selectedSolution]
                                    .spaceComplex
                                }
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <div
                        className={`rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 ${
                          isFullscreen ? "h-96" : "h-80"
                        }`}
                      >
                        <MonacoEditor
                          height="100%"
                          language={problem.solutions[
                            selectedSolution
                          ].language.toLowerCase()}
                          value={problem.solutions[selectedSolution].code}
                          theme={editorTheme}
                          options={{
                            readOnly: true,
                            minimap: { enabled: !isFullscreen },
                            fontSize: 14,
                            lineNumbers: "on",
                            roundedSelection: false,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            wordWrap: "on",
                            folding: true,
                            lineDecorationsWidth: 10,
                            lineNumbersMinChars: 3,
                          }}
                        />
                      </div>

                      {problem.solutions[selectedSolution].explanation && (
                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center">
                            <Lightbulb className="w-4 h-4 mr-1" />
                            Explanation
                          </h4>
                          <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed whitespace-pre-wrap">
                            {problem.solutions[selectedSolution].explanation}
                          </p>
                        </div>
                      )}

                      {problem.solutions[selectedSolution].notes && (
                        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                          <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-300 mb-2 flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Notes
                          </h4>
                          <p className="text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed whitespace-pre-wrap">
                            {problem.solutions[selectedSolution].notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Follow Up */}
            {problem.followUp && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <ChevronRight className="w-5 h-5 mr-2" />
                  Follow Up
                </h2>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <p className="text-purple-800 dark:text-purple-200 leading-relaxed">
                    {problem.followUp}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hints */}
            {(problem.hints?.length || 0) > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Hints ({problem.hints?.length || 0})
                </h3>
                <div className="space-y-3">
                  {problem.hints?.map((hint, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      {" "}
                      <button
                        onClick={() => toggleHint(index)}
                        className="w-full p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-between"
                        title={`${showHints[index] ? "Hide" : "Show"} hint ${
                          index + 1
                        }`}
                        aria-label={`${
                          showHints[index] ? "Hide" : "Show"
                        } hint ${index + 1}`}
                      >
                        <span>Hint {index + 1}</span>
                        {showHints[index] ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      {showHints[index] && (
                        <div className="p-3 pt-0">
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {hint}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resources */}
            {(problem.resources?.length || 0) > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Resources ({problem.resources?.length || 0})
                </h3>
                <div className="space-y-3">
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
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                            {resource.description}
                          </p>
                        )}
                      </div>
                      {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-3 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-200"
                          title={`Open ${resource.title}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Solutions
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {problem.solutions?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Resources
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {problem.resources?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Hints
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {problem.hints?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Tags
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {problem.tags?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
