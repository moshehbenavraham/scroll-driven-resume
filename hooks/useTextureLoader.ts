"use client";

/**
 * useTextureLoader - Manages Three.js textures from frame images with LRU caching.
 *
 * Converts HTMLImageElements to THREE.Texture objects with GPU memory management.
 * Uses LRU eviction to limit GPU memory usage while keeping browser image cache intact.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

/** Maximum number of textures to keep in GPU memory */
const MAX_TEXTURE_POOL_SIZE = 50;

/** Number of nearby frames to preload textures for */
const NEARBY_FRAME_RANGE = 5;

/**
 * Cached image entry with failure tracking for terminal states.
 * Failed entries participate in LRU eviction to prevent cache bloat.
 */
export interface CachedTexture {
  /** The loaded image element, null if load failed */
  image: HTMLImageElement | null;
  /** Whether the load failed (terminal state - no retry) */
  failed: boolean;
  /** Timestamp for LRU eviction tracking */
  timestamp: number;
}

/**
 * Options for useTextureLoader hook.
 */
export interface UseTextureLoaderOptions {
  /** Array of frame image URLs */
  frameUrls: string[];
  /** Number of frames to load with high priority. Default: 10 */
  priorityCount?: number;
  /** Maximum textures to cache in GPU memory. Default: 50 */
  maxCachedTextures?: number;
  /** Whether loading is enabled. Default: true */
  enabled?: boolean;
}

/**
 * Return value from useTextureLoader hook.
 */
export interface UseTextureLoaderReturn {
  /** Get texture for a specific frame index */
  getTexture: (frameIndex: number) => THREE.Texture | null;
  /** Check if texture is ready for a frame */
  isTextureReady: (frameIndex: number) => boolean;
  /** Number of images loaded into browser cache */
  loadedCount: number;
  /** Total number of frames */
  totalCount: number;
  /** Preload textures for frames around current position */
  preloadNearby: (currentFrame: number) => void;
}

/**
 * Hook to manage Three.js textures from frame images with LRU caching.
 *
 * @param options - Configuration options
 * @returns Texture loader interface
 *
 * @example
 * const { getTexture, loadedCount } = useTextureLoader({
 *   frameUrls: ['/frame1.webp', '/frame2.webp'],
 * });
 *
 * // In useFrame or render
 * const texture = getTexture(currentFrame);
 * if (texture) mesh.material.map = texture;
 */
export function useTextureLoader({
  frameUrls,
  priorityCount = 10,
  maxCachedTextures = MAX_TEXTURE_POOL_SIZE,
  enabled = true,
}: UseTextureLoaderOptions): UseTextureLoaderReturn {
  // Browser image cache - keeps all loaded CachedTexture entries (including failures)
  const imageCacheRef = useRef<Map<number, CachedTexture>>(new Map());

  // GPU texture pool - limited size with LRU eviction
  const texturePoolRef = useRef<Map<number, THREE.Texture>>(new Map());

  // LRU tracking - most recently accessed at end
  const accessOrderRef = useRef<number[]>([]);

  // Track loaded image count
  const [loadedCount, setLoadedCount] = useState(0);

  // Loading state for images (legacy - still used for tracking in-flight loads)
  const loadingRef = useRef<Set<number>>(new Set());

  // Track mounted state to prevent state updates after unmount or before mount
  const isMountedRef = useRef(false);

  // Promise registry for concurrent load deduplication (T005)
  const loadingPromisesRef = useRef<Map<number, Promise<CachedTexture>>>(
    new Map()
  );

  // Track requestIdleCallback handle for cleanup (T006)
  const idleCallbackHandleRef = useRef<number | null>(null);

  // Track setTimeout handles for cleanup (T007)
  const timeoutHandlesRef = useRef<Set<ReturnType<typeof setTimeout>>>(
    new Set()
  );

  /**
   * Load an image into browser cache.
   * Returns a CachedTexture entry (may contain failed state).
   */
  const loadImage = useCallback(
    (index: number): Promise<CachedTexture> => {
      // Check for existing loading promise (concurrent load deduplication)
      const existingPromise = loadingPromisesRef.current.get(index);
      if (existingPromise) {
        return existingPromise;
      }

      // Already cached (success or failure)
      const cached = imageCacheRef.current.get(index);
      if (cached) {
        // Return cached entry (even if failed - terminal state)
        return Promise.resolve(cached);
      }

      // Create promise for this load
      const promise = new Promise<CachedTexture>((resolve, reject) => {
        // Start loading
        loadingRef.current.add(index);
        const img = new Image();
        // Enable CORS for WebGL texture usage
        img.crossOrigin = "anonymous";

        img.onload = () => {
          loadingRef.current.delete(index);
          const entry: CachedTexture = {
            image: img,
            failed: false,
            timestamp: Date.now(),
          };
          imageCacheRef.current.set(index, entry);
          loadingPromisesRef.current.delete(index);
          // Only update state if component is mounted
          if (isMountedRef.current) {
            setLoadedCount((prev) => prev + 1);
          }
          resolve(entry);
        };

        img.onerror = () => {
          loadingRef.current.delete(index);
          // Cache failed state as terminal (no retry)
          const entry: CachedTexture = {
            image: null,
            failed: true,
            timestamp: Date.now(),
          };
          imageCacheRef.current.set(index, entry);
          loadingPromisesRef.current.delete(index);
          reject(new Error(`Failed to load image at index ${index}`));
        };

        img.src = frameUrls[index];
      });

      // Store promise for concurrent load deduplication
      loadingPromisesRef.current.set(index, promise);

      return promise;
    },
    [frameUrls]
  );

  /**
   * Update LRU access order.
   */
  const updateAccessOrder = useCallback((index: number) => {
    const order = accessOrderRef.current;
    const existingIdx = order.indexOf(index);
    if (existingIdx !== -1) {
      order.splice(existingIdx, 1);
    }
    order.push(index);
  }, []);

  /**
   * Evict oldest texture from GPU pool.
   */
  const evictOldest = useCallback(() => {
    const order = accessOrderRef.current;
    const pool = texturePoolRef.current;

    while (pool.size >= maxCachedTextures && order.length > 0) {
      const oldest = order.shift();
      if (oldest !== undefined) {
        const texture = pool.get(oldest);
        if (texture) {
          texture.dispose();
          pool.delete(oldest);
        }
      }
    }
  }, [maxCachedTextures]);

  /**
   * Get or create texture for a frame index.
   */
  const getTexture = useCallback(
    (frameIndex: number): THREE.Texture | null => {
      if (!enabled || frameIndex < 0 || frameIndex >= frameUrls.length) {
        return null;
      }

      const pool = texturePoolRef.current;

      // Check if texture already exists
      if (pool.has(frameIndex)) {
        updateAccessOrder(frameIndex);
        return pool.get(frameIndex)!;
      }

      // Check if image is in browser cache
      const cached = imageCacheRef.current.get(frameIndex);

      // Skip failed entries - they are terminal states
      if (cached && cached.failed) {
        return null;
      }

      if (!cached || !cached.image || !cached.image.complete) {
        // Image not ready - trigger load in background
        loadImage(frameIndex).catch(() => {
          // Silently ignore - texture will be unavailable
        });
        return null;
      }

      // Evict if pool is full
      if (pool.size >= maxCachedTextures) {
        evictOldest();
      }

      // Create texture from image
      const texture = new THREE.Texture(cached.image);
      texture.needsUpdate = true;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      // Add to pool
      pool.set(frameIndex, texture);
      updateAccessOrder(frameIndex);

      return texture;
    },
    [
      enabled,
      frameUrls.length,
      loadImage,
      maxCachedTextures,
      evictOldest,
      updateAccessOrder,
    ]
  );

  /**
   * Check if texture is ready for a frame.
   */
  const isTextureReady = useCallback((frameIndex: number): boolean => {
    if (texturePoolRef.current.has(frameIndex)) {
      return true;
    }
    const cached = imageCacheRef.current.get(frameIndex);
    // Ready if cached, not failed, and image is complete
    return cached !== undefined && !cached.failed && cached.image !== null && cached.image.complete;
  }, []);

  /**
   * Preload textures for frames near the current position.
   */
  const preloadNearby = useCallback(
    (currentFrame: number) => {
      if (!enabled) {
        return;
      }

      const start = Math.max(0, currentFrame - NEARBY_FRAME_RANGE);
      const end = Math.min(
        frameUrls.length - 1,
        currentFrame + NEARBY_FRAME_RANGE
      );

      for (let i = start; i <= end; i++) {
        // Trigger image load if not cached
        if (!imageCacheRef.current.has(i)) {
          loadImage(i).catch(() => {
            // Silently ignore errors
          });
        }
      }
    },
    [enabled, frameUrls.length, loadImage]
  );

  // Track mounted state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Load priority frames on mount
  useEffect(() => {
    if (!enabled || frameUrls.length === 0) {
      return;
    }

    // Load first N frames with priority
    const loadPriorityFrames = async () => {
      const count = Math.min(priorityCount, frameUrls.length);
      const promises: Promise<CachedTexture>[] = [];

      for (let i = 0; i < count; i++) {
        promises.push(loadImage(i));
      }

      await Promise.allSettled(promises);
    };

    loadPriorityFrames();

    // Continue loading remaining frames in background
    const loadRemainingFrames = () => {
      if ("requestIdleCallback" in window) {
        let currentIndex = priorityCount;

        const loadBatch = (deadline: IdleDeadline) => {
          while (
            deadline.timeRemaining() > 0 &&
            currentIndex < frameUrls.length
          ) {
            loadImage(currentIndex).catch(() => {});
            currentIndex++;
          }

          if (currentIndex < frameUrls.length) {
            // Track the idle callback handle for cleanup (T013)
            idleCallbackHandleRef.current = requestIdleCallback(loadBatch);
          }
        };

        // Track initial idle callback handle (T013)
        idleCallbackHandleRef.current = requestIdleCallback(loadBatch);
      } else {
        // Fallback for browsers without requestIdleCallback (T014)
        for (let i = priorityCount; i < frameUrls.length; i++) {
          const handle = setTimeout(
            () => loadImage(i).catch(() => {}),
            (i - priorityCount) * 50
          );
          timeoutHandlesRef.current.add(handle);
        }
      }
    };

    loadRemainingFrames();
  }, [enabled, frameUrls, priorityCount, loadImage]);

  // Cleanup textures and async resources on unmount (T015)
  useEffect(() => {
    const texturePool = texturePoolRef.current;
    const accessOrder = accessOrderRef.current;
    const timeoutHandles = timeoutHandlesRef.current;
    const loadingPromises = loadingPromisesRef.current;
    return () => {
      // Cancel pending idle callbacks
      if (idleCallbackHandleRef.current !== null && "cancelIdleCallback" in window) {
        cancelIdleCallback(idleCallbackHandleRef.current);
        idleCallbackHandleRef.current = null;
      }

      // Clear all pending timeouts
      timeoutHandles.forEach((handle) => {
        clearTimeout(handle);
      });
      timeoutHandles.clear();

      // Clear loading promises registry
      loadingPromises.clear();

      // Dispose GPU textures
      texturePool.forEach((texture) => {
        texture.dispose();
      });
      texturePool.clear();
      accessOrder.length = 0;
    };
  }, []);

  return {
    getTexture,
    isTextureReady,
    loadedCount,
    totalCount: frameUrls.length,
    preloadNearby,
  };
}

export default useTextureLoader;
