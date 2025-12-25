"use client";

/**
 * useFrameSequence hook - Integration hook for scroll-synchronized frame animation.
 * Combines useFrameAnimation, useFramePreload, and store management for easy component use.
 */

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useMotionValueEvent } from "framer-motion";
import { useFrameAnimation } from "./useFrameAnimation";
import { useFramePreload } from "./useFramePreload";
import { useAnimationStore } from "@/stores/animation-store";
import {
  generateFrameUrls,
  getOptimalQuality,
  createMobileMediaQuery,
} from "@/lib/frame-utils";
import {
  FRAME_COUNTS,
  type UseFrameSequenceOptions,
  type UseFrameSequenceReturn,
  type FrameQuality,
} from "@/types/animation";

// Re-export FRAME_COUNTS for convenience
export { FRAME_COUNTS };

/**
 * Integration hook for scroll-synchronized frame animation.
 * Combines scroll tracking, preloading, and state management.
 *
 * @param options - Configuration options
 * @returns Frame sequence state and controls
 *
 * @example
 * const sectionRef = useRef<HTMLElement>(null);
 * const {
 *   currentFrame,
 *   frameUrls,
 *   isReady,
 *   startPreload
 * } = useFrameSequence({
 *   sequence: "hero",
 *   containerRef: sectionRef,
 * });
 *
 * // Start preloading when component mounts
 * useEffect(() => {
 *   startPreload();
 * }, [startPreload]);
 */
export function useFrameSequence(
  options: UseFrameSequenceOptions
): UseFrameSequenceReturn {
  const {
    sequence,
    containerRef,
    priorityCount = 10,
    offset,
    onProgress,
    onComplete,
  } = options;

  // Get frame count for this sequence
  const totalFrames = FRAME_COUNTS[sequence] ?? 0;

  // Detect mobile and reduced motion using lazy initializer for SSR safety
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return getOptimalQuality() === "mobile";
  });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  // Store actions
  const {
    setSequenceFrame,
    setSequenceActive,
    setSequenceLoadProgress,
    setSequenceLoaded,
    setSequenceDirection,
    prefersReducedMotion: storePrefersReducedMotion,
  } = useAnimationStore();

  // Subscribe to media query changes
  useEffect(() => {
    const mobileQuery = createMobileMediaQuery();
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleMobileChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mobileQuery?.addEventListener("change", handleMobileChange);
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      mobileQuery?.removeEventListener("change", handleMobileChange);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  // Determine quality based on viewport
  const quality: FrameQuality = isMobile ? "mobile" : "desktop";

  // Generate frame URLs
  const frameUrls = useMemo(() => {
    if (totalFrames === 0) {
      return [];
    }
    return generateFrameUrls({
      sequence,
      totalFrames,
      quality,
    });
  }, [sequence, totalFrames, quality]);

  // Should animation be disabled?
  const shouldDisable =
    prefersReducedMotion || storePrefersReducedMotion || isMobile;

  // Frame animation hook (only active when not disabled)
  const { frameIndex, direction, isActive } = useFrameAnimation({
    target: containerRef,
    totalFrames: shouldDisable ? 1 : totalFrames,
    offset,
  });

  // Track current frame from motion value - only update when frame actually changes
  const [currentFrame, setCurrentFrame] = useState(0);
  const lastFrameRef = useRef(0);

  useMotionValueEvent(frameIndex, "change", (latest) => {
    const frame = Math.round(latest);
    // Only trigger re-render if frame actually changed
    if (frame !== lastFrameRef.current) {
      lastFrameRef.current = frame;
      setCurrentFrame(frame);
      setSequenceFrame(sequence, frame);
    }
  });

  // Sync direction to store
  useEffect(() => {
    setSequenceDirection(sequence, direction);
  }, [sequence, direction, setSequenceDirection]);

  // Sync isActive to store
  useEffect(() => {
    setSequenceActive(sequence, isActive);
  }, [sequence, isActive, setSequenceActive]);

  // Preload progress handler
  const handleProgress = useCallback(
    (percent: number) => {
      setSequenceLoadProgress(sequence, percent);
      onProgress?.(percent);
    },
    [sequence, setSequenceLoadProgress, onProgress]
  );

  // Preload complete handler
  const handleComplete = useCallback(() => {
    setSequenceLoaded(sequence, true);
    onComplete?.();
  }, [sequence, setSequenceLoaded, onComplete]);

  // Preload hook
  const {
    isLoading,
    isComplete: isReady,
    progress: loadProgress,
    startPreload,
  } = useFramePreload({
    frames: frameUrls,
    priorityCount,
    onProgress: handleProgress,
    onComplete: handleComplete,
  });

  return {
    currentFrame: shouldDisable ? 0 : currentFrame,
    frameUrls,
    isLoading,
    isReady,
    loadProgress,
    direction,
    isActive,
    prefersReducedMotion: prefersReducedMotion || storePrefersReducedMotion,
    isMobile,
    startPreload,
  };
}

export default useFrameSequence;
