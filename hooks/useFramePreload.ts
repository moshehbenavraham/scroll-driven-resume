"use client";

/**
 * useFramePreload hook - Priority-based frame preloading.
 * Loads first N frames with high priority, streams remainder in background.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import type {
  UseFramePreloadOptions,
  UseFramePreloadReturn,
} from "@/types/animation";

/**
 * Default number of frames to load with high priority.
 */
const DEFAULT_PRIORITY_COUNT = 10;

/**
 * Chunk size for background loading.
 */
const BACKGROUND_CHUNK_SIZE = 5;

/**
 * Preloads frame images with priority-based loading strategy.
 * First N frames are loaded immediately, remaining frames stream in background.
 *
 * @param options - Configuration options
 * @param options.frames - Array of frame URLs to preload
 * @param options.priorityCount - Number of frames to load with high priority (default: 10)
 * @param options.onProgress - Callback fired on progress updates (0-100)
 * @param options.onComplete - Callback fired when all frames are loaded
 * @param options.onError - Callback fired when a frame fails to load
 *
 * @returns Object containing:
 *   - isLoading: boolean indicating if preloading is in progress
 *   - isComplete: boolean indicating if all frames are loaded
 *   - progress: number (0-100) current progress percentage
 *   - loadedCount: number of frames loaded
 *   - totalCount: total number of frames
 *   - startPreload: function to manually trigger preloading
 *
 * @example
 * const frameUrls = generateFrameUrls('/frames/hero', 192, 'webp');
 * const preload = useFramePreload({
 *   frames: frameUrls,
 *   priorityCount: 10,
 *   onProgress: (percent) => console.log(`${percent}% loaded`),
 *   onComplete: () => console.log('All frames loaded!'),
 * });
 *
 * // Check status
 * if (preload.isComplete) {
 *   // Ready to animate
 * }
 */
export function useFramePreload(
  options: UseFramePreloadOptions
): UseFramePreloadReturn {
  const {
    frames,
    priorityCount = DEFAULT_PRIORITY_COUNT,
    onProgress,
    onComplete,
    onError,
  } = options;

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // Refs to track in-flight requests and prevent duplicates
  const loadedUrls = useRef<Set<string>>(new Set());
  const inFlightUrls = useRef<Set<string>>(new Set());
  const isMounted = useRef(true);

  // Calculate progress percentage
  const totalCount = frames.length;
  const progress =
    totalCount > 0 ? Math.round((loadedCount / totalCount) * 100) : 0;

  /**
   * Loads a single image and returns a promise.
   */
  const loadImage = useCallback(
    (url: string): Promise<void> => {
      return new Promise((resolve) => {
        // Skip if already loaded or in-flight
        if (loadedUrls.current.has(url) || inFlightUrls.current.has(url)) {
          resolve();
          return;
        }

        // Mark as in-flight
        inFlightUrls.current.add(url);

        const img = new Image();

        img.onload = () => {
          if (!isMounted.current) {
            return;
          }

          // Mark as loaded
          inFlightUrls.current.delete(url);
          loadedUrls.current.add(url);

          // Update count
          setLoadedCount((prev) => prev + 1);

          resolve();
        };

        img.onerror = () => {
          if (!isMounted.current) {
            return;
          }

          // Remove from in-flight
          inFlightUrls.current.delete(url);

          // Report error
          const error = new Error(`Failed to load image: ${url}`);
          onError?.(url, error);

          // Still resolve to continue loading other frames
          resolve();
        };

        img.src = url;
      });
    },
    [onError]
  );

  /**
   * Loads a chunk of images in parallel.
   */
  const loadChunk = useCallback(
    async (urls: string[]): Promise<void> => {
      await Promise.all(urls.map(loadImage));
    },
    [loadImage]
  );

  /**
   * Loads remaining frames in background using requestIdleCallback.
   */
  const loadBackgroundFrames = useCallback(
    (remainingUrls: string[]): void => {
      if (remainingUrls.length === 0) {
        return;
      }

      let index = 0;

      const loadNextChunk = () => {
        if (!isMounted.current || index >= remainingUrls.length) {
          return;
        }

        // Get next chunk
        const chunk = remainingUrls.slice(index, index + BACKGROUND_CHUNK_SIZE);
        index += BACKGROUND_CHUNK_SIZE;

        // Load chunk
        loadChunk(chunk).then(() => {
          if (isMounted.current && index < remainingUrls.length) {
            // Schedule next chunk during idle time
            if (typeof requestIdleCallback !== "undefined") {
              requestIdleCallback(loadNextChunk, { timeout: 2000 });
            } else {
              // Fallback for Safari
              setTimeout(loadNextChunk, 50);
            }
          }
        });
      };

      // Start background loading
      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(loadNextChunk, { timeout: 2000 });
      } else {
        setTimeout(loadNextChunk, 50);
      }
    },
    [loadChunk]
  );

  /**
   * Starts the preloading process.
   */
  const startPreload = useCallback(async (): Promise<void> => {
    if (isLoading || isComplete || frames.length === 0) {
      return;
    }

    setIsLoading(true);

    // Split frames into priority and background
    const priorityFrames = frames.slice(0, priorityCount);
    const backgroundFrames = frames.slice(priorityCount);

    // Load priority frames immediately (high priority)
    await loadChunk(priorityFrames);

    // Start background loading for remaining frames
    loadBackgroundFrames(backgroundFrames);
  }, [
    isLoading,
    isComplete,
    frames,
    priorityCount,
    loadChunk,
    loadBackgroundFrames,
  ]);

  // Track completion and fire callbacks
  // Using refs to avoid triggering additional renders
  const completionHandled = useRef(false);

  useEffect(() => {
    // Fire progress callback for intermediate updates
    if (loadedCount > 0 && loadedCount < totalCount) {
      onProgress?.(progress);
    }

    // Handle completion once
    if (
      loadedCount === totalCount &&
      totalCount > 0 &&
      !completionHandled.current
    ) {
      completionHandled.current = true;
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setIsLoading(false);
        setIsComplete(true);
      }, 0);
      onComplete?.();
    }
  }, [loadedCount, totalCount, progress, onProgress, onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    isLoading,
    isComplete,
    progress,
    loadedCount,
    totalCount,
    startPreload,
  };
}

export default useFramePreload;
