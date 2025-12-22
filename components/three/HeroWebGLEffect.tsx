"use client";

/**
 * HeroWebGLEffect component - WebGL effect layer for hero section.
 * Orchestrates capability detection, effect rendering, and fallback display.
 */

import { useRef, useSyncExternalStore } from "react";
import { useScroll } from "framer-motion";
import { cn } from "@/lib/cn";
import { useWebGLCapabilities } from "@/hooks/useWebGLCapabilities";
import { CanvasWrapper } from "./canvas-wrapper";
import { ParticleField } from "./effects/ParticleField";
import { GlowAura } from "./effects/GlowAura";
import { WebGLFallback } from "./fallbacks/WebGLFallback";
import type { HeroWebGLEffectProps, WebGLEffectType } from "@/types/webgl";

/**
 * Subscribe to mount state (no-op since we only need initial value).
 */
const subscribeToMount = () => () => {};

/**
 * Get mount state client-side.
 */
const getMountState = () => true;

/**
 * Get mount state server-side.
 */
const getMountStateServer = () => false;

/** Default effect type to render */
const DEFAULT_EFFECT_TYPE: WebGLEffectType = "particles";

/**
 * WebGL effect layer for the hero section.
 * Renders at z-5 between frame sequence (z-0) and gradient overlay (z-10).
 *
 * Features:
 * - Automatic GPU capability detection
 * - Adaptive quality based on device performance
 * - Mobile and reduced motion detection
 * - CSS fallback when WebGL unavailable
 * - Scroll-synchronized effects
 *
 * @param props - Component props
 * @param props.className - Optional additional CSS classes
 * @param props.effectType - Effect to render ("particles" | "glow" | "none")
 * @param props.scrollProgress - External scroll progress (optional, auto-detected if not provided)
 * @param props.disabled - Force disable WebGL effects
 *
 * @example
 * // In HeroSection sticky container
 * <div className="absolute inset-0 z-[5]">
 *   <HeroWebGLEffect effectType="particles" />
 * </div>
 */
export function HeroWebGLEffect({
  className,
  effectType = DEFAULT_EFFECT_TYPE,
  scrollProgress: externalScrollProgress,
  disabled = false,
}: HeroWebGLEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track client-side mount to avoid hydration mismatch
  // Using useSyncExternalStore to avoid setState in effect
  const isMounted = useSyncExternalStore(
    subscribeToMount,
    getMountState,
    getMountStateServer
  );

  // Detect WebGL capabilities
  const capabilities = useWebGLCapabilities();

  // Use Framer Motion's useScroll if no external progress provided
  // This tracks the entire page scroll (hero section handles its own mapping)
  const { scrollYProgress: internalScrollProgress } = useScroll();
  const scrollProgress = externalScrollProgress ?? internalScrollProgress;

  // Check if effects should be shown (not "none" type)
  const showEffects = effectType !== "none";

  // Determine if WebGL should be rendered
  const shouldRenderWebGL =
    capabilities.isEnabled && !disabled && showEffects;

  // Render placeholder during SSR to avoid hydration mismatch
  // WebGL detection only works client-side
  if (!isMounted) {
    return (
      <div
        ref={containerRef}
        className={cn("absolute inset-0 opacity-0", className)}
        data-webgl="loading"
      />
    );
  }

  // Show fallback if WebGL is disabled
  if (!shouldRenderWebGL) {
    return (
      <div
        ref={containerRef}
        className={cn("absolute inset-0", className)}
        data-webgl="fallback"
        data-reason={capabilities.disableReason}
      >
        <WebGLFallback
          reason={capabilities.disableReason}
          showEffect={showEffects}
        />
      </div>
    );
  }

  // Render WebGL effect
  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0",
        // Prevent blocking interaction with content
        "pointer-events-none",
        // Smooth fade-in transition
        "transition-opacity duration-500",
        className
      )}
      data-webgl="active"
      data-tier={capabilities.tier}
    >
      <CanvasWrapper
        className="h-full w-full"
        // Use invisible fallback during Suspense to prevent flashing
        fallback={<div className="h-full w-full" />}
        // Optimize for transparency
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        // Adjust camera for 2D-like effects
        camera={{ position: [0, 0, 5], fov: 50 }}
        // Performance optimizations
        dpr={[1, 1.5]} // Limit pixel ratio for performance
        frameloop="always" // Continuous animation
      >
        {/* Render selected effect */}
        {effectType === "particles" && (
          <ParticleField
            scrollProgress={scrollProgress}
            quality={capabilities.quality}
            color="#a855f7"
            sizeRange={[0.08, 0.15]}
            spread={[8, 6, 2]}
            speed={0.15}
          />
        )}

        {effectType === "glow" && (
          <GlowAura
            scrollProgress={scrollProgress}
            quality={capabilities.quality}
            innerColor="#9333ea"
            outerColor="#3b82f6"
            radius={4}
            pulseIntensity={0.25}
          />
        )}

        {/* Ambient light for any mesh-based effects */}
        <ambientLight intensity={0.5} />
      </CanvasWrapper>
    </div>
  );
}

export default HeroWebGLEffect;
