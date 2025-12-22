"use client";

/**
 * AboutDecorative component - Section-specific decorative elements.
 * Uses existing decorative components for visual consistency with hero.
 * Hidden on mobile for performance.
 */

import { cn } from "@/lib/cn";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  DecorativeElements,
  FloatingShape,
  ConnectionLine,
  GradientMesh,
  NoiseOverlay,
} from "@/components/decorative";
import type { AboutDecorativeProps } from "@/types/about";

/**
 * Decorative elements for the About section.
 * Creates visual depth and continuity with hero section.
 * Hidden on mobile and when reduced motion is preferred.
 *
 * @param props - Component props
 * @param props.className - Optional additional CSS classes
 * @param props.children - Optional child elements for composition
 */
export function AboutDecorative({ className, children }: AboutDecorativeProps) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  // Don't render decoratives on mobile or with reduced motion
  if (isMobile || prefersReducedMotion) {
    return null;
  }

  return (
    <div
      className={cn("absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      <DecorativeElements staggerDelay={0.15}>
        {/* Gradient mesh for atmospheric depth */}
        <GradientMesh
          type="radial"
          stops={[
            { color: "rgba(147, 112, 219, 0.05)", position: 0 },
            { color: "rgba(100, 100, 120, 0.03)", position: 40 },
            { color: "transparent", position: 100 },
          ]}
          opacity={0.5}
        />

        {/* Top left floating shape */}
        <FloatingShape
          variant="hexagon"
          position={{ x: 5, y: 15 }}
          size="md"
          color="accent"
          opacity={0.15}
          blur={1}
          speed={0.3}
          delay={0.1}
        />

        {/* Top right shape */}
        <FloatingShape
          variant="circle"
          position={{ x: 90, y: 10 }}
          size="sm"
          color="muted"
          opacity={0.12}
          blur={2}
          speed={0.4}
          delay={0.2}
        />

        {/* Mid section connection line */}
        <ConnectionLine
          start={{ x: 8, y: 20 }}
          end={{ x: 25, y: 45 }}
          color="rgba(147, 112, 219, 0.1)"
          thickness={1}
          opacity={0.2}
          delay={0.3}
        />

        {/* Center diamond */}
        <FloatingShape
          variant="diamond"
          position={{ x: 50, y: 50 }}
          size="sm"
          color="highlight"
          opacity={0.1}
          blur={1}
          speed={0.35}
          delay={0.4}
        />

        {/* Bottom left shape */}
        <FloatingShape
          variant="triangle"
          position={{ x: 8, y: 85 }}
          size="md"
          color="accent"
          opacity={0.12}
          blur={2}
          speed={0.25}
          delay={0.5}
        />

        {/* Bottom right shape */}
        <FloatingShape
          variant="circle"
          position={{ x: 85, y: 80 }}
          size="lg"
          color="muted"
          opacity={0.08}
          blur={3}
          speed={0.45}
          delay={0.6}
        />

        {/* Connection from achievements area */}
        <ConnectionLine
          start={{ x: 75, y: 25 }}
          end={{ x: 88, y: 75 }}
          color="rgba(147, 112, 219, 0.08)"
          thickness={1}
          opacity={0.15}
          delay={0.7}
        />

        {/* Noise overlay for organic texture */}
        <NoiseOverlay intensity={0.02} blendMode="overlay" />
      </DecorativeElements>

      {/* Allow composition with custom children */}
      {children}
    </div>
  );
}

export default AboutDecorative;
