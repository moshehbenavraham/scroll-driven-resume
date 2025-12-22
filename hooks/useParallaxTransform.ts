"use client";

/**
 * useParallaxTransform hook - Enhanced parallax transform calculations.
 * Creates smooth parallax transforms based on scroll progress and speed.
 */

import { useTransform } from "framer-motion";
import { clamp } from "@/lib/utils";
import {
  PARALLAX_SPEED_CONFIG,
  type UseParallaxTransformOptions,
  type UseParallaxTransformReturn,
} from "@/types/parallax";

/**
 * Maximum parallax offset in pixels (prevents extreme transforms).
 */
const MAX_OFFSET = 150;

/**
 * Generates parallax transform values based on scroll progress and speed.
 *
 * Speed behavior:
 * - speed = 0: Element stays fixed (no transform)
 * - speed < 1: Element moves slower than scroll (appears behind)
 * - speed = 1: Element moves at scroll speed (no parallax)
 * - speed > 1: Element moves faster than scroll (appears in front)
 *
 * The transform uses translate3d for GPU acceleration.
 *
 * @param options - Configuration options
 * @param options.speed - Speed multiplier (clamped to 0-2.0)
 * @param options.scrollProgress - MotionValue tracking scroll progress (0-1)
 * @param options.enabled - Whether parallax is enabled (default: true)
 *
 * @returns Object containing y transform and style object
 *
 * @example
 * const { scrollYProgress } = useScroll({ target: sectionRef });
 * const { style } = useParallaxTransform({
 *   speed: 0.5,
 *   scrollProgress: scrollYProgress,
 * });
 *
 * <motion.div style={style}>Slow parallax content</motion.div>
 */
export function useParallaxTransform(
  options: UseParallaxTransformOptions
): UseParallaxTransformReturn {
  const { speed, scrollProgress, enabled = true } = options;

  // Clamp speed to valid range
  const clampedSpeed = clamp(
    speed,
    PARALLAX_SPEED_CONFIG.min,
    PARALLAX_SPEED_CONFIG.max
  );

  // Calculate parallax offset based on speed difference from normal (1.0)
  // - At speed 0: full negative offset at start, full positive at end
  // - At speed 0.5: half the offset range
  // - At speed 1.0: no offset (normal scroll)
  // - At speed 1.5: opposite direction offset
  const speedDelta = clampedSpeed - 1.0;
  const offsetRange = speedDelta * MAX_OFFSET;

  // Transform scroll progress to Y offset
  // When disabled or speed is exactly 1, return identity transform
  const y = useTransform(
    scrollProgress,
    [0, 1],
    enabled && clampedSpeed !== 1.0 ? [-offsetRange, offsetRange] : [0, 0]
  );

  return {
    y,
    style: {
      y,
      willChange: enabled ? "transform" : "auto",
    },
  };
}

export default useParallaxTransform;
