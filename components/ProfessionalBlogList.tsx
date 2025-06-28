import { ArrowRight, Heart, Bookmark, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Card } from "@/components/ui/card";

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  label: string;
  author: string;
  published: string;
  url: string;
  image: string;
  tags?: string[];
}

interface BlogListProps {
  posts: BlogPost[];
}

const ProfessionalBlogList = ({ posts }: BlogListProps) => {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleSave = (postId: string) => {
    setSavedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleShare = async (post: BlogPost) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.summary,
          url: window.location.origin + post.url,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.origin + post.url);
        // You could add a toast notification here
        alert("Link copied to clipboard!");
      } catch (error) {
        console.log("Error copying to clipboard:", error);
      }
    }
  };
  return (
    <div className="space-y-12">
      {posts.map((post, index) => (
        <div key={post.id} className="relative group">
          <Card className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 lg:p-8 rounded-xl hover:bg-gray-800/95 hover:border-gray-600 hover:-translate-y-1">
            <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-6 sm:gap-y-0 md:items-center md:gap-x-8 lg:gap-x-12">
              <div className="sm:col-span-6">
                <div className="mb-4 md:mb-6">
                  <div className="flex flex-wrap gap-2 sm:gap-3 text-xs uppercase tracking-wider md:gap-5 lg:gap-6">
                    {post.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-blue-900/40 to-blue-800/30 text-blue-300 rounded-full font-medium text-xs border border-blue-700/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold md:text-2xl lg:text-3xl text-white leading-tight mb-3 sm:mb-4">
                  <Link
                    href={post.url}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-300 md:mt-5 leading-relaxed text-sm sm:text-base">
                  {post.summary}
                </p>
                <div className="mt-4 sm:mt-6 flex items-center space-x-3 sm:space-x-4 text-sm md:mt-8">
                  <span className="text-gray-400 font-medium">
                    {post.author}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">{post.published}</span>
                </div>
                {/* Action Buttons */}
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between md:mt-8 pt-4 border-t border-gray-700 gap-4 sm:gap-0">
                  <div className="flex items-center space-x-3 sm:space-x-6">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 text-sm ${
                        likedPosts.has(post.id)
                          ? "text-red-400 bg-red-900/20"
                          : "text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                      }`}
                    >
                      <Heart
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${
                          likedPosts.has(post.id) ? "fill-current" : ""
                        }`}
                      />
                      <span className="font-medium hidden sm:inline">Like</span>
                    </button>

                    <button
                      onClick={() => handleSave(post.id)}
                      className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 text-sm ${
                        savedPosts.has(post.id)
                          ? "text-blue-400 bg-blue-900/20"
                          : "text-gray-400 hover:text-blue-400 hover:bg-blue-900/20"
                      }`}
                    >
                      <Bookmark
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${
                          savedPosts.has(post.id) ? "fill-current" : ""
                        }`}
                      />
                      <span className="font-medium hidden sm:inline">Save</span>
                    </button>

                    <button
                      onClick={() => handleShare(post)}
                      className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-gray-400 hover:text-green-400 hover:bg-green-900/20 transition-all duration-200 text-sm"
                    >
                      <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-medium hidden sm:inline">
                        Share
                      </span>
                    </button>
                  </div>

                  <Link
                    href={post.url}
                    className="inline-flex items-center px-3 sm:px-4 py-2 font-semibold text-blue-400 hover:text-white bg-transparent hover:bg-blue-600 border border-blue-400 rounded-lg transition-all duration-200 text-sm sm:text-base group"
                  >
                    <span>Read more</span>
                    <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
              <div className="order-first sm:order-last sm:col-span-4">
                <Link href={post.url} className="block group">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl border-2 border-gray-600 bg-gray-700 shadow-md hover:shadow-lg transition-all duration-300">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-500">
                        <svg
                          className="w-12 h-12 sm:w-16 sm:h-16"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            </div>{" "}
          </Card>

          {/* Add subtle separator line between cards, except for the last one */}
          {index < posts.length - 1 && (
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-6 w-24 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export { ProfessionalBlogList };
