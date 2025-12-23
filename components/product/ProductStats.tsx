"use client";

/**
 * ProductStats component - Stats display with scroll-triggered reveal animation.
 * Shows community stats (members, resources, projects, events) with icons.
 */

import { useMemo } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { Users, BookOpen, Code, Calendar, Star, Globe } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  type ProductStatsProps,
  type ProductStatIcon,
  DEFAULT_PRODUCT_STATS,
} from "@/types/product";

/**
 * Icon mapping for stat items.
 */
const ICON_MAP: Record<
  ProductStatIcon,
  React.ComponentType<{ className?: string }>
> = {
  users: Users,
  book: BookOpen,
  code: Code,
  calendar: Calendar,
  star: Star,
  globe: Globe,
};

/**
 * Animation configuration for stats reveal.
 * Start reveal at 40% scroll progress, complete at 70%.
 */
const REVEAL_CONFIG = {
  startProgress: 0.4,
  endProgress: 0.7,
  staggerDelay: 0.1, // 100ms between each stat
};

/**
 * Individual stat item component.
 */
interface StatItemProps {
  label: string;
  value: string;
  icon: ProductStatIcon;
  index: number;
  scrollProgress?: number;
}

function StatItem({
  label,
  value,
  icon,
  index,
  scrollProgress = 1,
}: StatItemProps) {
  const Icon = ICON_MAP[icon] || Users;

  // Calculate animation progress for this specific item
  // Each item starts slightly after the previous one (staggered)
  const itemStartProgress = REVEAL_CONFIG.startProgress + index * 0.05;
  const itemEndProgress = Math.min(
    REVEAL_CONFIG.endProgress,
    itemStartProgress + 0.15
  );

  // Map scroll progress to item visibility (0-1)
  const itemProgress = useMemo(() => {
    if (scrollProgress <= itemStartProgress) {
      return 0;
    }
    if (scrollProgress >= itemEndProgress) {
      return 1;
    }
    return (
      (scrollProgress - itemStartProgress) /
      (itemEndProgress - itemStartProgress)
    );
  }, [scrollProgress, itemStartProgress, itemEndProgress]);

  return (
    <motion.div
      className={cn(
        "flex flex-col items-center",
        "px-4 py-3 md:px-6 md:py-4",
        // Glass effect background
        "bg-white/5 backdrop-blur-sm",
        "rounded-lg",
        // Border
        "border border-white/10"
      )}
      role="listitem"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: itemProgress,
        y: 20 * (1 - itemProgress),
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
    >
      {/* Icon */}
      <Icon
        className={cn("h-6 w-6 md:h-8 md:w-8", "text-purple-400", "mb-2")}
      />

      {/* Value */}
      <span
        className={cn(
          "text-2xl md:text-3xl lg:text-4xl",
          "font-bold",
          "text-white",
          "mb-1"
        )}
      >
        {value}
      </span>

      {/* Label */}
      <span
        className={cn(
          "text-sm md:text-base",
          "text-white/60",
          "tracking-wide uppercase"
        )}
      >
        {label}
      </span>
    </motion.div>
  );
}

/**
 * Product stats display with scroll-triggered reveal animation.
 *
 * @param props - Component props
 * @param props.stats - Array of stats to display (default: DEFAULT_PRODUCT_STATS)
 * @param props.className - Optional additional CSS classes
 * @param props.scrollProgress - Scroll progress value (0-1) for reveal animation
 *
 * @example
 * <ProductStats scrollProgress={0.5} />
 */
export function ProductStats({
  stats = DEFAULT_PRODUCT_STATS,
  className,
  scrollProgress = 1,
}: ProductStatsProps) {
  // Handle empty stats gracefully
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        // Grid layout - responsive
        "grid grid-cols-2 md:grid-cols-4",
        "gap-3 md:gap-4 lg:gap-6",
        // Spacing
        "mb-8",
        className
      )}
      role="list"
      aria-label="Community statistics"
    >
      {stats.map((stat, index) => (
        <StatItem
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          index={index}
          scrollProgress={scrollProgress}
        />
      ))}
    </div>
  );
}

/**
 * ProductStats variant that uses a MotionValue for scroll progress.
 * Use this when scroll progress comes from Framer Motion's useScroll.
 */
export interface ProductStatsWithMotionProps extends Omit<
  ProductStatsProps,
  "scrollProgress"
> {
  /** Framer Motion scroll progress value */
  scrollProgress: MotionValue<number>;
}

export function ProductStatsWithMotion({
  stats = DEFAULT_PRODUCT_STATS,
  className,
  scrollProgress,
}: ProductStatsWithMotionProps) {
  // Transform scroll progress to the reveal range (40-70% -> 0-1)
  const revealProgress = useTransform(
    scrollProgress,
    [REVEAL_CONFIG.startProgress, REVEAL_CONFIG.endProgress],
    [0, 1]
  );

  // Handle empty stats gracefully
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        // Grid layout - responsive
        "grid grid-cols-2 md:grid-cols-4",
        "gap-3 md:gap-4 lg:gap-6",
        // Spacing
        "mb-8",
        className
      )}
      role="list"
      aria-label="Community statistics"
    >
      {stats.map((stat, index) => (
        <MotionStatItem
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          index={index}
          revealProgress={revealProgress}
        />
      ))}
    </div>
  );
}

/**
 * Individual stat item with MotionValue-based animation.
 */
interface MotionStatItemProps {
  label: string;
  value: string;
  icon: ProductStatIcon;
  index: number;
  revealProgress: MotionValue<number>;
}

function MotionStatItem({
  label,
  value,
  icon,
  index,
  revealProgress,
}: MotionStatItemProps) {
  const Icon = ICON_MAP[icon] || Users;

  // Calculate stagger offset for this item
  const staggerOffset = index * REVEAL_CONFIG.staggerDelay;

  // Transform reveal progress with stagger
  const opacity = useTransform(
    revealProgress,
    [staggerOffset, staggerOffset + 0.3],
    [0, 1]
  );

  const y = useTransform(
    revealProgress,
    [staggerOffset, staggerOffset + 0.3],
    [20, 0]
  );

  return (
    <motion.div
      className={cn(
        "flex flex-col items-center",
        "px-4 py-3 md:px-6 md:py-4",
        // Glass effect background
        "bg-white/5 backdrop-blur-sm",
        "rounded-lg",
        // Border
        "border border-white/10"
      )}
      role="listitem"
      style={{ opacity, y }}
    >
      {/* Icon */}
      <Icon
        className={cn("h-6 w-6 md:h-8 md:w-8", "text-purple-400", "mb-2")}
      />

      {/* Value */}
      <span
        className={cn(
          "text-2xl md:text-3xl lg:text-4xl",
          "font-bold",
          "text-white",
          "mb-1"
        )}
      >
        {value}
      </span>

      {/* Label */}
      <span
        className={cn(
          "text-sm md:text-base",
          "text-white/60",
          "tracking-wide uppercase"
        )}
      >
        {label}
      </span>
    </motion.div>
  );
}

export default ProductStats;
