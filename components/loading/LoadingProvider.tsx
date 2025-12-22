"use client";

/**
 * LoadingProvider component - Manages preload lifecycle.
 * Connects useFramePreload hook to loading store.
 * Orchestrates the loading screen and content reveal.
 */

import { useEffect, useCallback, useState, type ReactNode } from "react";
import { useFramePreload } from "@/hooks/useFramePreload";
import { useLoadingStore } from "@/stores/loading-store";
import { LoadingScreen } from "./LoadingScreen";
import { ContentReveal } from "./ContentReveal";

/**
 * Props for LoadingProvider component.
 */
export interface LoadingProviderProps {
  /** Content to render after loading */
  children: ReactNode;
  /** Array of frame URLs to preload (optional) */
  frameUrls?: string[];
  /** Whether to start preloading automatically (default: true) */
  autoStart?: boolean;
  /** Minimum loading time in ms to prevent flash (default: 500) */
  minLoadingTime?: number;
}

/**
 * Loading provider that orchestrates preloading and content reveal.
 * Connects useFramePreload hook to the loading store.
 * Handles edge cases like zero frames and network errors gracefully.
 */
export function LoadingProvider({
  children,
  frameUrls = [],
  autoStart = true,
  minLoadingTime = 500,
}: LoadingProviderProps) {
  const { setProgress, setComplete, reset } = useLoadingStore();
  const isLoading = useLoadingStore((state) => state.isLoading);
  const progress = useLoadingStore((state) => state.progress);

  // Track if content should be revealed (after exit animation)
  const [isContentRevealed, setIsContentRevealed] = useState(false);

  // Track minimum loading time
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Handle progress updates from preload hook
  const handleProgress = useCallback(
    (progressValue: number) => {
      setProgress(progressValue);
    },
    [setProgress]
  );

  // Handle preload completion
  const handleComplete = useCallback(() => {
    // Only set complete if minimum time has elapsed
    if (minTimeElapsed) {
      setComplete();
    }
  }, [minTimeElapsed, setComplete]);

  // Handle preload errors
  const handleError = useCallback((url: string, error: Error) => {
    console.warn(`Failed to preload: ${url}`, error);
    // Don't fail loading on individual frame errors
    // Continue gracefully
  }, []);

  // Initialize preload hook
  const { isComplete: preloadComplete, startPreload } = useFramePreload({
    frames: frameUrls,
    onProgress: handleProgress,
    onComplete: handleComplete,
    onError: handleError,
  });

  // Start minimum loading timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, minLoadingTime);

    return () => clearTimeout(timer);
  }, [minLoadingTime]);

  // Handle completion when both preload and min time are done
  useEffect(() => {
    if (preloadComplete && minTimeElapsed) {
      setComplete();
    }
  }, [preloadComplete, minTimeElapsed, setComplete]);

  // Auto-start preloading
  useEffect(() => {
    if (autoStart) {
      // Handle edge case: zero frames to preload
      if (frameUrls.length === 0) {
        setProgress(100);
        // Still wait for minimum time
        if (minTimeElapsed) {
          setComplete();
        }
      } else {
        startPreload();
      }
    }
  }, [
    autoStart,
    frameUrls.length,
    startPreload,
    setProgress,
    setComplete,
    minTimeElapsed,
  ]);

  // Reset store on unmount
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  // Handle loading screen exit animation complete
  const handleExitComplete = useCallback(() => {
    setIsContentRevealed(true);
  }, []);

  return (
    <>
      {/* Loading overlay */}
      <LoadingScreen
        isLoading={isLoading}
        progress={progress}
        onExitComplete={handleExitComplete}
      />

      {/* Content with reveal animation */}
      <ContentReveal isRevealed={isContentRevealed}>{children}</ContentReveal>
    </>
  );
}

export default LoadingProvider;
