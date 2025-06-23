import { useState, useEffect } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import {
  Plus,
  Edit,
  Trash2,
  FolderOpen,
  MoreVertical,
  X,
  AlertTriangle,
  BookOpen,
  List,
  Eye,
  FileText,
  Code,
  Brain,
  Clock,
  Star,
  CheckCircle,
} from "lucide-react";

interface Topic {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  _count: {
    blogs: number;
    notes: number;
    leetcodeProblems: number;
  };
  subTopics: SubTopic[];
}

interface SubTopic {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  _count: {
    blogs: number;
    notes: number;
    leetcodeProblems: number;
  };
}

interface TableOfContentsItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  level: number; // 1 = main topic, 2 = subtopic, 3 = sub-subtopic
  parentId?: string;
  contentType: "blog" | "note" | "leetcode" | "section";
  estimatedReadTime?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  isPublished: boolean;
}

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [showCreateSubTopic, setShowCreateSubTopic] = useState(false);
  const [showEditTopic, setShowEditTopic] = useState(false);
  const [showEditSubTopic, setShowEditSubTopic] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "topic" | "subtopic";
    id: string;
    name: string;
  } | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [editingTopicId, setEditingTopicId] = useState("");
  const [editingSubTopicId, setEditingSubTopicId] = useState("");
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");

  // New states for table of contents
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [selectedTopicForTOC, setSelectedTopicForTOC] = useState<Topic | null>(
    null
  );
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>(
    []
  );
  const [showCreateTOCItem, setShowCreateTOCItem] = useState(false);
  const [tocForm, setTocForm] = useState({
    title: "",
    slug: "",
    description: "",
    order: 0,
    level: 1,
    parentId: "",
    contentType: "section" as "blog" | "note" | "leetcode" | "section",
    estimatedReadTime: 5,
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
    isPublished: false,
  });

  const [topicForm, setTopicForm] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    order: 0,
  });

  const [subTopicForm, setSubTopicForm] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    order: 0,
    topicId: "",
  });

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await fetch("/api/admin/topics");
      const data = await response.json();
      setTopics(data);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("/api/admin/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(topicForm),
      });

      if (response.ok) {
        fetchTopics();
        setShowCreateTopic(false);
        setTopicForm({
          name: "",
          slug: "",
          description: "",
          icon: "",
          order: 0,
        });
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create topic");
      }
    } catch (error) {
      console.error("Failed to create topic:", error);
      setError("Failed to create topic");
    }
  };

  const handleEditTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("/api/admin/topics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...topicForm, id: editingTopicId }),
      });

      if (response.ok) {
        fetchTopics();
        setShowEditTopic(false);
        setEditingTopicId("");
        setTopicForm({
          name: "",
          slug: "",
          description: "",
          icon: "",
          order: 0,
        });
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update topic");
      }
    } catch (error) {
      console.error("Failed to update topic:", error);
      setError("Failed to update topic");
    }
  };

  const handleDeleteTopic = async () => {
    if (!deleteTarget || deleteTarget.type !== "topic") return;

    setError("");
    try {
      const response = await fetch("/api/admin/topics", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget.id }),
      });

      if (response.ok) {
        fetchTopics();
        setShowDeleteConfirm(false);
        setDeleteTarget(null);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete topic");
      }
    } catch (error) {
      console.error("Failed to delete topic:", error);
      setError("Failed to delete topic");
    }
  };
  const handleCreateSubTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("/api/admin/subtopics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subTopicForm),
      });

      if (response.ok) {
        fetchTopics();
        setShowCreateSubTopic(false);
        setSubTopicForm({
          name: "",
          slug: "",
          description: "",
          icon: "",
          order: 0,
          topicId: "",
        });
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create subtopic");
      }
    } catch (error) {
      console.error("Failed to create subtopic:", error);
      setError("Failed to create subtopic");
    }
  };

  const handleEditSubTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("/api/admin/subtopics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...subTopicForm, id: editingSubTopicId }),
      });

      if (response.ok) {
        fetchTopics();
        setShowEditSubTopic(false);
        setEditingSubTopicId("");
        setSubTopicForm({
          name: "",
          slug: "",
          description: "",
          icon: "",
          order: 0,
          topicId: "",
        });
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update subtopic");
      }
    } catch (error) {
      console.error("Failed to update subtopic:", error);
      setError("Failed to update subtopic");
    }
  };

  const handleDeleteSubTopic = async () => {
    if (!deleteTarget || deleteTarget.type !== "subtopic") return;

    setError("");
    try {
      const response = await fetch("/api/admin/subtopics", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget.id }),
      });

      if (response.ok) {
        fetchTopics();
        setShowDeleteConfirm(false);
        setDeleteTarget(null);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete subtopic");
      }
    } catch (error) {
      console.error("Failed to delete subtopic:", error);
      setError("Failed to delete subtopic");
    }
  };

  // New functions for table of contents
  const fetchTableOfContents = async (topicId: string) => {
    try {
      const response = await fetch(
        `/api/admin/topics/${topicId}/table-of-contents`
      );
      const data = await response.json();
      setTableOfContents(data);
    } catch (error) {
      console.error("Failed to fetch table of contents:", error);
    }
  };

  const handleCreateTOCItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopicForTOC) return;

    try {
      const response = await fetch(
        `/api/admin/topics/${selectedTopicForTOC.id}/table-of-contents`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tocForm),
        }
      );

      if (response.ok) {
        fetchTableOfContents(selectedTopicForTOC.id);
        setShowCreateTOCItem(false);
        resetTOCForm();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create table of contents item");
      }
    } catch (error) {
      console.error("Failed to create TOC item:", error);
      setError("Failed to create table of contents item");
    }
  };

  const resetTOCForm = () => {
    setTocForm({
      title: "",
      slug: "",
      description: "",
      order: 0,
      level: 1,
      parentId: "",
      contentType: "section",
      estimatedReadTime: 5,
      difficulty: "beginner",
      isPublished: false,
    });
  };

  const openTableOfContents = (topic: Topic) => {
    setSelectedTopicForTOC(topic);
    setShowTableOfContents(true);
    fetchTableOfContents(topic.id);
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "blog":
        return <FileText className="w-4 h-4" />;
      case "note":
        return <BookOpen className="w-4 h-4" />;
      case "leetcode":
        return <Code className="w-4 h-4" />;
      default:
        return <List className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleTopic = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const openEditTopic = (topic: Topic) => {
    setTopicForm({
      name: topic.name,
      slug: topic.slug,
      description: topic.description,
      icon: topic.icon,
      order: topic.order,
    });
    setEditingTopicId(topic.id);
    setShowEditTopic(true);
  };

  const openEditSubTopic = (subTopic: SubTopic, topicId: string) => {
    setSubTopicForm({
      name: subTopic.name,
      slug: subTopic.slug,
      description: subTopic.description,
      icon: subTopic.icon,
      order: subTopic.order,
      topicId: topicId,
    });
    setEditingSubTopicId(subTopic.id);
    setShowEditSubTopic(true);
  };

  const openDeleteConfirm = (
    type: "topic" | "subtopic",
    id: string,
    name: string
  ) => {
    setDeleteTarget({ type, id, name });
    setShowDeleteConfirm(true);
  };

  const resetForms = () => {
    setTopicForm({
      name: "",
      slug: "",
      description: "",
      icon: "",
      order: 0,
    });
    setSubTopicForm({
      name: "",
      slug: "",
      description: "",
      icon: "",
      order: 0,
      topicId: "",
    });
    setError("");
  };
  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded mb-4"></div>
          ))}
        </div>
      </AdminLayout>
    );
  }
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>{" "}
              <button
                onClick={() => setError("")}
                className="ml-auto text-red-600 hover:text-red-800"
                title="Close error message"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Topics & Categories
            </h1>
            <p className="text-gray-600">
              Organize your content into topics and subtopics
            </p>
          </div>
          <button
            onClick={() => setShowCreateTopic(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Topic
          </button>
        </div>

        {/* Topics List */}
        <div className="space-y-4">
          {topics.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No topics yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first topic to organize your content
              </p>
              <button
                onClick={() => setShowCreateTopic(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Topic
              </button>
            </div>
          ) : (
            topics.map((topic) => (
              <div
                key={topic.id}
                className="bg-white rounded-lg border border-gray-200"
              >
                {/* Topic Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {" "}
                      <button
                        onClick={() => toggleTopic(topic.id)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Toggle topic visibility"
                      >
                        <FolderOpen className="w-5 h-5" />
                      </button>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {topic.name}
                        </h3>
                        <p className="text-sm text-gray-600">/{topic.slug}</p>
                        {topic.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {topic.description}
                          </p>
                        )}
                      </div>
                    </div>{" "}
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">
                        {topic._count.blogs +
                          topic._count.notes +
                          topic._count.leetcodeProblems}{" "}
                        items
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditTopic(topic)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit topic"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            openDeleteConfirm("topic", topic.id, topic.name)
                          }
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete topic"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTopicId(topic.id);
                            setSubTopicForm((prev) => ({
                              ...prev,
                              topicId: topic.id,
                            }));
                            setShowCreateSubTopic(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Add Subtopic
                        </button>
                        <button
                          onClick={() => openTableOfContents(topic)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Manage Table of Contents"
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtopics */}
                {expandedTopics.has(topic.id) && topic.subTopics.length > 0 && (
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {" "}
                      {topic.subTopics.map((subTopic) => (
                        <div
                          key={subTopic.id}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {subTopic.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                /{subTopic.slug}
                              </p>
                              <div className="text-xs text-gray-500 mt-2">
                                {subTopic._count.blogs +
                                  subTopic._count.notes +
                                  subTopic._count.leetcodeProblems}{" "}
                                items
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 ml-2">
                              <button
                                onClick={() =>
                                  openEditSubTopic(subTopic, topic.id)
                                }
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Edit subtopic"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() =>
                                  openDeleteConfirm(
                                    "subtopic",
                                    subTopic.id,
                                    subTopic.name
                                  )
                                }
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete subtopic"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Create Topic Modal */}
        {showCreateTopic && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Create New Topic</h2>
              <form onSubmit={handleCreateTopic} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={topicForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setTopicForm((prev) => ({
                        ...prev,
                        name,
                        slug: generateSlug(name),
                      }));
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={topicForm.slug}
                    onChange={(e) =>
                      setTopicForm((prev) => ({
                        ...prev,
                        slug: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={topicForm.description}
                    onChange={(e) =>
                      setTopicForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon (emoji or class name)
                  </label>
                  <input
                    type="text"
                    value={topicForm.icon}
                    onChange={(e) =>
                      setTopicForm((prev) => ({
                        ...prev,
                        icon: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="🚀 or icon-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    value={topicForm.order}
                    onChange={(e) =>
                      setTopicForm((prev) => ({
                        ...prev,
                        order: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>{" "}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateTopic(false);
                      resetForms();
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Topic
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create SubTopic Modal */}
        {showCreateSubTopic && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Create New Subtopic</h2>
              <form onSubmit={handleCreateSubTopic} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={subTopicForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setSubTopicForm((prev) => ({
                        ...prev,
                        name,
                        slug: generateSlug(name),
                      }));
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={subTopicForm.slug}
                    onChange={(e) =>
                      setSubTopicForm((prev) => ({
                        ...prev,
                        slug: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={subTopicForm.description}
                    onChange={(e) =>
                      setSubTopicForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon
                  </label>
                  <input
                    type="text"
                    value={subTopicForm.icon}
                    onChange={(e) =>
                      setSubTopicForm((prev) => ({
                        ...prev,
                        icon: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="📱 or icon-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    value={subTopicForm.order}
                    onChange={(e) =>
                      setSubTopicForm((prev) => ({
                        ...prev,
                        order: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>{" "}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateSubTopic(false);
                      resetForms();
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Subtopic
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Topic Modal */}
        {showEditTopic && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Topic</h2>
              <form onSubmit={handleEditTopic} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={topicForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setTopicForm((prev) => ({
                        ...prev,
                        name,
                        slug: generateSlug(name),
                      }));
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={topicForm.slug}
                    onChange={(e) =>
                      setTopicForm((prev) => ({
                        ...prev,
                        slug: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={topicForm.description}
                    onChange={(e) =>
                      setTopicForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon (emoji or class name)
                  </label>
                  <input
                    type="text"
                    value={topicForm.icon}
                    onChange={(e) =>
                      setTopicForm((prev) => ({
                        ...prev,
                        icon: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="🚀 or icon-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    value={topicForm.order}
                    onChange={(e) =>
                      setTopicForm((prev) => ({
                        ...prev,
                        order: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditTopic(false);
                      resetForms();
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Update Topic
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit SubTopic Modal */}
        {showEditSubTopic && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Subtopic</h2>
              <form onSubmit={handleEditSubTopic} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={subTopicForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setSubTopicForm((prev) => ({
                        ...prev,
                        name,
                        slug: generateSlug(name),
                      }));
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={subTopicForm.slug}
                    onChange={(e) =>
                      setSubTopicForm((prev) => ({
                        ...prev,
                        slug: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={subTopicForm.description}
                    onChange={(e) =>
                      setSubTopicForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon
                  </label>
                  <input
                    type="text"
                    value={subTopicForm.icon}
                    onChange={(e) =>
                      setSubTopicForm((prev) => ({
                        ...prev,
                        icon: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="📱 or icon-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    value={subTopicForm.order}
                    onChange={(e) =>
                      setSubTopicForm((prev) => ({
                        ...prev,
                        order: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditSubTopic(false);
                      resetForms();
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Update Subtopic
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && deleteTarget && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">
                  Delete {deleteTarget.type === "topic" ? "Topic" : "Subtopic"}
                </h2>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{deleteTarget.name}"? This
                action cannot be undone.
                {deleteTarget.type === "topic" &&
                  " All subtopics will also be deleted."}
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteTarget(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={
                    deleteTarget.type === "topic"
                      ? handleDeleteTopic
                      : handleDeleteSubTopic
                  }
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete {deleteTarget.type === "topic" ? "Topic" : "Subtopic"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table of Contents Modal */}
        {showTableOfContents && selectedTopicForTOC && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Table of Contents: {selectedTopicForTOC.name}
                  </h2>
                  <p className="text-gray-600">
                    Organize learning materials and create a structured
                    curriculum
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowCreateTOCItem(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Content Item</span>
                  </button>
                  <button
                    onClick={() => setShowTableOfContents(false)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Table of Contents Content */}
              <div className="flex-1 overflow-auto p-6">
                {tableOfContents.length === 0 ? (
                  <div className="text-center py-12">
                    <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No content structure yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Create a comprehensive learning path for{" "}
                      {selectedTopicForTOC.name}
                    </p>
                    <button
                      onClick={() => setShowCreateTOCItem(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Create First Content Item
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tableOfContents
                      .sort((a, b) => a.order - b.order)
                      .map((item) => (
                        <div
                          key={item.id}
                          className={`p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${
                            item.level === 1
                              ? "bg-blue-50 border-blue-200"
                              : item.level === 2
                              ? "ml-6 bg-green-50 border-green-200"
                              : "ml-12 bg-yellow-50 border-yellow-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="flex items-center space-x-2">
                                {getContentTypeIcon(item.contentType)}
                                <span className="text-sm text-gray-500">
                                  Level {item.level}
                                </span>
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <h4 className="font-medium text-gray-900">
                                    {item.title}
                                  </h4>{" "}
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(
                                      item.difficulty || "beginner"
                                    )}`}
                                  >
                                    {item.difficulty}
                                  </span>
                                  {!item.isPublished && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                      Draft
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  /{item.slug}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {item.description}
                                </p>
                                {item.estimatedReadTime && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    📚 ~{item.estimatedReadTime} min read
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Edit content item"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                title="View content"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete content item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Create TOC Item Modal */}
        {showCreateTOCItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-bold mb-4">Add Content Item</h2>
              <form onSubmit={handleCreateTOCItem} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={tocForm.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setTocForm((prev) => ({
                          ...prev,
                          title,
                          slug: generateSlug(title),
                        }));
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="e.g., Variables and Data Types"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={tocForm.slug}
                      onChange={(e) =>
                        setTocForm((prev) => ({
                          ...prev,
                          slug: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={tocForm.description}
                    onChange={(e) =>
                      setTocForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="Brief description of what this content covers..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content Type
                    </label>{" "}
                    <select
                      value={tocForm.contentType}
                      onChange={(e) =>
                        setTocForm((prev) => ({
                          ...prev,
                          contentType: e.target.value as
                            | "blog"
                            | "note"
                            | "leetcode"
                            | "section",
                        }))
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="section">📚 Section</option>
                      <option value="blog">📝 Blog Post</option>
                      <option value="note">📋 Study Note</option>
                      <option value="leetcode">💻 Code Problem</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level
                    </label>{" "}
                    <select
                      value={tocForm.level}
                      onChange={(e) =>
                        setTocForm((prev) => ({
                          ...prev,
                          level: parseInt(e.target.value),
                        }))
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value={1}>1 - Main Topic</option>
                      <option value={2}>2 - Subtopic</option>
                      <option value={3}>3 - Sub-subtopic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty
                    </label>{" "}
                    <select
                      value={tocForm.difficulty}
                      onChange={(e) =>
                        setTocForm((prev) => ({
                          ...prev,
                          difficulty: e.target.value as
                            | "beginner"
                            | "intermediate"
                            | "advanced",
                        }))
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="beginner">🟢 Beginner</option>
                      <option value="intermediate">🟡 Intermediate</option>
                      <option value="advanced">🔴 Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order
                    </label>{" "}
                    <input
                      type="number"
                      value={tocForm.order}
                      onChange={(e) =>
                        setTocForm((prev) => ({
                          ...prev,
                          order: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Read Time (minutes)
                    </label>{" "}
                    <input
                      type="number"
                      value={tocForm.estimatedReadTime}
                      onChange={(e) =>
                        setTocForm((prev) => ({
                          ...prev,
                          estimatedReadTime: parseInt(e.target.value) || 5,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      min="1"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  {" "}
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={tocForm.isPublished}
                    onChange={(e) =>
                      setTocForm((prev) => ({
                        ...prev,
                        isPublished: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="isPublished"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Publish immediately
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateTOCItem(false);
                      resetTOCForm();
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Content Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
