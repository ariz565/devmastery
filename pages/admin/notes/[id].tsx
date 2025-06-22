import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminLayout from "../../../components/admin/AdminLayout";
import {
  ArrowLeft,
  Edit,
  Calendar,
  User,
  Tag,
  Trash2,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
  };
  topic?: {
    id: string;
    name: string;
  };
  subTopic?: {
    id: string;
    name: string;
  };
}

export default function ViewNotePage() {
  const router = useRouter();
  const { id } = router.query;
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchNote();
    }
  }, [id]);

  const fetchNote = async () => {
    try {
      const response = await fetch(`/api/admin/notes/${id}`);
      if (response.ok) {
        const data = await response.json();
        setNote(data);
      } else {
        setError("Note not found");
      }
    } catch (error) {
      console.error("Failed to fetch note:", error);
      setError("Failed to load note");
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async () => {
    if (!note || !confirm("Are you sure you want to delete this note?")) return;

    try {
      const response = await fetch(`/api/admin/notes/${note.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Note deleted successfully");
        router.push("/admin/notes");
      } else {
        toast.error("Failed to delete note");
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
      toast.error("Failed to delete note");
    }
  };

  const formatContent = (content: string) => {
    // Split content by lines and process each line
    const lines = content.split("\n");
    const formatted: JSX.Element[] = [];
    let currentCodeBlock = "";
    let codeLanguage = "";
    let inCodeBlock = false;
    let codeBlockIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Handle code blocks
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          // End of code block
          formatted.push(
            <div key={`code-${codeBlockIndex}`} className="relative my-4">
              <div className="bg-gray-900 text-gray-200 px-4 py-2 text-sm rounded-t-lg">
                <span className="font-medium">{codeLanguage || "Code"}</span>
              </div>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-b-lg overflow-x-auto">
                <code>{currentCodeBlock.trim()}</code>
              </pre>
            </div>
          );
          currentCodeBlock = "";
          codeLanguage = "";
          inCodeBlock = false;
          codeBlockIndex++;
        } else {
          // Start of code block
          codeLanguage = line.replace("```", "").trim();
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        currentCodeBlock += line + "\n";
        continue;
      }

      // Handle headers
      if (line.startsWith("# ")) {
        const text = line.replace("# ", "");
        formatted.push(
          <h1
            key={i}
            className="text-2xl font-bold text-gray-900 mt-6 mb-4 first:mt-0"
          >
            {text}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        const text = line.replace("## ", "");
        formatted.push(
          <h2 key={i} className="text-xl font-semibold text-gray-900 mt-5 mb-3">
            {text}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        const text = line.replace("### ", "");
        formatted.push(
          <h3 key={i} className="text-lg font-semibold text-gray-900 mt-4 mb-2">
            {text}
          </h3>
        );
      } else if (line.includes("**")) {
        // Handle bold text
        const parts = line.split("**");
        const formattedParts = parts.map((part, index) =>
          index % 2 === 1 ? (
            <strong key={index} className="font-bold text-gray-900">
              {part}
            </strong>
          ) : (
            part
          )
        );
        formatted.push(
          <p key={i} className="text-gray-700 leading-relaxed mb-3">
            {formattedParts}
          </p>
        );
      } else if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        // Handle bullet points
        formatted.push(
          <div key={i} className="flex items-start mb-2">
            <span className="text-blue-500 mr-2 mt-1">•</span>
            <span className="text-gray-700 leading-relaxed">
              {line.trim().replace(/^[-*] /, "")}
            </span>
          </div>
        );
      } else if (line.trim() !== "") {
        // Handle inline code and regular paragraphs
        if (line.includes("`") && !line.startsWith("```")) {
          const parts = line.split("`");
          const formattedParts = parts.map((part, index) =>
            index % 2 === 1 ? (
              <code
                key={index}
                className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono"
              >
                {part}
              </code>
            ) : (
              part
            )
          );
          formatted.push(
            <p key={i} className="text-gray-700 leading-relaxed mb-3">
              {formattedParts}
            </p>
          );
        } else {
          formatted.push(
            <p key={i} className="text-gray-700 leading-relaxed mb-3">
              {line}
            </p>
          );
        }
      } else {
        // Handle empty lines
        formatted.push(<div key={i} className="mb-2"></div>);
      }
    }

    return <div className="space-y-1">{formatted}</div>;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !note) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Note not found"}
          </h1>
          <Link
            href="/admin/notes"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to notes
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
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/notes"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">View Note</h1>
              <p className="text-gray-600">Review note content and details</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={deleteNote}
              className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 font-medium"
            >
              <Trash2 className="w-4 h-4 mr-2 inline" />
              Delete
            </button>
            <Link
              href={`/admin/notes/edit/${note.id}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Note
            </Link>
          </div>
        </div>

        {/* Note Content */}
        <div className="bg-white rounded-lg shadow">
          {/* Note Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                {note.category}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <FileText className="w-4 h-4 mr-1" />
                Note
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {note.title}
            </h1>
            {/* Meta Information */}{" "}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {note.author?.name || "Unknown Author"}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Created: {new Date(note.createdAt).toLocaleDateString()}
              </div>
              {note.updatedAt !== note.createdAt && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Updated: {new Date(note.updatedAt).toLocaleDateString()}
                </div>
              )}
            </div>
            {/* Topic Information */}
            {(note.topic || note.subTopic) && (
              <div className="mt-4 flex items-center gap-4 text-sm">
                {note.topic && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    Topic: {note.topic.name}
                  </span>
                )}
                {note.subTopic && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    Subtopic: {note.subTopic.name}
                  </span>
                )}
              </div>
            )}
            {/* Tags */}
            {note.tags.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <Tag className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Tags:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Note Content */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📝</span>
              Content
            </h2>
            <div className="prose prose-lg max-w-none">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                {formatContent(note.content)}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Link
            href="/admin/notes"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Notes
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
