"use client";

/**
 * useImageCache - Caches HTMLImageElement references for canvas drawing.
 *
 * Works alongside useFramePreload: images are already in browser cache,
 * this hook creates HTMLImageElement references for efficient canvas drawImage().
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { UseImageCacheOptions, UseImageCacheReturn } from "@/types/animation";

/**
 * Hook to cache HTMLImageElement references for canvas rendering.
 *
 * Images loaded by useFramePreload are already in browser cache,
 * so creating Image() objects here loads them instantly.
 *
 * @param options - Configuration options
 * @param options.frameUrls - Array of frame URLs to cache
 * @param options.enabled - Whether caching is enabled (default: true)
 * @returns Image cache interface with getImage, isImageLoaded, loadedCount, totalCount
 *
 * @example
 * const { getImage, loadedCount } = useImageCache({
 *   frameUrls: ['/frame1.webp', '/frame2.webp'],
 * });
 *
 * const img = getImage(0);
 * if (img) ctx.drawImage(img, 0, 0);
 */
export function useImageCache({
  frameUrls,
  enabled = true,
}: UseImageCacheOptions): UseImageCacheReturn {
  // Store loaded images by index
  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());

  // Track loaded count for UI feedback
  const [loadedCount, setLoadedCount] = useState(0);

  // Load images into cache
  useEffect(() => {
    if (!enabled || frameUrls.length === 0) {
      return;
    }

    const cache = cacheRef.current;
    let mounted = true;
    let loaded = 0;

    // Create Image objects for each URL
    // Images are already in browser cache from useFramePreload
    frameUrls.forEach((url, index) => {
      // Skip if already cached
      if (cache.has(index)) {
        loaded++;
        return;
      }

      const img = new Image();
      // Enable CORS for WebGL texture usage
      img.crossOrigin = "anonymous";

      img.onload = () => {
        if (!mounted) {return;}
        cache.set(index, img);
        loaded++;
        setLoadedCount(loaded);
      };

      img.onerror = () => {
        // Silently ignore errors - frame will be skipped during render
        if (!mounted) {return;}
        loaded++;
        setLoadedCount(loaded);
      };

      // Start loading (will be instant from browser cache)
      img.src = url;
    });

    return () => {
      mounted = false;
    };
  }, [frameUrls, enabled]);

  // Get cached image by index
  const getImage = useCallback((index: number): HTMLImageElement | null => {
    return cacheRef.current.get(index) ?? null;
  }, []);

  // Check if image is loaded
  const isImageLoaded = useCallback((index: number): boolean => {
    const img = cacheRef.current.get(index);
    return img !== undefined && img.complete;
  }, []);

  return {
    getImage,
    isImageLoaded,
    loadedCount,
    totalCount: frameUrls.length,
  };
}

export default useImageCache;
