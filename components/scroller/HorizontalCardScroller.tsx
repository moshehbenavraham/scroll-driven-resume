"use client";

/**
 * HorizontalCardScroller component - Scrollable container with arrow navigation.
 * Provides horizontal scrolling for card layouts with accessibility support.
 */

import { Children } from "react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { ScrollerButton } from "./ScrollerButton";
import type { HorizontalCardScrollerProps } from "@/types/scroller";

/**
 * Horizontal scrolling container with arrow navigation buttons.
 *
 * Features:
 * - Native overflow scrolling for touch/swipe support
 * - Scroll snap for precise card alignment
 * - Arrow buttons that appear/hide based on scroll position
 * - Keyboard navigation (ArrowLeft/ArrowRight when focused)
 * - Respects prefers-reduced-motion
 * - Hidden scrollbar for clean UI
 *
 * @param props - Component props
 * @param props.children - Cards or items to display
 * @param props.className - Additional CSS classes for the container
 * @param props.cardClassName - CSS classes for each card wrapper
 * @param props.ariaLabel - Accessible label for the scroller region
 *
 * @example
 * <HorizontalCardScroller
 *   cardClassName="w-[300px]"
 *   ariaLabel="Portfolio projects"
 * >
 *   {projects.map((project) => (
 *     <ProjectCard key={project.id} project={project} />
 *   ))}
 * </HorizontalCardScroller>
 */
export function HorizontalCardScroller({
  children,
  className,
  cardClassName,
  ariaLabel = "Scrollable content",
}: HorizontalCardScrollerProps) {
  const {
    scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
    handleKeyDown,
  } = useHorizontalScroll();

  const childArray = Children.toArray(children);

  return (
    <div className={cn("group relative", className)}>
      {/* Left navigation button */}
      <AnimatePresence>
        {canScrollLeft ? (
          <ScrollerButton
            direction="left"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          />
        ) : null}
      </AnimatePresence>

      {/* Scroll container */}
      <div
        ref={scrollContainerRef}
        className={cn(
          "flex gap-4 overflow-x-auto",
          "snap-x snap-mandatory",
          "hide-scrollbar",
          // Padding to prevent card shadows from being clipped
          "px-1 py-1"
        )}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label={ariaLabel}
      >
        {childArray.map((child, index) => (
          <div
            key={index}
            className={cn("flex-shrink-0 snap-start", cardClassName)}
            data-scroller-item
          >
            {child}
          </div>
        ))}
      </div>

      {/* Right navigation button */}
      <AnimatePresence>
        {canScrollRight ? (
          <ScrollerButton
            direction="right"
            onClick={scrollRight}
            disabled={!canScrollRight}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default HorizontalCardScroller;
