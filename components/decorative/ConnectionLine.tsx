"use client";

/**
 * ConnectionLine component - Renders an animated SVG line between two points.
 * Creates visual connections between decorative elements.
 */

import { motion, useTransform, useMotionValue, type MotionValue } from "framer-motion";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DECORATIVE_Z_INDEX, type ConnectionLineProps } from "@/types/decorative";

/**
 * Calculate SVG path data for a line between two percentage positions.
 */
function getLinePath(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): string {
  return `M ${startX} ${startY} L ${endX} ${endY}`;
}

/**
 * Calculate line length for stroke animation.
 */
function getLineLength(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): number {
  const dx = endX - startX;
  const dy = endY - startY;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Props for ConnectionLine with scroll progress.
 */
interface ConnectionLineWithScrollProps extends ConnectionLineProps {
  /** Scroll progress MotionValue for draw animation */
  scrollProgress?: MotionValue<number>;
}

/**
 * ConnectionLine decorative component.
 *
 * Renders an SVG line between two points with optional scroll-driven
 * draw animation. Uses percentage-based positioning for responsiveness.
 *
 * @param props - Component props
 * @param props.start - Start position as {x, y} percentages (0-100)
 * @param props.end - End position as {x, y} percentages (0-100)
 * @param props.color - Line color (CSS value). Default: rgba(147, 112, 219, 0.3)
 * @param props.thickness - Line thickness in pixels. Default: 1
 * @param props.opacity - Opacity (0-1). Default: 0.2
 * @param props.animated - Whether to animate line drawing. Default: true
 * @param props.delay - Animation delay in seconds. Default: 0
 * @param props.scrollProgress - Scroll progress MotionValue
 * @param props.className - Additional CSS classes
 *
 * @example
 * <ConnectionLine
 *   start={{ x: 10, y: 20 }}
 *   end={{ x: 80, y: 60 }}
 *   animated
 *   scrollProgress={scrollYProgress}
 * />
 */
export function ConnectionLine({
  start,
  end,
  color = "rgba(147, 112, 219, 0.3)",
  thickness = 1,
  opacity = 0.2,
  animated = true,
  delay = 0,
  scrollProgress,
  className,
}: ConnectionLineWithScrollProps) {
  const prefersReducedMotion = useReducedMotion();

  // Calculate path and length
  const pathData = getLinePath(start.x, start.y, end.x, end.y);
  const lineLength = getLineLength(start.x, start.y, end.x, end.y);

  // Fallback motion value when no scroll progress provided
  const fallbackProgress = useMotionValue(0);
  const effectiveProgress = scrollProgress ?? fallbackProgress;

  // Animate stroke offset based on scroll progress
  const strokeOffset = useTransform(
    effectiveProgress,
    [0, 0.5, 1],
    [lineLength, 0, 0]
  );

  const shouldAnimate = animated && !prefersReducedMotion && scrollProgress;

  return (
    <motion.svg
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none",
        className
      )}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ zIndex: DECORATIVE_Z_INDEX.connectionLine }}
      initial={{ opacity: 0 }}
      animate={{ opacity: opacity }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.6,
        delay: prefersReducedMotion ? 0 : delay,
      }}
      aria-hidden="true"
    >
      <motion.path
        d={pathData}
        stroke={color}
        strokeWidth={thickness}
        fill="none"
        strokeLinecap="round"
        style={{
          strokeDasharray: shouldAnimate ? lineLength : undefined,
          strokeDashoffset: shouldAnimate ? strokeOffset : undefined,
        }}
      />
    </motion.svg>
  );
}

export default ConnectionLine;
