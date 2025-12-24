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

// ============================================================================
// Retry and Timeout Constants (T004)
// ============================================================================

/**
 * Maximum number of retry attempts for failed frame loads.
 */
const MAX_RETRIES = 3;

/**
 * Exponential backoff delays in milliseconds for retries.
 * Delay = 1000 * 2^(attempt-1) => [1000, 2000, 4000]
 */
const RETRY_DELAYS = [1000, 2000, 4000];

/**
 * Overall timeout in milliseconds before forcing completion.
 * 30 seconds provides reasonable time for slow networks.
 */
const OVERALL_TIMEOUT = 30000;

/**
 * Success threshold (0-1) for triggering early completion.
 * At 80%+ success rate, proceed without waiting for retries.
 */
const SUCCESS_THRESHOLD = 0.8;

/**
 * Maximum concurrent retry operations to prevent resource exhaustion.
 */
const MAX_CONCURRENT_RETRIES = 3;

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

  // ============================================================================
  // Retry and Completion Tracking Refs (T005, T006)
  // ============================================================================

  /**
   * Track retry timeout handles for cleanup on unmount.
   */
  const retryTimeouts = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  /**
   * Track the overall timeout handle for cleanup.
   */
  const overallTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Map of failed URLs to their retry attempt count.
   * Used to track which frames need retrying and how many attempts made.
   */
  const failedUrls = useRef<Map<string, number>>(new Map());

  /**
   * Count of all frame load attempts (success or failure).
   * Used to determine when all frames have been processed.
   */
  const attemptedCount = useRef<number>(0);

  /**
   * Count of successfully loaded frames.
   * Used for progress calculation and success threshold check.
   */
  const successCount = useRef<number>(0);

  /**
   * Current number of active retry operations.
   * Prevents retry stacking by limiting concurrent retries.
   */
  const activeRetryCount = useRef<number>(0);

  /**
   * Flag to indicate timeout has fired.
   */
  const timeoutFired = useRef<boolean>(false);

  // ============================================================================
  // Helper Functions (T007, T008)
  // ============================================================================

  /**
   * Calculates exponential backoff delay for retry attempts.
   * @param attempt - The retry attempt number (1-based)
   * @returns Delay in milliseconds
   */
  const calculateBackoffDelay = useCallback((attempt: number): number => {
    const index = Math.min(attempt - 1, RETRY_DELAYS.length - 1);
    return RETRY_DELAYS[index];
  }, []);

  /**
   * Determines if completion conditions are met.
   * Completion triggers when:
   * 1. All frames have been attempted (success or permanent failure), OR
   * 2. 80%+ success rate achieved with no pending initial loads, OR
   * 3. Overall timeout has fired
   *
   * @param total - Total number of frames
   * @returns Boolean indicating if completion should trigger
   */
  const shouldComplete = useCallback((total: number): boolean => {
    if (total === 0) {
      return true;
    }

    // Timeout forces completion
    if (timeoutFired.current) {
      return true;
    }

    const attempted = attemptedCount.current;
    const successful = successCount.current;
    const pendingRetries = failedUrls.current.size;

    // All initial loads complete (retries may still be pending)
    const allInitialAttempted = attempted >= total;

    // Check success threshold (80%)
    const successRate = successful / total;
    const meetsThreshold = successRate >= SUCCESS_THRESHOLD;

    // Complete if all attempted and either no retries or threshold met
    if (allInitialAttempted && (pendingRetries === 0 || meetsThreshold)) {
      return true;
    }

    return false;
  }, []);

  // Calculate progress percentage
  const totalCount = frames.length;
  const progress =
    totalCount > 0 ? Math.round((loadedCount / totalCount) * 100) : 0;

  // ============================================================================
  // Retry Load Function (T011)
  // ============================================================================

  /**
   * Ref to hold the retry function for recursive calls.
   */
  const scheduleRetryRef = useRef<((url: string, attempt: number) => void) | null>(null);

  /**
   * Attempts to retry loading a failed image with exponential backoff.
   * Uses a ref for recursive calls to avoid ESLint warnings.
   * @param url - The URL of the failed image
   * @param attempt - The current retry attempt number (1-based)
   */
  const scheduleRetry = useCallback(
    (url: string, attempt: number): void => {
      // Check if we should still retry
      if (!isMounted.current) {
        return;
      }
      if (attempt > MAX_RETRIES) {
        return;
      }
      if (activeRetryCount.current >= MAX_CONCURRENT_RETRIES) {
        // Queue for later - mark as permanently failed for now
        failedUrls.current.delete(url);
        return;
      }

      const delay = calculateBackoffDelay(attempt);
      activeRetryCount.current += 1;

      const timeoutId = setTimeout(() => {
        if (!isMounted.current) {
          activeRetryCount.current -= 1;
          return;
        }

        // Remove from retry timeouts tracking
        retryTimeouts.current.delete(timeoutId);

        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
          if (!isMounted.current) {
            activeRetryCount.current -= 1;
            return;
          }

          // Success! Remove from failed, add to loaded
          failedUrls.current.delete(url);
          loadedUrls.current.add(url);
          successCount.current += 1;
          activeRetryCount.current -= 1;

          // Update displayed count
          setLoadedCount((prev) => prev + 1);
        };

        img.onerror = () => {
          if (!isMounted.current) {
            activeRetryCount.current -= 1;
            return;
          }

          activeRetryCount.current -= 1;

          // Check if we have more retries
          if (attempt < MAX_RETRIES) {
            failedUrls.current.set(url, attempt + 1);
            // Use ref for recursive call
            scheduleRetryRef.current?.(url, attempt + 1);
          } else {
            // Max retries exhausted - mark as permanently failed
            failedUrls.current.delete(url);
            onError?.(url, new Error(`Failed to load image after ${MAX_RETRIES} retries: ${url}`));
          }
        };

        img.src = url;
      }, delay);

      // Track timeout for cleanup
      retryTimeouts.current.add(timeoutId);
    },
    [onError, calculateBackoffDelay]
  );

  // Update ref to current function
  scheduleRetryRef.current = scheduleRetry;

  // ============================================================================
  // Load Image Function (T009, T010)
  // ============================================================================

  /**
   * Loads a single image and returns a promise.
   * Tracks both attempted and successful loads separately.
   * Schedules retries for failed loads.
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
        // Enable CORS for WebGL texture usage
        img.crossOrigin = "anonymous";

        img.onload = () => {
          if (!isMounted.current) {
            return;
          }

          // Mark as loaded
          inFlightUrls.current.delete(url);
          loadedUrls.current.add(url);

          // Track both attempted and successful (T009)
          attemptedCount.current += 1;
          successCount.current += 1;

          // Update displayed count
          setLoadedCount((prev) => prev + 1);

          resolve();
        };

        img.onerror = () => {
          if (!isMounted.current) {
            return;
          }

          // Remove from in-flight
          inFlightUrls.current.delete(url);

          // Track as attempted (T009)
          attemptedCount.current += 1;

          // Report initial error
          const error = new Error(`Failed to load image: ${url}`);
          onError?.(url, error);

          // Schedule retry with exponential backoff (T010)
          failedUrls.current.set(url, 1);
          scheduleRetry(url, 1);

          // Resolve to continue loading other frames
          resolve();
        };

        img.src = url;
      });
    },
    [onError, scheduleRetry]
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
   * Forces completion after timeout, regardless of pending loads.
   * Called by the overall timeout (T012).
   */
  const forceCompletion = useCallback((): void => {
    if (!isMounted.current) {
      return;
    }
    if (completionHandled.current) {
      return;
    }

    // Mark completion as handled
    const completionRef = completionHandled;
    const timeoutRef = timeoutFired;
    timeoutRef.current = true;
    completionRef.current = true;

    // Clear all pending retry timeouts
    const retryRef = retryTimeouts.current;
    retryRef.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    retryRef.clear();
    failedUrls.current.clear();
    activeRetryCount.current = 0;

    // Clear overall timeout ref
    overallTimeout.current = null;

    // Force state update to trigger completion
    setIsLoading(false);
    setIsComplete(true);
    onComplete?.();
  }, [onComplete]);

  /**
   * Starts the preloading process.
   * Sets up overall timeout as safety net (T012).
   */
  const startPreload = useCallback(async (): Promise<void> => {
    if (isLoading || isComplete || frames.length === 0) {
      return;
    }

    setIsLoading(true);

    // Reset tracking refs for fresh start
    attemptedCount.current = 0;
    successCount.current = 0;
    failedUrls.current.clear();
    timeoutFired.current = false;

    // Set up overall timeout as safety net (T012)
    overallTimeout.current = setTimeout(() => {
      if (isMounted.current) {
        forceCompletion();
      }
    }, OVERALL_TIMEOUT);

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
    forceCompletion,
  ]);

  // ============================================================================
  // Completion and Progress Tracking (T014, T016)
  // ============================================================================

  // Track completion and fire callbacks
  // Using refs to avoid triggering additional renders
  const completionHandled = useRef(false);
  const lastProgressRef = useRef(-1);

  /**
   * Handles completion when conditions are met.
   * Separated to avoid ESLint immutability warnings in useEffect.
   */
  const handleCompletion = useCallback(() => {
    if (completionHandled.current) {
      return;
    }
    // eslint-disable-next-line react-hooks/immutability -- Intentional ref mutation for completion tracking
    completionHandled.current = true;

    // Clear overall timeout since we are completing
    const timeout = overallTimeout.current;
    if (timeout) {
      clearTimeout(timeout);
      overallTimeout.current = null;
    }

    // Clear any pending retries
    const retriesSet = retryTimeouts.current;
    retriesSet.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    retriesSet.clear();

    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      if (isMounted.current) {
        setIsLoading(false);
        setIsComplete(true);
      }
    }, 0);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    // Fire progress callback when progress changes (T016)
    if (progress !== lastProgressRef.current && totalCount > 0) {
      lastProgressRef.current = progress;
      onProgress?.(progress);
    }

    // Handle completion based on new logic (T014)
    // Completion triggers when:
    // 1. All frames attempted AND (no pending retries OR 80%+ success), OR
    // 2. Timeout fired
    const shouldTriggerCompletion =
      shouldComplete(totalCount) &&
      totalCount > 0 &&
      !completionHandled.current &&
      isLoading;

    if (shouldTriggerCompletion) {
      handleCompletion();
    }
  }, [loadedCount, totalCount, progress, onProgress, isLoading, shouldComplete, handleCompletion]);

  // ============================================================================
  // Comprehensive Cleanup on Unmount (T015)
  // ============================================================================

  useEffect(() => {
    isMounted.current = true;

    // Capture refs for cleanup
    const retryTimeoutsRef = retryTimeouts;
    const overallTimeoutRef = overallTimeout;
    const failedUrlsRef = failedUrls;

    return () => {
      // CRITICAL: Set isMounted to false FIRST to prevent callbacks
      isMounted.current = false;

      // Clear overall timeout
      const timeout = overallTimeoutRef.current;
      if (timeout) {
        clearTimeout(timeout);
        overallTimeoutRef.current = null;
      }

      // Clear all retry timeouts
      const retries = retryTimeoutsRef.current;
      retries.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      retries.clear();

      // Clear tracking state
      failedUrlsRef.current.clear();
      activeRetryCount.current = 0;
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
