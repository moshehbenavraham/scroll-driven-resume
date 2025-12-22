"use client";

/**
 * Bio component - Personal bio heading and paragraphs with staggered reveal.
 * Uses Framer Motion for line-by-line entrance animations.
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DEFAULT_BIO_CONTENT, type BioProps } from "@/types/about";

/**
 * Animation variants for the container.
 */
const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Animation variants for each paragraph/heading.
 */
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
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
 * Bio section with heading and paragraphs.
 * Animates content with staggered reveals.
 *
 * @param props - Component props
 * @param props.heading - Bio heading text
 * @param props.paragraphs - Array of paragraph strings
 * @param props.isRevealed - Whether content should animate in
 * @param props.className - Optional additional CSS classes
 */
export function Bio({
  heading = DEFAULT_BIO_CONTENT.heading,
  paragraphs = [...DEFAULT_BIO_CONTENT.paragraphs],
  isRevealed = false,
  className,
}: BioProps) {
  const prefersReducedMotion = useReducedMotion();

  const activeContainerVariants = prefersReducedMotion
    ? reducedMotionVariants
    : containerVariants;
  const activeItemVariants = prefersReducedMotion
    ? reducedMotionVariants
    : itemVariants;

  return (
    <motion.div
      className={cn("space-y-6", className)}
      initial="hidden"
      animate={isRevealed ? "visible" : "hidden"}
      variants={activeContainerVariants}
    >
      {/* Heading */}
      <motion.h2
        className={cn(
          "text-3xl font-bold md:text-4xl lg:text-5xl",
          "text-foreground",
          "tracking-tight"
        )}
        variants={activeItemVariants}
      >
        {heading}
      </motion.h2>

      {/* Paragraphs */}
      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => (
          <motion.p
            key={index}
            className={cn(
              "text-base md:text-lg",
              "text-muted-foreground",
              "leading-relaxed"
            )}
            variants={activeItemVariants}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}

export default Bio;
