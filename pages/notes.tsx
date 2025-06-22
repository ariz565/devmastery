import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Tag,
  User,
  FileText,
  BookOpen,
  Code,
  FolderTree,
  ArrowRight,
  Clock,
  Hash,
} from "lucide-react";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { BentoGrid, BentoItem } from "@/components/ui/bento-grid";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  author: {
    name: string;
  };
  topic?: {
    name: string;
    slug: string;
    icon: string;
  };
  subTopic?: {
    name: string;
    slug: string;
    icon: string;
  };
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes");
      const data = await response.json();
      setNotes(data.notes || []);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group notes by topic
  const groupedNotes = notes.reduce((acc, note) => {
    const topicName = note.topic?.name || note.category || "General";
    if (!acc[topicName]) {
      acc[topicName] = [];
    }
    acc[topicName].push(note);
    return acc;
  }, {} as Record<string, Note[]>);

  // Get all topics for filter
  const topics = ["all", ...Object.keys(groupedNotes)];

  // Filter notes based on selected topic and search term
  const filteredGroupedNotes = Object.entries(groupedNotes).reduce(
    (acc, [topic, topicNotes]) => {
      if (selectedTopic !== "all" && topic !== selectedTopic) {
        return acc;
      }

      const filtered = topicNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );

      if (filtered.length > 0) {
        acc[topic] = filtered;
      }
      return acc;
    },
    {} as Record<string, Note[]>
  ); // Convert notes to BentoGrid items
  const convertNotesToBentoItems = (notes: Note[]): BentoItem[] => {
    return notes.map((note, index) => ({
      title: note.title,
      description: note.content.replace(/[#*`]/g, "").substring(0, 120) + "...",
      icon: <FileText className="w-4 h-4 text-blue-500" />,
      status: note.category,
      tags: note.tags.slice(0, 3),
      meta: new Date(note.createdAt).toLocaleDateString(),
      cta: "Read →",
      colSpan: index % 4 === 0 ? 2 : 1, // Every 4th item spans 2 columns for visual variety
      href: `/notes/${note.id}`, // Add href for linking
    }));
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
              >
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 relative overflow-hidden">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className="absolute inset-0 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/topics"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <FolderTree className="w-4 h-4 mr-2" />
              Topics
            </Link>
            <Link
              href="/blogs"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Blogs
            </Link>
            <Link
              href="/leetcode"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <Code className="w-4 h-4 mr-2" />
              LeetCode
            </Link>
            <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm">
              <FileText className="w-4 h-4 mr-2" />
              Notes
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Study Notes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Quick reference notes and cheatsheets for programming concepts,
            frameworks, and technologies organized by topic.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            title="Filter by topic"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic === "all" ? "All Topics" : topic}
              </option>
            ))}
          </select>
        </div>

        {/* Notes by Topic */}
        {Object.keys(filteredGroupedNotes).length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No notes found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(filteredGroupedNotes).map(
              ([topicName, topicNotes]) => (
                <div key={topicName} className="space-y-6">
                  {/* Topic Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Hash className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {topicName}
                      </h2>
                      <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {topicNotes.length} note
                        {topicNotes.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <Link
                      href={`/topics/${
                        topicNotes[0]?.topic?.slug ||
                        topicName.toLowerCase().replace(/\s+/g, "-")
                      }`}
                      className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                    >
                      View all in topic
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>

                  {/* Notes Bento Grid */}
                  <BentoGrid items={convertNotesToBentoItems(topicNotes)} />
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
