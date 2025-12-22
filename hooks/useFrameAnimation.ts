"use client";

/**
 * useFrameAnimation hook - Scroll-synchronized frame animation.
 * Maps scroll progress to discrete frame indices for video-like playback.
 */

import { useState, useRef } from "react";
import {
  useScroll,
  useTransform,
  useMotionValueEvent,
  useInView,
} from "framer-motion";
import { clamp } from "@/lib/utils";
import type {
  UseFrameAnimationOptions,
  UseFrameAnimationReturn,
  ScrollDirection,
} from "@/types/animation";

/**
 * Maps scroll progress through a section to frame indices.
 * Creates video-like playback effect where scrolling advances/reverses frames.
 *
 * @param options - Configuration options
 * @param options.target - Reference to the target section element
 * @param options.totalFrames - Total number of frames in the sequence
 * @param options.offset - Scroll offset configuration (default: ["start end", "end start"])
 *
 * @returns Object containing:
 *   - frameIndex: MotionValue<number> (0 to totalFrames-1)
 *   - progress: MotionValue<number> (0-1)
 *   - direction: "up" | "down" | null
 *   - isActive: boolean indicating if animation is active
 *
 * @example
 * const sectionRef = useRef<HTMLElement>(null);
 * const { frameIndex, progress, direction, isActive } = useFrameAnimation({
 *   target: sectionRef,
 *   totalFrames: 192,
 * });
 *
 * // Use frameIndex to display correct frame
 * const currentFrame = useMotionTemplate`/frames/hero/frame_${frameIndex}.webp`;
 */
export function useFrameAnimation(
  options: UseFrameAnimationOptions
): UseFrameAnimationReturn {
  const { target, totalFrames, offset } = options;

  // Track scroll direction
  const [direction, setDirection] = useState<ScrollDirection>(null);
  const previousProgress = useRef(0);

  // Use Framer Motion's useScroll for section-scoped progress
  // Type assertion needed as Framer Motion expects specific string literals
  const { scrollYProgress } = useScroll({
    target,
    offset: (offset ?? ["start end", "end start"]) as [
      "start end",
      "end start",
    ],
  });

  // Transform progress (0-1) to frame index (0 to totalFrames-1)
  const frameIndex = useTransform(scrollYProgress, (progress) => {
    if (totalFrames <= 0) {
      return 0;
    }

    // Clamp progress to valid range
    const clampedProgress = clamp(progress, 0, 1);

    // Map progress to frame index
    // Use (totalFrames - 1) to ensure we never exceed the last valid index
    const index = Math.floor(clampedProgress * (totalFrames - 1));

    // Clamp to valid frame range as safety
    return clamp(index, 0, totalFrames - 1);
  });

  // Track direction changes - only update state when direction actually changes
  useMotionValueEvent(scrollYProgress, "change", (currentProgress) => {
    const newDirection =
      currentProgress > previousProgress.current
        ? "down"
        : currentProgress < previousProgress.current
          ? "up"
          : null;
    previousProgress.current = currentProgress;

    // Only trigger re-render if direction actually changed
    if (newDirection !== null && newDirection !== direction) {
      setDirection(newDirection);
    }
  });

  // Track if the section is in view (animation is active)
  const isActive = useInView(target, {
    once: false,
    amount: 0.01,
  });

  return {
    frameIndex,
    progress: scrollYProgress,
    direction,
    isActive,
  };
}

export default useFrameAnimation;
