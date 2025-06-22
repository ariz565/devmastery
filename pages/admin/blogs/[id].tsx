import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminLayout from "../../../components/admin/AdminLayout";
import {
  ArrowLeft,
  Edit,
  Calendar,
  User,
  Tag,
  Eye,
  Copy,
  Check,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  author: {
    name: string;
  };
}

export default function ViewBlogPage() {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [tableOfContents, setTableOfContents] = useState<
    { id: string; title: string; level: number }[]
  >([]);
  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const copyToClipboard = async (text: string, codeId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(codeId);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
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
    let headingIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Handle code blocks
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          // End of code block
          formatted.push(
            <div key={`code-${codeBlockIndex}`} className="relative my-6">
              <div className="flex items-center justify-between bg-gray-900 text-gray-200 px-4 py-2 text-sm rounded-t-lg">
                <span className="font-medium">{codeLanguage || "Code"}</span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      currentCodeBlock.trim(),
                      `code-${codeBlockIndex}`
                    )
                  }
                  className="flex items-center space-x-1 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {copiedCode === `code-${codeBlockIndex}` ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <SyntaxHighlighter
                language={codeLanguage || "text"}
                style={oneDark}
                customStyle={{
                  margin: 0,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  borderBottomLeftRadius: "0.5rem",
                  borderBottomRightRadius: "0.5rem",
                  fontSize: "14px",
                }}
                showLineNumbers={true}
              >
                {currentCodeBlock.trim()}
              </SyntaxHighlighter>
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
        const title = line.replace("# ", "");
        const id = `heading-${headingIndex}`;
        formatted.push(
          <h1
            key={i}
            id={id}
            className="text-3xl font-bold text-gray-900 mt-10 mb-6 border-b-2 border-blue-200 pb-3 scroll-mt-20"
          >
            {title}
          </h1>
        );
        headingIndex++;
      } else if (line.startsWith("## ")) {
        const title = line.replace("## ", "");
        const id = `heading-${headingIndex}`;
        formatted.push(
          <h2
            key={i}
            id={id}
            className="text-2xl font-semibold text-gray-800 mt-8 mb-4 border-l-4 border-blue-500 pl-4 scroll-mt-20"
          >
            {title}
          </h2>
        );
        headingIndex++;
      } else if (line.startsWith("### ")) {
        const title = line.replace("### ", "");
        const id = `heading-${headingIndex}`;
        formatted.push(
          <h3
            key={i}
            id={id}
            className="text-xl font-semibold text-gray-800 mt-6 mb-3 scroll-mt-20"
          >
            {title}
          </h3>
        );
        headingIndex++;
      } else if (line.startsWith("#### ")) {
        const title = line.replace("#### ", "");
        const id = `heading-${headingIndex}`;
        formatted.push(
          <h4
            key={i}
            id={id}
            className="text-lg font-medium text-gray-700 mt-5 mb-2 scroll-mt-20"
          >
            {title}
          </h4>
        );
        headingIndex++;
      }
      // Handle bold text
      else if (line.includes("**")) {
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
          <p key={i} className="text-gray-700 leading-relaxed mb-4 text-base">
            {formattedParts}
          </p>
        );
      }
      // Handle bullet points
      else if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        formatted.push(
          <div key={i} className="flex items-start mb-2">
            <span className="text-blue-500 mr-3 mt-1">•</span>
            <span className="text-gray-700 leading-relaxed">
              {line.trim().replace(/^[-*] /, "")}
            </span>
          </div>
        );
      }
      // Handle regular paragraphs
      else if (line.trim() !== "") {
        // Handle inline code
        if (line.includes("`") && !line.startsWith("```")) {
          const parts = line.split("`");
          const formattedParts = parts.map((part, index) =>
            index % 2 === 1 ? (
              <code
                key={index}
                className="bg-blue-50 text-blue-800 px-2 py-1 rounded text-sm font-mono border"
              >
                {part}
              </code>
            ) : (
              part
            )
          );
          formatted.push(
            <p key={i} className="text-gray-700 leading-relaxed mb-4 text-base">
              {formattedParts}
            </p>
          );
        } else {
          formatted.push(
            <p key={i} className="text-gray-700 leading-relaxed mb-4 text-base">
              {line}
            </p>
          );
        }
      }
      // Handle empty lines (add spacing)
      else {
        formatted.push(<div key={i} className="mb-3"></div>);
      }
    }

    return formatted;
  };

  // Process content and generate table of contents
  const { formattedContent, tableOfContentsData } = useMemo(() => {
    if (!blog?.content) {
      return {
        formattedContent: <div>No content available</div>,
        tableOfContentsData: [],
      };
    }

    const lines = blog.content.split("\n");
    const toc: { id: string; title: string; level: number }[] = [];
    let headingIndex = 0;

    // Extract headings for table of contents
    lines.forEach((line) => {
      if (line.startsWith("# ")) {
        const title = line.replace("# ", "");
        const id = `heading-${headingIndex}`;
        toc.push({ id, title, level: 1 });
        headingIndex++;
      } else if (line.startsWith("## ")) {
        const title = line.replace("## ", "");
        const id = `heading-${headingIndex}`;
        toc.push({ id, title, level: 2 });
        headingIndex++;
      } else if (line.startsWith("### ")) {
        const title = line.replace("### ", "");
        const id = `heading-${headingIndex}`;
        toc.push({ id, title, level: 3 });
        headingIndex++;
      } else if (line.startsWith("#### ")) {
        const title = line.replace("#### ", "");
        const id = `heading-${headingIndex}`;
        toc.push({ id, title, level: 4 });
        headingIndex++;
      }
    });

    return {
      formattedContent: (
        <div className="space-y-2">{formatContent(blog.content)}</div>
      ),
      tableOfContentsData: toc,
    };
  }, [blog?.content]);

  // Update table of contents when it changes
  useEffect(() => {
    setTableOfContents(tableOfContentsData);
  }, [tableOfContentsData]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/admin/blogs/${id}`);
      if (response.ok) {
        const data = await response.json();
        setBlog(data);
      } else {
        setError("Blog not found");
      }
    } catch (error) {
      console.error("Failed to fetch blog:", error);
      setError("Failed to load blog");
    } finally {
      setLoading(false);
    }
  };
  const togglePublishStatus = async () => {
    if (!blog) return;

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !blog.published }),
      });

      if (response.ok) {
        const updatedBlog = await response.json();
        setBlog(updatedBlog);
      }
    } catch (error) {
      console.error("Failed to update blog:", error);
    }
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

  if (error || !blog) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Blog not found"}
          </h1>
          <Link
            href="/admin/blogs"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to blogs
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
              href="/admin/blogs"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">View Blog</h1>
              <p className="text-gray-600">Review blog content and details</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePublishStatus}
              className={`px-4 py-2 rounded-lg font-medium ${
                blog.published
                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  : "bg-green-100 text-green-800 hover:bg-green-200"
              }`}
            >
              {blog.published ? "Unpublish" : "Publish"}
            </button>
            <Link
              href={`/admin/blogs/edit/${blog.id}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Blog
            </Link>
          </div>
        </div>

        {/* Blog Content */}
        <div className="bg-white rounded-lg shadow">
          {/* Blog Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  blog.published
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {blog.published ? "Published" : "Draft"}
              </span>
              <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                {blog.category}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>
            <p className="text-lg text-gray-600 mb-6">{blog.excerpt}</p>
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {blog.author.name}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Created: {new Date(blog.createdAt).toLocaleDateString()}
              </div>
              {blog.updatedAt !== blog.createdAt && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Updated: {new Date(blog.updatedAt).toLocaleDateString()}
                </div>
              )}
            </div>
            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <Tag className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Tags:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}{" "}
          </div>

          {/* Table of Contents */}
          {tableOfContents.length > 0 && (
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📋</span>
                Table of Contents
              </h2>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <ul className="space-y-2">
                  {tableOfContents.map((item, index) => (
                    <li key={index} className={`pl-${(item.level - 1) * 4}`}>
                      <a
                        href={`#${item.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          const element = document.getElementById(item.id);
                          element?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }}
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Blog Content */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">📝</span>
              Content
            </h2>
            <div className="prose prose-lg max-w-none">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                {formattedContent}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Link
            href="/admin/blogs"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Link>

          {blog.published && (
            <Link
              href={`/blog/${blog.id}`}
              target="_blank"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Public
            </Link>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
