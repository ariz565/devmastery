import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderTree,
  FileText,
  StickyNote,
  Code,
  Users,
  ChevronRight,
} from "lucide-react";
import { DotPattern } from "@/components/magicui/dot-pattern";

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

export default function TopicsIndexPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await fetch("/api/topics");
      const data = await response.json();
      setTopics(data.topics || []);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="mb-8 p-6 bg-white rounded-lg shadow">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, j) => (
                    <div key={j} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 py-12 relative">
      <DotPattern
        className="absolute inset-0 opacity-20"
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📚 Learning Topics
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our organized collection of programming tutorials, notes,
            and resources across different technologies and domains.
          </p>
        </div>

        {/* Topics Grid */}
        <div className="space-y-8">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              {/* Topic Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{topic.icon}</div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {topic.name}
                      </h2>
                      <p className="text-blue-100 mt-1">{topic.description}</p>
                    </div>
                  </div>
                  <div className="text-right text-white">
                    <div className="text-2xl font-bold">
                      {topic._count.blogs +
                        topic._count.notes +
                        topic._count.leetcodeProblems}
                    </div>
                    <div className="text-sm text-blue-100">Total Resources</div>
                  </div>
                </div>
              </div>

              {/* Topic Stats */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {topic._count.blogs} Blogs
                  </div>
                  <div className="flex items-center">
                    <StickyNote className="w-4 h-4 mr-1" />
                    {topic._count.notes} Notes
                  </div>
                  <div className="flex items-center">
                    <Code className="w-4 h-4 mr-1" />
                    {topic._count.leetcodeProblems} LeetCode Problems
                  </div>
                  <div className="flex items-center">
                    <FolderTree className="w-4 h-4 mr-1" />
                    {topic.subTopics.length} Subtopics
                  </div>
                </div>
              </div>

              {/* Subtopics Grid */}
              {topic.subTopics.length > 0 && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Subtopics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {topic.subTopics.map((subTopic) => (
                      <Link
                        key={subTopic.id}
                        href={`/topics/${topic.slug}/${subTopic.slug}`}
                        className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl">{subTopic.icon}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {subTopic.name}
                            </h4>
                            {subTopic.description && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {subTopic.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-3">
                              <div className="text-xs text-gray-400">
                                {subTopic._count.blogs +
                                  subTopic._count.notes +
                                  subTopic._count.leetcodeProblems}{" "}
                                resources
                              </div>
                              <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* View All Link */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <Link
                  href={`/topics/${topic.slug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all {topic.name} content
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Looking for something specific?
            </h2>
            <p className="text-gray-600 mb-6">
              Use our advanced search to find blogs, notes, and coding problems
              across all topics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blogs"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="w-5 h-5 mr-2" />
                Browse All Blogs
              </Link>
              <Link
                href="/notes"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <StickyNote className="w-5 h-5 mr-2" />
                View Study Notes
              </Link>
              <Link
                href="/leetcode"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Code className="w-5 h-5 mr-2" />
                Practice LeetCode
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
