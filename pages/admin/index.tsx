"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { FileText, StickyNote, Code, Users } from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  blogs: number;
  notes: number;
  leetcode: number;
  interviews: number;
}

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState<DashboardStats>({
    blogs: 0,
    notes: 0,
    leetcode: 0,
    interviews: 0,
  });

  useEffect(() => {
    if (isLoaded && user) {
      fetchStats();
    }
  }, [isLoaded, user]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Restricted
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to access the admin dashboard.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Sign In
          </Link>{" "}
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome to DevMastery Admin! 👋
              </h1>
              <p className="text-blue-100">
                Hello {user?.firstName || "Admin"}! You now have full access to
                manage your content and platform.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Code className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Dashboard Overview
          </h2>
          <p className="text-gray-500">
            Manage your content, track your progress, and grow your platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Blogs"
            value={stats.blogs}
            icon={FileText}
            color="blue"
            href="/admin/blogs"
          />
          <StatCard
            title="Notes"
            value={stats.notes}
            icon={StickyNote}
            color="green"
            href="/admin/notes"
          />
          <StatCard
            title="LeetCode Problems"
            value={stats.leetcode}
            icon={Code}
            color="purple"
            href="/admin/leetcode"
          />
          <StatCard
            title="Interview Notes"
            value={stats.interviews}
            icon={Users}
            color="orange"
            href="/admin/interviews"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                Created new blog post
              </span>
              <span className="text-xs text-gray-400">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                Added LeetCode solution
              </span>
              <span className="text-xs text-gray-400">5 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                Updated interview notes
              </span>
              <span className="text-xs text-gray-400">1 day ago</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionButton href="/admin/blogs/create" label="New Blog" />
            <QuickActionButton href="/admin/notes/create" label="New Note" />
            <QuickActionButton
              href="/admin/leetcode/create"
              label="Add Problem"
            />
            <QuickActionButton
              href="/admin/interviews/create"
              label="New Interview"
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon: Icon, color, href }: any) {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
  };

  return (
    <Link
      href={href}
      className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow block"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </Link>
  );
}

function QuickActionButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors"
    >
      <span className="text-sm font-medium text-gray-900">{label}</span>
    </Link>
  );
}
