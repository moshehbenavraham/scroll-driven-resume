"use client";

/**
 * useUnifiedFrameAnimation - Combines frame sequence logic with Three.js texture management.
 *
 * Provides scroll-synchronized frame animation with GPU-accelerated texture rendering.
 * Used by UnifiedHeroCanvas to render frame sequences directly in WebGL.
 */

import { useEffect, useMemo, useCallback, useRef, useState } from "react";
import { useMotionValueEvent } from "framer-motion";
import type * as THREE from "three";
import { useFrameAnimation } from "./useFrameAnimation";
import { useFramePreload } from "./useFramePreload";
import { useTextureLoader } from "./useTextureLoader";
import { useAnimationStore } from "@/stores/animation-store";
import {
  generateFrameUrls,
  getOptimalQuality,
  createMobileMediaQuery,
} from "@/lib/frame-utils";
import type {
  FrameSequenceId,
  FrameQuality,
  ScrollDirection,
  ScrollOffset,
} from "@/types/animation";

/**
 * Frame counts for each sequence.
 */
const SEQUENCE_FRAME_COUNTS: Record<string, number> = {
  hero: 192,
  product: 144,
};

/**
 * Options for useUnifiedFrameAnimation hook.
 */
export interface UseUnifiedFrameAnimationOptions {
  /** Sequence identifier (hero or product) */
  sequence: FrameSequenceId;
  /** Reference to container element for scroll tracking */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Number of priority frames to load first. Default: 10 */
  priorityCount?: number;
  /** Scroll offset configuration */
  offset?: ScrollOffset;
  /** Callback on preload progress */
  onProgress?: (percent: number) => void;
  /** Callback when preload completes */
  onComplete?: () => void;
}

/**
 * Return value from useUnifiedFrameAnimation hook.
 */
export interface UseUnifiedFrameAnimationReturn {
  /** Current Three.js texture for the active frame */
  currentTexture: THREE.Texture | null;
  /** Current frame index */
  currentFrame: number;
  /** Frame URLs for the sequence */
  frameUrls: string[];
  /** Current scroll direction */
  direction: ScrollDirection;
  /** Whether animation is active (section in view) */
  isActive: boolean;
  /** Whether the sequence is ready (priority frames loaded) */
  isReady: boolean;
  /** Load progress (0-100) */
  loadProgress: number;
  /** Whether device is mobile */
  isMobile: boolean;
  /** Whether reduced motion is preferred */
  prefersReducedMotion: boolean;
  /** Start preloading manually */
  startPreload: () => void;
  /** Preload textures near current frame */
  preloadNearby: (frame: number) => void;
}

/**
 * Integration hook for scroll-synchronized frame animation with WebGL textures.
 *
 * Combines:
 * - useFrameAnimation for scroll tracking
 * - useFramePreload for image loading
 * - useTextureLoader for Three.js texture management
 *
 * @param options - Configuration options
 * @returns Frame animation state with texture management
 *
 * @example
 * const { currentTexture, currentFrame, isReady } = useUnifiedFrameAnimation({
 *   sequence: "hero",
 *   containerRef: sectionRef,
 * });
 *
 * // In Three.js useFrame
 * if (currentTexture) {
 *   planeMesh.material.map = currentTexture;
 * }
 */
export function useUnifiedFrameAnimation(
  options: UseUnifiedFrameAnimationOptions
): UseUnifiedFrameAnimationReturn {
  const {
    sequence,
    containerRef,
    priorityCount = 10,
    offset,
    onProgress,
    onComplete,
  } = options;

  // Get frame count for this sequence
  const totalFrames = SEQUENCE_FRAME_COUNTS[sequence] ?? 0;

  // Detect mobile and reduced motion
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

    const handleMobileChange = (e: MediaQueryListEvent) =>
      setIsMobile(e.matches);
    const handleMotionChange = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);

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

  // Frame animation hook
  const { frameIndex, direction, isActive } = useFrameAnimation({
    target: containerRef,
    totalFrames: shouldDisable ? 1 : totalFrames,
    offset,
  });

  // Track current frame from motion value
  const [currentFrame, setCurrentFrame] = useState(0);
  const lastFrameRef = useRef(0);

  useMotionValueEvent(frameIndex, "change", (latest) => {
    const frame = Math.round(latest);
    if (frame !== lastFrameRef.current) {
      lastFrameRef.current = frame;
      // Defer state updates to avoid updating during render
      queueMicrotask(() => {
        setCurrentFrame(frame);
        setSequenceFrame(sequence, frame);
      });
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

  // Preload hook - loads images into browser cache
  const {
    isComplete: isReady,
    progress: loadProgress,
    startPreload,
  } = useFramePreload({
    frames: frameUrls,
    priorityCount,
    onProgress: handleProgress,
    onComplete: handleComplete,
  });

  // Texture loader hook - converts images to Three.js textures
  const { getTexture, preloadNearby, loadedCount } = useTextureLoader({
    frameUrls,
    priorityCount,
    enabled: !shouldDisable && frameUrls.length > 0,
  });

  // Get current texture - re-run when loadedCount changes (images finish loading)
  const currentTexture = useMemo(() => {
    if (shouldDisable) {
      return getTexture(0);
    }
    return getTexture(currentFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTexture, currentFrame, shouldDisable, loadedCount]);

  // Preload nearby textures when frame changes
  useEffect(() => {
    if (!shouldDisable) {
      preloadNearby(currentFrame);
    }
  }, [currentFrame, preloadNearby, shouldDisable]);

  return {
    currentTexture,
    currentFrame: shouldDisable ? 0 : currentFrame,
    frameUrls,
    direction,
    isActive,
    isReady,
    loadProgress,
    isMobile,
    prefersReducedMotion: prefersReducedMotion || storePrefersReducedMotion,
    startPreload,
    preloadNearby,
  };
}

export default useUnifiedFrameAnimation;
