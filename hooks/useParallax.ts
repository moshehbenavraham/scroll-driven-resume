"use client";

/**
 * useParallax hook - Parallax transform generation.
 * Creates smooth parallax effects with configurable speed multipliers.
 */

import { useScroll, useTransform } from "framer-motion";
import { clamp } from "@/lib/utils";
import {
  PARALLAX_SPEEDS,
  type UseParallaxOptions,
  type UseParallaxReturn,
} from "@/types/animation";

/**
 * Default parallax speed (mid-ground layer).
 */
const DEFAULT_SPEED = PARALLAX_SPEEDS.default;

/**
 * Generates parallax transform values for layered depth effects.
 * Elements with different speeds create an illusion of depth.
 *
 * Speed multipliers:
 *   - 0.3 (background): Moves slower than scroll, appears far away
 *   - 0.5 (default): Standard parallax effect
 *   - 1.0 (foreground): Moves at scroll speed
 *   - 1.3 (fast): Moves faster than scroll, appears very close
 *
 * @param options - Configuration options
 * @param options.target - Reference to the target section element
 * @param options.speed - Speed multiplier (0.3-1.3 range, default: 0.5)
 * @param options.offset - Scroll offset configuration
 *
 * @returns Object containing:
 *   - y: MotionValue<number> for vertical parallax offset
 *   - x: MotionValue<number> for horizontal parallax offset (typically 0)
 *   - opacity: MotionValue<number> for fade effects
 *
 * @example
 * const sectionRef = useRef<HTMLElement>(null);
 *
 * // Background layer (slow)
 * const bgParallax = useParallax({ target: sectionRef, speed: 0.3 });
 *
 * // Foreground layer (fast)
 * const fgParallax = useParallax({ target: sectionRef, speed: 1.0 });
 *
 * <motion.div style={{ y: bgParallax.y }}>Background</motion.div>
 * <motion.div style={{ y: fgParallax.y }}>Foreground</motion.div>
 */
export function useParallax(options: UseParallaxOptions): UseParallaxReturn {
  const { target, speed = DEFAULT_SPEED, offset } = options;

  // Clamp speed to valid range
  const clampedSpeed = clamp(speed, 0.1, 2.0);

  // Use Framer Motion's useScroll for section-scoped progress
  // Type assertion needed as Framer Motion expects specific string literals
  const { scrollYProgress } = useScroll({
    target,
    offset: (offset ?? ["start end", "end start"]) as [
      "start end",
      "end start",
    ],
  });

  // Calculate parallax Y offset
  // Positive speed < 1: element moves slower than scroll (appears behind)
  // Positive speed > 1: element moves faster than scroll (appears in front)
  // The offset is based on progress through the section * a multiplier
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [
      // Start position: offset based on speed difference
      (clampedSpeed - 1) * -100,
      // End position: opposite offset
      (clampedSpeed - 1) * 100,
    ]
  );

  // Horizontal parallax (typically 0, but available for advanced effects)
  const x = useTransform(scrollYProgress, [0, 1], [0, 0]);

  // Opacity with fade-in/fade-out at boundaries
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0]
  );

  return {
    y,
    x,
    opacity,
  };
}

export default useParallax;
