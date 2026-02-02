"use client";

/**
 * LoadingLogo component - Centered logo placeholder for loading screen.
 * Displays a simple text or SVG logo that can be replaced with actual branding.
 */

import { motion } from "framer-motion";

/**
 * Props for LoadingLogo component.
 */
export interface LoadingLogoProps {
  /** Optional custom text to display (default: "AI") */
  text?: string;
  /** Optional custom className for styling */
  className?: string;
}

/**
 * Loading logo with subtle pulse animation.
 * Uses a simple monogram as placeholder for actual logo.
 */
export function LoadingLogo({ text = "AI", className = "" }: LoadingLogoProps) {
  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
        <span className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {text}
        </span>
      </div>
    </motion.div>
  );
}

export default LoadingLogo;
