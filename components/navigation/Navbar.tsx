"use client";

/**
 * Navbar component - Fixed navigation bar with glass-morphism styling.
 * Provides persistent navigation throughout the portfolio experience.
 */

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { useActiveSection, useScrollDirection } from "@/hooks";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NavLinks } from "./NavLinks";
import { MobileMenu } from "./MobileMenu";
import { SECTION_IDS, type NavbarProps } from "@/types/navigation";

/**
 * Skip to content link component.
 * Hidden by default, visible on focus for keyboard users.
 */
function SkipToContent() {
  return (
    <a
      href="#main-content"
      className={cn(
        // Position off-screen by default
        "absolute top-4 left-4 z-[60]",
        // Hidden until focused
        "-translate-y-16 opacity-0",
        // Visible on focus
        "focus:translate-y-0 focus:opacity-100",
        // Styling
        "bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium",
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        // Transition
        "transition-all duration-200"
      )}
    >
      Skip to content
    </a>
  );
}

/**
 * Main navigation bar with glass-morphism design.
 * Features responsive layout with mobile menu and scroll-aware visibility.
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes
 * @param props.hideOnScroll - Enable scroll-aware hide behavior (default: false)
 *
 * @example
 * <Navbar hideOnScroll />
 */
export function Navbar({ className, hideOnScroll = false }: NavbarProps) {
  // Track active section based on viewport visibility
  const activeSection = useActiveSection({
    sectionIds: SECTION_IDS,
    threshold: 0.3,
    rootMargin: "-80px 0px 0px 0px",
  });

  // Track scroll direction for hide-on-scroll behavior
  const scrollDirection = useScrollDirection({ threshold: 10 });

  // Determine if navbar should be visible
  const isVisible = useMemo(() => {
    if (!hideOnScroll) {
      return true;
    }
    // Show on scroll up, hide on scroll down
    return scrollDirection !== "down";
  }, [hideOnScroll, scrollDirection]);

  return (
    <>
      {/* Skip to content link for accessibility */}
      <SkipToContent />

      {/* Fixed navbar container */}
      <AnimatePresence>
        {isVisible ? (
          <motion.header
            className={cn(
              // Fixed positioning at top
              "fixed top-0 right-0 left-0 z-50",
              // Padding for inset effect
              "px-4 pt-4",
              // Pointer events pass through padding area
              "pointer-events-none"
            )}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Inner navbar with glass-morphism */}
            <nav
              className={cn(
                // Re-enable pointer events
                "pointer-events-auto",
                // Max width and centering
                "mx-auto max-w-[1200px]",
                // Height and padding
                "flex h-14 items-center justify-between px-4",
                // Glass-morphism styling
                "bg-background/70 backdrop-blur-md",
                // Border and shadow
                "rounded-2xl ring-1 ring-white/10",
                "shadow-lg shadow-black/5",
                // Fallback for browsers without backdrop-filter
                "supports-[not(backdrop-filter)]:bg-background/95",
                className
              )}
              role="navigation"
              aria-label="Main navigation"
            >
              {/* Desktop navigation links (left side) */}
              <NavLinks activeSection={activeSection} />

              {/* Right side: Theme toggle + Mobile menu */}
              <div className="flex items-center gap-2">
                <ThemeToggle className="border-none bg-transparent" />
                <MobileMenu activeSection={activeSection} />
              </div>
            </nav>
          </motion.header>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
