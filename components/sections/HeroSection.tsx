"use client";

/**
 * HeroSection component - Full-viewport hero with scroll-synchronized frame animation.
 * Uses unified WebGL canvas for flicker-free rendering of frames and particle effects.
 * Implements multi-layer parallax for depth effect.
 */

import { useRef } from "react";
import { cn } from "@/lib/cn";
import { ContentReveal } from "@/components/loading/ContentReveal";
import { HeroContent } from "@/components/hero/HeroContent";
import { SkillIndicators } from "@/components/hero/SkillIndicators";
import { SocialLinks } from "@/components/hero/SocialLinks";
import { UnifiedHeroCanvas } from "@/components/three/UnifiedHeroCanvas";
import { ParallaxContainer, ParallaxLayer } from "@/components/parallax";
import {
  DecorativeElements,
  FloatingShape,
  ConnectionLine,
  GradientMesh,
  NoiseOverlay,
} from "@/components/decorative";
import type { HeroSectionProps } from "@/types/hero";

/**
 * Hero section with scroll-synchronized portrait animation.
 * Uses 300vh height to create scroll runway for 192 frames.
 *
 * Uses unified WebGL canvas to eliminate flashing between frame updates
 * and particle effects. Falls back to 2D canvas on unsupported devices.
 *
 * Z-index layers:
 * - Unified canvas (frames + effects): 0 (background)
 * - Decorative elements: 5-8 (depth)
 * - Gradient overlay: 10 (contrast)
 * - Content: 20 (foreground)
 *
 * @param props - Component props
 * @param props.className - Optional additional CSS classes
 * @param props.isRevealed - Whether content should be revealed (default: true)
 * @param props.onLoadComplete - Callback when frame sequence load completes
 * @param props.onLoadProgress - Callback for frame sequence load progress
 *
 * @example
 * <HeroSection isRevealed={!isLoading} />
 */
export function HeroSection({
  className,
  isRevealed = true,
  onLoadComplete,
  onLoadProgress,
}: HeroSectionProps) {
  // Reference to section element for scroll tracking
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className={cn(
        // 300vh creates scroll runway for smooth 192-frame animation
        "relative h-[300vh]",
        className
      )}
      aria-label="Hero section"
    >
      {/* Sticky container - stays fixed during scroll */}
      <div
        className={cn(
          // Sticky positioning
          "sticky top-0",
          // Full viewport height with mobile Safari fix
          "h-screen min-h-[100dvh]",
          // Contain children
          "overflow-hidden"
        )}
      >
        {/* Parallax container provides scroll context to layers */}
        <ParallaxContainer containerRef={sectionRef}>
          {/* Layer 1: Unified WebGL canvas (frames + effects) (z-index: 0) */}
          {/* Background layer: speed 0 = fixed relative to section */}
          <ParallaxLayer layer="background" zIndex={0}>
            <UnifiedHeroCanvas
              sequence="hero"
              containerRef={sectionRef}
              effectType="particles"
              onLoadComplete={onLoadComplete}
              onLoadProgress={onLoadProgress}
              className="h-full w-full"
            />
          </ParallaxLayer>

          {/* Layer 1.5: Decorative elements (z-index: 5-8) */}
          {/* Mid layer speed for subtle parallax depth */}
          <ParallaxLayer layer="mid" zIndex={5} pointerEvents={false}>
            <DecorativeElements staggerDelay={0.1}>
              {/* Gradient mesh for atmospheric depth */}
              <GradientMesh
                type="radial"
                stops={[
                  { color: "rgba(147, 112, 219, 0.08)", position: 0 },
                  { color: "rgba(100, 100, 120, 0.04)", position: 50 },
                  { color: "transparent", position: 100 },
                ]}
                opacity={0.6}
              />

              {/* Top area shapes */}
              <FloatingShape
                variant="triangle"
                position={{ x: 8, y: 12 }}
                size="lg"
                color="accent"
                opacity={0.25}
                blur={1}
                speed={0.35}
                delay={0.1}
              />
              <FloatingShape
                variant="circle"
                position={{ x: 85, y: 15 }}
                size="md"
                color="muted"
                opacity={0.2}
                blur={2}
                speed={0.45}
                delay={0.2}
              />

              {/* Mid area connection */}
              <FloatingShape
                variant="hexagon"
                position={{ x: 45, y: 35 }}
                size="sm"
                color="highlight"
                opacity={0.15}
                speed={0.4}
                delay={0.3}
              />
              <ConnectionLine
                start={{ x: 12, y: 18 }}
                end={{ x: 42, y: 35 }}
                color="rgba(147, 112, 219, 0.15)"
                thickness={1}
                opacity={0.3}
                delay={0.4}
              />

              {/* Bottom area shapes */}
              <FloatingShape
                variant="diamond"
                position={{ x: 12, y: 78 }}
                size="md"
                color="accent"
                opacity={0.2}
                blur={1}
                speed={0.3}
                delay={0.5}
              />
              <FloatingShape
                variant="circle"
                position={{ x: 88, y: 82 }}
                size="sm"
                color="muted"
                opacity={0.18}
                blur={3}
                speed={0.5}
                delay={0.6}
              />

              {/* Noise overlay for organic feel */}
              <NoiseOverlay intensity={0.03} blendMode="overlay" />
            </DecorativeElements>
          </ParallaxLayer>

          {/* Layer 2: Gradient overlay for text contrast (z-index: 10) */}
          {/* Mid layer: speed 0.4 = slower than scroll for depth effect */}
          <ParallaxLayer layer="mid" zIndex={10}>
            <div
              className={cn(
                "h-full w-full",
                // Gradient from transparent top to semi-opaque bottom
                "bg-gradient-to-t",
                "from-black/80 via-black/40 to-transparent"
              )}
              aria-hidden="true"
            />
          </ParallaxLayer>

          {/* Layer 3: Content overlay (z-index: 20) */}
          {/* Foreground layer: speed 1.0 = normal scroll speed */}
          <ParallaxLayer layer="foreground" zIndex={20}>
            <div
              className={cn(
                "h-full w-full",
                // Center content vertically and horizontally
                "flex items-center justify-center",
                // Allow clicks on interactive elements
                "pointer-events-none"
              )}
            >
              <ContentReveal
                isRevealed={isRevealed}
                className={cn(
                  // Re-enable pointer events for content
                  "pointer-events-auto",
                  "w-full"
                )}
              >
                <HeroContent>
                  <SkillIndicators className="mb-8" />
                  <SocialLinks />
                </HeroContent>
              </ContentReveal>
            </div>
          </ParallaxLayer>
        </ParallaxContainer>
      </div>
    </section>
  );
}

export default HeroSection;
