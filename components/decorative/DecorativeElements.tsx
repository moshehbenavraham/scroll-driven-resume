"use client";

/**
 * DecorativeElements component - Container for orchestrating decorative elements.
 * Manages staggered reveals and provides scroll context to children.
 */

import { useRef } from "react";
import { motion, useScroll, useInView, type MotionValue } from "framer-motion";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { FloatingShape } from "./FloatingShape";
import { ConnectionLine } from "./ConnectionLine";
import { GradientMesh } from "./GradientMesh";
import { NoiseOverlay } from "./NoiseOverlay";
import type {
  DecorativeElementsProps,
  DecorativeElementConfig,
  FloatingShapeProps,
  ConnectionLineProps,
  GradientMeshProps,
  NoiseOverlayProps,
} from "@/types/decorative";

/**
 * Render a decorative element based on its config type.
 */
function renderElement(
  config: DecorativeElementConfig,
  scrollProgress: MotionValue<number>,
  index: number,
  staggerDelay: number
) {
  const delay = index * staggerDelay;

  switch (config.type) {
    case "shape":
      return (
        <FloatingShape
          key={config.id}
          {...(config.props as FloatingShapeProps)}
          delay={delay}
          scrollProgress={scrollProgress}
        />
      );
    case "line":
      return (
        <ConnectionLine
          key={config.id}
          {...(config.props as ConnectionLineProps)}
          delay={delay}
          scrollProgress={scrollProgress}
        />
      );
    case "gradient":
      return <GradientMesh key={config.id} {...(config.props as GradientMeshProps)} />;
    case "noise":
      return <NoiseOverlay key={config.id} {...(config.props as NoiseOverlayProps)} />;
    default:
      return null;
  }
}

/**
 * DecorativeElements container component.
 *
 * Orchestrates decorative elements with staggered reveal animations
 * and scroll-driven parallax. Can receive elements via config array
 * or children props.
 *
 * @param props - Component props
 * @param props.elements - Array of element configurations
 * @param props.children - Child elements (alternative to config)
 * @param props.staggered - Enable staggered reveals. Default: true
 * @param props.staggerDelay - Delay between elements in seconds. Default: 0.1
 * @param props.scrollProgress - External scroll progress MotionValue
 * @param props.showOnMobile - Show on mobile viewports. Default: false
 * @param props.className - Additional CSS classes
 *
 * @example
 * // Using config array
 * <DecorativeElements
 *   elements={[
 *     { id: "shape1", type: "shape", props: { variant: "circle", position: { x: 10, y: 20 } } },
 *     { id: "line1", type: "line", props: { start: { x: 10, y: 20 }, end: { x: 50, y: 50 } } },
 *   ]}
 * />
 *
 * @example
 * // Using children
 * <DecorativeElements>
 *   <FloatingShape variant="circle" position={{ x: 10, y: 20 }} />
 *   <GradientMesh />
 * </DecorativeElements>
 */
export function DecorativeElements({
  elements,
  children,
  staggered = true,
  staggerDelay = 0.1,
  scrollProgress: externalScrollProgress,
  showOnMobile = false,
  className,
}: DecorativeElementsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  // Use container scroll if no external progress provided
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scrollProgress = externalScrollProgress ?? scrollYProgress;

  // Check if in view for reveal animations
  const isInView = useInView(containerRef, {
    once: true,
    margin: "-10%",
  });

  // Hide on mobile unless explicitly enabled
  if (isMobile && !showOnMobile) {
    return null;
  }

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.4,
        staggerChildren: staggered && !prefersReducedMotion ? staggerDelay : 0,
      },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "absolute inset-0 w-full h-full overflow-hidden pointer-events-none",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      aria-hidden="true"
    >
      {/* Render from config array */}
      {elements?.map((config, index) =>
        renderElement(
          config,
          scrollProgress,
          index,
          staggered ? staggerDelay : 0
        )
      )}

      {/* Render children if provided */}
      {children}
    </motion.div>
  );
}

export default DecorativeElements;
