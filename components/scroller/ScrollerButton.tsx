"use client";

/**
 * ScrollerButton component - Navigation arrow for horizontal scrollers.
 * Uses Framer Motion for smooth fade transitions.
 */

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { ScrollerButtonProps } from "@/types/scroller";

/**
 * Animation variants for button fade in/out.
 */
const buttonVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/**
 * Navigation button for horizontal card scrollers.
 * Appears with a fade animation and includes a gradient background.
 *
 * @param props - Component props
 * @param props.direction - Scroll direction ("left" or "right")
 * @param props.onClick - Click handler
 * @param props.disabled - Whether the button is disabled
 */
export function ScrollerButton({
  direction,
  onClick,
  disabled,
}: ScrollerButtonProps) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  const isLeft = direction === "left";

  return (
    <motion.div
      className={cn(
        "absolute top-0 z-10 flex h-full items-center",
        isLeft ? "left-0" : "right-0"
      )}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={buttonVariants}
      transition={{ duration: 0.2 }}
    >
      {/* Gradient overlay */}
      <div
        className={cn(
          "pointer-events-none absolute h-full w-16",
          isLeft
            ? "left-0 bg-gradient-to-r from-background to-transparent"
            : "right-0 bg-gradient-to-l from-background to-transparent"
        )}
      />

      {/* Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "relative z-10",
          "bg-background/80 backdrop-blur-sm",
          "hover:bg-background/90",
          "border border-border/50",
          "shadow-sm",
          isLeft ? "ml-1" : "mr-1"
        )}
        aria-label={`Scroll ${direction}`}
      >
        <Icon className="h-5 w-5" />
      </Button>
    </motion.div>
  );
}

export default ScrollerButton;
