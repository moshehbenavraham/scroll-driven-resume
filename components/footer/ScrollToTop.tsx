"use client";

/**
 * ScrollToTop component - Button to scroll back to page top.
 * Shows after scrolling past a threshold with smooth animation.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ScrollToTopProps } from "@/types/contact";

/**
 * Default scroll threshold to show button (pixels).
 */
const DEFAULT_SHOW_AFTER = 400;

/**
 * Button animation variants.
 */
const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Reduced motion variants.
 */
const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

/**
 * Scroll to top button with smooth scroll behavior.
 * Appears after scrolling past a threshold.
 *
 * @param props - Component props
 * @param props.className - Optional additional CSS classes
 * @param props.showAfter - Scroll threshold to show button (default: 400px)
 *
 * @example
 * <ScrollToTop showAfter={300} />
 */
export function ScrollToTop({
  className,
  showAfter = DEFAULT_SHOW_AFTER,
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const activeVariants = prefersReducedMotion
    ? reducedMotionVariants
    : buttonVariants;

  /**
   * Check scroll position and update visibility.
   */
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > showAfter);
    };

    // Check initial position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfter]);

  /**
   * Scroll to top of page.
   */
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.button
          type="button"
          onClick={scrollToTop}
          className={cn(
            "fixed right-6 bottom-6 z-50",
            "flex h-12 w-12 items-center justify-center",
            "rounded-full",
            "bg-accent text-white",
            "shadow-lg shadow-accent/20",
            "hover:bg-accent/90",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
            "focus:ring-offset-background",
            "transition-colors duration-200",
            className
          )}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={activeVariants}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}

export default ScrollToTop;
