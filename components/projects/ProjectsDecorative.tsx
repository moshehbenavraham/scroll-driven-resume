"use client";

/**
 * ProjectsDecorative component - Section-specific decorative elements.
 * Uses existing decorative components for visual consistency.
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
import type { ProjectsDecorativeProps } from "@/types/projects";

/**
 * Decorative elements for the Projects section.
 * Creates visual depth and continuity with other sections.
 * Hidden on mobile and when reduced motion is preferred.
 *
 * @param props - Component props
 * @param props.className - Optional additional CSS classes
 */
export function ProjectsDecorative({ className }: ProjectsDecorativeProps) {
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
            { color: "rgba(147, 112, 219, 0.04)", position: 0 },
            { color: "rgba(100, 149, 237, 0.02)", position: 50 },
            { color: "transparent", position: 100 },
          ]}
          opacity={0.35}
        />

        {/* Top left circle */}
        <FloatingShape
          variant="circle"
          position={{ x: 6, y: 18 }}
          size="md"
          color="accent"
          opacity={0.08}
          blur={2}
          speed={0.3}
          delay={0.1}
        />

        {/* Top right hexagon */}
        <FloatingShape
          variant="hexagon"
          position={{ x: 90, y: 12 }}
          size="sm"
          color="muted"
          opacity={0.1}
          blur={1}
          speed={0.28}
          delay={0.2}
        />

        {/* Connection line left diagonal */}
        <ConnectionLine
          start={{ x: 8, y: 25 }}
          end={{ x: 18, y: 65 }}
          color="rgba(147, 112, 219, 0.07)"
          thickness={1}
          opacity={0.14}
          delay={0.3}
        />

        {/* Center triangle - subtle */}
        <FloatingShape
          variant="triangle"
          position={{ x: 55, y: 50 }}
          size="sm"
          color="highlight"
          opacity={0.05}
          blur={2}
          speed={0.25}
          delay={0.4}
        />

        {/* Bottom left diamond */}
        <FloatingShape
          variant="diamond"
          position={{ x: 12, y: 78 }}
          size="sm"
          color="accent"
          opacity={0.09}
          blur={1}
          speed={0.32}
          delay={0.5}
        />

        {/* Connection line right side */}
        <ConnectionLine
          start={{ x: 88, y: 20 }}
          end={{ x: 92, y: 58 }}
          color="rgba(100, 149, 237, 0.06)"
          thickness={1}
          opacity={0.12}
          delay={0.6}
        />

        {/* Bottom right circle */}
        <FloatingShape
          variant="circle"
          position={{ x: 94, y: 82 }}
          size="sm"
          color="muted"
          opacity={0.07}
          blur={2}
          speed={0.26}
          delay={0.7}
        />

        {/* Noise overlay for organic texture */}
        <NoiseOverlay intensity={0.012} blendMode="overlay" />
      </DecorativeElements>
    </div>
  );
}

export default ProjectsDecorative;
