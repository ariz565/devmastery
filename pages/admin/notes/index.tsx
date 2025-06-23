import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import AdminLayout from "../../../components/admin/AdminLayout";
import { Plus, Search, FileText, Edit, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";

interface Note {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    email: string;
  } | null;
  topic: {
    name: string;
  } | null;
}

export default function NotesManagement() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push("/admin/auth");
      return;
    }
    fetchNotes();
  }, [user, isLoaded, router]);

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/admin/notes");
      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      const response = await fetch(`/api/admin/notes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotes(notes.filter((note) => note.id !== id));
        toast.success("Note deleted successfully");
      } else {
        toast.error("Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "all",
    ...Array.from(new Set(notes.map((note) => note.category))),
  ];

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
              Notes Management
            </h1>
            <p className="text-gray-600 mt-1">
              Create and manage your study notes
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/notes/create")}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>{" "}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Filter notes by category"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notes found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first note"}
            </p>
            {!searchTerm && selectedCategory === "all" && (
              <button
                onClick={() => router.push("/admin/notes/create")}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Note
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {" "}
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    <button
                      onClick={() => router.push(`/admin/notes/${note.id}`)}
                      className="text-left hover:text-blue-600 transition-colors"
                      title="View note"
                    >
                      {note.title}
                    </button>
                  </h3>{" "}
                  <div className="flex space-x-2 ml-2">
                    <button
                      onClick={() => router.push(`/admin/notes/${note.id}`)}
                      className="text-gray-400 hover:text-green-600 transition-colors"
                      title="View note"
                      aria-label={`View note ${note.title}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/admin/notes/edit/${note.id}`)
                      }
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit note"
                      aria-label={`Edit note ${note.title}`}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete note"
                      aria-label={`Delete note ${note.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {note.content.substring(0, 100)}...
                </p>{" "}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {note.category}
                  </span>
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  by {note.author?.name || note.author?.email || "Unknown"}
                  {note.topic && (
                    <span className="ml-2 text-blue-600">
                      • {note.topic.name}
                    </span>
                  )}
                </div>
                {note.tags && note.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="text-gray-500 text-xs">
                        +{note.tags.length - 3} more
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
