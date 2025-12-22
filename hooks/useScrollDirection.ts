"use client";

/**
 * useScrollDirection hook - Detects scroll direction for scroll-aware UI behavior.
 * Used by navbar to hide on scroll down and show on scroll up.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  ScrollDirection,
  UseScrollDirectionOptions,
} from "@/types/navigation";

/**
 * Hook to detect scroll direction.
 * Returns "up", "down", or null (no scroll yet).
 *
 * @param options - Configuration options
 * @param options.threshold - Minimum scroll delta before direction change (default: 10)
 * @param options.initialDirection - Initial direction value (default: null)
 *
 * @example
 * const direction = useScrollDirection({ threshold: 20 });
 * // direction: "up" | "down" | null
 */
export function useScrollDirection(
  options: UseScrollDirectionOptions = {}
): ScrollDirection {
  const { threshold = 10, initialDirection = null } = options;

  const [direction, setDirection] = useState<ScrollDirection>(initialDirection);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const updateDirection = useCallback(() => {
    const scrollY = window.scrollY;
    const delta = scrollY - lastScrollY.current;

    // Only update if scroll delta exceeds threshold
    if (Math.abs(delta) >= threshold) {
      const newDirection: ScrollDirection = delta > 0 ? "down" : "up";
      setDirection(newDirection);
      lastScrollY.current = scrollY;
    }

    ticking.current = false;
  }, [threshold]);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(updateDirection);
      ticking.current = true;
    }
  }, [updateDirection]);

  useEffect(() => {
    // Initialize last scroll position
    lastScrollY.current = window.scrollY;

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return direction;
}

export default useScrollDirection;
