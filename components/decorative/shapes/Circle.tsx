/**
 * Circle SVG decorative shape component.
 * Renders a circular shape for floating decorative elements.
 */

import { cn } from "@/lib/cn";
import type { ShapeSVGProps } from "@/types/decorative";

/**
 * Circle decorative shape.
 *
 * @param props - Shape props
 * @param props.size - Circle diameter in pixels. Default: 40
 * @param props.fill - Fill color. Default: currentColor
 * @param props.stroke - Stroke color. Default: none
 * @param props.strokeWidth - Stroke width. Default: 0
 * @param props.opacity - Opacity (0-1). Default: 1
 * @param props.className - Additional CSS classes
 */
export function Circle({
  size = 40,
  fill = "currentColor",
  stroke = "none",
  strokeWidth = 0,
  opacity = 1,
  className,
}: ShapeSVGProps) {
  const radius = size / 2 - strokeWidth;

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
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={opacity}
      />
    </svg>
  );
}

export default Circle;
