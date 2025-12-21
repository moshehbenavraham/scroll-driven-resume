"use client";

/**
 * useReducedMotion hook - Detects user's motion preference.
 * Returns true if user prefers reduced motion via OS or browser settings.
 */

import { useSyncExternalStore } from "react";

/**
 * Media query for prefers-reduced-motion.
 */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Get current reduced motion preference from media query.
 */
function getSnapshot(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * Server snapshot - always returns false for SSR.
 */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Subscribe to media query changes.
 */
function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", callback);

  return () => {
    mediaQuery.removeEventListener("change", callback);
  };
}

/**
 * Hook to detect if user prefers reduced motion.
 * Uses useSyncExternalStore for proper React 18+ integration.
 *
 * @returns boolean - true if user prefers reduced motion
 *
 * @example
 * const prefersReducedMotion = useReducedMotion();
 * const animationDuration = prefersReducedMotion ? 0 : 500;
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default useReducedMotion;
