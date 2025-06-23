"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import {
  MessageCircle,
  Reply,
  Heart,
  ThumbsDown,
  MoreHorizontal,
  Edit3,
  Trash2,
  Flag,
  Calendar,
  User,
  Send,
  Code,
  Bold,
  Italic,
  Link,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface Comment {
  id: string;
  content: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  authorId?: string;
  authorName?: string;
  authorEmail?: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
  parentId?: string;
  replies?: Comment[];
  likes: number;
  dislikes: number;
}

interface CommentSectionProps {
  resourceId: string;
}

export default function CommentSection({ resourceId }: CommentSectionProps) {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [showAnonymousForm, setShowAnonymousForm] = useState(false);
  const [anonymousName, setAnonymousName] = useState("");
  const [anonymousEmail, setAnonymousEmail] = useState("");
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  );

  // Quill editor configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link"],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "link",
    "align",
  ];

  useEffect(() => {
    fetchComments();
  }, [resourceId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/interviews/${resourceId}/comments`);
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async (content: string, parentId?: string) => {
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const payload: any = {
        content: content.trim(),
        parentId: parentId || null,
      };

      if (!user && showAnonymousForm) {
        payload.authorName = anonymousName;
        payload.authorEmail = anonymousEmail;
      }

      const response = await fetch(`/api/interviews/${resourceId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchComments(); // Refresh comments
        setNewComment("");
        setReplyContent("");
        setReplyingTo(null);
        setShowAnonymousForm(false);
        setAnonymousName("");
        setAnonymousEmail("");
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleExpanded = (commentId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const CommentComponent = ({
    comment,
    isReply = false,
  }: {
    comment: Comment;
    isReply?: boolean;
  }) => {
    const authorName =
      comment.author?.name || comment.authorName || "Anonymous";
    const isExpanded = expandedComments.has(comment.id);
    const hasReplies = comment.replies && comment.replies.length > 0;

    return (
      <div
        className={`${
          isReply
            ? "ml-8 border-l-2 border-gray-200 dark:border-gray-700 pl-4"
            : ""
        }`}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Comment Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {authorName}
                  </span>
                  {comment.isEdited && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      (edited)
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
              </div>
            </div>

            <button
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Comment options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Comment Content */}
          <div
            className="prose prose-sm max-w-none dark:prose-invert mb-4"
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />

          {/* Comment Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                <Heart className="w-4 h-4" />
                <span className="text-xs">{comment.likes}</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
                <ThumbsDown className="w-4 h-4" />
                <span className="text-xs">{comment.dislikes}</span>
              </button>
              <button
                onClick={() =>
                  setReplyingTo(replyingTo === comment.id ? null : comment.id)
                }
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <Reply className="w-4 h-4" />
                <span className="text-xs">Reply</span>
              </button>
            </div>

            {hasReplies && (
              <button
                onClick={() => toggleExpanded(comment.id)}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <span className="text-xs">
                  {comment.replies?.length} replies
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <ReactQuill
                value={replyContent}
                onChange={setReplyContent}
                modules={modules}
                formats={formats}
                placeholder="Write your reply..."
                className="mb-3"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setReplyingTo(null)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => submitComment(replyContent, comment.id)}
                  disabled={submitting || !replyContent.trim()}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Reply</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Replies */}
        {hasReplies && isExpanded && (
          <div className="mt-4 space-y-4">
            {comment.replies?.map((reply) => (
              <CommentComponent key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center space-x-2">
        <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Discussion ({comments.length})
        </h3>
      </div>

      {/* New Comment Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <ReactQuill
            value={newComment}
            onChange={setNewComment}
            modules={modules}
            formats={formats}
            placeholder="Share your thoughts, ask questions, or discuss this resource..."
          />
        </div>

        {/* Anonymous Form */}
        {!user && (
          <div className="mb-4">
            {!showAnonymousForm ? (
              <button
                onClick={() => setShowAnonymousForm(true)}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Comment as guest
              </button>
            ) : (
              <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={anonymousName}
                    onChange={(e) => setAnonymousName(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  />
                  <input
                    type="email"
                    placeholder="Your email (optional)"
                    value={anonymousEmail}
                    onChange={(e) => setAnonymousEmail(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  />
                </div>
                <button
                  onClick={() => setShowAnonymousForm(false)}
                  className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {user
              ? `Commenting as ${user.firstName || user.username || "User"}`
              : ""}
          </div>
          <button
            onClick={() => submitComment(newComment)}
            disabled={
              submitting ||
              !newComment.trim() ||
              (!user && showAnonymousForm && !anonymousName)
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? "Posting..." : "Post Comment"}</span>
          </button>
        </div>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm animate-pulse"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="space-y-1">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No comments yet
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            Be the first to share your thoughts on this resource!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentComponent key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
