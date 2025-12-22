"use client";

/**
 * FrameSequence component - Scroll-synchronized frame animation.
 * Uses canvas-based rendering for flicker-free frame switching.
 */

import { useEffect } from "react";
import { cn } from "@/lib/cn";
import { useFrameSequence } from "@/hooks/useFrameSequence";
import { CanvasFrameRenderer } from "./CanvasFrameRenderer";
import type { FrameSequenceProps } from "@/types/animation";

/**
 * FrameSequence component for scroll-synchronized frame animation.
 *
 * Features:
 * - Canvas-based rendering for flicker-free frame switching
 * - Single frame drawn at a time (no opacity transitions)
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

  // Don't render until we have frame URLs
  if (frameUrls.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        // Container fills parent
        "relative h-full w-full overflow-hidden",
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
          <div className="font-mono text-sm text-white">
            Loading... {loadProgress}%
          </div>
        </div>
      ) : null}

      {/* Frame rendering */}
      {showStatic ? (
        // Static fallback: single img for reduced motion/mobile
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={frameUrls[0]}
          alt={`${sequence} static frame`}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        // Canvas-based rendering for smooth scroll animation
        <CanvasFrameRenderer
          frameUrls={frameUrls}
          currentFrame={currentFrame}
          className="h-full w-full"
        />
      )}
    </div>
  );
}

export default FrameSequence;
