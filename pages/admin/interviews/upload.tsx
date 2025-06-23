"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import AdminLayout from "../../../components/admin/AdminLayout";
import {
  ArrowLeft,
  Upload,
  FileText,
  Image,
  Video,
  ExternalLink,
  Code,
  Book,
  File,
  Youtube,
  Eye,
  X,
  Check,
  AlertCircle,
} from "lucide-react";

interface UploadedFile {
  url: string;
  fileName: string;
  size: number;
  type: string;
  mimetype: string;
  extractedContent?: string;
}

interface YouTubeVideo {
  id: string;
  url: string;
  embedUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
}

export default function AdminUploadResource() {
  const router = useRouter();
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    type: "study-guide" as
      | "coding-question"
      | "study-guide"
      | "link"
      | "document"
      | "video"
      | "excel"
      | "image",
    category: "",
    difficulty: "medium" as "easy" | "medium" | "hard",
    tags: [] as string[],
    url: "",
    youtubeUrl: "",
    isPremium: false,
    isPublic: true,
  });

  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [youtubeVideo, setYoutubeVideo] = useState<YouTubeVideo | null>(null);
  const [previewMode, setPreviewMode] = useState<
    "content" | "file" | "youtube" | null
  >(null);
  const [errors, setErrors] = useState<string[]>([]);

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
    setErrors([]);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/admin/interviews/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedFile(data.file);

        // If PDF content was extracted, populate the content field
        if (data.file.extractedContent) {
          setFormData((prev) => ({
            ...prev,
            content: data.file.extractedContent,
            title: prev.title || data.file.fileName.replace(/\.[^/.]+$/, ""),
          }));
        }
      } else {
        const error = await response.json();
        setErrors([error.message || "Upload failed"]);
      }
    } catch (error) {
      setErrors(["Upload failed. Please try again."]);
    } finally {
      setUploading(false);
    }
  };

  const handleYouTubeProcess = async () => {
    if (!formData.youtubeUrl.trim()) return;

    setProcessing(true);
    setErrors([]);

    try {
      const response = await fetch("/api/admin/interviews/process-youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: formData.youtubeUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        setYoutubeVideo(data.video);
        setFormData((prev) => ({
          ...prev,
          title: prev.title || data.video.title,
          type: "video",
          url: data.video.url,
        }));
      } else {
        const error = await response.json();
        setErrors([error.message || "Failed to process YouTube URL"]);
      }
    } catch (error) {
      setErrors([
        "Failed to process YouTube URL. Please check the URL and try again.",
      ]);
    } finally {
      setProcessing(false);
    }
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
    setErrors([]);

    try {
      const submitData = {
        ...formData,
        fileUrl: uploadedFile?.url,
        fileName: uploadedFile?.fileName,
        fileSize: uploadedFile?.size,
        youtubeVideoId: youtubeVideo?.id,
        youtubeEmbedUrl: youtubeVideo?.embedUrl,
        youtubeThumbnail: youtubeVideo?.thumbnailUrl,
      };

      const response = await fetch("/api/admin/interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const data = await response.json();
        router.push("/admin/interviews");
      } else {
        const error = await response.json();
        setErrors([error.message || "Failed to create resource"]);
      }
    } catch (error) {
      setErrors(["Failed to create resource. Please try again."]);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create New Interview Resource
            </h1>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Upload and manage interview preparation resources. Create
          comprehensive materials to help candidates succeed.
        </p>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Please fix the following errors:
                </h3>
                <ul className="mt-2 text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Resource Details */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Resource Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter a descriptive title for your resource"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Type *
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as typeof formData.type,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Category *
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Difficulty *
                </label>
                <select
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      difficulty: e.target.value as typeof formData.difficulty,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {difficultyLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Provide a clear description of what this resource covers"
                  required
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Content
              </h2>
              {formData.content && (
                <button
                  type="button"
                  onClick={() =>
                    setPreviewMode(previewMode === "content" ? null : "content")
                  }
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {previewMode === "content" ? "Hide Preview" : "Preview"}
                </button>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Detailed Content (Optional)
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Write the main content of your resource here. Use Markdown
                formatting for rich text.
              </p>
              <textarea
                id="content"
                rows={15}
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm dark:bg-gray-700 dark:text-white"
                placeholder="# Interview Questions for System Design

## Core Concepts

**Question 1: Design a URL Shortener like bit.ly**

Key considerations:
- Scale: Handle millions of URLs
- Database design
- Caching strategy
- Load balancing

## Solution Architecture

```
[Client] -> [Load Balancer] -> [App Servers] -> [Database]
                            -> [Cache Layer]
```

## Code Examples

```javascript
// URL encoding function
function encodeURL(longURL) {
    const base62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    // Implementation here...
}
```"
              />
            </div>

            {previewMode === "content" && formData.content && (
              <div className="mt-4 p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Preview:
                </h3>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: formData.content
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\*(.*?)\*/g, "<em>$1</em>")
                        .replace(
                          /`([^`]+)`/g,
                          '<code class="bg-gray-200 dark:bg-gray-600 px-1 rounded">$1</code>'
                        )
                        .replace(
                          /^# (.*$)/gm,
                          '<h1 class="text-xl font-bold">$1</h1>'
                        )
                        .replace(
                          /^## (.*$)/gm,
                          '<h2 class="text-lg font-bold">$1</h2>'
                        )
                        .replace(
                          /^### (.*$)/gm,
                          '<h3 class="text-md font-bold">$1</h3>'
                        )
                        .replace(
                          /```(\w+)?\n([\s\S]*?)```/g,
                          '<pre class="bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto"><code>$2</code></pre>'
                        ),
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Additional Resources Section */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Additional Resources (Optional)
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* File Upload */}
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900 dark:text-white">
                  Upload File (Optional)
                </h3>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.xlsx,.xls,.csv,.doc,.docx,.txt"
                    aria-label="Upload file"
                  />

                  {uploadedFile ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {uploadedFile.fileName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {uploading ? "Uploading..." : "Click to upload"}
                        </button>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          or drag and drop
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PDF, Images, Videos up to 50MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* YouTube Video */}
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900 dark:text-white flex items-center">
                  <Youtube className="h-5 w-5 mr-2 text-red-600" />
                  YouTube URL (Optional)
                </h3>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={formData.youtubeUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, youtubeUrl: e.target.value })
                      }
                      placeholder="https://youtube.com/watch?v=..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleYouTubeProcess}
                      disabled={processing || !formData.youtubeUrl.trim()}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
                    >
                      {processing ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      ) : (
                        <Youtube className="h-4 w-4 mr-2" />
                      )}
                      {processing ? "Processing..." : "Add Video"}
                    </button>
                  </div>

                  {youtubeVideo && (
                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-start space-x-3">
                        <img
                          src={youtubeVideo.thumbnailUrl}
                          alt={youtubeVideo.title}
                          className="w-24 h-18 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {youtubeVideo.title}
                          </p>
                          <div className="flex items-center mt-2">
                            <Youtube className="h-3 w-3 text-red-600 mr-1" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Video added successfully
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setYoutubeVideo(null);
                            setFormData((prev) => ({
                              ...prev,
                              youtubeUrl: "",
                              url: "",
                            }));
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tags and Settings */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Tags and Settings
            </h2>

            <div className="space-y-6">
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags (Optional)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tag}{" "}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                        title={`Remove ${tag} tag`}
                        aria-label={`Remove ${tag} tag`}
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
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., system-design, algorithms, backend"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* External URL (for links) */}
              {formData.type === "link" && !youtubeVideo && (
                <div>
                  <label
                    htmlFor="external-url"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    External URL *
                  </label>
                  <input
                    type="url"
                    id="external-url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com"
                    required
                  />
                </div>
              )}

              {/* Settings */}
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900 dark:text-white">
                  Visibility Settings
                </h3>
                <div className="space-y-3">
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
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="font-medium">Make publicly visible</span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">
                        Allow anyone to view and access this resource
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPremium"
                      checked={formData.isPremium}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isPremium: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isPremium"
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="font-medium">Premium content</span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">
                        Require subscription to access this resource
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading || processing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
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
