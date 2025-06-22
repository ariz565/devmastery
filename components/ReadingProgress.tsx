import { useState, useEffect, useRef } from "react";

interface ReadingProgressProps {
  target?: React.RefObject<HTMLElement>;
  className?: string;
  position?: "top" | "left";
}

const ReadingProgress = ({
  target,
  className = "",
  position = "top",
}: ReadingProgressProps) => {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateProgress = () => {
      const element = target?.current || document.documentElement;
      const totalHeight = element.scrollHeight - element.clientHeight;
      const windowScrollTop = target?.current
        ? target.current.scrollTop
        : window.pageYOffset;

      if (totalHeight === 0) {
        setProgress(0);
        return;
      }

      const progress = (windowScrollTop / totalHeight) * 100;
      const clampedProgress = Math.min(100, Math.max(0, progress));
      setProgress(clampedProgress);

      // Update CSS custom property
      if (progressRef.current) {
        progressRef.current.style.setProperty(
          "--progress",
          `${clampedProgress}%`
        );
      }
    };

    const throttledCalculateProgress = throttle(calculateProgress, 10);

    if (target?.current) {
      target.current.addEventListener("scroll", throttledCalculateProgress);
    } else {
      window.addEventListener("scroll", throttledCalculateProgress);
    }

    // Calculate initial progress
    calculateProgress();

    return () => {
      if (target?.current) {
        target.current.removeEventListener(
          "scroll",
          throttledCalculateProgress
        );
      } else {
        window.removeEventListener("scroll", throttledCalculateProgress);
      }
    };
  }, [target]);

  // Simple throttle function
  function throttle(func: Function, limit: number) {
    let inThrottle: boolean;
    return function (this: any) {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
  if (position === "top") {
    return (
      <div
        className={`fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50 ${className}`}
      >
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-150 ease-out shadow-sm progress-bar-width"
        />
      </div>
    );
  }

  if (position === "left") {
    return (
      <div
        className={`fixed left-0 top-0 w-1 h-full bg-gray-200 dark:bg-gray-700 z-40 ${className}`}
      >
        <div
          ref={progressRef}
          className="w-full bg-gradient-to-b from-blue-500 to-purple-600 transition-all duration-150 ease-out shadow-sm progress-bar-height"
        />
      </div>
    );
  }

  return null;
};

export default ReadingProgress;
