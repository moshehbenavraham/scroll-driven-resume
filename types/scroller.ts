/**
 * TypeScript interfaces for the HorizontalCardScroller component.
 */

import type { ReactNode } from "react";

/**
 * Props for the HorizontalCardScroller component.
 */
export interface HorizontalCardScrollerProps {
  /** Child elements to render as scrollable cards */
  children: ReactNode;
  /** Additional CSS classes for the container */
  className?: string;
  /** CSS classes applied to each card wrapper */
  cardClassName?: string;
  /** Accessible label for the scroller region */
  ariaLabel?: string;
}

/**
 * Props for the ScrollerButton component.
 */
export interface ScrollerButtonProps {
  /** Scroll direction */
  direction: "left" | "right";
  /** Click handler */
  onClick: () => void;
  /** Whether the button is disabled */
  disabled: boolean;
}

/**
 * Return type for the useHorizontalScroll hook.
 */
export interface UseHorizontalScrollReturn {
  /** Ref to attach to the scroll container */
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  /** Whether scrolling left is possible */
  canScrollLeft: boolean;
  /** Whether scrolling right is possible */
  canScrollRight: boolean;
  /** Scroll the container to the left */
  scrollLeft: () => void;
  /** Scroll the container to the right */
  scrollRight: () => void;
  /** Keyboard event handler for arrow navigation */
  handleKeyDown: (event: React.KeyboardEvent) => void;
}
