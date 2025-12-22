"use client";

/**
 * NoiseOverlay component - Renders a grain texture overlay.
 * Adds organic feel and breaks up gradient banding.
 */

import { cn } from "@/lib/cn";
import { DECORATIVE_Z_INDEX, type NoiseOverlayProps } from "@/types/decorative";

/**
 * Base64-encoded noise texture (50x50 PNG, grayscale noise).
 * Small size tiles seamlessly and reduces bundle impact.
 */
const NOISE_TEXTURE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4d5eXlzc3Oeli0teleL1dlzZXlvYiQBLT2s9e7SMDZ6dY2Jf5OZmpq7o6/v/v7j4+Pf3N/V8u7O4+/V1NYEjRbmAAAAT0lEQVR42u3PsQ0AIAwEwfsCfex/VAINDxJVKB9Xt3FzZ+bMzJzMzJyZOTNnZubMnJk5M2dmzswAQBKAJABJAJIAJAFIApAEIIlfsr4B+AM7CgPlWXsR1wAAAABJRU5ErkJggg==";

/**
 * NoiseOverlay decorative component.
 *
 * Renders a subtle grain texture overlay that adds organic feel
 * and helps break up gradient banding. Uses a base64-encoded
 * tiling noise texture to avoid network requests.
 *
 * @param props - Component props
 * @param props.intensity - Noise opacity (0-1). Default: 0.05
 * @param props.blendMode - CSS mix-blend-mode. Default: overlay
 * @param props.animated - Whether to animate noise (slight shift). Default: false
 * @param props.className - Additional CSS classes
 *
 * @example
 * <NoiseOverlay intensity={0.03} blendMode="soft-light" />
 */
export function NoiseOverlay({
  intensity = 0.05,
  blendMode = "overlay",
  animated = false,
  className,
}: NoiseOverlayProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none",
        animated && "animate-noise",
        className
      )}
      style={{
        zIndex: DECORATIVE_Z_INDEX.noiseOverlay,
        backgroundImage: `url("${NOISE_TEXTURE}")`,
        backgroundRepeat: "repeat",
        opacity: intensity,
        mixBlendMode: blendMode,
      }}
      aria-hidden="true"
    />
  );
}

export default NoiseOverlay;
