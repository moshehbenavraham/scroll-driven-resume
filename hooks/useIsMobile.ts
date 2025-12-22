"use client";

/**
 * useIsMobile hook - SSR-safe viewport width detection.
 * Returns true when viewport width is below mobile breakpoint.
 */

import { useSyncExternalStore } from "react";
import { MOBILE_BREAKPOINT } from "@/types/animation";

/**
 * Get current mobile state from window width.
 */
function getSnapshot(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.innerWidth < MOBILE_BREAKPOINT;
}

/**
 * Server snapshot - always returns false for SSR.
 * Prevents hydration mismatch by defaulting to desktop.
 */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Subscribe to resize events for width changes.
 */
function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("resize", callback);

  return () => {
    window.removeEventListener("resize", callback);
  };
}

/**
 * Hook to detect if viewport is mobile width.
 * Uses useSyncExternalStore for proper React 18+ integration.
 *
 * SSR Behavior:
 * - Returns false on server (assumes desktop)
 * - Hydrates with false, then updates to actual value after mount
 * - This prevents hydration mismatch errors
 *
 * @returns boolean - true if viewport width < 768px
 *
 * @example
 * const isMobile = useIsMobile();
 * const parallaxEnabled = !isMobile;
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default useIsMobile;
