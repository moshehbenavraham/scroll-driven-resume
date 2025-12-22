"use client";

/**
 * ParallaxContainer component - Section wrapper that establishes parallax context.
 * Provides scroll progress and configuration to child ParallaxLayer components.
 */

import { useScroll } from "framer-motion";
import { cn } from "@/lib/cn";
import { useReducedMotion, useIsMobile } from "@/hooks";
import { ParallaxProvider } from "./ParallaxContext";
import type { ParallaxContainerProps } from "@/types/parallax";
import { MAX_PARALLAX_LAYERS } from "@/types/parallax"; // eslint-disable-line no-duplicate-imports

/**
 * Container component that establishes parallax context for child layers.
 *
 * Provides:
 * - Scroll progress tracking scoped to the container section
 * - Mobile detection (disables parallax on mobile)
 * - Reduced motion support (disables parallax when preferred)
 * - Layer count validation (warns when > maxLayers)
 *
 * @param props - Component props
 * @param props.containerRef - Reference to the section element for scroll tracking
 * @param props.children - Child ParallaxLayer components
 * @param props.offset - Scroll offset configuration
 * @param props.enabled - Whether parallax is enabled (default: true)
 * @param props.maxLayers - Maximum layers allowed (default: 5)
 * @param props.className - Optional className for wrapper
 *
 * @example
 * const sectionRef = useRef<HTMLElement>(null);
 *
 * <section ref={sectionRef}>
 *   <ParallaxContainer containerRef={sectionRef}>
 *     <ParallaxLayer speed={0} layer="background">
 *       <Canvas />
 *     </ParallaxLayer>
 *     <ParallaxLayer speed={0.4} layer="mid">
 *       <DecorativeElements />
 *     </ParallaxLayer>
 *     <ParallaxLayer speed={1.0} layer="foreground">
 *       <Content />
 *     </ParallaxLayer>
 *   </ParallaxContainer>
 * </section>
 */
export function ParallaxContainer({
  containerRef,
  children,
  offset,
  enabled = true,
  maxLayers = MAX_PARALLAX_LAYERS,
  className,
}: ParallaxContainerProps) {
  // Detect user preferences and viewport
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  // Track scroll progress scoped to container section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: (offset ?? ["start end", "end start"]) as [
      "start end",
      "end start",
    ],
  });

  // Determine if parallax should be active
  // Disabled when: explicitly disabled, reduced motion preferred, or mobile
  const isEnabled = enabled && !prefersReducedMotion && !isMobile;

  return (
    <ParallaxProvider
      containerRef={containerRef}
      scrollProgress={scrollYProgress}
      isEnabled={isEnabled}
      prefersReducedMotion={prefersReducedMotion}
      isMobile={isMobile}
      maxLayers={maxLayers}
    >
      <div className={cn("contents", className)}>{children}</div>
    </ParallaxProvider>
  );
}

export default ParallaxContainer;
