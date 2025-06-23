"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminLayout from "../../../components/admin/AdminLayout";
import {
  ArrowLeft,
  Edit,
  Download,
  Eye,
  ExternalLink,
  FileText,
  Image,
  Video,
  Code,
  Book,
  File,
  Star,
  Calendar,
  User,
  Globe,
  Crown,
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

export default function ViewInterviewResource() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [resource, setResource] = useState<InterviewResource | null>(null);

  const resourceTypes = {
    "coding-question": {
      label: "Coding Question",
      icon: Code,
      color: "bg-purple-100 text-purple-800",
    },
    "study-guide": {
      label: "Study Guide",
      icon: Book,
      color: "bg-blue-100 text-blue-800",
    },
    link: {
      label: "External Link",
      icon: ExternalLink,
      color: "bg-green-100 text-green-800",
    },
    document: {
      label: "Document",
      icon: FileText,
      color: "bg-orange-100 text-orange-800",
    },
    video: { label: "Video", icon: Video, color: "bg-red-100 text-red-800" },
    excel: {
      label: "Excel Sheet",
      icon: File,
      color: "bg-emerald-100 text-emerald-800",
    },
    image: { label: "Image", icon: Image, color: "bg-pink-100 text-pink-800" },
  };

  const difficultyLevels = {
    easy: { label: "Easy", color: "bg-green-100 text-green-800" },
    medium: { label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    hard: { label: "Hard", color: "bg-red-100 text-red-800" },
  };

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const typeInfo = resourceTypes[resource.type];
  const difficultyInfo = difficultyLevels[resource.difficulty];
  const TypeIcon = typeInfo.icon;

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
              Interview Resource Details
            </h1>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/admin/interviews/edit/${resource.id}`}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Type */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {resource.title}
                  </h2>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}
                    >
                      <TypeIcon className="h-3 w-3 mr-1" />
                      {typeInfo.label}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyInfo.color}`}
                    >
                      <Target className="h-3 w-3 mr-1" />
                      {difficultyInfo.label}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {resource.category}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {resource.isPremium && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </span>
                  )}
                  {resource.isPublic ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Globe className="h-3 w-3 mr-1" />
                      Public
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Private
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-700 text-lg">{resource.description}</p>{" "}
              {/* Content */}
              {resource.content && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Content
                  </h3>
                  <div className="prose prose-sm max-w-none bg-gray-900 rounded-lg p-6 border">
                    <div
                      className="whitespace-pre-wrap text-sm font-mono leading-relaxed"
                      style={{
                        color: "#f8f9fa",
                        backgroundColor: "#1a1a1a",
                        padding: "1.5rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #374151",
                        fontSize: "14px",
                        lineHeight: "1.6",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: resource.content
                          .replace(
                            /\*\*(.*?)\*\*/g,
                            '<strong style="color: #fbbf24; font-weight: 600;">$1</strong>'
                          )
                          .replace(
                            /\*(.*?)\*/g,
                            '<em style="color: #a78bfa; font-style: italic;">$1</em>'
                          )
                          .replace(
                            /`([^`]+)`/g,
                            '<code style="background: #374151; color: #10b981; padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>'
                          )
                          .replace(
                            /^# (.*$)/gm,
                            '<h1 style="color: #60a5fa; font-size: 1.5rem; font-weight: bold; margin: 1rem 0;">$1</h1>'
                          )
                          .replace(
                            /^## (.*$)/gm,
                            '<h2 style="color: #34d399; font-size: 1.25rem; font-weight: bold; margin: 0.75rem 0;">$1</h2>'
                          )
                          .replace(
                            /^### (.*$)/gm,
                            '<h3 style="color: #fbbf24; font-size: 1.125rem; font-weight: bold; margin: 0.5rem 0;">$1</h3>'
                          )
                          .replace(
                            /```(\w+)?\n([\s\S]*?)```/g,
                            '<div style="background: #111827; border: 1px solid #374151; border-radius: 6px; padding: 1rem; margin: 1rem 0; overflow-x: auto;"><pre style="color: #e5e7eb; font-family: monospace; font-size: 13px; line-height: 1.5; margin: 0;">$2</pre></div>'
                          )
                          .replace(
                            /\[([^\]]+)\]\(([^)]+)\)/g,
                            '<a href="$2" style="color: #60a5fa; text-decoration: underline;" target="_blank" rel="noopener noreferrer">$1</a>'
                          )
                          .replace(
                            /^- (.*$)/gm,
                            '<li style="color: #d1d5db; margin: 0.25rem 0; list-style-type: disc; margin-left: 1rem;">$1</li>'
                          )
                          .replace(
                            /^\d+\. (.*$)/gm,
                            '<li style="color: #d1d5db; margin: 0.25rem 0; list-style-type: decimal; margin-left: 1rem;">$1</li>'
                          ),
                      }}
                    />
                  </div>
                </div>
              )}
              {/* Tags */}
              {resource.tags.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* File/URL Info */}
            {(resource.fileUrl || resource.url) && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Resource Access
                </h3>

                {resource.type === "link" && resource.url ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <ExternalLink className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium text-green-900">
                          External Link
                        </p>
                        <p className="text-sm text-green-700 truncate max-w-md">
                          {resource.url}
                        </p>
                      </div>
                    </div>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit
                    </a>
                  </div>
                ) : resource.fileUrl ? (
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium text-blue-900">
                          {resource.fileName}
                        </p>
                        {resource.fileSize && (
                          <p className="text-sm text-blue-700">
                            {formatFileSize(resource.fileSize)}
                          </p>
                        )}
                      </div>
                    </div>
                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">Views</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {resource.views.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Download className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">Downloads</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {resource.downloads.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">Rating</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900 mr-1">
                      {resource.rating.toFixed(1)}
                    </span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= resource.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Metadata
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Created
                  </div>
                  <p className="text-gray-900 ml-6">
                    {formatDate(resource.createdAt)}
                  </p>
                </div>

                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Last Updated
                  </div>
                  <p className="text-gray-900 ml-6">
                    {formatDate(resource.updatedAt)}
                  </p>
                </div>

                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <User className="h-4 w-4 mr-2" />
                    Resource ID
                  </div>
                  <p className="text-gray-900 ml-6 font-mono text-xs">
                    {resource.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  href={`/admin/interviews/edit/${resource.id}`}
                  className="flex items-center w-full px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Resource
                </Link>

                {(resource.fileUrl || resource.url) && (
                  <a
                    href={resource.fileUrl || resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center w-full px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100"
                  >
                    {resource.type === "link" ? (
                      <ExternalLink className="h-4 w-4 mr-2" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    {resource.type === "link" ? "Visit Link" : "Download File"}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
