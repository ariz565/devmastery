import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Link from "next/link";
import { Settings, User, LogIn, BookOpen, FileText, Code, FolderTree } from "lucide-react";

export default function AuthNavbar() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">      {/* Public Navigation - Always visible */}
      <div className="flex items-center space-x-2">
        <Link
          href="/topics"
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <FolderTree className="w-4 h-4 mr-2" />
          Topics
        </Link>
        <Link
          href="/blogs"
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Blogs
        </Link>
        <Link
          href="/notes"
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <FileText className="w-4 h-4 mr-2" />
          Notes
        </Link>
        <Link
          href="/leetcode"
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Code className="w-4 h-4 mr-2" />
          LeetCode
        </Link>
      </div>

      {user ? (
        <>
          {/* Admin Dashboard Button */}
          <button
            onClick={() => router.push("/admin")}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Admin Dashboard"
          >
            <Settings className="w-4 h-4 mr-2" />
            Dashboard
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-200 hidden sm:block">
              Welcome, {user.firstName || user.username || "User"}!
            </span>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                  userButtonPopoverCard:
                    "dark:bg-gray-800 dark:border-gray-700",
                  userButtonPopoverActionButton:
                    "dark:text-gray-200 dark:hover:bg-gray-700",
                },
              }}
            />
          </div>
        </>
      ) : (
        <div className="flex items-center space-x-3">
          <SignInButton mode="modal">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </button>
          </SignInButton>

          <SignInButton mode="modal">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <User className="w-4 h-4 mr-2" />
              Register
            </button>
          </SignInButton>
        </div>
      )}
    </div>
  );
}
