"use client";

/**
 * useActiveSection hook - Tracks which section is currently visible in viewport.
 * Uses Intersection Observer API for efficient section detection.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import type { UseActiveSectionOptions } from "@/types/navigation";

/**
 * Intersection entry with section ID.
 */
interface SectionEntry {
  id: string;
  ratio: number;
  boundingTop: number;
}

/**
 * Hook to detect the currently active section based on viewport visibility.
 * Returns the ID of the section that is most visible in the viewport.
 *
 * Uses Intersection Observer for efficient detection without scroll event listeners.
 * When multiple sections are visible, returns the topmost section.
 *
 * @param options - Configuration options
 * @param options.sectionIds - Array of section IDs to observe
 * @param options.threshold - Intersection ratio threshold (0-1, default: 0.3)
 * @param options.rootMargin - Root margin for observation (default: "-80px 0px 0px 0px")
 *
 * @example
 * const activeSection = useActiveSection({
 *   sectionIds: ["hero", "about", "skills"],
 *   threshold: 0.3,
 * });
 * // activeSection: "hero" | "about" | "skills" | null
 */
export function useActiveSection(
  options: UseActiveSectionOptions
): string | null {
  const {
    sectionIds,
    threshold = 0.3,
    rootMargin = "-80px 0px 0px 0px",
  } = options;

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const entriesRef = useRef<Map<string, SectionEntry>>(new Map());

  /**
   * Determine which section should be active based on current entries.
   * Priority: topmost visible section with ratio >= threshold.
   */
  const determineActiveSection = useCallback(() => {
    const visibleSections: SectionEntry[] = [];

    entriesRef.current.forEach((entry) => {
      if (entry.ratio >= threshold) {
        visibleSections.push(entry);
      }
    });

    if (visibleSections.length === 0) {
      // No sections meet threshold - find the one closest to threshold
      let bestId: string | null = null;
      let bestRatio = 0;

      entriesRef.current.forEach((entry) => {
        if (entry.ratio > bestRatio) {
          bestRatio = entry.ratio;
          bestId = entry.id;
        }
      });

      setActiveSection(bestId);
      return;
    }

    // Sort by bounding top (topmost first)
    visibleSections.sort((a, b) => a.boundingTop - b.boundingTop);

    // Return the topmost visible section
    setActiveSection(visibleSections[0].id);
  }, [threshold]);

  /**
   * Handle intersection observer entries.
   */
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (id) {
          entriesRef.current.set(id, {
            id,
            ratio: entry.intersectionRatio,
            boundingTop: entry.boundingClientRect.top,
          });
        }
      });

      determineActiveSection();
    },
    [determineActiveSection]
  );

  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Clear entries map
    entriesRef.current.clear();

    // Create new observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      rootMargin,
    });

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    // Cleanup on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [sectionIds, rootMargin, handleIntersection]);

  return activeSection;
}

export default useActiveSection;
