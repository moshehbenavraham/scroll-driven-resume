"use client";

/**
 * HeroSection component - Full-viewport hero with scroll-synchronized frame animation.
 * Integrates FrameSequence, gradient overlay, and content with proper z-index layering.
 */

import { useRef } from "react";
import { cn } from "@/lib/cn";
import { FrameSequence } from "@/components/animation/FrameSequence";
import { ContentReveal } from "@/components/loading/ContentReveal";
import { HeroContent } from "@/components/hero/HeroContent";
import { SkillIndicators } from "@/components/hero/SkillIndicators";
import { SocialLinks } from "@/components/hero/SocialLinks";
import type { HeroSectionProps } from "@/types/hero";

/**
 * Hero section with scroll-synchronized portrait animation.
 * Uses 300vh height to create scroll runway for 192 frames.
 *
 * Z-index layers:
 * - Frame sequence: 0 (background)
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
        {/* Layer 1: Frame sequence (z-index: 0) */}
        <div className="absolute inset-0 z-0">
          <FrameSequence
            sequence="hero"
            containerRef={sectionRef}
            onLoadComplete={onLoadComplete}
            onLoadProgress={onLoadProgress}
            className="h-full w-full"
          />
        </div>

        {/* Layer 2: Gradient overlay for text contrast (z-index: 10) */}
        <div
          className={cn(
            "absolute inset-0 z-10",
            // Gradient from transparent top to semi-opaque bottom
            "bg-gradient-to-t",
            "from-black/80 via-black/40 to-transparent",
            // Pointer events pass through to frame sequence
            "pointer-events-none"
          )}
          aria-hidden="true"
        />

        {/* Layer 3: Content overlay (z-index: 20) */}
        <div
          className={cn(
            "absolute inset-0 z-20",
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
      </div>
    </section>
  );
}

export default HeroSection;
