"use client";

/**
 * ProjectCard component - Individual project card with animations.
 * Features image thumbnail, title, description, tech badges, and links.
 * Uses Framer Motion for entrance animation with hover effects.
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ProjectImage } from "./ProjectImage";
import { TechBadge } from "./TechBadge";
import { ProjectLinks } from "./ProjectLinks";
import type { ProjectCardProps } from "@/types/projects";

/**
 * Animation variants for card entrance.
 */
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

/**
 * Instant variants for reduced motion.
 */
const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
};

/**
 * Project card with image, title, description, tech badges, and links.
 * Supports hover effects and entrance animations.
 *
 * @param props - Component props
 * @param props.project - Project data
 * @param props.isRevealed - Whether card should be visible/animated
 * @param props.delay - Animation delay in seconds
 * @param props.className - Optional additional CSS classes
 *
 * @example
 * <ProjectCard
 *   project={{ id: "1", title: "My Project", ... }}
 *   isRevealed={true}
 *   delay={0.1}
 * />
 */
export function ProjectCard({
  project,
  isRevealed = false,
  delay = 0,
  className,
}: ProjectCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const { title, description, thumbnail, technologies, liveUrl, sourceUrl } =
    project;

  const activeVariants = prefersReducedMotion
    ? reducedMotionVariants
    : cardVariants;

  return (
    <motion.article
      className={cn(
        // Group for child hover effects
        "group",
        // Card styling
        "relative flex flex-col",
        "rounded-lg",
        "bg-card/50 backdrop-blur-sm",
        "border-border/50 border",
        // Hover effects - lift and border highlight
        "transition-all duration-300",
        "hover:-translate-y-2",
        "hover:bg-card/70 hover:border-border",
        "hover:shadow-accent/5 hover:shadow-lg",
        // Height consistency
        "h-full",
        // Overflow for rounded image
        "overflow-hidden",
        className
      )}
      initial="hidden"
      animate={isRevealed ? "visible" : "hidden"}
      variants={activeVariants}
      transition={{ delay: prefersReducedMotion ? 0 : delay }}
    >
      {/* Project thumbnail with hover zoom */}
      <ProjectImage src={thumbnail} alt={`${title} project screenshot`} />

      {/* Content area */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title */}
        <h3
          className={cn(
            "text-lg font-semibold",
            "text-foreground",
            "mb-2",
            "line-clamp-1"
          )}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className={cn(
            "text-sm",
            "text-muted-foreground",
            "mb-4",
            "line-clamp-3",
            // Flex grow to push badges/links to bottom
            "flex-1"
          )}
        >
          {description}
        </p>

        {/* Tech badges */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {technologies.slice(0, 5).map((tech) => (
            <TechBadge key={tech} technology={tech} />
          ))}
        </div>

        {/* Links */}
        <ProjectLinks liveUrl={liveUrl} sourceUrl={sourceUrl} />
      </div>
    </motion.article>
  );
}

export default ProjectCard;
