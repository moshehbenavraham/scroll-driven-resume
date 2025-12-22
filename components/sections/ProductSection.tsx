"use client";

/**
 * ProductSection component - Full-viewport product showcase with scroll-synchronized
 * burst frame animation. Uses unified WebGL canvas for flicker-free rendering.
 *
 * Z-index layers:
 * - Unified canvas (frames + effects): 0 (background)
 * - Gradient overlay: 10 (contrast)
 * - Content: 20 (foreground)
 */

import { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/cn";
import { ContentReveal } from "@/components/loading/ContentReveal";
import { ProductContent } from "@/components/product/ProductContent";
import { ProductStatsWithMotion } from "@/components/product/ProductStats";
import { ProductCTAs } from "@/components/product/ProductCTAs";
import { UnifiedHeroCanvas } from "@/components/three/UnifiedHeroCanvas";
import type { ProductSectionProps } from "@/types/product";

/**
 * Product section scroll runway configuration.
 * 144 frames at 225vh = 1.5625vh per frame (matches hero ratio).
 */
const SCROLL_RUNWAY_HEIGHT = "225vh";

/**
 * Product section with scroll-synchronized burst animation.
 * Uses 225vh height to create scroll runway for 144 frames.
 *
 * Uses unified WebGL canvas to eliminate flashing between frame updates
 * and particle effects. Falls back to 2D canvas on unsupported devices.
 *
 * @param props - Component props
 * @param props.className - Optional additional CSS classes
 * @param props.isRevealed - Whether content should be revealed (default: true)
 * @param props.onLoadComplete - Callback when frame sequence load completes
 * @param props.onLoadProgress - Callback for frame sequence load progress
 *
 * @example
 * <ProductSection isRevealed={!isLoading} />
 */
export function ProductSection({
  className,
  isRevealed = true,
  onLoadComplete,
  onLoadProgress,
}: ProductSectionProps) {
  // Reference to section element for scroll tracking
  const sectionRef = useRef<HTMLElement>(null);

  // Track scroll progress within this section (0-1)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Transform scroll progress for stats reveal (40-70% range)
  const statsProgress = useTransform(
    scrollYProgress,
    [0.3, 0.7], // When section is 30-70% through viewport
    [0, 1]
  );

  return (
    <section
      ref={sectionRef}
      className={cn(
        // 225vh creates scroll runway for smooth 144-frame animation
        "relative",
        className
      )}
      style={{ height: SCROLL_RUNWAY_HEIGHT }}
      aria-label="Product section"
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
        {/* Layer 1: Unified WebGL canvas (frames + effects) (z-index: 0) */}
        <div className="absolute inset-0 z-0">
          <UnifiedHeroCanvas
            sequence="product"
            containerRef={sectionRef}
            effectType="particles"
            onLoadComplete={onLoadComplete}
            onLoadProgress={onLoadProgress}
            className="h-full w-full"
          />
        </div>

        {/* Layer 2: Gradient overlay for text contrast (z-index: 10) */}
        <div
          className={cn(
            "absolute inset-0 z-10",
            // Radial gradient from center for burst effect
            "bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.8)_100%)]",
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
            <ProductContent>
              <ProductStatsWithMotion
                scrollProgress={statsProgress}
                className="mb-8"
              />
              <ProductCTAs />
            </ProductContent>
          </ContentReveal>
        </div>
      </div>
    </section>
  );
}

export default ProductSection;
