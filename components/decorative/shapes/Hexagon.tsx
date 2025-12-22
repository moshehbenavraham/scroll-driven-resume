/**
 * Hexagon SVG decorative shape component.
 * Renders a regular hexagon for floating decorative elements.
 */

import { cn } from "@/lib/cn";
import type { ShapeSVGProps } from "@/types/decorative";

/**
 * Calculate regular hexagon points for given size.
 */
function getHexagonPoints(size: number, strokeWidth: number): string {
  const padding = strokeWidth;
  const radius = (size - padding * 2) / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  // 6 points at 60-degree intervals, starting from top
  const points: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push([x, y]);
  }

  return points.map((p) => p.join(",")).join(" ");
}

/**
 * Hexagon decorative shape.
 *
 * @param props - Shape props
 * @param props.size - Hexagon bounding box size in pixels. Default: 40
 * @param props.fill - Fill color. Default: currentColor
 * @param props.stroke - Stroke color. Default: none
 * @param props.strokeWidth - Stroke width. Default: 0
 * @param props.opacity - Opacity (0-1). Default: 1
 * @param props.className - Additional CSS classes
 */
export function Hexagon({
  size = 40,
  fill = "currentColor",
  stroke = "none",
  strokeWidth = 0,
  opacity = 1,
  className,
}: ShapeSVGProps) {
  const points = getHexagonPoints(size, strokeWidth);

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

export default Hexagon;
