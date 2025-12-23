"use client";

/**
 * ContactSection component - Contact form and social links with scroll-triggered reveals.
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
import {
  ContactForm,
  ContactSocialLinks,
  ContactDecorative,
} from "@/components/contact";
import type { ContactSectionProps } from "@/types/contact";

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
 * Content animation variants.
 */
const contentVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
      delay: 0.2,
    },
  },
};

/**
 * Reduced motion variants.
 */
const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
};

/**
 * Contact section with form and social links.
 * Uses natural content height with generous padding.
 *
 * @param props - Component props
 * @param props.className - Optional additional CSS classes
 * @param props.isRevealed - Whether content should be revealed (default: true)
 *
 * @example
 * <ContactSection isRevealed={isContentRevealed} />
 */
export function ContactSection({
  className,
  isRevealed = true,
}: ContactSectionProps) {
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
  const activeHeadingVariants = prefersReducedMotion
    ? reducedMotionVariants
    : headingVariants;

  const activeContentVariants = prefersReducedMotion
    ? reducedMotionVariants
    : contentVariants;

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={cn(
        "relative",
        // Natural height with generous padding
        "min-h-screen py-24 lg:py-32",
        // Background
        "bg-background/50",
        className
      )}
      aria-label="Contact section"
    >
      <ParallaxContainer containerRef={sectionRef}>
        {/* Layer 1: Decorative elements (z-index: 5) */}
        <ParallaxLayer layer="mid" zIndex={5} pointerEvents={false}>
          <ContactDecorative />
        </ParallaxLayer>

        {/* Layer 2: Content (z-index: 20) */}
        <ParallaxLayer layer="foreground" zIndex={20}>
          <div
            ref={contentRef}
            className={cn(
              "container mx-auto px-4 md:px-6 lg:px-8",
              "flex flex-col gap-12 lg:gap-16"
            )}
          >
            {/* Section heading */}
            <motion.div
              className="text-center"
              initial="hidden"
              animate={shouldReveal ? "visible" : "hidden"}
              variants={activeHeadingVariants}
            >
              <h2 className="text-foreground text-3xl font-bold md:text-4xl lg:text-5xl">
                Get In Touch
              </h2>
              <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
                Have a project in mind or want to discuss opportunities?
                I would love to hear from you.
              </p>
            </motion.div>

            {/* Two-column layout: Form | Social */}
            <motion.div
              className={cn(
                "grid gap-12 lg:gap-16",
                "grid-cols-1 lg:grid-cols-12",
                "items-start"
              )}
              initial="hidden"
              animate={shouldReveal ? "visible" : "hidden"}
              variants={activeContentVariants}
            >
              {/* Form column - 7 columns on large screens */}
              <div className="lg:col-span-7">
                <div
                  className={cn(
                    "rounded-2xl p-6 md:p-8",
                    "bg-card/30 backdrop-blur-sm",
                    "border border-border/30"
                  )}
                >
                  <ContactForm />
                </div>
              </div>

              {/* Social column - 5 columns on large screens */}
              <div className="lg:col-span-5">
                <div
                  className={cn(
                    "rounded-2xl p-6 md:p-8",
                    "bg-card/30 backdrop-blur-sm",
                    "border border-border/30"
                  )}
                >
                  <ContactSocialLinks />
                </div>
              </div>
            </motion.div>
          </div>
        </ParallaxLayer>
      </ParallaxContainer>
    </section>
  );
}

export default ContactSection;
