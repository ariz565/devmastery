import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import AdminLayout from "../../../components/admin/AdminLayout";
import { Plus, Search, Code, Edit, Trash2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface LeetcodeProblem {
  id: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  description: string;
  solution: string;
  explanation: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function LeetcodeManagement() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [problems, setProblems] = useState<LeetcodeProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push("/admin/auth");
      return;
    }
    fetchProblems();
  }, [user, isLoaded, router]);

  const fetchProblems = async () => {
    try {
      const response = await fetch("/api/admin/leetcode");
      if (response.ok) {
        const data = await response.json();
        setProblems(data.problems || []);
      }
    } catch (error) {
      console.error("Error fetching problems:", error);
      toast.error("Failed to load problems");
    } finally {
      setLoading(false);
    }
  };

  const deleteProblem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this problem?")) return;

    try {
      const response = await fetch(`/api/admin/leetcode/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProblems(problems.filter((problem) => problem.id !== id));
        toast.success("Problem deleted successfully");
      } else {
        toast.error("Failed to delete problem");
      }
    } catch (error) {
      console.error("Error deleting problem:", error);
      toast.error("Failed to delete problem");
    }
  };
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.solution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      selectedDifficulty === "all" || problem.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const difficulties = ["all", "EASY", "MEDIUM", "HARD"];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HARD":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isLoaded || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              LeetCode Problems
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your solved LeetCode problems
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/leetcode/create")}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Problem
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>{" "}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Filter by difficulty"
          >
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty === "all" ? "All Difficulties" : difficulty}
              </option>
            ))}
          </select>
        </div>

        {/* Problems Grid */}
        {filteredProblems.length === 0 ? (
          <div className="text-center py-12">
            <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No problems found
            </h3>{" "}
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedDifficulty !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first solved problem"}
            </p>
            {!searchTerm && selectedDifficulty === "all" && (
              <button
                onClick={() => router.push("/admin/leetcode/create")}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Problem
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map((problem) => (
              <div
                key={problem.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
                    {problem.title}
                  </h3>{" "}
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        router.push(`/admin/leetcode/edit/${problem.id}`)
                      }
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit problem"
                      aria-label={`Edit problem ${problem.title}`}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteProblem(problem.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete problem"
                      aria-label={`Delete problem ${problem.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {problem.solution.substring(0, 100)}...
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    {new Date(problem.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {problem.tags && problem.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {problem.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {problem.tags.length > 3 && (
                      <span className="text-gray-500 text-xs">
                        +{problem.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
