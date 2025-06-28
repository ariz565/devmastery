import { ReactNode } from "react";
import AuthNavbar from "./AuthNavbar";
import Link from "next/link";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        {/* Subtle dot pattern for navbar background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz4KPC9zdmc+')] opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="group flex items-center space-x-3">
              <img
                src="/logo.svg"
                height="32"
                width="32"
                alt="DevMastery Logo"
                className="h-8 w-8 group-hover:scale-110 transition-transform duration-300"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                DevMastery
              </span>
            </Link>

            {/* Navigation */}
            <AuthNavbar />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="relative bg-gray-900/90 backdrop-blur-xl border-t border-white/10 shadow-2xl">
        {/* Subtle dot pattern for footer background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz4KPC9zdmc+')] opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="/logo.svg"
                  height="24"
                  width="24"
                  alt="DevMastery Logo"
                  className="h-6 w-6"
                />
                <span className="text-lg font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  DevMastery
                </span>
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Empowering developers through comprehensive learning resources,
                coding challenges, and interview preparation materials.
              </p>
              <p className="text-sm text-gray-400 font-medium">
                © {new Date().getFullYear()} DevMastery. All rights reserved.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/topics"
                    className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block font-medium"
                  >
                    Topics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blogs"
                    className="text-gray-300 hover:text-green-400 transition-all duration-300 hover:translate-x-1 inline-block font-medium"
                  >
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/notes"
                    className="text-gray-300 hover:text-purple-400 transition-all duration-300 hover:translate-x-1 inline-block font-medium"
                  >
                    Notes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/leetcode"
                    className="text-gray-300 hover:text-orange-400 transition-all duration-300 hover:translate-x-1 inline-block font-medium"
                  >
                    LeetCode
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/interviews"
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    Interviews
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
