"use client";

/**
 * LoadingProgress component - Animated progress bar with percentage.
 * Shows loading progress with smooth animated transitions.
 */

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

/**
 * Props for LoadingProgress component.
 */
export interface LoadingProgressProps {
  /** Current progress value (0-100) */
  progress: number;
  /** Whether to show the percentage text (default: true) */
  showPercentage?: boolean;
  /** Optional custom className for styling */
  className?: string;
}

/**
 * Spring configuration for smooth progress animation.
 */
const SPRING_CONFIG = {
  stiffness: 100,
  damping: 30,
  restDelta: 0.001,
};

/**
 * Loading progress bar with smooth spring animation.
 * Uses Framer Motion useSpring for buttery smooth progress updates.
 */
export function LoadingProgress({
  progress,
  showPercentage = true,
  className = "",
}: LoadingProgressProps) {
  // Create spring-animated progress value
  const springProgress = useSpring(0, SPRING_CONFIG);

  // Transform spring value to percentage string
  const displayProgress = useTransform(springProgress, (value) =>
    Math.round(value)
  );

  // Update spring when progress changes
  useEffect(() => {
    springProgress.set(progress);
  }, [progress, springProgress]);

  return (
    <div className={`w-full max-w-xs ${className}`}>
      {/* Progress bar container */}
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
        {/* Animated progress fill */}
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full bg-neutral-900 dark:bg-neutral-100"
          style={{
            width: useTransform(springProgress, (value) => `${value}%`),
          }}
        />
      </div>

      {/* Percentage text */}
      {showPercentage ? (
        <div className="mt-3 text-center">
          <motion.span className="text-sm font-medium tabular-nums text-neutral-600 dark:text-neutral-400">
            <motion.span>{displayProgress}</motion.span>%
          </motion.span>
        </div>
      ) : null}
    </div>
  );
}

export default LoadingProgress;
