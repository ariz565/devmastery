import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import {
  Settings,
  User,
  LogIn,
  BookOpen,
  FileText,
  Code,
  FolderTree,
  Target,
  Menu,
  X,
} from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";

export default function AuthNavbar() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
      </div>
    );
  }

  const navigationItems = [
    { href: "/topics", icon: FolderTree, label: "Topics" },
    { href: "/blogs", icon: BookOpen, label: "Blogs" },
    { href: "/notes", icon: FileText, label: "Notes" },
    { href: "/leetcode", icon: Code, label: "LeetCode" },
    { href: "/interviews", icon: Target, label: "Interviews" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-1">
        {navigationItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="group inline-flex items-center px-5 py-2.5 text-sm font-medium text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-white/15 hover:to-white/10 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/5 hover:border-white/20"
          >
            <Icon className="w-4 h-4 mr-2.5 group-hover:scale-110 transition-transform duration-300" />
            {label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button
          onClick={toggleMobileMenu}
          className="inline-flex items-center justify-center p-3 rounded-xl text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-white/15 hover:to-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 backdrop-blur-sm"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* User Actions */}
      <DarkModeToggle />

      {user ? (
        <>
          <button
            onClick={() => router.push("/admin")}
            className="hidden sm:inline-flex items-center px-5 py-2.5 text-sm font-medium text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 rounded-xl transition-all duration-300 border border-white/10 hover:border-blue-400/40 backdrop-blur-sm group"
            title="Admin Dashboard"
          >
            <Settings className="w-4 h-4 mr-2.5 group-hover:rotate-180 transition-transform duration-500" />
            Dashboard
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-white/90 hidden md:block font-medium">
              Welcome, {user.firstName || user.username || "User"}!
            </span>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox:
                    "w-9 h-9 ring-2 ring-white/30 hover:ring-blue-400/50 transition-all duration-300",
                  userButtonPopoverCard:
                    "bg-gray-900/95 backdrop-blur-xl border border-white/20 shadow-2xl",
                  userButtonPopoverActionButton:
                    "text-white hover:bg-white/10 transition-colors duration-200",
                },
              }}
            />
          </div>
        </>
      ) : (
        <div className="hidden lg:flex items-center space-x-3">
          <SignInButton mode="modal">
            <button className="group inline-flex items-center px-4 py-2 text-sm font-medium bg-gradient-to-r from-white to-gray-100 text-gray-900 rounded-lg hover:from-blue-50 hover:to-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20">
              <LogIn className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Sign In
            </button>
          </SignInButton>
        </div>
      )}

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={toggleMobileMenu}
          />

          <div className="fixed top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-white/20 shadow-2xl z-50 lg:hidden">
            <div className="px-6 py-8 space-y-4">
              {navigationItems.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={toggleMobileMenu}
                  className="group flex items-center px-6 py-4 text-base font-medium text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-white/15 hover:to-white/10 rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20"
                >
                  <Icon className="w-5 h-5 mr-4 group-hover:scale-110 transition-transform duration-300" />
                  {label}
                </Link>
              ))}

              {user && (
                <button
                  onClick={() => {
                    router.push("/admin");
                    toggleMobileMenu();
                  }}
                  className="group flex items-center w-full px-6 py-4 text-base font-medium text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 rounded-xl transition-all duration-300 border border-white/10 hover:border-blue-400/40"
                >
                  <Settings className="w-5 h-5 mr-4 group-hover:rotate-180 transition-transform duration-500" />
                  Admin Dashboard
                </button>
              )}

              {!user && (
                <SignInButton mode="modal">
                  <button
                    onClick={toggleMobileMenu}
                    className="group flex items-center w-full px-6 py-4 text-base font-medium bg-gradient-to-r from-white to-gray-100 text-gray-900 hover:from-blue-50 hover:to-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
                  >
                    <LogIn className="w-5 h-5 mr-4 group-hover:scale-110 transition-transform duration-300" />
                    Sign In
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
