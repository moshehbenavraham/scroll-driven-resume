"use client";

/**
 * useScrollProgress hook - Section-scoped scroll progress tracking.
 * Returns a 0-1 MotionValue representing scroll progress through a target section.
 */

import { useScroll, useInView } from "framer-motion";
import type {
  UseScrollProgressOptions,
  UseScrollProgressReturn,
} from "@/types/animation";

/**
 * Tracks scroll progress through a target section element.
 * Returns progress as a MotionValue (0-1) and whether the section is in view.
 *
 * @param options - Configuration options
 * @param options.target - Reference to the target section element
 * @param options.offset - Scroll offset configuration (default: ["start end", "end start"])
 *
 * @returns Object containing:
 *   - progress: MotionValue<number> (0 before section, 0-1 during, 1 after)
 *   - isInView: boolean indicating if section is currently visible
 *
 * @example
 * const sectionRef = useRef<HTMLElement>(null);
 * const { progress, isInView } = useScrollProgress({
 *   target: sectionRef,
 * });
 *
 * // Use in motion component
 * <motion.div style={{ opacity: progress }} />
 */
export function useScrollProgress(
  options: UseScrollProgressOptions
): UseScrollProgressReturn {
  const { target, offset } = options;

  // Use Framer Motion's useScroll for section-scoped progress
  // Type assertion needed as Framer Motion expects specific string literals
  const { scrollYProgress } = useScroll({
    target,
    offset: (offset ?? ["start end", "end start"]) as [
      "start end",
      "end start",
    ],
  });

  // Track if the section is in view
  const isInView = useInView(target, {
    once: false,
    amount: 0.01, // Trigger when even 1% is visible
  });

  return {
    progress: scrollYProgress,
    isInView,
  };
}

export default useScrollProgress;
