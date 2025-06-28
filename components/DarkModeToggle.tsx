import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if user has a preference stored
    const stored = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const shouldBeDark = stored ? JSON.parse(stored) : prefersDark;
    setDarkMode(shouldBeDark);

    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Don't render the button until mounted to avoid hydration mismatch
  if (!mounted) {
    return <div className="p-2 rounded-lg w-9 h-9" />;
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="p-3 rounded-xl text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-white/15 hover:to-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 backdrop-blur-sm group"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <Sun className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
      ) : (
        <Moon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
      )}
    </button>
  );
}
