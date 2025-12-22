"use client";

/**
 * AboutSection component - Personal bio and achievements with scroll-triggered reveals.
 * Uses ParallaxContainer for depth effect and decorative integration.
 *
 * Z-index layers:
 * - Decorative elements: 5 (background)
 * - Content: 20 (foreground)
 */

import { useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/cn";
import { ParallaxContainer, ParallaxLayer } from "@/components/parallax";
import { Bio, Achievements, AboutDecorative } from "@/components/about";
import type { AboutSectionProps } from "@/types/about";

/**
 * About section with scroll-triggered reveal animations.
 * Uses natural content height with generous padding.
 *
 * @param props - Component props
 * @param props.className - Optional additional CSS classes
 * @param props.isRevealed - Whether content should be revealed (default: true)
 *
 * @example
 * <AboutSection isRevealed={isContentRevealed} />
 */
export function AboutSection({
  className,
  isRevealed = true,
}: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Trigger animations when section is 50% in viewport
  const isInView = useInView(contentRef, {
    once: true,
    amount: 0.3,
  });

  // Content is revealed when both parent signals and section is in view
  const shouldReveal = isRevealed && isInView;

  return (
    <section
      id="about"
      ref={sectionRef}
      className={cn(
        "relative",
        // Natural height with generous padding
        "min-h-screen py-24 lg:py-32",
        // Background
        "bg-background",
        className
      )}
      aria-label="About section"
    >
      <ParallaxContainer containerRef={sectionRef}>
        {/* Layer 1: Decorative elements (z-index: 5) */}
        <ParallaxLayer layer="mid" zIndex={5} pointerEvents={false}>
          <AboutDecorative />
        </ParallaxLayer>

        {/* Layer 2: Content (z-index: 20) */}
        <ParallaxLayer layer="foreground" zIndex={20}>
          <div
            ref={contentRef}
            className={cn(
              "container mx-auto px-4 md:px-6 lg:px-8",
              "flex flex-col gap-16 lg:gap-24"
            )}
          >
            {/* Asymmetric two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Bio column - takes 7 columns on large screens */}
              <div className="lg:col-span-7">
                <Bio isRevealed={shouldReveal} />
              </div>

              {/* Achievements column - takes 5 columns on large screens */}
              <div className="lg:col-span-5">
                <Achievements isRevealed={shouldReveal} />
              </div>
            </div>
          </div>
        </ParallaxLayer>
      </ParallaxContainer>
    </section>
  );
}

export default AboutSection;
