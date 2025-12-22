"use client";

/**
 * ParallaxLayer component - Individual layer with configurable parallax speed.
 * Applies GPU-accelerated transforms based on scroll progress.
 */

import { useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useParallaxTransform } from "@/hooks";
import { useParallaxContext } from "./ParallaxContext";
import {
  PARALLAX_LAYER_SPEEDS,
  type ParallaxLayerProps,
  type ParallaxLayerType,
} from "@/types/parallax";

/**
 * Get speed value from layer type or explicit speed prop.
 */
function getLayerSpeed(
  speed: number | undefined,
  layer: ParallaxLayerType | undefined
): number {
  // Explicit speed takes precedence
  if (speed !== undefined) {
    return speed;
  }

  // Named layer type maps to preset speed
  if (layer) {
    return PARALLAX_LAYER_SPEEDS[layer];
  }

  // Default to mid-layer speed
  return PARALLAX_LAYER_SPEEDS.mid;
}

/**
 * Determine if pointer events should be enabled for this layer.
 */
function getPointerEvents(
  pointerEvents: boolean | undefined,
  layer: ParallaxLayerType | undefined
): boolean {
  // Explicit prop takes precedence
  if (pointerEvents !== undefined) {
    return pointerEvents;
  }

  // Mid-layer defaults to no pointer events (decorative)
  if (layer === "mid") {
    return false;
  }

  // Background and foreground default to pointer events enabled
  return true;
}

/**
 * Individual parallax layer with configurable speed.
 *
 * Speed behavior:
 * - 0: Element stays fixed relative to section (no parallax)
 * - 0.3-0.5: Element moves slower than scroll (appears behind)
 * - 1.0: Element moves at scroll speed (no parallax effect)
 * - 1.0-1.3: Element moves faster than scroll (appears in front)
 *
 * GPU Acceleration:
 * - Uses translate3d(0, Ypx, 0) for GPU-accelerated transforms
 * - Sets will-change: transform when enabled
 * - Falls back to static position when parallax is disabled
 *
 * @param props - Component props
 * @param props.children - Content to render in this layer
 * @param props.speed - Speed multiplier (overrides layer preset)
 * @param props.layer - Named layer type (background, mid, foreground)
 * @param props.className - Optional className for wrapper
 * @param props.zIndex - Z-index for stacking order
 * @param props.pointerEvents - Whether to enable pointer events
 *
 * @example
 * // Using named layer type
 * <ParallaxLayer layer="background" zIndex={0}>
 *   <Canvas />
 * </ParallaxLayer>
 *
 * // Using explicit speed
 * <ParallaxLayer speed={0.3} zIndex={5}>
 *   <DecorativeElements />
 * </ParallaxLayer>
 *
 * // Foreground with pointer events
 * <ParallaxLayer layer="foreground" zIndex={20}>
 *   <InteractiveContent />
 * </ParallaxLayer>
 */
export function ParallaxLayer({
  children,
  speed,
  layer,
  className,
  zIndex,
  pointerEvents,
}: ParallaxLayerProps) {
  // Get context from container
  const { scrollProgress, isEnabled, registerLayer } = useParallaxContext();

  // Register this layer with container for count tracking
  useEffect(() => {
    const unregister = registerLayer();
    return unregister;
  }, [registerLayer]);

  // Calculate effective speed
  const effectiveSpeed = getLayerSpeed(speed, layer);

  // Calculate pointer events
  const hasPointerEvents = getPointerEvents(pointerEvents, layer);

  // Get parallax transform
  const { style } = useParallaxTransform({
    speed: effectiveSpeed,
    scrollProgress,
    enabled: isEnabled,
  });

  return (
    <motion.div
      className={cn(
        "absolute inset-0",
        // Prevent horizontal shifting
        "origin-center",
        // Pointer events based on layer type
        !hasPointerEvents && "pointer-events-none",
        className
      )}
      style={{
        // Apply parallax transform (GPU-accelerated via translate3d)
        ...style,
        // Z-index for layer stacking
        ...(zIndex !== undefined && { zIndex }),
        // Force GPU layer creation
        transform: "translate3d(0, 0, 0)",
      }}
    >
      {children}
    </motion.div>
  );
}

export default ParallaxLayer;
