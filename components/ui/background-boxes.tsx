"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);

  // Light theme colors
  const lightColors = [
    "rgb(59 130 246)", // blue-500
    "rgb(168 85 247)", // purple-500
    "rgb(34 197 94)", // green-500
    "rgb(251 191 36)", // amber-500
    "rgb(239 68 68)", // red-500
    "rgb(6 182 212)", // cyan-500
    "rgb(245 101 101)", // rose-500
    "rgb(139 92 246)", // violet-500
    "rgb(16 185 129)", // emerald-500
  ];

  // Dark theme colors
  const darkColors = [
    "rgb(147 197 253)", // blue-300
    "rgb(249 168 212)", // pink-300
    "rgb(134 239 172)", // green-300
    "rgb(253 224 71)", // yellow-300
    "rgb(252 165 165)", // red-300
    "rgb(212 180 254)", // purple-300
    "rgb(147 197 253)", // blue-300
    "rgb(165 180 252)", // indigo-300
    "rgb(196 181 253)", // violet-300
  ];

  const getRandomColor = () => {
    // Check if we're in light mode (with SSR safety)
    const isLight =
      typeof window !== "undefined" &&
      document.documentElement.classList.contains("light");
    const colors = isLight ? lightColors : darkColors;
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      className={cn(
        "absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4",
        "[transform:translate(-40%,-60%)_skewX(-48deg)_skewY(14deg)_scale(0.675)_rotate(0deg)_translateZ(0)]",
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="relative h-8 w-16 border-l border-slate-700 dark:border-slate-700 light:border-slate-300"
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: `${getRandomColor()}`,
                transition: { duration: 0 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col` + j}
              className="relative h-8 w-16 border-t border-r border-slate-700 dark:border-slate-700 light:border-slate-300"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] text-slate-700 dark:text-slate-700 light:text-slate-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
