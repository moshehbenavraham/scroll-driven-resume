"use client";

/**
 * SkillsDecorative component - Section-specific decorative elements.
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
import type { SkillsDecorativeProps } from "@/types/skills";

/**
 * Decorative elements for the Skills section.
 * Creates visual depth and continuity with other sections.
 * Hidden on mobile and when reduced motion is preferred.
 *
 * @param props - Component props
 * @param props.className - Optional additional CSS classes
 */
export function SkillsDecorative({ className }: SkillsDecorativeProps) {
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
            { color: "rgba(100, 149, 237, 0.04)", position: 0 },
            { color: "rgba(100, 100, 120, 0.02)", position: 50 },
            { color: "transparent", position: 100 },
          ]}
          opacity={0.4}
        />

        {/* Top left floating hexagon */}
        <FloatingShape
          variant="hexagon"
          position={{ x: 8, y: 20 }}
          size="sm"
          color="accent"
          opacity={0.1}
          blur={1}
          speed={0.25}
          delay={0.1}
        />

        {/* Top right circle */}
        <FloatingShape
          variant="circle"
          position={{ x: 92, y: 15 }}
          size="md"
          color="muted"
          opacity={0.08}
          blur={2}
          speed={0.35}
          delay={0.2}
        />

        {/* Connection line left side */}
        <ConnectionLine
          start={{ x: 5, y: 30 }}
          end={{ x: 15, y: 70 }}
          color="rgba(100, 149, 237, 0.08)"
          thickness={1}
          opacity={0.15}
          delay={0.3}
        />

        {/* Center diamond - subtle */}
        <FloatingShape
          variant="diamond"
          position={{ x: 50, y: 45 }}
          size="sm"
          color="highlight"
          opacity={0.06}
          blur={2}
          speed={0.3}
          delay={0.4}
        />

        {/* Bottom right triangle */}
        <FloatingShape
          variant="triangle"
          position={{ x: 88, y: 75 }}
          size="sm"
          color="accent"
          opacity={0.1}
          blur={1}
          speed={0.28}
          delay={0.5}
        />

        {/* Connection line right side */}
        <ConnectionLine
          start={{ x: 85, y: 25 }}
          end={{ x: 95, y: 65 }}
          color="rgba(100, 149, 237, 0.06)"
          thickness={1}
          opacity={0.12}
          delay={0.6}
        />

        {/* Noise overlay for organic texture */}
        <NoiseOverlay intensity={0.015} blendMode="overlay" />
      </DecorativeElements>
    </div>
  );
}

export default SkillsDecorative;
