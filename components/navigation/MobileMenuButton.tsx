"use client";

/**
 * MobileMenuButton component - Animated hamburger icon for mobile menu toggle.
 * Transforms between hamburger (3 lines) and X (close) states.
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { MobileMenuButtonProps } from "@/types/navigation";

/**
 * Line animation variants for hamburger to X transformation.
 */
const lineVariants = {
  closed: {
    rotate: 0,
    y: 0,
  },
  open: (custom: { rotate: number; y: number }) => ({
    rotate: custom.rotate,
    y: custom.y,
  }),
};

/**
 * Mobile menu hamburger button with animated icon.
 * Transforms from 3-line hamburger to X when open.
 *
 * @param props - Component props
 * @param props.isOpen - Whether the menu is currently open
 * @param props.onToggle - Toggle handler
 * @param props.className - Additional CSS classes
 *
 * @example
 * <MobileMenuButton
 *   isOpen={menuOpen}
 *   onToggle={() => setMenuOpen(!menuOpen)}
 * />
 */
export function MobileMenuButton({
  isOpen,
  onToggle,
  className,
}: MobileMenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        // Size and layout
        "relative flex h-10 w-10 items-center justify-center",
        // Show only on mobile
        "md:hidden",
        // Background and border
        "border-input bg-background/50 rounded-md border backdrop-blur-sm",
        // Hover and focus states
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        // Transition
        "transition-colors duration-150",
        className
      )}
      aria-label={isOpen ? "Close navigation menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      {/* Hamburger / X icon */}
      <div className="relative h-5 w-5">
        {/* Top line - rotates to form X */}
        <motion.span
          className="absolute top-1 left-0 h-0.5 w-5 rounded-full bg-current"
          variants={lineVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          custom={{ rotate: 45, y: 5 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
        {/* Middle line - fades out */}
        <motion.span
          className="absolute top-[9px] left-0 h-0.5 w-5 rounded-full bg-current"
          initial={{ opacity: 1 }}
          animate={{ opacity: isOpen ? 0 : 1 }}
          transition={{ duration: 0.15 }}
        />
        {/* Bottom line - rotates to form X */}
        <motion.span
          className="absolute bottom-1 left-0 h-0.5 w-5 rounded-full bg-current"
          variants={lineVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          custom={{ rotate: -45, y: -5 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      </div>
    </button>
  );
}

export default MobileMenuButton;
