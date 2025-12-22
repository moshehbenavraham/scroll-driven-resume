/**
 * Diamond SVG decorative shape component.
 * Renders a diamond (rotated square) for floating decorative elements.
 */

import { cn } from "@/lib/cn";
import type { ShapeSVGProps } from "@/types/decorative";

/**
 * Calculate diamond points for given size.
 */
function getDiamondPoints(size: number, strokeWidth: number): string {
  const padding = strokeWidth;
  const halfSize = size / 2;

  // Points: top, right, bottom, left (diamond orientation)
  const points: [number, number][] = [
    [halfSize, padding],
    [size - padding, halfSize],
    [halfSize, size - padding],
    [padding, halfSize],
  ];

  return points.map((p) => p.join(",")).join(" ");
}

/**
 * Diamond decorative shape.
 *
 * @param props - Shape props
 * @param props.size - Diamond bounding box size in pixels. Default: 40
 * @param props.fill - Fill color. Default: currentColor
 * @param props.stroke - Stroke color. Default: none
 * @param props.strokeWidth - Stroke width. Default: 0
 * @param props.opacity - Opacity (0-1). Default: 1
 * @param props.className - Additional CSS classes
 */
export function Diamond({
  size = 40,
  fill = "currentColor",
  stroke = "none",
  strokeWidth = 0,
  opacity = 1,
  className,
}: ShapeSVGProps) {
  const points = getDiamondPoints(size, strokeWidth);

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

export default Diamond;
