import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import AdminLayout from "../../../../components/admin/AdminLayout";
import {
  Save,
  Plus,
  Trash2,
  Code,
  FileText,
  Tag,
  Building,
  Star,
  Clock,
  Zap,
  BookOpen,
  Globe,
  Image,
  Video,
  FileDown,
  Monitor,
} from "lucide-react";
import toast from "react-hot-toast";

interface ProblemSolution {
  id?: string;
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
  id?: string;
  title: string;
  type:
    | "ARTICLE"
    | "VIDEO"
    | "PDF"
    | "IMAGE"
    | "CODE"
    | "WEBSITE"
    | "BOOK"
    | "COURSE";
  url?: string;
  filePath?: string;
  description?: string;
}

const PROGRAMMING_LANGUAGES = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "C",
  "C#",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "PHP",
  "Ruby",
  "Scala",
  "TypeScript",
  "Dart",
  "R",
];

const SOLUTION_TEMPLATES = {
  JavaScript: `// Time Complexity: O()
// Space Complexity: O()
function solution() {
    // Your solution here
}`,
  Python: `# Time Complexity: O()
# Space Complexity: O()
def solution():
    # Your solution here
    pass`,
  Java: `// Time Complexity: O()
// Space Complexity: O()
public class Solution {
    public int solve() {
        // Your solution here
        return 0;
    }
}`,
  "C++": `// Time Complexity: O()
// Space Complexity: O()
class Solution {
public:
    int solve() {
        // Your solution here
        return 0;
    }
};`,
  Go: `// Time Complexity: O()
// Space Complexity: O()
func solution() int {
    // Your solution here
    return 0
}`,
  TypeScript: `// Time Complexity: O()
// Space Complexity: O()
function solution(): number {
    // Your solution here
    return 0;
}`,
};

const RESOURCE_TYPES = [
  { value: "ARTICLE", label: "Article", icon: FileText },
  { value: "VIDEO", label: "Video", icon: Video },
  { value: "PDF", label: "PDF", icon: FileDown },
  { value: "IMAGE", label: "Image", icon: Image },
  { value: "CODE", label: "Code", icon: Code },
  { value: "WEBSITE", label: "Website", icon: Globe },
  { value: "BOOK", label: "Book", icon: BookOpen },
  { value: "COURSE", label: "Course", icon: Monitor },
];

export default function EditLeetcodeProblem() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Basic problem data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">(
    "EASY"
  );
  const [category, setCategory] = useState("DSA");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // LeetCode specific
  const [leetcodeUrl, setLeetcodeUrl] = useState("");
  const [problemNumber, setProblemNumber] = useState<number | undefined>();
  const [isPremium, setIsPremium] = useState(false);
  const [acceptance, setAcceptance] = useState<number | undefined>();
  const [frequency, setFrequency] = useState("");

  // Companies
  const [companies, setCompanies] = useState<string[]>([]);
  const [companyInput, setCompanyInput] = useState("");

  // Hints and follow-up
  const [hints, setHints] = useState<string[]>([]);
  const [hintInput, setHintInput] = useState("");
  const [followUp, setFollowUp] = useState("");

  // Solutions
  const [solutions, setSolutions] = useState<ProblemSolution[]>([]);

  // Resources
  const [resources, setResources] = useState<ProblemResource[]>([]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push("/admin/auth");
      return;
    }
    if (id) {
      fetchProblem();
    }
  }, [user, isLoaded, router, id]);

  const fetchProblem = async () => {
    try {
      const response = await fetch(`/api/admin/leetcode/${id}`);
      if (response.ok) {
        const problem = await response.json();

        // Set basic data
        setTitle(problem.title);
        setDescription(problem.description);
        setDifficulty(problem.difficulty);
        setCategory(problem.category || "DSA");
        setTags(problem.tags || []);
        setLeetcodeUrl(problem.leetcodeUrl || "");
        setProblemNumber(problem.problemNumber);
        setIsPremium(problem.isPremium || false);
        setAcceptance(problem.acceptance);
        setFrequency(problem.frequency || "");
        setCompanies(problem.companies || []);
        setHints(problem.hints || []);
        setFollowUp(problem.followUp || "");
        setSolutions(problem.solutions || []);
        setResources(problem.resources || []);
      } else {
        toast.error("Problem not found");
        router.push("/admin/leetcode");
      }
    } catch (error) {
      console.error("Error fetching problem:", error);
      toast.error("Failed to load problem");
      router.push("/admin/leetcode");
    } finally {
      setInitialLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const addCompany = () => {
    if (companyInput.trim() && !companies.includes(companyInput.trim())) {
      setCompanies([...companies, companyInput.trim()]);
      setCompanyInput("");
    }
  };

  const removeCompany = (companyToRemove: string) => {
    setCompanies(companies.filter((company) => company !== companyToRemove));
  };

  const addHint = () => {
    if (hintInput.trim()) {
      setHints([...hints, hintInput.trim()]);
      setHintInput("");
    }
  };

  const removeHint = (index: number) => {
    setHints(hints.filter((_, i) => i !== index));
  };

  const addSolution = () => {
    setSolutions([
      ...solutions,
      {
        language: "Python",
        code: SOLUTION_TEMPLATES.Python,
        approach: "",
        timeComplex: "",
        spaceComplex: "",
        explanation: "",
        notes: "",
        isOptimal: false,
      },
    ]);
  };

  const updateSolution = (
    index: number,
    field: keyof ProblemSolution,
    value: any
  ) => {
    const newSolutions = [...solutions];
    newSolutions[index] = { ...newSolutions[index], [field]: value };

    // Update code template when language changes
    if (
      field === "language" &&
      SOLUTION_TEMPLATES[value as keyof typeof SOLUTION_TEMPLATES]
    ) {
      newSolutions[index].code =
        SOLUTION_TEMPLATES[value as keyof typeof SOLUTION_TEMPLATES];
    }

    setSolutions(newSolutions);
  };

  const removeSolution = (index: number) => {
    if (solutions.length > 1) {
      setSolutions(solutions.filter((_, i) => i !== index));
    }
  };

  const addResource = () => {
    setResources([
      ...resources,
      {
        title: "",
        type: "ARTICLE",
        url: "",
        description: "",
      },
    ]);
  };

  const updateResource = (
    index: number,
    field: keyof ProblemResource,
    value: any
  ) => {
    const newResources = [...resources];
    newResources[index] = { ...newResources[index], [field]: value };
    setResources(newResources);
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    if (solutions.some((sol) => !sol.code.trim())) {
      toast.error("All solutions must have code");
      return;
    }

    setLoading(true);

    try {
      const problemData = {
        title: title.trim(),
        description: description.trim(),
        difficulty,
        category,
        tags,
        leetcodeUrl: leetcodeUrl.trim() || undefined,
        problemNumber: problemNumber || undefined,
        isPremium,
        acceptance: acceptance || undefined,
        frequency: frequency.trim() || undefined,
        companies,
        hints,
        followUp: followUp.trim() || undefined,
        solutions: solutions.filter((sol) => sol.code.trim()),
        resources: resources.filter((res) => res.title.trim()),
      };

      const response = await fetch(`/api/admin/leetcode/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(problemData),
      });

      if (response.ok) {
        toast.success("Problem updated successfully!");
        router.push("/admin/leetcode");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update problem");
      }
    } catch (error) {
      console.error("Error updating problem:", error);
      toast.error("Failed to update problem");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || initialLoading) {
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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Problem</h1>
            <p className="text-gray-600 mt-1">
              Update problem details, solutions, and resources
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Two Sum"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty *
                </label>{" "}
                <select
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(e.target.value as "EASY" | "MEDIUM" | "HARD")
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  aria-label="Select difficulty level"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>{" "}
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  aria-label="Select problem category"
                >
                  <option value="DSA">Data Structures & Algorithms</option>
                  <option value="System Design">System Design</option>
                  <option value="Database">Database</option>
                  <option value="Math">Mathematics</option>
                  <option value="String">String Manipulation</option>
                  <option value="Dynamic Programming">
                    Dynamic Programming
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LeetCode URL
                </label>
                <input
                  type="url"
                  value={leetcodeUrl}
                  onChange={(e) => setLeetcodeUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://leetcode.com/problems/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Number
                </label>
                <input
                  type="number"
                  value={problemNumber || ""}
                  onChange={(e) =>
                    setProblemNumber(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Detailed problem description..."
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isPremium}
                    onChange={(e) => setIsPremium(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Premium Problem
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Acceptance Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={acceptance || ""}
                  onChange={(e) =>
                    setAcceptance(
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 45.2"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Tags
            </h2>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Add tags (e.g., Array, Two Pointers)"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}{" "}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-blue-600"
                        aria-label={`Remove ${tag} tag`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Companies */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Building className="w-5 h-5" />
              Companies
            </h2>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={companyInput}
                  onChange={(e) => setCompanyInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addCompany())
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Add companies that ask this question"
                />
                <button
                  type="button"
                  onClick={addCompany}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add
                </button>
              </div>

              {companies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {companies.map((company, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {company}
                      <button
                        type="button"
                        onClick={() => removeCompany(company)}
                        className="ml-1 hover:text-green-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Solutions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Solutions
              </h2>
              <button
                type="button"
                onClick={addSolution}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Solution
              </button>
            </div>

            <div className="space-y-6">
              {solutions.map((solution, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">
                      Solution {index + 1}
                    </h3>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={solution.isOptimal}
                          onChange={(e) =>
                            updateSolution(index, "isOptimal", e.target.checked)
                          }
                          className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                        />
                        <Star className="w-4 h-4 ml-1 text-yellow-500" />
                        <span className="ml-1 text-sm text-gray-700">
                          Optimal
                        </span>
                      </label>
                      {solutions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSolution(index)}
                          className="text-red-600 hover:text-red-700"
                          title="Remove solution"
                          aria-label={`Remove solution ${index + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>{" "}
                      <select
                        value={solution.language}
                        onChange={(e) =>
                          updateSolution(index, "language", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        aria-label="Select programming language"
                      >
                        {PROGRAMMING_LANGUAGES.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Approach
                      </label>
                      <input
                        type="text"
                        value={solution.approach}
                        onChange={(e) =>
                          updateSolution(index, "approach", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Two Pointers, Binary Search"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Time
                        </label>
                        <input
                          type="text"
                          value={solution.timeComplex || ""}
                          onChange={(e) =>
                            updateSolution(index, "timeComplex", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="O(n)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Zap className="w-3 h-3 inline mr-1" />
                          Space
                        </label>
                        <input
                          type="text"
                          value={solution.spaceComplex || ""}
                          onChange={(e) =>
                            updateSolution(
                              index,
                              "spaceComplex",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="O(1)"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Code
                      </label>
                      <textarea
                        value={solution.code}
                        onChange={(e) =>
                          updateSolution(index, "code", e.target.value)
                        }
                        rows={12}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        placeholder="Your solution code..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Explanation
                      </label>
                      <textarea
                        value={solution.explanation || ""}
                        onChange={(e) =>
                          updateSolution(index, "explanation", e.target.value)
                        }
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Explain your approach and algorithm..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        value={solution.notes || ""}
                        onChange={(e) =>
                          updateSolution(index, "notes", e.target.value)
                        }
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Additional notes, edge cases, optimizations..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Resources
              </h2>
              <button
                type="button"
                onClick={addResource}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
              </button>
            </div>

            {resources.length > 0 && (
              <div className="space-y-4">
                {resources.map((resource, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">
                        Resource {index + 1}
                      </h3>{" "}
                      <button
                        type="button"
                        onClick={() => removeResource(index)}
                        className="text-red-600 hover:text-red-700"
                        title="Remove resource"
                        aria-label={`Remove resource ${index + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={resource.title}
                          onChange={(e) =>
                            updateResource(index, "title", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Resource title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type
                        </label>{" "}
                        <select
                          value={resource.type}
                          onChange={(e) =>
                            updateResource(index, "type", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          aria-label="Select resource type"
                        >
                          {RESOURCE_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL
                        </label>
                        <input
                          type="url"
                          value={resource.url || ""}
                          onChange={(e) =>
                            updateResource(index, "url", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="https://..."
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={resource.description || ""}
                          onChange={(e) =>
                            updateResource(index, "description", e.target.value)
                          }
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Brief description of the resource..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hints and Follow-up */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Additional Information
            </h2>

            <div className="space-y-6">
              {/* Hints */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hints
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={hintInput}
                      onChange={(e) => setHintInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addHint())
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a hint for solving this problem"
                    />
                    <button
                      type="button"
                      onClick={addHint}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      Add
                    </button>
                  </div>

                  {hints.length > 0 && (
                    <div className="space-y-2">
                      {hints.map((hint, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-yellow-50 rounded border"
                        >
                          <span className="flex-1 text-sm">{hint}</span>{" "}
                          <button
                            type="button"
                            onClick={() => removeHint(index)}
                            className="text-red-600 hover:text-red-700"
                            title="Remove hint"
                            aria-label={`Remove hint ${index + 1}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Follow-up */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Question
                </label>
                <textarea
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="What if we need to handle this scenario...?"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Problem
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
