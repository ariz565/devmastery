"use client";

import React from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { Button } from "./ui/stateful-button";
import { UserPlus, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthButtonProps {
  className?: string;
  redirectTo?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary";
}

export function AuthButton({
  className,
  redirectTo = "/topics",
  children = "Get Started",
  variant = "primary",
}: AuthButtonProps) {
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const handleClick = async () => {
    // Add a small delay to show the loading animation
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (isSignedIn) {
      // User is already signed in, redirect to the specified page
      await router.push(redirectTo);
    } else {
      // User is not signed in, open the sign-in modal
      openSignIn({
        afterSignInUrl: redirectTo,
        afterSignUpUrl: redirectTo,
      });
    }
  };

  // Always show the children text (e.g., "Get Started") for consistency
  const buttonText = children;
  const icon = isSignedIn ? null : <UserPlus className="w-4 h-4" />;

  return (
    <Button
      onClick={handleClick}
      className={cn(
        "font-semibold rounded-full transition-all duration-300 shadow-lg",
        variant === "primary"
          ? "bg-white text-gray-900 hover:bg-gray-100"
          : "bg-gray-800/60 backdrop-blur-sm text-white border border-gray-700/50 hover:bg-gray-800",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{buttonText}</span>
        {!isSignedIn && (
          <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        )}
      </div>
    </Button>
  );
}
