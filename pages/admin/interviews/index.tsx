"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "../../../components/admin/AdminLayout";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Download,
  Star,
  Upload,
  FileText,
  Image,
  Video,
  ExternalLink,
  Code,
  Book,
  Target,
  Globe,
  File,
} from "lucide-react";

interface InterviewResource {
  id: string;
  title: string;
  description: string;
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
  author: {
    name: string;
    email: string;
  };
}

interface Stats {
  totalResources: number;
  codingQuestions: number;
  studyGuides: number;
  totalViews: number;
  totalDownloads: number;
  avgRating: number;
}

export default function InterviewsPage() {
  const [resources, setResources] = useState<InterviewResource[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalResources: 0,
    codingQuestions: 0,
    studyGuides: 0,
    totalViews: 0,
    totalDownloads: 0,
    avgRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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

  const resourceTypes = [
    { value: "coding-question", label: "Coding Questions", icon: Code },
    { value: "study-guide", label: "Study Guides", icon: Book },
    { value: "link", label: "External Links", icon: ExternalLink },
    { value: "document", label: "Documents", icon: FileText },
    { value: "video", label: "Videos", icon: Video },
    { value: "excel", label: "Excel Sheets", icon: File },
    { value: "image", label: "Images", icon: Image },
  ];

  useEffect(() => {
    fetchResources();
    fetchStats();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/admin/interviews");
      const data = await response.json();
      setResources(data.resources || []);
    } catch (error) {
      console.error("Failed to fetch interview resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/interviews/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const deleteResource = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      await fetch(`/api/admin/interviews/${id}`, { method: "DELETE" });
      setResources(resources.filter((resource) => resource.id !== id));
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error("Failed to delete resource:", error);
    }
  };

  const filteredResources = resources
    .filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesType = filterType === "all" || resource.type === filterType;
      const matchesCategory =
        filterCategory === "all" || resource.category === filterCategory;
      const matchesDifficulty =
        filterDifficulty === "all" || resource.difficulty === filterDifficulty;

      return (
        matchesSearch && matchesType && matchesCategory && matchesDifficulty
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "mostViewed":
          return b.views - a.views;
        case "mostDownloaded":
          return b.downloads - a.downloads;
        case "highestRated":
          return b.rating - a.rating;
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const getTypeIcon = (type: string) => {
    const typeConfig = resourceTypes.find((t) => t.value === type);
    return typeConfig ? typeConfig.icon : FileText;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Interview Preparation Hub
            </h1>
            <p className="text-gray-600 mt-1">
              Manage coding questions, study resources, and preparation
              materials
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/interviews/upload"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Resource
            </Link>
            <Link
              href="/admin/interviews/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Resource
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Resources
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalResources}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Code className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Coding Questions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.codingQuestions}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Book className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Study Guides
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.studyGuides}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalViews}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Download className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Downloads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalDownloads}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avgRating.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              title="Filter by resource type"
            >
              <option value="all">All Types</option>
              {resourceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              title="Filter by category"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              title="Filter by difficulty"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              title="Sort resources"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="mostViewed">Most Viewed</option>
              <option value="mostDownloaded">Most Downloaded</option>
              <option value="highestRated">Highest Rated</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No interview resources found
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first interview preparation resource.
            </p>
            <Link
              href="/admin/interviews/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add your first resource
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const TypeIcon = getTypeIcon(resource.type);
              return (
                <div
                  key={resource.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <TypeIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(
                            resource.difficulty
                          )}`}
                        >
                          {resource.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {resource.isPremium && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            Premium
                          </span>
                        )}
                        {resource.isPublic && (
                          <span title="Public">
                            <Globe className="w-4 h-4 text-green-600" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {resource.description}
                    </p>

                    {/* Category and Tags */}
                    <div className="mb-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mb-2">
                        {resource.category}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {resource.tags.length > 3 && (
                          <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            +{resource.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {resource.views}
                        </div>
                        <div className="flex items-center">
                          <Download className="w-4 h-4 mr-1" />
                          {resource.downloads}
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          {resource.rating.toFixed(1)}
                        </div>
                      </div>
                      <span className="text-xs">
                        {new Date(resource.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* File Info */}
                    {resource.fileName && (
                      <div className="mb-4 p-2 bg-gray-50 rounded text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {resource.fileName}
                          </span>
                          {resource.fileSize && (
                            <span className="text-gray-500">
                              {(resource.fileSize / 1024 / 1024).toFixed(2)} MB
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/admin/interviews/${resource.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="View resource"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/interviews/edit/${resource.id}`}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"
                        title="Edit resource"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => deleteResource(resource.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Delete resource"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
