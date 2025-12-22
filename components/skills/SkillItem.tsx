"use client";

/**
 * SkillItem component - Individual skill item within a category card.
 * Displays a single skill with subtle hover styling.
 */

import { cn } from "@/lib/cn";
import type { SkillItemProps } from "@/types/skills";

/**
 * Individual skill item with hover effect.
 *
 * @param props - Component props
 * @param props.skill - Skill name/text
 * @param props.className - Optional additional CSS classes
 *
 * @example
 * <SkillItem skill="TypeScript" />
 */
export function SkillItem({ skill, className }: SkillItemProps) {
  return (
    <li
      className={cn(
        // Base styling
        "text-muted-foreground text-sm",
        // Hover effect
        "transition-colors duration-200",
        "hover:text-foreground",
        className
      )}
    >
      {skill}
    </li>
  );
}

export default SkillItem;
