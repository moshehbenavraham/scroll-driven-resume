"use client";

/**
 * UnifiedHeroCanvas - Single WebGL canvas for frame animation and effects.
 *
 * Combines frame sequence rendering and particle effects into one Three.js canvas
 * to eliminate flashing caused by dual-canvas synchronization issues.
 *
 * Scene graph:
 * - FramePlane (z: -2) - Background frame texture
 * - GlowAura (z: -1) - Optional glow effect
 * - ParticleField (z: 0) - Particle system
 */

import { useRef, useEffect, Suspense, useSyncExternalStore } from "react";
import { useScroll } from "framer-motion";
import type * as THREE from "three";
import { cn } from "@/lib/cn";
import { useWebGLCapabilities } from "@/hooks/useWebGLCapabilities";
import { useUnifiedFrameAnimation } from "@/hooks/useUnifiedFrameAnimation";
import { CanvasWrapper } from "./canvas-wrapper";
import { FramePlane } from "./effects/FramePlane";
import { ParticleField } from "./effects/ParticleField";
import { GlowAura } from "./effects/GlowAura";
import { WebGLFallback } from "./fallbacks/WebGLFallback";
import { FrameSequence } from "@/components/animation/FrameSequence";
import type { FrameSequenceId } from "@/types/animation";
import type { WebGLEffectType } from "@/types/webgl";

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

/**
 * Props for UnifiedHeroCanvas component.
 */
export interface UnifiedHeroCanvasProps {
  /** Frame sequence to display (hero or product) */
  sequence: FrameSequenceId;
  /** Reference to container element for scroll tracking */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Effect type to render. Default: "particles" */
  effectType?: WebGLEffectType;
  /** Optional CSS class name */
  className?: string;
  /** Callback when frame preload completes */
  onLoadComplete?: () => void;
  /** Callback for frame preload progress (0-100) */
  onLoadProgress?: (percent: number) => void;
  /** Force disable WebGL rendering */
  disabled?: boolean;
}

/**
 * Inner canvas content - rendered inside the Canvas context.
 */
function UnifiedHeroCanvasContent({
  currentTexture,
  scrollProgress,
  quality,
  effectType,
}: {
  currentTexture: THREE.Texture | null;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  quality: {
    particleCount: number;
    opacityMultiplier: number;
    enableGlow: boolean;
    enableShaders: boolean;
    targetFPS: number;
  };
  effectType: WebGLEffectType;
}) {
  return (
    <>
      {/* Background layer - frame texture (at z=0, fills viewport) */}
      <FramePlane
        texture={currentTexture}
        renderOrder={0}
        zPosition={0}
      />

      {/* Mid layer - glow effect (if enabled) */}
      {effectType === "glow" && quality.enableGlow ? (
        <GlowAura
          scrollProgress={scrollProgress}
          quality={quality}
          innerColor="#9333ea"
          outerColor="#3b82f6"
          radius={4}
          pulseIntensity={0.25}
        />
      ) : null}

      {/* Top layer - particles */}
      {effectType === "particles" && quality.particleCount > 0 ? (
        <ParticleField
          scrollProgress={scrollProgress}
          quality={quality}
          color="#a855f7"
          sizeRange={[0.08, 0.15]}
          spread={[8, 6, 2]}
          speed={0.15}
        />
      ) : null}

      {/* Ambient light for any mesh-based effects */}
      <ambientLight intensity={0.5} />
    </>
  );
}

/**
 * Unified WebGL canvas combining frame animation and particle effects.
 *
 * Features:
 * - Single RAF loop for synchronized rendering
 * - GPU-accelerated texture-based frame animation
 * - Integrated particle effects
 * - Automatic WebGL fallback to 2D canvas
 * - Mobile and reduced motion detection
 *
 * @param props - Component props
 * @returns Unified WebGL canvas or fallback
 *
 * @example
 * <UnifiedHeroCanvas
 *   sequence="hero"
 *   containerRef={sectionRef}
 *   effectType="particles"
 *   onLoadComplete={() => setReady(true)}
 * />
 */
export function UnifiedHeroCanvas({
  sequence,
  containerRef,
  effectType = "particles",
  className,
  onLoadComplete,
  onLoadProgress,
  disabled = false,
}: UnifiedHeroCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Track client-side mount to avoid hydration mismatch
  // Using useSyncExternalStore to avoid setState in effect
  const isMounted = useSyncExternalStore(
    subscribeToMount,
    getMountState,
    getMountStateServer
  );

  // Detect WebGL capabilities
  const capabilities = useWebGLCapabilities();

  // Get scroll progress for particle effects
  const { scrollYProgress } = useScroll();

  // Unified frame animation with texture management
  const {
    currentTexture,
    isReady,
    loadProgress,
    isMobile,
    prefersReducedMotion,
    startPreload,
  } = useUnifiedFrameAnimation({
    sequence,
    containerRef,
    priorityCount: 10,
    onProgress: onLoadProgress,
    onComplete: onLoadComplete,
  });

  // Start preloading on mount
  useEffect(() => {
    startPreload();
  }, [startPreload]);

  // Check if effects should be shown
  const showEffects = effectType !== "none";

  // Determine if WebGL should be rendered
  const shouldRenderWebGL =
    capabilities.isEnabled &&
    !disabled &&
    !isMobile &&
    !prefersReducedMotion;

  // Render placeholder during SSR
  if (!isMounted) {
    return (
      <div
        ref={wrapperRef}
        className={cn("absolute inset-0 opacity-0", className)}
        data-unified-canvas="loading"
      />
    );
  }

  // Fallback to 2D canvas for unsupported devices
  if (!shouldRenderWebGL) {
    return (
      <div
        ref={wrapperRef}
        className={cn("absolute inset-0", className)}
        data-unified-canvas="fallback"
        data-reason={capabilities.disableReason || (isMobile ? "mobile" : "reduced-motion")}
      >
        {/* Use existing FrameSequence as fallback */}
        <FrameSequence
          sequence={sequence}
          containerRef={containerRef}
          onLoadComplete={onLoadComplete}
          onLoadProgress={onLoadProgress}
          className="h-full w-full"
        />
        {/* Show CSS-only effects if WebGL unavailable but effects enabled */}
        {showEffects && !capabilities.isEnabled ? (
          <div className="absolute inset-0 pointer-events-none">
            <WebGLFallback
              reason={capabilities.disableReason}
              showEffect={showEffects}
            />
          </div>
        ) : null}
      </div>
    );
  }

  // Show canvas as soon as we have a texture (don't wait for full preload)
  const hasTexture = currentTexture !== null;

  // Render unified WebGL canvas
  return (
    <div
      ref={wrapperRef}
      className={cn(
        "absolute inset-0",
        "pointer-events-none",
        "transition-opacity duration-500",
        hasTexture || isReady ? "opacity-100" : "opacity-0",
        className
      )}
      data-unified-canvas="active"
      data-tier={capabilities.tier}
      data-has-texture={hasTexture}
      data-load-progress={loadProgress}
    >
      <Suspense fallback={<div className="h-full w-full bg-black" />}>
        <CanvasWrapper
          className="h-full w-full"
          fallback={<div className="h-full w-full" />}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: false,
          }}
          camera={{ position: [0, 0, 5], fov: 50 }}
          dpr={[1, 1.5]}
          frameloop="always"
        >
          <UnifiedHeroCanvasContent
            currentTexture={currentTexture}
            scrollProgress={scrollYProgress}
            quality={capabilities.quality}
            effectType={effectType}
          />
        </CanvasWrapper>
      </Suspense>
    </div>
  );
}

export default UnifiedHeroCanvas;
