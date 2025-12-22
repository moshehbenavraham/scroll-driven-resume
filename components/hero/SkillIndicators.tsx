"use client";

/**
 * SkillIndicators component - Skill badges for hero section.
 * Displays four skill categories with icons and labels.
 */

import { Brain, Code2, Lightbulb, Users } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  type SkillIndicatorsProps,
  type SkillCategory,
  DEFAULT_SKILLS,
} from "@/types/hero";

/**
 * Icon mapping for skill categories.
 */
const SKILL_ICONS: Record<SkillCategory, typeof Brain> = {
  ai: Brain,
  development: Code2,
  product: Lightbulb,
  leadership: Users,
};

/**
 * Skill indicators component displaying expertise areas.
 * Shows icons with labels in a horizontal layout.
 *
 * @param props - Component props
 * @param props.className - Optional additional CSS classes
 * @param props.skills - Optional custom skills (uses defaults if not provided)
 *
 * @example
 * <SkillIndicators className="mt-6" />
 */
export function SkillIndicators({
  className,
  skills = DEFAULT_SKILLS,
}: SkillIndicatorsProps) {
  return (
    <div
      className={cn(
        // Grid layout - 2 columns on mobile, 4 on desktop
        "grid grid-cols-2 gap-4 md:grid-cols-4",
        className
      )}
      role="list"
      aria-label="Key skills and expertise"
    >
      {skills.map((skill) => {
        const Icon = SKILL_ICONS[skill.category];

        return (
          <div
            key={skill.category}
            className={cn(
              // Container
              "flex flex-col items-center gap-2 p-3",
              // Background
              "rounded-lg bg-white/5",
              "backdrop-blur-sm",
              // Hover effect
              "transition-colors duration-200",
              "hover:bg-white/10"
            )}
            role="listitem"
          >
            <Icon className="h-6 w-6 text-white/80" aria-hidden="true" />
            <span className="text-sm font-medium text-white/90">
              {skill.label}
            </span>
            <span className="text-center text-xs text-white/60">
              {skill.description}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default SkillIndicators;
