import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  FileText,
  StickyNote,
  Code,
  ArrowLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import ProgrammingLanguageSidebar from "@/components/ProgrammingLanguageSidebar";

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

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  published: boolean;
  createdAt: string;
  author: {
    name: string;
  };
}

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface LeetcodeProblem {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  createdAt: string;
}

export default function TopicDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [topic, setTopic] = useState<Topic | null>(null);
  const [subTopic, setSubTopic] = useState<SubTopic | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [leetcodeProblems, setLeetcodeProblems] = useState<LeetcodeProblem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"blogs" | "notes" | "leetcode">(
    "blogs"
  );

  const isSubTopic = Array.isArray(slug) && slug.length === 2;
  const topicSlug = Array.isArray(slug) ? slug[0] : slug;
  const subTopicSlug = Array.isArray(slug) ? slug[1] : null;

  useEffect(() => {
    if (slug) {
      fetchTopicData();
      fetchContent();
    }
  }, [slug]);

  const fetchTopicData = async () => {
    try {
      const response = await fetch("/api/topics");
      const data = await response.json();

      const foundTopic = data.topics.find((t: Topic) => t.slug === topicSlug);
      setTopic(foundTopic);

      if (isSubTopic && foundTopic) {
        const foundSubTopic = foundTopic.subTopics.find(
          (st: SubTopic) => st.slug === subTopicSlug
        );
        setSubTopic(foundSubTopic);
      }
    } catch (error) {
      console.error("Failed to fetch topic data:", error);
    }
  };

  const fetchContent = async () => {
    try {
      const [blogsRes, notesRes, leetcodeRes] = await Promise.all([
        fetch(
          `/api/blogs?${
            isSubTopic
              ? `subTopicSlug=${subTopicSlug}`
              : `topicSlug=${topicSlug}`
          }`
        ),
        fetch(
          `/api/notes?${
            isSubTopic
              ? `subTopicSlug=${subTopicSlug}`
              : `topicSlug=${topicSlug}`
          }`
        ),
        fetch(
          `/api/leetcode?${
            isSubTopic
              ? `subTopicSlug=${subTopicSlug}`
              : `topicSlug=${topicSlug}$`
          }`
        ),
      ]);

      const [blogsData, notesData, leetcodeData] = await Promise.all([
        blogsRes.json(),
        notesRes.json(),
        leetcodeRes.json(),
      ]);

      setBlogs(blogsData.blogs || []);
      setNotes(notesData.notes || []);
      setLeetcodeProblems(leetcodeData.problems || []);
    } catch (error) {
      console.error("Failed to fetch content:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!topic || (isSubTopic && !subTopic)) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Topic Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The topic you're looking for doesn't exist.
          </p>
          <Link
            href="/topics"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Topics
          </Link>
        </div>
      </div>
    );
  }

  const currentTopic = subTopic || topic;
  const totalContent = blogs.length + notes.length + leetcodeProblems.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-blue-100 mb-6">
            <Link href="/topics" className="hover:text-white">
              Topics
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/topics/${topic.slug}`} className="hover:text-white">
              {topic.name}
            </Link>
            {isSubTopic && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">{subTopic?.name}</span>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-6">
            <div className="text-6xl">{currentTopic.icon}</div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{currentTopic.name}</h1>
              <p className="text-xl text-blue-100 mb-4">
                {currentTopic.description}
              </p>
              <div className="flex items-center space-x-6 text-blue-100">
                <span className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  {blogs.length} Blogs
                </span>
                <span className="flex items-center">
                  <StickyNote className="w-5 h-5 mr-2" />
                  {notes.length} Notes
                </span>
                <span className="flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  {leetcodeProblems.length} Problems
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {" "}
        {/* Check if this is a programming language topic that needs sidebar */}
        {isSubTopic &&
        subTopic &&
        (subTopic.slug === "java" ||
          subTopic.slug === "python" ||
          subTopic.slug === "javascript" ||
          subTopic.slug === "cpp" ||
          subTopic.slug === "go") ? (
          /* Programming Language Layout with Sidebar */
          <div className="flex gap-8">
            {/* Enhanced Programming Language Sidebar */}
            <div className="flex-shrink-0">
              <ProgrammingLanguageSidebar
                topicSlug={topic.slug}
                subTopicSlug={subTopic.slug}
                currentSection={router.query.section as string}
              />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* Content Tabs */}
              {totalContent > 0 && (
                <>
                  <div className="border-b border-gray-200 mb-8">
                    <nav className="-mb-px flex space-x-8">
                      <button
                        onClick={() => setActiveTab("blogs")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === "blogs"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <FileText className="w-5 h-5 inline mr-2" />
                        Detailed Guides ({blogs.length})
                      </button>
                      <button
                        onClick={() => setActiveTab("notes")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === "notes"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <StickyNote className="w-5 h-5 inline mr-2" />
                        Quick References ({notes.length})
                      </button>
                      <button
                        onClick={() => setActiveTab("leetcode")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === "leetcode"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <Code className="w-5 h-5 inline mr-2" />
                        Practice Problems ({leetcodeProblems.length})
                      </button>
                    </nav>
                  </div>

                  {/* Content Grid - Optimized for sidebar layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Blogs Tab */}
                    {activeTab === "blogs" &&
                      blogs.map((blog) => (
                        <Link
                          key={blog.id}
                          href={`/blog/${blog.id}`}
                          className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
                        >
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-3">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {blog.category}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {blog.readTime} min read
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                              {blog.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {blog.excerpt}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                {blog.author.name}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(blog.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}

                    {/* Notes Tab */}
                    {activeTab === "notes" &&
                      notes.map((note) => (
                        <Link
                          key={note.id}
                          href={`/notes/${note.id}`}
                          className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border-l-4 border-yellow-400"
                        >
                          <div className="p-6">
                            <div className="flex items-center mb-2">
                              <StickyNote className="w-4 h-4 text-yellow-600 mr-2" />
                              <span className="text-xs font-medium text-yellow-600 uppercase tracking-wide">
                                Quick Reference
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                              {note.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-4">
                              {note.content.substring(0, 150)}...
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(note.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </Link>
                      ))}

                    {/* LeetCode Tab */}
                    {activeTab === "leetcode" &&
                      leetcodeProblems.map((problem) => (
                        <Link
                          key={problem.id}
                          href={`/leetcode/${problem.id}`}
                          className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border-l-4 border-green-400"
                        >
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  problem.difficulty === "Easy"
                                    ? "bg-green-100 text-green-800"
                                    : problem.difficulty === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {problem.difficulty}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                              {problem.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {problem.description.substring(0, 150)}...
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(problem.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </>
              )}

              {/* Empty State for Programming Languages */}
              {totalContent === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">{subTopic.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {subTopic.name} Learning Path
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Comprehensive {subTopic.name} tutorials and references are
                    being prepared. Check back soon for in-depth content!
                  </p>
                  <div className="bg-blue-50 rounded-lg p-6 text-left max-w-md mx-auto">
                    <h4 className="font-medium text-blue-900 mb-2">
                      What's Coming:
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Fundamentals and core concepts</li>
                      <li>• Advanced features and patterns</li>
                      <li>• Best practices and examples</li>
                      <li>• Hands-on coding exercises</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Regular Topic Layout */
          <>
            {/* Subtopics (if viewing main topic) */}
            {!isSubTopic && topic.subTopics.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Subtopics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {topic.subTopics.map((subTopic) => (
                    <Link
                      key={subTopic.id}
                      href={`/topics/${topic.slug}/${subTopic.slug}`}
                      className="group bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{subTopic.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {subTopic.name}
                          </h3>
                          {subTopic.description && (
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                              {subTopic.description}
                            </p>
                          )}
                          <div className="mt-4 text-sm text-gray-500">
                            {subTopic._count.blogs +
                              subTopic._count.notes +
                              subTopic._count.leetcodeProblems}{" "}
                            resources
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Content Tabs */}
            {totalContent > 0 && (
              <>
                <div className="border-b border-gray-200 mb-8">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab("blogs")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "blogs"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <FileText className="w-5 h-5 inline mr-2" />
                      Blogs ({blogs.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("notes")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "notes"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <StickyNote className="w-5 h-5 inline mr-2" />
                      Notes ({notes.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("leetcode")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "leetcode"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <Code className="w-5 h-5 inline mr-2" />
                      LeetCode ({leetcodeProblems.length})
                    </button>
                  </nav>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Blogs Tab */}
                  {activeTab === "blogs" &&
                    blogs.map((blog) => (
                      <Link
                        key={blog.id}
                        href={`/blog/${blog.id}`}
                        className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {blog.category}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {blog.readTime} min read
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                            {blog.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {blog.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            {" "}
                            <span className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {blog.author.name}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}

                  {/* Notes Tab */}
                  {activeTab === "notes" &&
                    notes.map((note) => (
                      <Link
                        key={note.id}
                        href={`/notes/${note.id}`}
                        className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
                      >
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                            {note.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-4">
                            {note.content.substring(0, 150)}...
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(note.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </Link>
                    ))}

                  {/* LeetCode Tab */}
                  {activeTab === "leetcode" &&
                    leetcodeProblems.map((problem) => (
                      <Link
                        key={problem.id}
                        href={`/leetcode/${problem.id}`}
                        className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                problem.difficulty === "Easy"
                                  ? "bg-green-100 text-green-800"
                                  : problem.difficulty === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {problem.difficulty}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                            {problem.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {problem.description.substring(0, 150)}...
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(problem.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </>
            )}

            {/* Empty State */}
            {totalContent === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No content yet
                </h3>
                <p className="text-gray-600">
                  This topic doesn't have any content yet. Check back later!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
