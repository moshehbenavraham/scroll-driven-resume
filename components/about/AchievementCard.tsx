"use client";

/**
 * AchievementCard component - Individual achievement card with animated counter.
 * Uses Framer Motion for entrance animation and counter effect.
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Folder, Code, Users } from "lucide-react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { AchievementCardProps, IconMap } from "@/types/about";

/**
 * Icon component mapping.
 */
const iconMap: IconMap = {
  calendar: Calendar,
  folder: Folder,
  code: Code,
  users: Users,
};

/**
 * Animation variants for card entrance.
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
 * Hook to animate a number from 0 to target.
 * Returns 0 when inactive, animates to target when active.
 */
function useCounterAnimation(
  target: number,
  isActive: boolean,
  duration: number = 1500
): number {
  // Initialize to 0 - will remain 0 until isActive becomes true
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Only run animation when active
    if (!isActive) {
      return;
    }

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [target, isActive, duration]);

  // Return 0 when not active, otherwise return animated count
  return isActive ? count : 0;
}

/**
 * Individual achievement card with icon, animated counter, and label.
 *
 * @param props - Component props
 * @param props.achievement - Achievement configuration
 * @param props.isRevealed - Whether card should be visible/animated
 * @param props.delay - Animation delay in seconds
 * @param props.className - Optional additional CSS classes
 */
export function AchievementCard({
  achievement,
  isRevealed = false,
  delay = 0,
  className,
}: AchievementCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const { icon, value, suffix = "", label } = achievement;

  // Get the icon component
  const IconComponent = iconMap[icon];

  // Animate counter only when revealed and not reduced motion
  const displayValue = useCounterAnimation(
    value,
    isRevealed && !prefersReducedMotion,
    1500
  );

  // Show final value immediately for reduced motion
  const finalValue = prefersReducedMotion ? value : displayValue;

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
        // Hover effect
        "transition-colors duration-300",
        "hover:bg-card/70 hover:border-border",
        className
      )}
      initial="hidden"
      animate={isRevealed ? "visible" : "hidden"}
      variants={activeVariants}
      transition={{ delay }}
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

      {/* Value with counter animation */}
      <div
        className={cn(
          "text-3xl font-bold md:text-4xl",
          "text-foreground",
          "tabular-nums" // Prevent layout shift during animation
        )}
      >
        {finalValue}
        {suffix}
      </div>

      {/* Label */}
      <div
        className={cn(
          "mt-1",
          "text-sm md:text-base",
          "text-muted-foreground",
          "tracking-wide uppercase"
        )}
      >
        {label}
      </div>
    </motion.div>
  );
}

export default AchievementCard;
