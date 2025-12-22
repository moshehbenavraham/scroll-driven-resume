"use client";

/**
 * FrameImage component - Individual frame image with optimized rendering.
 * Used by FrameSequence for opacity-based frame switching.
 */

import { memo } from "react";
import { cn } from "@/lib/cn";
import type { FrameImageProps } from "@/types/animation";

/**
 * Individual frame image component.
 * Positioned absolutely within parent container.
 * Uses opacity for visibility toggling (GPU accelerated).
 *
 * @param props - Component props
 * @param props.src - URL of the frame image
 * @param props.alt - Alt text for accessibility
 * @param props.isActive - Whether this frame is currently visible
 * @param props.zIndex - Z-index for stacking order
 * @param props.className - Optional additional CSS classes
 * @param props.loading - Optional loading strategy (default: "eager")
 */
function FrameImageComponent({
  src,
  alt,
  isActive,
  zIndex,
  className,
  loading = "eager",
}: FrameImageProps) {
  return (
    // Using native img intentionally for frame animation performance
    // Next.js Image adds overhead not suitable for 100+ dynamically loaded frames
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={loading}
      draggable={false}
      className={cn(
        // Base positioning - fill parent container
        "absolute inset-0 w-full h-full object-cover",
        // GPU-accelerated opacity transition
        "transition-opacity duration-75 ease-linear",
        // Performance hints
        "will-change-opacity",
        // Prevent selection/dragging
        "select-none pointer-events-none",
        className
      )}
      style={{
        opacity: isActive ? 1 : 0,
        zIndex,
      }}
    />
  );
}

/**
 * Memoized FrameImage to prevent unnecessary re-renders.
 * Only re-renders when src, isActive, or zIndex changes.
 */
export const FrameImage = memo(FrameImageComponent, (prevProps, nextProps) => {
  return (
    prevProps.src === nextProps.src &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.zIndex === nextProps.zIndex
  );
});

FrameImage.displayName = "FrameImage";

export default FrameImage;
