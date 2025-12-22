"use client";

/**
 * Achievements component - Grid container for achievement cards.
 * Responsive layout: 1 column mobile, 2 columns tablet/desktop.
 */

import { cn } from "@/lib/cn";
import { AchievementCard } from "./AchievementCard";
import { DEFAULT_ACHIEVEMENTS, type AchievementsProps } from "@/types/about";

/**
 * Achievements grid displaying achievement cards.
 * Responsive layout with staggered reveal animations.
 *
 * @param props - Component props
 * @param props.achievements - Array of achievement configurations
 * @param props.isRevealed - Whether achievements should animate in
 * @param props.className - Optional additional CSS classes
 */
export function Achievements({
  achievements = [...DEFAULT_ACHIEVEMENTS],
  isRevealed = false,
  className,
}: AchievementsProps) {
  // Don't render if no achievements
  if (achievements.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        // Grid layout
        "grid grid-cols-1 sm:grid-cols-2 gap-4",
        className
      )}
      role="list"
      aria-label="Achievements"
    >
      {achievements.map((achievement, index) => (
        <div key={achievement.id} role="listitem">
          <AchievementCard
            achievement={achievement}
            isRevealed={isRevealed}
            delay={index * 0.1} // Stagger each card
          />
        </div>
      ))}
    </div>
  );
}

export default Achievements;
