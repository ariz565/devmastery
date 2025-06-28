"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, BookOpen, FileText, Code, FolderTree } from "lucide-react";
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
    description: "Modern JavaScript features and syntax",
    href: "/notes/javascript-es6",
    tags: ["javascript", "es6", "syntax"],
  },
];

export function SearchBarCompact({ className, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      // Simulate API call with debouncing
      const timeoutId = setTimeout(() => {
        const filteredResults = mockResults.filter(
          (result) =>
            result.title.toLowerCase().includes(query.toLowerCase()) ||
            result.description.toLowerCase().includes(query.toLowerCase()) ||
            result.tags?.some((tag) =>
              tag.toLowerCase().includes(query.toLowerCase())
            )
        );
        setResults(filteredResults.slice(0, 4)); // Limit to 4 results
      }, 150);

      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch?.(searchQuery);
    setIsOpen(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "blog":
        return <BookOpen className="w-3 h-3" />;
      case "topic":
        return <FolderTree className="w-3 h-3" />;
      case "note":
        return <FileText className="w-3 h-3" />;
      case "leetcode":
        return <Code className="w-3 h-3" />;
      default:
        return <Search className="w-3 h-3" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "blog":
        return "bg-green-500/20 text-green-300";
      case "topic":
        return "bg-blue-500/20 text-blue-300";
      case "note":
        return "bg-purple-500/20 text-purple-300";
      case "leetcode":
        return "bg-orange-500/20 text-orange-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-sm", className)}>
      {/* Compact Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search..."
          className="w-full pl-10 pr-8 py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 hover:bg-white/15"
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
            title="Clear search"
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-red-400 transition-colors"
          >
            <X className="h-3 w-3 text-gray-400" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (query.length > 0 || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((result) => (
                <a
                  key={result.id}
                  href={result.href}
                  onClick={() => handleSearch(result.title)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors group"
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-6 h-6 rounded text-xs",
                      getTypeBadgeColor(result.type)
                    )}
                  >
                    {getTypeIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors truncate">
                      {result.title}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {result.description}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {result.type}
                  </div>
                </a>
              ))}
            </div>
          ) : query.length > 0 ? (
            <div className="p-4 text-center text-gray-400 text-sm">
              No results found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export { SearchBarCompact as SearchBar };
