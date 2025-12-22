"use client";

/**
 * GradientMesh component - Renders a gradient background for atmospheric depth.
 * Creates subtle color transitions behind decorative elements.
 */

import { cn } from "@/lib/cn";
import {
  DECORATIVE_Z_INDEX,
  DEFAULT_GRADIENT_STOPS,
  type GradientMeshProps,
} from "@/types/decorative";

/**
 * Build CSS gradient string from stops and type.
 */
function buildGradient(
  type: "radial" | "linear" | "conic",
  stops: { color: string; position: number }[],
  angle: number
): string {
  const stopsString = stops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(", ");

  switch (type) {
    case "linear":
      return `linear-gradient(${angle}deg, ${stopsString})`;
    case "conic":
      return `conic-gradient(from ${angle}deg, ${stopsString})`;
    case "radial":
    default:
      return `radial-gradient(ellipse at center, ${stopsString})`;
  }
}

/**
 * GradientMesh decorative component.
 *
 * Renders a CSS gradient background that creates atmospheric depth
 * behind other decorative elements. Supports radial, linear, and
 * conic gradient types.
 *
 * @param props - Component props
 * @param props.stops - Array of gradient stops with color and position
 * @param props.type - Gradient type: radial, linear, or conic. Default: radial
 * @param props.angle - Angle for linear/conic gradients in degrees. Default: 45
 * @param props.opacity - Overall opacity (0-1). Default: 0.5
 * @param props.blendMode - CSS mix-blend-mode. Default: normal
 * @param props.className - Additional CSS classes
 *
 * @example
 * <GradientMesh
 *   type="radial"
 *   stops={[
 *     { color: "rgba(147, 112, 219, 0.2)", position: 0 },
 *     { color: "transparent", position: 100 },
 *   ]}
 *   opacity={0.4}
 * />
 */
export function GradientMesh({
  stops = DEFAULT_GRADIENT_STOPS,
  type = "radial",
  angle = 45,
  opacity = 0.5,
  blendMode = "normal",
  className,
}: GradientMeshProps) {
  const gradient = buildGradient(type, stops, angle);

  return (
    <div
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none",
        className
      )}
      style={{
        zIndex: DECORATIVE_Z_INDEX.gradientMesh,
        background: gradient,
        opacity: opacity,
        mixBlendMode: blendMode,
      }}
      aria-hidden="true"
    />
  );
}

export default GradientMesh;
