"use client";

/**
 * WebGLFallback component - CSS fallback when WebGL is unavailable.
 * Displays a subtle gradient/blur effect that mimics the WebGL aesthetic.
 */

import { cn } from "@/lib/cn";
import type { WebGLFallbackProps } from "@/types/webgl";

/**
 * CSS fallback displayed when WebGL effects cannot be rendered.
 * Provides a subtle ambient visual effect using pure CSS.
 *
 * @param props - Component props
 * @param props.className - Optional additional CSS classes
 * @param props.reason - Reason for fallback (for debugging)
 * @param props.showEffect - Whether to display the fallback effect (default: true)
 *
 * @example
 * <WebGLFallback reason="mobile-viewport" />
 */
export function WebGLFallback({
  className,
  reason,
  showEffect = true,
}: WebGLFallbackProps) {
  if (!showEffect) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute inset-0",
        "pointer-events-none",
        "overflow-hidden",
        className
      )}
      aria-hidden="true"
      data-fallback-reason={reason}
    >
      {/* Ambient glow effect using radial gradients */}
      <div
        className={cn(
          "absolute inset-0",
          "opacity-30",
          "bg-[radial-gradient(ellipse_at_center,rgba(147,51,234,0.15)_0%,transparent_70%)]"
        )}
      />

      {/* Secondary glow offset for depth */}
      <div
        className={cn(
          "absolute inset-0",
          "opacity-20",
          "translate-x-1/4 translate-y-1/4",
          "bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1)_0%,transparent_60%)]"
        )}
      />

      {/* Subtle noise texture overlay for visual interest */}
      <div
        className={cn(
          "absolute inset-0",
          "opacity-[0.02]",
          "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]"
        )}
      />
    </div>
  );
}

export default WebGLFallback;
