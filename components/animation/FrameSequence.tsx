"use client";

/**
 * FrameSequence component - Scroll-synchronized frame animation.
 * Renders a sequence of frames with opacity-based switching for smooth playback.
 */

import { useEffect, useMemo } from "react";
import { cn } from "@/lib/cn";
import { useFrameSequence } from "@/hooks/useFrameSequence";
import { getVirtualizedRange } from "@/lib/frame-utils";
import { FrameImage } from "./FrameImage";
import {
  FRAME_VIRTUALIZATION_RANGE,
  type FrameSequenceProps,
} from "@/types/animation";

/**
 * FrameSequence component for scroll-synchronized frame animation.
 *
 * Features:
 * - Opacity-based frame switching for smooth playback
 * - Frame virtualization (only renders current +/- 2 frames)
 * - Automatic preloading with priority for first N frames
 * - Reduced motion support (static first frame)
 * - Mobile fallback (static first frame)
 * - Sync to Zustand store for global state access
 *
 * @param props - Component props
 * @param props.sequence - Sequence identifier ("hero" or "product")
 * @param props.containerRef - Reference to scroll container element
 * @param props.className - Optional additional CSS classes
 * @param props.priorityCount - Number of frames to preload first (default: 10)
 * @param props.onLoadComplete - Callback when preloading completes
 * @param props.onLoadProgress - Callback for preload progress updates
 * @param props.disabled - Whether to force disable animation
 * @param props.offset - Custom scroll offset configuration
 *
 * @example
 * const sectionRef = useRef<HTMLElement>(null);
 *
 * return (
 *   <section ref={sectionRef} className="relative h-[300vh]">
 *     <div className="sticky top-0 h-screen">
 *       <FrameSequence
 *         sequence="hero"
 *         containerRef={sectionRef}
 *         onLoadComplete={() => console.log('Ready!')}
 *       />
 *     </div>
 *   </section>
 * );
 */
export function FrameSequence({
  sequence,
  containerRef,
  className,
  priorityCount = 10,
  onLoadComplete,
  onLoadProgress,
  disabled = false,
  offset,
}: FrameSequenceProps) {
  // Use the integration hook
  const {
    currentFrame,
    frameUrls,
    isLoading,
    isReady,
    loadProgress,
    prefersReducedMotion,
    isMobile,
    startPreload,
  } = useFrameSequence({
    sequence,
    containerRef,
    priorityCount,
    offset,
    onProgress: onLoadProgress,
    onComplete: onLoadComplete,
  });

  // Start preloading on mount
  useEffect(() => {
    startPreload();
  }, [startPreload]);

  // Should show static frame?
  const showStatic = disabled || prefersReducedMotion || isMobile;

  // Calculate virtualized frame range
  const { start, end } = useMemo(() => {
    if (showStatic) {
      return { start: 0, end: 0 };
    }
    return getVirtualizedRange(
      currentFrame,
      frameUrls.length,
      FRAME_VIRTUALIZATION_RANGE
    );
  }, [currentFrame, frameUrls.length, showStatic]);

  // Get frames to render (virtualized)
  const framesToRender = useMemo(() => {
    if (frameUrls.length === 0) {
      return [];
    }

    if (showStatic) {
      // Only render first frame when disabled
      return [{ index: 0, url: frameUrls[0] }];
    }

    // Render virtualized range
    const frames: Array<{ index: number; url: string }> = [];
    for (let i = start; i <= end; i++) {
      if (i >= 0 && i < frameUrls.length) {
        frames.push({ index: i, url: frameUrls[i] });
      }
    }
    return frames;
  }, [frameUrls, showStatic, start, end]);

  // Don't render until we have frame URLs
  if (frameUrls.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        // Container fills parent
        "relative w-full h-full overflow-hidden",
        // Ensure proper stacking context
        "isolate",
        className
      )}
      role="img"
      aria-label={`${sequence} animation sequence`}
      aria-live="polite"
      data-sequence={sequence}
      data-frame={currentFrame}
      data-loading={isLoading}
      data-ready={isReady}
    >
      {/* Loading indicator (shown while preloading) */}
      {isLoading && !isReady ? (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/50"
          role="status"
          aria-label={`Loading ${sequence} frames: ${loadProgress}%`}
        >
          <div className="text-white text-sm font-mono">
            Loading... {loadProgress}%
          </div>
        </div>
      ) : null}

      {/* Frame images (virtualized) */}
      {framesToRender.map(({ index, url }) => (
        <FrameImage
          key={`${sequence}-frame-${index}`}
          src={url}
          alt={`${sequence} frame ${index + 1}`}
          isActive={showStatic ? index === 0 : index === currentFrame}
          zIndex={
            showStatic
              ? 1
              : index === currentFrame
                ? FRAME_VIRTUALIZATION_RANGE + 1
                : FRAME_VIRTUALIZATION_RANGE - Math.abs(index - currentFrame)
          }
        />
      ))}
    </div>
  );
}

export default FrameSequence;
