"use client";

/**
 * CanvasFrameRenderer - Renders frame sequences to canvas.
 *
 * Replaces stacked img elements with a single canvas that draws
 * one frame at a time, eliminating opacity transition flashing.
 */

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { useImageCache } from "@/hooks/useImageCache";
import { useCanvasRenderer } from "@/hooks/useCanvasRenderer";
import type { CanvasFrameRendererProps } from "@/types/animation";

/**
 * Canvas-based frame sequence renderer.
 *
 * Draws a single frame at a time to eliminate opacity transition
 * artifacts during rapid scroll.
 *
 * @param props - Component props
 * @param props.frameUrls - Array of frame URLs
 * @param props.currentFrame - Current frame index to display
 * @param props.className - Optional CSS class name
 *
 * @example
 * <CanvasFrameRenderer
 *   frameUrls={urls}
 *   currentFrame={42}
 *   className="h-full w-full"
 * />
 */
export function CanvasFrameRenderer({
  frameUrls,
  currentFrame,
  className,
}: CanvasFrameRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cache images for canvas drawing
  const { getImage, loadedCount } = useImageCache({
    frameUrls,
    enabled: frameUrls.length > 0,
  });

  // Handle canvas drawing
  useCanvasRenderer({
    canvasRef,
    currentFrame,
    getImage,
    enabled: loadedCount > 0,
  });

  // Resize canvas to match container with HiDPI support
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size accounting for device pixel ratio
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Set display size via CSS
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Scale context for HiDPI
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // Redraw current frame after resize
    const image = getImage(currentFrame);
    if (image && image.complete) {
      const drawCtx = canvas.getContext("2d");
      if (drawCtx) {
        // Force redraw by triggering the renderer
        // The useCanvasRenderer effect will handle the actual draw
      }
    }
  }, [currentFrame, getImage]);

  // Initial resize and ResizeObserver setup
  useEffect(() => {
    resizeCanvas();

    const container = containerRef.current;
    if (!container) {
      return;
    }

    // Use ResizeObserver for responsive resizing
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [resizeCanvas]);

  // Redraw on window resize (backup for ResizeObserver edge cases)
  useEffect(() => {
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full w-full", className)}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />
    </div>
  );
}

export default CanvasFrameRenderer;
