"use client";

/**
 * useViewportHeight hook - SSR-safe dynamic viewport height detection.
 * Handles mobile browser chrome (address bar, toolbar) and keyboard state.
 * Uses visualViewport API when available, falls back to innerHeight.
 */

import { useSyncExternalStore } from "react";

/**
 * Default viewport height fallback for SSR.
 * Uses a common mobile viewport height as a reasonable default.
 */
const DEFAULT_VIEWPORT_HEIGHT = 800;

/**
 * Get current viewport height from visualViewport or innerHeight.
 * visualViewport provides the most accurate height on mobile browsers,
 * accounting for browser chrome and virtual keyboard.
 */
function getSnapshot(): number {
  if (typeof window === "undefined") {
    return DEFAULT_VIEWPORT_HEIGHT;
  }

  // Prefer visualViewport for accurate mobile measurements
  if (window.visualViewport) {
    return window.visualViewport.height;
  }

  // Fallback to innerHeight
  return window.innerHeight;
}

/**
 * Server snapshot - returns default height for SSR.
 * Prevents hydration mismatch by using consistent default.
 */
function getServerSnapshot(): number {
  return DEFAULT_VIEWPORT_HEIGHT;
}

/**
 * Subscribe to viewport changes.
 * Listens to resize, orientationchange, and visualViewport resize events.
 */
function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  // Subscribe to visualViewport resize if available
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", callback);
  }

  // Also listen to window resize and orientation change
  window.addEventListener("resize", callback);
  window.addEventListener("orientationchange", callback);

  return () => {
    if (window.visualViewport) {
      window.visualViewport.removeEventListener("resize", callback);
    }
    window.removeEventListener("resize", callback);
    window.removeEventListener("orientationchange", callback);
  };
}

/**
 * Hook to get accurate viewport height accounting for mobile browser chrome.
 * Uses useSyncExternalStore for proper React 18+ integration.
 *
 * SSR Behavior:
 * - Returns DEFAULT_VIEWPORT_HEIGHT (800px) on server
 * - Hydrates with default, then updates to actual value after mount
 * - This prevents hydration mismatch errors
 *
 * Mobile Behavior:
 * - Uses visualViewport API for accurate height including keyboard state
 * - Updates when address bar shows/hides
 * - Updates when virtual keyboard appears/disappears
 *
 * @returns number - viewport height in pixels
 *
 * @example
 * const vh = useViewportHeight();
 * const heroStyle = { height: `${vh}px` };
 */
export function useViewportHeight(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Hook that returns CSS custom property value for viewport height.
 * Useful for setting CSS variables dynamically.
 *
 * @returns string - CSS value like "800px"
 */
export function useViewportHeightCSS(): string {
  const vh = useViewportHeight();
  return `${vh}px`;
}

/**
 * Hook that returns both numeric and CSS values.
 * Convenient when you need both formats.
 *
 * @returns object with numeric and CSS string values
 */
export function useViewportHeightValues(): {
  height: number;
  css: string;
  style: { height: string };
} {
  const height = useViewportHeight();
  return {
    height,
    css: `${height}px`,
    style: { height: `${height}px` },
  };
}

export default useViewportHeight;
