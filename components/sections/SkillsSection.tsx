"use client";

/**
 * SkillsSection component - Technical skills showcase with categorized cards.
 * Uses ParallaxContainer for depth effect and decorative integration.
 *
 * Z-index layers:
 * - Decorative elements: 5 (background)
 * - Content: 20 (foreground)
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ParallaxContainer, ParallaxLayer } from "@/components/parallax";
import { SkillCard, SkillsDecorative } from "@/components/skills";
import { HorizontalCardScroller } from "@/components/scroller";
import {
  DEFAULT_SKILL_CATEGORIES,
  type SkillsSectionProps,
} from "@/types/skills";

/**
 * Container animation variants for staggered children.
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Heading animation variants.
 */
const headingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

/**
 * Reduced motion variants for instant reveal.
 */
const reducedMotionContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
};

const reducedMotionHeadingVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
};

/**
 * Skills section with scroll-triggered reveal animations.
 * Uses natural content height with generous padding.
 *
 * @param props - Component props
 * @param props.className - Optional additional CSS classes
 * @param props.isRevealed - Whether content should be revealed (default: true)
 *
 * @example
 * <SkillsSection isRevealed={isContentRevealed} />
 */
export function SkillsSection({
  className,
  isRevealed = true,
}: SkillsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Trigger animations when section is 30% in viewport
  const isInView = useInView(contentRef, {
    once: true,
    amount: 0.3,
  });

  // Content is revealed when both parent signals and section is in view
  const shouldReveal = isRevealed && isInView;

  // Select appropriate variants based on motion preference
  const activeContainerVariants = prefersReducedMotion
    ? reducedMotionContainerVariants
    : containerVariants;

  const activeHeadingVariants = prefersReducedMotion
    ? reducedMotionHeadingVariants
    : headingVariants;

  return (
    <section
      id="skills"
      ref={sectionRef}
      className={cn(
        "relative",
        // Natural height with responsive padding
        "min-h-screen py-16 sm:py-20 md:py-24 lg:py-32",
        // Background (solid to hide parallax from previous sections)
        "bg-background",
        className
      )}
      style={{ zIndex: 3 }}
      aria-label="Skills section"
    >
      <ParallaxContainer containerRef={sectionRef}>
        {/* Layer 1: Decorative elements (z-index: 5) */}
        <ParallaxLayer layer="mid" zIndex={5} pointerEvents={false}>
          <SkillsDecorative />
        </ParallaxLayer>

        {/* Layer 2: Content (z-index: 20) */}
        <ParallaxLayer layer="foreground" zIndex={20}>
          <div
            ref={contentRef}
            className={cn(
              "container mx-auto px-4 sm:px-6 lg:px-8",
              "flex flex-col gap-8 md:gap-12 lg:gap-16"
            )}
          >
            {/* Section heading with reveal animation */}
            <motion.div
              className="text-center"
              initial="hidden"
              animate={shouldReveal ? "visible" : "hidden"}
              variants={activeHeadingVariants}
            >
              <h2 className="text-foreground text-3xl font-bold md:text-4xl lg:text-5xl">
                Skills
              </h2>
              <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
                Technical expertise across AI/ML, development, product
                management, and leadership.
              </p>
            </motion.div>

            {/* Skills horizontal scroller */}
            <motion.div
              initial="hidden"
              animate={shouldReveal ? "visible" : "hidden"}
              variants={activeContainerVariants}
            >
              <HorizontalCardScroller
                cardClassName="w-[280px] sm:w-[320px] lg:w-[280px]"
                ariaLabel="Skills categories"
              >
                {DEFAULT_SKILL_CATEGORIES.map((category, index) => (
                  <SkillCard
                    key={category.id}
                    category={category}
                    isRevealed={shouldReveal}
                    delay={prefersReducedMotion ? 0 : 0.1 * index}
                  />
                ))}
              </HorizontalCardScroller>
            </motion.div>
          </div>
        </ParallaxLayer>
      </ParallaxContainer>
    </section>
  );
}

export default SkillsSection;
