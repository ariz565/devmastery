"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminLayout from "../../../components/admin/AdminLayout";
import {
  ArrowLeft,
  Save,
  Upload,
  FileText,
  Image,
  Video,
  ExternalLink,
  Code,
  Book,
  File,
  X,
  Check,
} from "lucide-react";

export default function CreateResourcePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadedFile, setUploadedFile] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "coding-question",
    category: "Data Structures",
    difficulty: "medium",
    content: "",
    url: "",
    tags: "",
    isPublic: true,
    isPremium: false,
  });

  const resourceTypes = [
    { value: "coding-question", label: "Coding Question", icon: Code },
    { value: "study-guide", label: "Study Guide", icon: Book },
    { value: "document", label: "Document", icon: FileText },
    { value: "image", label: "Image", icon: Image },
    { value: "video", label: "Video", icon: Video },
    { value: "link", label: "External Link", icon: ExternalLink },
    { value: "excel", label: "Excel Sheet", icon: File },
  ];

  const categories = [
    "Data Structures",
    "Algorithms",
    "System Design",
    "Behavioral",
    "Frontend",
    "Backend",
    "Database",
    "DevOps",
    "Machine Learning",
    "Mobile Development",
    "General Programming",
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/interviews/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedFile(data.file);
        setSuccess("File uploaded successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const payload = {
        ...formData,
        tags: tagsArray,
        fileUrl: uploadedFile?.url,
        fileName: uploadedFile?.fileName,
        fileSize: uploadedFile?.size,
      };

      const response = await fetch("/api/admin/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/admin/interviews");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to create resource");
      }
    } catch (error) {
      console.error("Failed to create resource:", error);
      setError("Failed to create resource. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = resourceTypes.find((t) => t.value === type);
    const IconComponent = typeConfig?.icon || FileText;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/interviews"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Resource
            </h1>
            <p className="text-gray-600 mt-1">
              Add a new interview preparation resource
            </p>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <X className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <Check className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter resource title..."
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the resource and what users will learn..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <div className="relative">
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    title="Select resource type"
                  >
                    {resourceTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {getTypeIcon(formData.type)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  title="Select category"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty *
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({ ...formData, difficulty: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  title="Select difficulty level"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="javascript, algorithm, leetcode (comma-separated)"
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Content
            </h2>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File (Optional)
              </label>

              {!uploadedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <div className="space-y-2">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="text-gray-600">
                      <label className="cursor-pointer text-blue-600 hover:text-blue-500 font-medium">
                        Choose a file
                        <input
                          type="file"
                          className="sr-only"
                          onChange={handleFileUpload}
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.mp4,.webm,.txt"
                        />
                      </label>{" "}
                      or drag and drop
                    </div>
                    <p className="text-sm text-gray-500">
                      PDF, DOC, XLS, PNG, JPG, MP4, TXT up to 50MB
                    </p>
                  </div>
                  {uploading && (
                    <div className="mt-4">
                      <div className="text-blue-600">Uploading...</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <File className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">
                          {uploadedFile.fileName}
                        </p>
                        <p className="text-sm text-green-700">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>{" "}
                    <button
                      type="button"
                      onClick={removeUploadedFile}
                      className="p-1 text-green-600 hover:bg-green-100 rounded"
                      title="Remove uploaded file"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* URL for links */}
            {formData.type === "link" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL *
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                  required={formData.type === "link"}
                />
              </div>
            )}

            {/* Content for coding questions or detailed content */}
            {(formData.type === "coding-question" ||
              formData.type === "study-guide") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.type === "coding-question"
                    ? "Problem Statement & Solution"
                    : "Content"}
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder={
                    formData.type === "coding-question"
                      ? "## Problem\nDescribe the problem here...\n\n## Solution\n```javascript\n// Your solution code here\n```\n\n## Explanation\nExplain your approach..."
                      : "Write your study guide content here..."
                  }
                />
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Settings
            </h2>

            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublic: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-700">
                    Make Public
                  </span>
                  <p className="text-sm text-gray-500">
                    Allow this resource to be visible to users
                  </p>
                </div>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPremium}
                  onChange={(e) =>
                    setFormData({ ...formData, isPremium: e.target.checked })
                  }
                  className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-700">
                    Premium Content
                  </span>
                  <p className="text-sm text-gray-500">
                    Restrict access to premium users only
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <Link
              href="/admin/interviews"
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
            >
              {loading ? (
                "Creating..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Resource
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
