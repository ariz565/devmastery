"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminLayout from "../../../../components/admin/AdminLayout";
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
  Globe,
  Target,
} from "lucide-react";

interface InterviewResource {
  id: string;
  title: string;
  description: string;
  content?: string;
  type:
    | "coding-question"
    | "study-guide"
    | "link"
    | "document"
    | "video"
    | "excel"
    | "image";
  category: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  url?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  views: number;
  downloads: number;
  rating: number;
  isPremium: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EditInterviewResource() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resource, setResource] = useState<InterviewResource | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    type: "study-guide" as InterviewResource["type"],
    category: "",
    difficulty: "medium" as InterviewResource["difficulty"],
    tags: [] as string[],
    url: "",
    isPremium: false,
    isPublic: true,
  });
  const [tagInput, setTagInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const resourceTypes = [
    { value: "coding-question", label: "Coding Questions", icon: Code },
    { value: "study-guide", label: "Study Guides", icon: Book },
    { value: "link", label: "External Links", icon: ExternalLink },
    { value: "document", label: "Documents", icon: FileText },
    { value: "video", label: "Videos", icon: Video },
    { value: "excel", label: "Excel Sheets", icon: File },
    { value: "image", label: "Images", icon: Image },
  ];

  const difficultyLevels = [
    { value: "easy", label: "Easy", color: "text-green-600" },
    { value: "medium", label: "Medium", color: "text-yellow-600" },
    { value: "hard", label: "Hard", color: "text-red-600" },
  ];

  const categories = [
    "AWS",
    "Backend Development",
    "System Design",
    "Database",
    "API Design",
    "Security",
    "DevOps",
    "Microservices",
    "Cloud Architecture",
    "Performance",
    "Testing",
    "General",
  ];

  useEffect(() => {
    if (id) {
      fetchResource();
    }
  }, [id]);

  const fetchResource = async () => {
    try {
      const response = await fetch(`/api/admin/interviews/${id}`);
      if (response.ok) {
        const data = await response.json();
        setResource(data);
        setFormData({
          title: data.title,
          description: data.description,
          content: data.content || "",
          type: data.type,
          category: data.category,
          difficulty: data.difficulty,
          tags: data.tags,
          url: data.url || "",
          isPremium: data.isPremium,
          isPublic: data.isPublic,
        });
      } else {
        console.error("Failed to fetch resource");
        router.push("/admin/interviews");
      }
    } catch (error) {
      console.error("Error fetching resource:", error);
      router.push("/admin/interviews");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/interviews/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("File upload failed");
    }

    const data = await response.json();
    return data.fileUrl;
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let fileUrl = resource?.fileUrl;
      let fileName = resource?.fileName;
      let fileSize = resource?.fileSize;

      // Upload new file if selected
      if (selectedFile) {
        setUploading(true);
        fileUrl = await uploadFile(selectedFile);
        fileName = selectedFile.name;
        fileSize = selectedFile.size;
        setUploading(false);
      }

      const updateData = {
        ...formData,
        fileUrl,
        fileName,
        fileSize,
      };

      const response = await fetch(`/api/admin/interviews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        router.push("/admin/interviews");
      } else {
        const error = await response.json();
        console.error("Failed to update resource:", error);
        alert("Failed to update resource. Please try again.");
      }
    } catch (error) {
      console.error("Error updating resource:", error);
      alert("An error occurred while updating the resource.");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!resource) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Resource Not Found
          </h1>
          <Link
            href="/admin/interviews"
            className="text-blue-600 hover:underline"
          >
            Back to Interview Resources
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/interviews"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Interview Resource
            </h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Resource Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Type
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as InterviewResource["type"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {resourceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label
                  htmlFor="difficulty"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      difficulty: e.target
                        .value as InterviewResource["difficulty"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {difficultyLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* External URL (for links) */}
              {formData.type === "link" && (
                <div>
                  <label
                    htmlFor="url"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    URL
                  </label>
                  <input
                    type="url"
                    id="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com"
                  />
                </div>
              )}

              {/* File Upload */}
              {formData.type !== "link" && (
                <div>
                  <label
                    htmlFor="file"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    File{" "}
                    {resource.fileName &&
                      "(optional - leave empty to keep current file)"}
                  </label>
                  {resource.fileName && (
                    <p className="text-sm text-gray-600 mb-2">
                      Current file: {resource.fileName}
                    </p>
                  )}
                  <input
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    accept={
                      formData.type === "image"
                        ? "image/*"
                        : formData.type === "video"
                        ? "video/*"
                        : formData.type === "excel"
                        ? ".xlsx,.xls,.csv"
                        : "*"
                    }
                  />
                </div>
              )}

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Content - Rich Text Editor */}
              <div className="md:col-span-2">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Content (Detailed Information)
                </label>
                <div className="mb-2">
                  <textarea
                    id="content"
                    rows={12}
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="Enter the detailed content here. You can use Markdown formatting:&#10;&#10;# Headers&#10;## Subheaders&#10;&#10;**Bold text**&#10;*Italic text*&#10;&#10;```javascript&#10;// Code blocks&#10;console.log('Hello World');&#10;```&#10;&#10;- Lists&#10;- Items&#10;&#10;[Links](http://example.com)"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  <strong>Tip:</strong> Use Markdown formatting for rich
                  content. Your content will be displayed with proper formatting
                  on the public page.
                </div>
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Settings */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPremium"
                    checked={formData.isPremium}
                    onChange={(e) =>
                      setFormData({ ...formData, isPremium: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isPremium"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Premium Content (requires subscription)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) =>
                      setFormData({ ...formData, isPublic: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isPublic"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Publicly visible
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/interviews"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : saving ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Resource
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
