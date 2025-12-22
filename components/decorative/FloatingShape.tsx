"use client";

/**
 * FloatingShape component - Renders a decorative shape with parallax motion.
 * Used for adding visual depth and interest between parallax layers.
 */

import { motion, useTransform, useMotionValue, type MotionValue } from "framer-motion";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Circle, Triangle, Hexagon, Diamond } from "./shapes";
import {
  DECORATIVE_SHAPE_SIZES,
  DECORATIVE_COLORS,
  DECORATIVE_Z_INDEX,
  type FloatingShapeProps,
  type DecorativeShapeSize,
} from "@/types/decorative";

/**
 * Map of shape variant to component.
 */
const SHAPE_COMPONENTS = {
  circle: Circle,
  triangle: Triangle,
  hexagon: Hexagon,
  diamond: Diamond,
} as const;

/**
 * Get size value from preset or custom number.
 */
function getSize(size: DecorativeShapeSize | number): number {
  if (typeof size === "number") {
    return size;
  }
  return DECORATIVE_SHAPE_SIZES[size];
}

/**
 * Get color value from preset or custom string.
 */
function getColor(color: string): string {
  if (color in DECORATIVE_COLORS) {
    return DECORATIVE_COLORS[color as keyof typeof DECORATIVE_COLORS];
  }
  return color;
}

/**
 * Props for FloatingShape with scroll progress.
 */
interface FloatingShapeWithScrollProps extends FloatingShapeProps {
  /** Scroll progress MotionValue for parallax effect */
  scrollProgress?: MotionValue<number>;
}

/**
 * FloatingShape decorative component.
 *
 * Renders a geometric shape at a specified position with optional parallax
 * motion and reveal animation. Used in the mid-layer between background
 * frames and foreground content.
 *
 * @param props - Component props
 * @param props.variant - Shape type: circle, triangle, hexagon, or diamond
 * @param props.position - Position as {x, y} percentages (0-100)
 * @param props.size - Size preset (sm, md, lg) or pixel value. Default: md
 * @param props.color - Color preset or CSS color. Default: accent
 * @param props.opacity - Opacity (0-1). Default: 0.3
 * @param props.blur - Blur amount in pixels. Default: 0
 * @param props.speed - Parallax speed (0.3-0.5 recommended). Default: 0.4
 * @param props.delay - Animation delay in seconds. Default: 0
 * @param props.scrollProgress - Scroll progress MotionValue
 * @param props.className - Additional CSS classes
 *
 * @example
 * <FloatingShape
 *   variant="circle"
 *   position={{ x: 10, y: 20 }}
 *   size="lg"
 *   color="accent"
 *   scrollProgress={scrollYProgress}
 * />
 */
export function FloatingShape({
  variant,
  position,
  size = "md",
  color = "accent",
  opacity = 0.3,
  blur = 0,
  speed = 0.4,
  delay = 0,
  scrollProgress,
  className,
}: FloatingShapeWithScrollProps) {
  const prefersReducedMotion = useReducedMotion();

  // Fallback motion value when no scroll progress provided
  const fallbackProgress = useMotionValue(0);
  const effectiveProgress = scrollProgress ?? fallbackProgress;

  // Calculate parallax offset based on scroll progress
  const parallaxY = useTransform(
    effectiveProgress,
    [0, 1],
    [0, speed * 100]
  );

  const ShapeComponent = SHAPE_COMPONENTS[variant];
  const sizeValue = getSize(size);
  const colorValue = getColor(color);

  // Animation variants for reveal
  const variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: opacity,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <motion.div
      className={cn(
        "absolute pointer-events-none",
        className
      )}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        zIndex: DECORATIVE_Z_INDEX.floatingShape,
        y: prefersReducedMotion ? 0 : parallaxY,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        willChange: prefersReducedMotion ? "auto" : "transform",
      }}
      variants={variants}
      initial="hidden"
      animate="visible"
      aria-hidden="true"
    >
      <ShapeComponent
        size={sizeValue}
        fill={colorValue}
        opacity={1}
      />
    </motion.div>
  );
}

export default FloatingShape;
