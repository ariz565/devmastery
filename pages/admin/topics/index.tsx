import { useState, useEffect } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { Plus, Edit, Trash2, FolderOpen, MoreVertical } from "lucide-react";

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

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [showCreateSubTopic, setShowCreateSubTopic] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

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
      }
    } catch (error) {
      console.error("Failed to create topic:", error);
    }
  };

  const handleCreateSubTopic = async (e: React.FormEvent) => {
    e.preventDefault();
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
      }
    } catch (error) {
      console.error("Failed to create subtopic:", error);
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
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">
                        {topic._count.blogs +
                          topic._count.notes +
                          topic._count.leetcodeProblems}{" "}
                        items
                      </div>
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
                    </div>
                  </div>
                </div>

                {/* Subtopics */}
                {expandedTopics.has(topic.id) && topic.subTopics.length > 0 && (
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {topic.subTopics.map((subTopic) => (
                        <div
                          key={subTopic.id}
                          className="p-3 bg-gray-50 rounded-lg"
                        >
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
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateTopic(false)}
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
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateSubTopic(false)}
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
      </div>
    </AdminLayout>
  );
}
