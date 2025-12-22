"use client";

/**
 * useCanvasRenderer - Handles canvas drawing for frame sequences.
 *
 * Draws a single frame to canvas on each frame change.
 * Uses requestAnimationFrame for smooth, tear-free rendering.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  UseCanvasRendererOptions,
  UseCanvasRendererReturn,
  DrawDimensions,
} from "@/types/animation";

/**
 * Calculate dimensions for object-fit: cover behavior.
 * Crops source image to fill destination while preserving aspect ratio.
 */
function calculateCoverFit(
  imgWidth: number,
  imgHeight: number,
  canvasWidth: number,
  canvasHeight: number
): DrawDimensions {
  const imgAspect = imgWidth / imgHeight;
  const canvasAspect = canvasWidth / canvasHeight;

  let sx = 0;
  let sy = 0;
  let sWidth = imgWidth;
  let sHeight = imgHeight;

  if (imgAspect > canvasAspect) {
    // Image is wider than canvas - crop horizontally
    sWidth = imgHeight * canvasAspect;
    sx = (imgWidth - sWidth) / 2;
  } else {
    // Image is taller than canvas - crop vertically
    sHeight = imgWidth / canvasAspect;
    sy = (imgHeight - sHeight) / 2;
  }

  return {
    sx,
    sy,
    sWidth,
    sHeight,
    dx: 0,
    dy: 0,
    dWidth: canvasWidth,
    dHeight: canvasHeight,
  };
}

/**
 * Hook to render frames to a canvas element.
 *
 * Draws a single frame at a time - no opacity transitions.
 * Uses requestAnimationFrame for tear-free rendering.
 *
 * @param options - Configuration options
 * @param options.canvasRef - Reference to the canvas element
 * @param options.currentFrame - Current frame index to draw
 * @param options.getImage - Function to get HTMLImageElement by index
 * @param options.enabled - Whether rendering is enabled (default: true)
 * @returns Object with lastDrawnFrame
 *
 * @example
 * const canvasRef = useRef<HTMLCanvasElement>(null);
 * const { lastDrawnFrame } = useCanvasRenderer({
 *   canvasRef,
 *   currentFrame: 5,
 *   getImage: (i) => imageCache.get(i),
 * });
 */
export function useCanvasRenderer({
  canvasRef,
  currentFrame,
  getImage,
  enabled = true,
}: UseCanvasRendererOptions): UseCanvasRendererReturn {
  const [lastDrawnFrame, setLastDrawnFrame] = useState(-1);
  const lastDrawnRef = useRef(-1);
  const rafRef = useRef<number | null>(null);

  // Draw a frame to the canvas
  const drawFrame = useCallback(
    (ctx: CanvasRenderingContext2D, image: HTMLImageElement) => {
      const canvas = ctx.canvas;

      // Clear previous frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate cover fit dimensions
      const dims = calculateCoverFit(
        image.naturalWidth,
        image.naturalHeight,
        canvas.width,
        canvas.height
      );

      // Draw single frame
      ctx.drawImage(
        image,
        dims.sx,
        dims.sy,
        dims.sWidth,
        dims.sHeight,
        dims.dx,
        dims.dy,
        dims.dWidth,
        dims.dHeight
      );
    },
    []
  );

  // Effect to draw frames when currentFrame changes
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Skip if frame hasn't changed
    if (currentFrame === lastDrawnRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const image = getImage(currentFrame);
    if (!image || !image.complete) {
      return;
    }

    // Cancel any pending RAF
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    // Use RAF for tear-free rendering
    rafRef.current = requestAnimationFrame(() => {
      drawFrame(ctx, image);
      lastDrawnRef.current = currentFrame;
      setLastDrawnFrame(currentFrame);
      rafRef.current = null;
    });

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [canvasRef, currentFrame, getImage, enabled, drawFrame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    lastDrawnFrame,
  };
}

export default useCanvasRenderer;
