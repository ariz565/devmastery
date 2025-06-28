import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  BookOpen,
  FolderTree,
  FileText,
  Code,
  MessageCircle,
} from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import { SearchBar } from "./SearchBarCompact";
import { ThemeToggle } from "./ThemeToggle";
import { UserProfile } from "./UserProfile";
import { AuthButton } from "./AuthButton";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const { openSignIn, openSignUp, signOut } = useClerk();

  const handleLogin = () => {
    openSignIn({
      afterSignInUrl: "/topics",
    });
  };

  const handleSignUp = () => {
    openSignUp({
      afterSignUpUrl: "/topics",
    });
  };

  const handleLogout = async () => {
    await signOut();
  };

  // Transform Clerk user data to our UserProfile format
  const profileUser =
    isSignedIn && user
      ? {
          name: user.fullName || `${user.firstName} ${user.lastName}` || "User",
          email: user.primaryEmailAddress?.emailAddress || "",
          avatar: user.imageUrl || "",
          role: (user.publicMetadata?.role as "admin" | "user") || "user",
          isLoggedIn: true,
        }
      : {
          name: "",
          email: "",
          avatar: "",
          role: "user" as "admin" | "user",
          isLoggedIn: false,
        };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 flex-shrink-0 mr-8"
          >
            <img
              src="/logo.svg"
              height="32"
              width="32"
              alt="DevMastery Logo"
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-white font-display">
              DevMastery
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-12 flex-1">
            <Link
              href="/blogs"
              className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors font-medium group px-2 py-1"
            >
              <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Blogs</span>
            </Link>
            <Link
              href="/topics"
              className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors font-medium group px-2 py-1"
            >
              <FolderTree className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Topics</span>
            </Link>
            <Link
              href="/notes"
              className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors font-medium group px-2 py-1"
            >
              <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Notes</span>
            </Link>
            <Link
              href="/leetcode"
              className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors font-medium group px-2 py-1"
            >
              <Code className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>LeetCode</span>
            </Link>
            <Link
              href="/interviews"
              className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors font-medium group px-2 py-1"
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Interviews</span>
            </Link>
          </nav>

          {/* Search Bar - Hidden on small screens */}
          <div className="hidden md:block flex-1 max-w-md mx-12">
            <SearchBar />
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-8">
            {/* Theme Toggle */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Authentication Button or User Profile */}
            {isSignedIn ? (
              /* User Profile Icon for Authenticated Users */
              <UserProfile
                user={profileUser}
                onLogin={handleLogin}
                onSignUp={handleSignUp}
                onLogout={handleLogout}
              />
            ) : (
              /* Get Started Button for Non-Authenticated Users - Always Visible */
              <div className="hidden md:flex items-center">
                <AuthButton
                  variant="primary"
                  redirectTo="/topics"
                  className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-2.5 text-sm font-semibold min-w-[120px] whitespace-nowrap rounded-full shadow-lg transition-all duration-300"
                >
                  Get Started
                </AuthButton>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white/80 hover:text-white transition-colors ml-6"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <div className="md:hidden mb-6">
                <SearchBar />
              </div>

              {/* Mobile Theme Toggle */}
              <div className="md:hidden mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 font-medium">Theme</span>
                  <ThemeToggle />
                </div>
              </div>

              {/* Mobile Authentication */}
              <div className="md:hidden mb-6">
                {isSignedIn ? (
                  <div className="text-center text-white/80 font-medium py-3">
                    Welcome back!
                  </div>
                ) : (
                  <div className="w-full">
                    <AuthButton
                      variant="primary"
                      redirectTo="/topics"
                      className="w-full bg-white text-gray-900 hover:bg-gray-100 py-3 text-sm font-semibold rounded-full shadow-lg transition-all duration-300"
                    >
                      Get Started
                    </AuthButton>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <Link
                href="/blogs"
                className="flex items-center space-x-4 text-white/80 hover:text-white transition-colors font-medium py-4 border-b border-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BookOpen className="w-5 h-5" />
                <span>Blogs</span>
              </Link>
              <Link
                href="/topics"
                className="flex items-center space-x-4 text-white/80 hover:text-white transition-colors font-medium py-4 border-b border-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FolderTree className="w-5 h-5" />
                <span>Topics</span>
              </Link>
              <Link
                href="/notes"
                className="flex items-center space-x-4 text-white/80 hover:text-white transition-colors font-medium py-4 border-b border-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileText className="w-5 h-5" />
                <span>Notes</span>
              </Link>
              <Link
                href="/leetcode"
                className="flex items-center space-x-4 text-white/80 hover:text-white transition-colors font-medium py-4 border-b border-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Code className="w-5 h-5" />
                <span>LeetCode</span>
              </Link>
              <Link
                href="/interviews"
                className="flex items-center space-x-4 text-white/80 hover:text-white transition-colors font-medium py-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Interviews</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
