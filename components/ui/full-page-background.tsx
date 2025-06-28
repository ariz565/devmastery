"use client";
import React from "react";
import { Boxes } from "./background-boxes";
import { cn } from "@/lib/utils";

interface FullPageBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function FullPageBackground({
  children,
  className,
}: FullPageBackgroundProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen overflow-hidden",
        "bg-slate-950 dark:bg-slate-950", // Dark mode
        "light:bg-slate-50", // Light mode
        className
      )}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 w-full h-full">
        <Boxes />
      </div>

      {/* Gradient overlay for better text readability */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          "bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950/60", // Dark mode
          "light:bg-gradient-to-b light:from-slate-50/80 light:via-slate-50/60 light:to-slate-50/80" // Light mode
        )}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
