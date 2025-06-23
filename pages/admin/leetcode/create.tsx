import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import AdminLayout from "../../../components/admin/AdminLayout";
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
  Monitor
} from "lucide-react";
import toast from "react-hot-toast";

interface ProblemSolution {
  language: string;
  code: string;
  approach: string;
  timeComplex?: string;
  spaceComplex?: string;
  explanation?: string;
  notes?: string;
  isOptimal?: boolean;
}

interface ProblemResource {
  title: string;
  type: "ARTICLE" | "VIDEO" | "DOCUMENTATION" | "GITHUB" | "TUTORIAL" | "BOOK" | "COURSE";
  url?: string;
  filePath?: string;
  description?: string;
}

const DIFFICULTY_OPTIONS = [
  { value: "EASY", label: "Easy", color: "text-green-600" },
  { value: "MEDIUM", label: "Medium", color: "text-yellow-600" },
  { value: "HARD", label: "Hard", color: "text-red-600" },
];

const LANGUAGE_OPTIONS = [
  "Python", "JavaScript", "TypeScript", "Java", "C++", "C", "C#", 
  "Go", "Rust", "Swift", "Kotlin", "Scala", "Ruby", "PHP"
];

const SOLUTION_TEMPLATES = {
  Python: `def solution(self):\n    # Your solution here\n    pass`,
  JavaScript: `function solution() {\n    // Your solution here\n}`,
  TypeScript: `function solution(): void {\n    // Your solution here\n}`,
  Java: `public class Solution {\n    public void solution() {\n        // Your solution here\n    }\n}`,
  "C++": `class Solution {\npublic:\n    void solution() {\n        // Your solution here\n    }\n};`,
  C: `void solution() {\n    // Your solution here\n}`,
  "C#": `public class Solution {\n    public void Solution() {\n        // Your solution here\n    }\n}`,
  Go: `func solution() {\n    // Your solution here\n}`,
  Rust: `impl Solution {\n    pub fn solution() {\n        // Your solution here\n    }\n}`,
  Swift: `class Solution {\n    func solution() {\n        // Your solution here\n    }\n}`,
  Kotlin: `class Solution {\n    fun solution() {\n        // Your solution here\n    }\n}`,
  Scala: `object Solution {\n    def solution(): Unit = {\n        // Your solution here\n    }\n}`,
  Ruby: `def solution\n    # Your solution here\nend`,
  PHP: `<?php\nfunction solution() {\n    // Your solution here\n}\n?>`
};

const RESOURCE_TYPES = [
  { value: "ARTICLE", label: "Article", icon: FileText },
  { value: "VIDEO", label: "Video", icon: Video },
  { value: "DOCUMENTATION", label: "Documentation", icon: FileText },
  { value: "GITHUB", label: "GitHub", icon: Code },
  { value: "TUTORIAL", label: "Tutorial", icon: BookOpen },
  { value: "BOOK", label: "Book", icon: BookOpen },
  { value: "COURSE", label: "Course", icon: Monitor },
];

export default function CreateLeetcodeProblem() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Basic problem data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");
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
  const [solutions, setSolutions] = useState<ProblemSolution[]>([
    {
      language: "Python",
      code: SOLUTION_TEMPLATES.Python,
      approach: "",
      timeComplex: "",
      spaceComplex: "",
      explanation: "",
      notes: "",
      isOptimal: true,
    }
  ]);
  
  // Resources
  const [resources, setResources] = useState<ProblemResource[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    if (solutions.length === 0) {
      toast.error("At least one solution is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/leetcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          difficulty,
          category,
          tags,
          companies,
          hints,
          followUp: followUp.trim(),
          leetcodeUrl: leetcodeUrl.trim(),
          problemNumber,
          frequency: frequency.trim(),
          acceptance,
          isPremium,
          solutions: solutions.filter(sol => sol.code.trim()),
          resources: resources.filter(res => res.title.trim()),
        }),
      });

      if (response.ok) {
        toast.success("Problem created successfully!");
        router.push("/admin/leetcode");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to create problem");
      }
    } catch (error) {
      console.error("Error creating problem:", error);
      toast.error("Failed to create problem");
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addCompany = () => {
    if (companyInput.trim() && !companies.includes(companyInput.trim())) {
      setCompanies([...companies, companyInput.trim()]);
      setCompanyInput("");
    }
  };

  const removeCompany = (companyToRemove: string) => {
    setCompanies(companies.filter(company => company !== companyToRemove));
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
    setSolutions([...solutions, {
      language: "Python",
      code: SOLUTION_TEMPLATES.Python,
      approach: "",
      timeComplex: "",
      spaceComplex: "",
      explanation: "",
      notes: "",
      isOptimal: false,
    }]);
  };

  const updateSolution = (index: number, field: keyof ProblemSolution, value: any) => {
    const newSolutions = [...solutions];
    newSolutions[index] = { ...newSolutions[index], [field]: value };
    
    // Update code template when language changes
    if (field === "language" && SOLUTION_TEMPLATES[value as keyof typeof SOLUTION_TEMPLATES]) {
      newSolutions[index].code = SOLUTION_TEMPLATES[value as keyof typeof SOLUTION_TEMPLATES];
    }
    
    setSolutions(newSolutions);
  };

  const removeSolution = (index: number) => {
    if (solutions.length > 1) {
      setSolutions(solutions.filter((_, i) => i !== index));
    }
  };

  const addResource = () => {
    setResources([...resources, {
      title: "",
      type: "ARTICLE",
      url: "",
      description: "",
    }]);
  };

  const updateResource = (index: number, field: keyof ProblemResource, value: any) => {
    const newResources = [...resources];
    newResources[index] = { ...newResources[index], [field]: value };
    setResources(newResources);
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
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
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create LeetCode Problem</h1>
          <p className="text-gray-600">Add a new coding problem with solutions and resources</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Two Sum"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Description *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the problem statement..."
                  required
                />
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty *
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as "EASY" | "MEDIUM" | "HARD")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DIFFICULTY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Array, Dynamic Programming"
                />
              </div>

              <div>
                <label htmlFor="leetcodeUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  LeetCode URL
                </label>
                <input
                  type="url"
                  id="leetcodeUrl"
                  value={leetcodeUrl}
                  onChange={(e) => setLeetcodeUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://leetcode.com/problems/..."
                />
              </div>

              <div>
                <label htmlFor="problemNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Number
                </label>
                <input
                  type="number"
                  id="problemNumber"
                  value={problemNumber || ""}
                  onChange={(e) => setProblemNumber(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2" />
              Tags
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    aria-label={`Remove ${tag} tag`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Add tag"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Companies */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Companies
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {companies.map((company, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full flex items-center"
                >
                  {company}
                  <button
                    type="button"
                    onClick={() => removeCompany(company)}
                    className="ml-2 text-green-600 hover:text-green-800"
                    aria-label={`Remove ${company} company`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={companyInput}
                onChange={(e) => setCompanyInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCompany())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a company..."
              />
              <button
                type="button"
                onClick={addCompany}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Add company"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Additional Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <input
                  type="text"
                  id="frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., High, Medium, Low"
                />
              </div>

              <div>
                <label htmlFor="acceptance" className="block text-sm font-medium text-gray-700 mb-2">
                  Acceptance Rate (%)
                </label>
                <input
                  type="number"
                  id="acceptance"
                  value={acceptance || ""}
                  onChange={(e) => setAcceptance(e.target.value ? parseFloat(e.target.value) : undefined)}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 45.2"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPremium"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isPremium" className="ml-2 block text-sm text-gray-700">
                  Premium Problem
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="followUp" className="block text-sm font-medium text-gray-700 mb-2">
                Follow-up Questions
              </label>
              <textarea
                id="followUp"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any follow-up questions or variations..."
              />
            </div>
          </div>

          {/* Hints */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Hints
            </h2>
            
            <div className="space-y-2 mb-4">
              {hints.map((hint, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 rounded-md">
                  <span className="text-sm text-yellow-800 font-medium">#{index + 1}</span>
                  <span className="flex-1 text-sm text-yellow-800">{hint}</span>
                  <button
                    type="button"
                    onClick={() => removeHint(index)}
                    className="text-yellow-600 hover:text-yellow-800"
                    aria-label={`Remove hint ${index + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={hintInput}
                onChange={(e) => setHintInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHint())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a hint..."
              />
              <button
                type="button"
                onClick={addHint}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                aria-label="Add hint"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Solutions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Solutions
              </h2>
              <button
                type="button"
                onClick={addSolution}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                aria-label="Add solution"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Solution
              </button>
            </div>
            
            <div className="space-y-6">
              {solutions.map((solution, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Solution {index + 1}</h3>
                    {solutions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSolution(index)}
                        className="text-red-600 hover:text-red-800"
                        aria-label={`Remove solution ${index + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>                      <select
                        value={solution.language}
                        onChange={(e) => updateSolution(index, "language", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Programming language"
                      >
                        {LANGUAGE_OPTIONS.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
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
                        onChange={(e) => updateSolution(index, "approach", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Two Pointers, Dynamic Programming"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Time Complexity
                      </label>
                      <input
                        type="text"
                        value={solution.timeComplex || ""}
                        onChange={(e) => updateSolution(index, "timeComplex", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., O(n), O(log n)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Zap className="w-4 h-4 inline mr-1" />
                        Space Complexity
                      </label>
                      <input
                        type="text"
                        value={solution.spaceComplex || ""}
                        onChange={(e) => updateSolution(index, "spaceComplex", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., O(1), O(n)"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code
                    </label>
                    <textarea
                      value={solution.code}
                      onChange={(e) => updateSolution(index, "code", e.target.value)}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="Write your solution code here..."
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Explanation
                    </label>
                    <textarea
                      value={solution.explanation || ""}
                      onChange={(e) => updateSolution(index, "explanation", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Explain your approach and solution..."
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={solution.notes || ""}
                      onChange={(e) => updateSolution(index, "notes", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Any additional notes or observations..."
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`optimal-${index}`}
                      checked={solution.isOptimal || false}
                      onChange={(e) => updateSolution(index, "isOptimal", e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`optimal-${index}`} className="ml-2 block text-sm text-gray-700">
                      Mark as optimal solution
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Resources
              </h2>
              <button
                type="button"
                onClick={addResource}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
                aria-label="Add resource"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
              </button>
            </div>
            
            <div className="space-y-4">
              {resources.map((resource, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Resource {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeResource(index)}
                      className="text-red-600 hover:text-red-800"
                      aria-label={`Remove resource ${index + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={resource.title}
                        onChange={(e) => updateResource(index, "title", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Resource title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type
                      </label>                      <select
                        value={resource.type}
                        onChange={(e) => updateResource(index, "type", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Resource type"
                      >
                        {RESOURCE_TYPES.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL
                    </label>
                    <input
                      type="url"
                      value={resource.url || ""}
                      onChange={(e) => updateResource(index, "url", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={resource.description || ""}
                      onChange={(e) => updateResource(index, "description", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief description of the resource..."
                    />
                  </div>
                </div>
              ))}
              
              {resources.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No resources added yet. Click "Add Resource" to get started.
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push("/admin/leetcode")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Problem
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}