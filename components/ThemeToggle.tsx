"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Get stored theme or default
    const stored = localStorage.getItem("theme") as "light" | "dark" | "system";
    if (stored) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;

    const getSystemTheme = () => {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    };

    let resolvedTheme: "light" | "dark";

    if (theme === "system") {
      resolvedTheme = getSystemTheme();
    } else {
      resolvedTheme = theme;
    }

    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);

    // Store theme preference
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  if (!mounted) {
    return (
      <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
        <div className="p-2 rounded-md w-8 h-8"></div>
        <div className="p-2 rounded-md w-8 h-8"></div>
        <div className="p-2 rounded-md w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "p-2 rounded-md transition-all duration-200",
          theme === "light"
            ? "bg-white/20 text-white shadow-sm"
            : "text-white/60 hover:text-white hover:bg-white/10"
        )}
        title="Light mode"
        aria-label="Switch to light mode"
      >
        <Sun className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "p-2 rounded-md transition-all duration-200",
          theme === "dark"
            ? "bg-white/20 text-white shadow-sm"
            : "text-white/60 hover:text-white hover:bg-white/10"
        )}
        title="Dark mode"
        aria-label="Switch to dark mode"
      >
        <Moon className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme("system")}
        className={cn(
          "p-2 rounded-md transition-all duration-200",
          theme === "system"
            ? "bg-white/20 text-white shadow-sm"
            : "text-white/60 hover:text-white hover:bg-white/10"
        )}
        title="System mode"
        aria-label="Use system theme"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}
