/**
 * Custom hook for horizontal scrolling functionality.
 * Handles scroll state, navigation, keyboard controls, and accessibility.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";
import type { UseHorizontalScrollReturn } from "@/types/scroller";

/**
 * Hook for managing horizontal scroll behavior with arrow navigation.
 *
 * Features:
 * - Tracks scroll position to enable/disable navigation arrows
 * - Keyboard navigation (ArrowLeft/ArrowRight)
 * - Respects reduced motion preferences
 * - Debounced scroll event listener
 * - ResizeObserver for dynamic content
 *
 * @returns Scroll state and control functions
 */
export function useHorizontalScroll(): UseHorizontalScrollReturn {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  /**
   * Update scroll button visibility based on current scroll position.
   */
  const updateScrollState = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = container;

    // Small threshold to account for sub-pixel rendering
    const threshold = 2;

    setCanScrollLeft(scrollLeft > threshold);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - threshold);
  }, []);

  /**
   * Scroll the container by one card width + gap.
   */
  const scrollByCard = useCallback(
    (direction: "left" | "right") => {
      const container = scrollContainerRef.current;
      if (!container) {
        return;
      }

      // Find the first card to get its width
      const firstCard = container.querySelector(
        "[data-scroller-item]"
      ) as HTMLElement | null;
      if (!firstCard) {
        return;
      }

      // Get card width + gap (16px default gap in Tailwind's gap-4)
      const cardWidth = firstCard.offsetWidth;
      const gap = 16;
      const scrollAmount = cardWidth + gap;

      const scrollBehavior = prefersReducedMotion ? "instant" : "smooth";

      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: scrollBehavior,
      });
    },
    [prefersReducedMotion]
  );

  const scrollLeft = useCallback(() => scrollByCard("left"), [scrollByCard]);
  const scrollRight = useCallback(() => scrollByCard("right"), [scrollByCard]);

  /**
   * Handle keyboard navigation when the scroller is focused.
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollLeft();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollRight();
      }
    },
    [scrollLeft, scrollRight]
  );

  /**
   * Set up scroll and resize listeners.
   */
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    // Debounce scroll events
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateScrollState, 50);
    };

    // Update on resize
    const resizeObserver = new ResizeObserver(() => {
      updateScrollState();
    });

    // Initial state update
    updateScrollState();

    // Add listeners
    container.addEventListener("scroll", handleScroll, { passive: true });
    resizeObserver.observe(container);

    // Also observe children for dynamic content changes
    const children = container.querySelectorAll("[data-scroller-item]");
    children.forEach((child) => resizeObserver.observe(child));

    return () => {
      clearTimeout(scrollTimeout);
      container.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [updateScrollState]);

  return {
    scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
    handleKeyDown,
  };
}

export default useHorizontalScroll;
