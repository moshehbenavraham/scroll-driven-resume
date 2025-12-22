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
  // Browser image cache - keeps all loaded HTMLImageElements
  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());

  // GPU texture pool - limited size with LRU eviction
  const texturePoolRef = useRef<Map<number, THREE.Texture>>(new Map());

  // LRU tracking - most recently accessed at end
  const accessOrderRef = useRef<number[]>([]);

  // Track loaded image count
  const [loadedCount, setLoadedCount] = useState(0);

  // Loading state for images
  const loadingRef = useRef<Set<number>>(new Set());

  // Track mounted state to prevent state updates after unmount or before mount
  const isMountedRef = useRef(false);

  /**
   * Load an image into browser cache.
   */
  const loadImage = useCallback(
    (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        // Already cached
        const cached = imageCacheRef.current.get(index);
        if (cached && cached.complete) {
          resolve(cached);
          return;
        }

        // Already loading
        if (loadingRef.current.has(index)) {
          // Wait for existing load
          const checkInterval = setInterval(() => {
            const img = imageCacheRef.current.get(index);
            if (img && img.complete) {
              clearInterval(checkInterval);
              resolve(img);
            }
          }, 10);
          return;
        }

        // Start loading
        loadingRef.current.add(index);
        const img = new Image();
        // Enable CORS for WebGL texture usage
        img.crossOrigin = "anonymous";

        img.onload = () => {
          loadingRef.current.delete(index);
          imageCacheRef.current.set(index, img);
          // Only update state if component is mounted
          if (isMountedRef.current) {
            setLoadedCount((prev) => prev + 1);
          }
          resolve(img);
        };

        img.onerror = () => {
          loadingRef.current.delete(index);
          reject(new Error(`Failed to load image at index ${index}`));
        };

        img.src = frameUrls[index];
      });
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
      const image = imageCacheRef.current.get(frameIndex);
      if (!image || !image.complete) {
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
      const texture = new THREE.Texture(image);
      texture.needsUpdate = true;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      // Add to pool
      pool.set(frameIndex, texture);
      updateAccessOrder(frameIndex);

      return texture;
    },
    [enabled, frameUrls.length, loadImage, maxCachedTextures, evictOldest, updateAccessOrder]
  );

  /**
   * Check if texture is ready for a frame.
   */
  const isTextureReady = useCallback(
    (frameIndex: number): boolean => {
      if (texturePoolRef.current.has(frameIndex)) {
        return true;
      }
      const image = imageCacheRef.current.get(frameIndex);
      return image !== undefined && image.complete;
    },
    []
  );

  /**
   * Preload textures for frames near the current position.
   */
  const preloadNearby = useCallback(
    (currentFrame: number) => {
      if (!enabled) {return;}

      const start = Math.max(0, currentFrame - NEARBY_FRAME_RANGE);
      const end = Math.min(frameUrls.length - 1, currentFrame + NEARBY_FRAME_RANGE);

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
      const promises: Promise<HTMLImageElement>[] = [];

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
            requestIdleCallback(loadBatch);
          }
        };

        requestIdleCallback(loadBatch);
      } else {
        // Fallback for browsers without requestIdleCallback
        for (let i = priorityCount; i < frameUrls.length; i++) {
          setTimeout(() => loadImage(i).catch(() => {}), (i - priorityCount) * 50);
        }
      }
    };

    loadRemainingFrames();
  }, [enabled, frameUrls, priorityCount, loadImage]);

  // Cleanup textures on unmount
  useEffect(() => {
    const texturePool = texturePoolRef.current;
    const accessOrder = accessOrderRef.current;
    return () => {
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
