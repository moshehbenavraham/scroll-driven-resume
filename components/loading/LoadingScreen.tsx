"use client";

/**
 * LoadingScreen component - Full-screen loading overlay.
 * Covers viewport with dark overlay during asset loading.
 * Uses AnimatePresence for smooth exit animation.
 */

import { AnimatePresence, motion } from "framer-motion";
import { LoadingLogo } from "./LoadingLogo";
import { LoadingProgress } from "./LoadingProgress";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Props for LoadingScreen component.
 */
export interface LoadingScreenProps {
  /** Whether loading is in progress */
  isLoading: boolean;
  /** Current progress value (0-100) */
  progress: number;
  /** Callback fired when exit animation completes */
  onExitComplete?: () => void;
}

/**
 * Animation variants for the loading overlay.
 */
const overlayVariants = {
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
};

/**
 * Full-screen loading overlay with logo and progress bar.
 * Blocks pointer events during loading.
 * Fades out with 0.5s ease-out transition when complete.
 */
export function LoadingScreen({
  isLoading,
  progress,
  onExitComplete,
}: LoadingScreenProps) {
  const prefersReducedMotion = useReducedMotion();

  // Determine animation duration
  const exitDuration = prefersReducedMotion ? 0 : 0.5;

  return (
    <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
      {isLoading ? (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-neutral-950/95 backdrop-blur-sm"
          initial="visible"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          transition={{
            duration: exitDuration,
            ease: "easeOut",
          }}
          style={{
            pointerEvents: "all",
          }}
          aria-live="polite"
          aria-busy={isLoading}
          role="status"
        >
          {/* Logo */}
          <LoadingLogo className="mb-8" />

          {/* Progress bar */}
          <LoadingProgress progress={progress} showPercentage />

          {/* Screen reader text */}
          <span className="sr-only">
            Loading... {Math.round(progress)}% complete
          </span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default LoadingScreen;
