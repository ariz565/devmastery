"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Filter, X, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  type: "blog" | "topic" | "note" | "leetcode";
  description: string;
  href: string;
  tags?: string[];
}

interface SearchBarProps {
  className?: string;
  onSearch?: (query: string) => void;
}

// Mock search results - in a real app, this would come from an API
const mockResults: SearchResult[] = [
  {
    id: "1",
    title: "React Hooks Deep Dive",
    type: "blog",
    description: "Understanding useState, useEffect, and custom hooks",
    href: "/blog/react-hooks-deep-dive",
    tags: ["react", "hooks", "frontend"],
  },
  {
    id: "2",
    title: "Binary Search Algorithm",
    type: "leetcode",
    description: "Master the binary search technique",
    href: "/leetcode/binary-search",
    tags: ["algorithms", "search", "arrays"],
  },
  {
    id: "3",
    title: "Data Structures Overview",
    type: "topic",
    description: "Comprehensive guide to data structures",
    href: "/topics/data-structures",
    tags: ["data-structures", "fundamentals"],
  },
  {
    id: "4",
    title: "JavaScript ES6 Features",
    type: "note",
    description: "Quick reference for modern JavaScript",
    href: "/notes/js-es6",
    tags: ["javascript", "es6", "reference"],
  },
];

const recentSearches = [
  "React hooks",
  "Binary tree",
  "System design",
  "JavaScript promises",
];

const trendingSearches = [
  "Next.js 14",
  "TypeScript",
  "LeetCode patterns",
  "Docker",
  "GraphQL",
];

export function SearchBar({ className, onSearch }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("all");
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowFilters(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      // Simulate search - filter mock results
      const filtered = mockResults.filter(
        (result) =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase()) ||
          result.tags?.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          )
      );

      if (selectedType !== "all") {
        setResults(filtered.filter((result) => result.type === selectedType));
      } else {
        setResults(filtered);
      }
    } else {
      setResults([]);
    }
  }, [query, selectedType]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch?.(searchQuery);
  };

  const getTypeIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "blog":
        return "📝";
      case "topic":
        return "📚";
      case "note":
        return "📋";
      case "leetcode":
        return "💻";
      default:
        return "📄";
    }
  };

  const getTypeBadgeColor = (type: SearchResult["type"]) => {
    switch (type) {
      case "blog":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "topic":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "note":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "leetcode":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search articles, topics, problems..."
          className="w-full pl-10 pr-20 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
        />

        {/* Filter and Clear buttons */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          <button
            onClick={() => setShowFilters(!showFilters)}
            title="Toggle filters"
            aria-label="Toggle search filters"
            className={cn(
              "p-1.5 rounded-md transition-colors",
              showFilters
                ? "bg-blue-500/20 text-blue-400"
                : "text-white/60 hover:text-white hover:bg-white/10"
            )}
          >
            <Filter className="w-4 h-4" />
          </button>
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              title="Clear search"
              aria-label="Clear search query"
              className="p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg z-50">
          <div className="flex flex-wrap gap-2">
            {["all", "blog", "topic", "note", "leetcode"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                  selectedType === type
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                )}
              >
                {type === "all"
                  ? "All"
                  : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-black/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
          {query.length === 0 ? (
            <div className="p-4">
              {/* Recent Searches */}
              <div className="mb-4">
                <div className="flex items-center text-white/60 text-sm font-medium mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Recent Searches
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="block w-full text-left px-3 py-2 text-white/80 hover:bg-white/10 rounded-md transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Searches */}
              <div>
                <div className="flex items-center text-white/60 text-sm font-medium mb-2">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending
                </div>
                <div className="space-y-1">
                  {trendingSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="block w-full text-left px-3 py-2 text-white/80 hover:bg-white/10 rounded-md transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result) => (
                <a
                  key={result.id}
                  href={result.href}
                  className="flex items-start p-3 hover:bg-white/10 rounded-lg transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg mr-3 mt-0.5">
                    {getTypeIcon(result.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-medium group-hover:text-blue-300 transition-colors truncate">
                        {result.title}
                      </h4>
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full font-medium ml-2 flex-shrink-0",
                          getTypeBadgeColor(result.type)
                        )}
                      >
                        {result.type}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm line-clamp-2">
                      {result.description}
                    </p>
                    {result.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {result.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 bg-white/10 text-white/60 rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-white/60">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">
                Try different keywords or check the spelling
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
