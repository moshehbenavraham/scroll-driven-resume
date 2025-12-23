"use client";

/**
 * ProjectsSection component - Portfolio projects showcase with card grid.
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
import { ProjectCard, ProjectsDecorative } from "@/components/projects";
import {
  DEFAULT_PROJECTS,
  type ProjectsSectionProps,
} from "@/types/projects";

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
 * Projects section with scroll-triggered reveal animations.
 * Displays portfolio projects in a responsive grid layout.
 *
 * @param props - Component props
 * @param props.className - Optional additional CSS classes
 * @param props.isRevealed - Whether content should be revealed (default: true)
 *
 * @example
 * <ProjectsSection isRevealed={isContentRevealed} />
 */
export function ProjectsSection({
  className,
  isRevealed = true,
}: ProjectsSectionProps) {
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
      id="projects"
      ref={sectionRef}
      className={cn(
        "relative",
        // Natural height with responsive padding
        "min-h-screen py-16 sm:py-20 md:py-24 lg:py-32",
        // Background
        "bg-background",
        className
      )}
      aria-label="Projects section"
    >
      <ParallaxContainer containerRef={sectionRef}>
        {/* Layer 1: Decorative elements (z-index: 5) */}
        <ParallaxLayer layer="mid" zIndex={5} pointerEvents={false}>
          <ProjectsDecorative />
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
                Projects
              </h2>
              <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
                Selected work showcasing AI, full-stack development, and
                technical innovation.
              </p>
            </motion.div>

            {/* Projects grid - responsive columns */}
            <motion.div
              className={cn(
                "grid gap-4 sm:gap-6 lg:gap-8",
                // Responsive grid: 1 -> 2 -> 3 columns
                "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
                // Equal height items
                "items-stretch"
              )}
              initial="hidden"
              animate={shouldReveal ? "visible" : "hidden"}
              variants={activeContainerVariants}
            >
              {DEFAULT_PROJECTS.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isRevealed={shouldReveal}
                  delay={prefersReducedMotion ? 0 : 0.1 * index}
                />
              ))}
            </motion.div>
          </div>
        </ParallaxLayer>
      </ParallaxContainer>
    </section>
  );
}

export default ProjectsSection;
