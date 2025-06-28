"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Settings,
  LogOut,
  Crown,
  Shield,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserProfileProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: "admin" | "user";
    isLoggedIn: boolean;
  };
  onLogin?: () => void;
  onLogout?: () => void;
  onSignUp?: () => void;
}

export function UserProfile({
  user,
  onLogin,
  onLogout,
  onSignUp,
}: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user?.isLoggedIn) {
    return (
      <div className="flex items-center space-x-3">
        <button
          onClick={onLogin}
          className="px-4 py-2 text-white/80 hover:text-white transition-colors font-medium"
        >
          Sign In
        </button>
        <button
          onClick={onSignUp}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
        >
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 group"
      >
        <div className="relative">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
          {user.role === "admin" && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
              <Crown className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-black/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* User Info Header - Minimal */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-center">
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                {user.role === "admin" && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Crown className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <a
              href="/profile"
              className="flex items-center space-x-3 w-full p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Profile Settings</span>
            </a>

            <a
              href="/preferences"
              className="flex items-center space-x-3 w-full p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Preferences</span>
            </a>

            {user.role === "admin" && (
              <a
                href="/admin"
                className="flex items-center space-x-3 w-full p-3 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </a>
            )}

            <hr className="my-2 border-white/10" />

            <button
              onClick={onLogout}
              className="flex items-center space-x-3 w-full p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
