/**
 * Triangle SVG decorative shape component.
 * Renders an equilateral triangle for floating decorative elements.
 */

import { cn } from "@/lib/cn";
import type { ShapeSVGProps } from "@/types/decorative";

/**
 * Calculate equilateral triangle points for given size.
 */
function getTrianglePoints(size: number, strokeWidth: number): string {
  const padding = strokeWidth;
  const width = size - padding * 2;
  const height = (width * Math.sqrt(3)) / 2;
  const yOffset = (size - height) / 2;

  // Points: top center, bottom left, bottom right
  const points = [
    [size / 2, yOffset + padding],
    [padding, size - yOffset - padding],
    [size - padding, size - yOffset - padding],
  ];

  return points.map((p) => p.join(",")).join(" ");
}

/**
 * Triangle decorative shape.
 *
 * @param props - Shape props
 * @param props.size - Triangle bounding box size in pixels. Default: 40
 * @param props.fill - Fill color. Default: currentColor
 * @param props.stroke - Stroke color. Default: none
 * @param props.strokeWidth - Stroke width. Default: 0
 * @param props.opacity - Opacity (0-1). Default: 1
 * @param props.className - Additional CSS classes
 */
export function Triangle({
  size = 40,
  fill = "currentColor",
  stroke = "none",
  strokeWidth = 0,
  opacity = 1,
  className,
}: ShapeSVGProps) {
  const points = getTrianglePoints(size, strokeWidth);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <polygon
        points={points}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity={opacity}
      />
    </svg>
  );
}

export default Triangle;
