"use client";

/**
 * SkillCard component - Individual skill category card with animations.
 * Uses Framer Motion for entrance animation matching AchievementCard pattern.
 */

import { motion } from "framer-motion";
import { Brain, Code, Layers, Users } from "lucide-react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SkillItem } from "./SkillItem";
import type { SkillCardProps, SkillIconMap } from "@/types/skills";

/**
 * Icon component mapping.
 */
const iconMap: SkillIconMap = {
  brain: Brain,
  code: Code,
  layers: Layers,
  users: Users,
};

/**
 * Animation variants for card entrance.
 * Matches AchievementCard pattern.
 */
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

/**
 * Instant variants for reduced motion.
 */
const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
};

/**
 * Skill category card with icon, title, and skill list.
 *
 * @param props - Component props
 * @param props.category - Skill category configuration
 * @param props.isRevealed - Whether card should be visible/animated
 * @param props.delay - Animation delay in seconds
 * @param props.className - Optional additional CSS classes
 *
 * @example
 * <SkillCard
 *   category={{ id: "dev", icon: "code", title: "Development", skills: ["TypeScript", "React"] }}
 *   isRevealed={true}
 *   delay={0.1}
 * />
 */
export function SkillCard({
  category,
  isRevealed = false,
  delay = 0,
  className,
}: SkillCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const { icon, title, skills } = category;

  // Get the icon component
  const IconComponent = iconMap[icon];

  const activeVariants = prefersReducedMotion
    ? reducedMotionVariants
    : cardVariants;

  return (
    <motion.div
      className={cn(
        // Card styling
        "relative p-6",
        "rounded-xl",
        "bg-card/50 backdrop-blur-sm",
        "border-border/50 border",
        // Hover effects - lift and border highlight
        "transition-all duration-300",
        "hover:-translate-y-1",
        "hover:bg-card/70 hover:border-border",
        "hover:shadow-accent/5 hover:shadow-lg",
        // Height consistency
        "h-full",
        className
      )}
      initial="hidden"
      animate={isRevealed ? "visible" : "hidden"}
      variants={activeVariants}
      transition={{ delay: prefersReducedMotion ? 0 : delay }}
    >
      {/* Icon */}
      <div
        className={cn(
          "mb-4",
          "h-10 w-10",
          "flex items-center justify-center",
          "rounded-lg",
          "bg-accent/10",
          "text-accent"
        )}
      >
        <IconComponent className="h-5 w-5" aria-hidden="true" />
      </div>

      {/* Title */}
      <h3 className={cn("text-lg font-semibold", "text-foreground", "mb-4")}>
        {title}
      </h3>

      {/* Skills list */}
      <ul className="space-y-2">
        {skills.map((skill) => (
          <SkillItem key={skill} skill={skill} />
        ))}
      </ul>
    </motion.div>
  );
}

export default SkillCard;
