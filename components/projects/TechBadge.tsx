"use client";

/**
 * TechBadge component - Technology stack badge for project cards.
 * Displays technology name with subtle styling.
 */

import { cn } from "@/lib/cn";
import type { TechBadgeProps } from "@/types/projects";

/**
 * Technology badge with pill styling.
 *
 * @param props - Component props
 * @param props.technology - Technology name to display
 * @param props.className - Optional additional CSS classes
 *
 * @example
 * <TechBadge technology="TypeScript" />
 */
export function TechBadge({ technology, className }: TechBadgeProps) {
  return (
    <span
      className={cn(
        // Base styling
        "inline-flex items-center",
        "px-2.5 py-0.5",
        "text-xs font-medium",
        // Colors
        "bg-accent/10 text-accent",
        // Shape
        "rounded-full",
        // Transition for hover states (inherited from parent)
        "transition-colors duration-200",
        className
      )}
    >
      {technology}
    </span>
  );
}

export default TechBadge;
